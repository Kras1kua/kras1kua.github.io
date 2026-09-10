// Сервер сайта: отдаёт статические файлы и принимает заявки с лендинга в PostgreSQL.
// Локально сайт по-прежнему можно открыть двойным кликом по index.html —
// сервер нужен для приёма формы и для запуска на Railway.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

// --- Подключение к базе ---------------------------------------------------------
// Railway передаёт строку подключения в переменной DATABASE_URL.
// Внутри сети Railway (*.railway.internal) SSL не нужен, снаружи — нужен.
const DATABASE_URL = process.env.DATABASE_URL || "";
const isLocalOrInternal = /localhost|127\.0\.0\.1|\.railway\.internal/.test(DATABASE_URL);

let pool = null;
if (DATABASE_URL) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: isLocalOrInternal ? false : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  pool.on("error", (err) => console.error("Ошибка пула Postgres:", err.message));
} else {
  console.warn("DATABASE_URL не задана — заявки приниматься не будут.");
}

// Создаём таблицу заявок, если её ещё нет. Ошибку логируем, но сервер не роняем:
// статические страницы должны открываться даже при недоступной базе.
async function initDb() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name       text        NOT NULL,
        contact    text        NOT NULL,
        message    text        NOT NULL DEFAULT '',
        source     text        NOT NULL DEFAULT 'landing',
        user_agent text,
        ip         text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    console.log("Таблица leads готова.");
  } catch (err) {
    console.error("Не удалось создать таблицу leads:", err.message);
  }
}

// --- Вспомогательные функции --------------------------------------------------
function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

// Читаем тело запроса с ограничением размера (защита от больших POST).
function readBody(req, limit = 16 * 1024) {
  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("Тело запроса слишком большое"));
        req.destroy();
        return;
      }
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

// Разбираем и JSON, и обычную отправку формы (application/x-www-form-urlencoded).
function parseBody(raw, contentType) {
  if ((contentType || "").includes("application/json")) {
    return JSON.parse(raw || "{}");
  }
  const params = new URLSearchParams(raw || "");
  const obj = {};
  for (const [k, v] of params) obj[k] = v;
  return obj;
}

function clientIp(req) {
  const fwd = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || req.socket.remoteAddress || "";
}

// Простой лимит: не больше 5 заявок с одного IP за 10 минут.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const rateHits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const hits = (rateHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateHits.set(ip, hits);
  return hits.length > RATE_MAX;
}

// --- Обработчики маршрутов ----------------------------------------------------
async function handleHealthDb(res) {
  if (!pool) return sendJson(res, 503, { ok: false, error: "DATABASE_URL не задана" });
  try {
    const r = await pool.query("SELECT now() AS now, version() AS version");
    const c = await pool.query("SELECT count(*)::int AS leads FROM leads");
    sendJson(res, 200, {
      ok: true,
      now: r.rows[0].now,
      version: r.rows[0].version,
      leads: c.rows[0].leads,
    });
  } catch (err) {
    sendJson(res, 500, { ok: false, error: err.message });
  }
}

async function handleLead(req, res) {
  if (!pool) return sendJson(res, 503, { ok: false, error: "База недоступна" });

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return sendJson(res, 429, { ok: false, error: "Слишком много заявок, попробуйте позже" });
  }

  let body;
  try {
    body = parseBody(await readBody(req), req.headers["content-type"]);
  } catch (err) {
    return sendJson(res, 400, { ok: false, error: "Некорректные данные формы" });
  }

  // Ловушка для ботов: поле "company" скрыто от людей. Если заполнено — делаем вид,
  // что всё хорошо, но в базу не пишем.
  if (body.company) return sendJson(res, 200, { ok: true });

  const name = String(body.name || "").trim();
  const contact = String(body.contact || "").trim();
  const message = String(body.message || body.project || "").trim();

  if (name.length < 1 || name.length > 200) {
    return sendJson(res, 400, { ok: false, error: "Укажите имя" });
  }
  if (contact.length < 1 || contact.length > 200) {
    return sendJson(res, 400, { ok: false, error: "Укажите способ связи" });
  }
  if (message.length > 5000) {
    return sendJson(res, 400, { ok: false, error: "Сообщение слишком длинное" });
  }

  try {
    const r = await pool.query(
      `INSERT INTO leads (name, contact, message, source, user_agent, ip)
       VALUES ($1, $2, $3, 'landing', $4, $5)
       RETURNING id, created_at`,
      [name, contact, message, req.headers["user-agent"] || null, ip]
    );
    console.log(`Новая заявка #${r.rows[0].id} от ${name}`);
    sendJson(res, 201, { ok: true, id: r.rows[0].id, created_at: r.rows[0].created_at });
  } catch (err) {
    console.error("Не удалось сохранить заявку:", err.message);
    sendJson(res, 500, { ok: false, error: "Не удалось сохранить заявку" });
  }
}

// Просмотр последних заявок. Доступ по токену из переменной ADMIN_TOKEN:
//   GET /api/leads?token=ВАШ_ТОКЕН
// Без заданного ADMIN_TOKEN маршрут выключен.
async function handleLeadsList(req, res) {
  if (!pool) return sendJson(res, 503, { ok: false, error: "База недоступна" });
  const token = process.env.ADMIN_TOKEN || "";
  if (!token) return sendJson(res, 503, { ok: false, error: "ADMIN_TOKEN не задан — просмотр выключен" });

  const given = new URL(req.url, "http://x").searchParams.get("token") || "";
  if (given !== token) return sendJson(res, 401, { ok: false, error: "Неверный токен" });

  try {
    const r = await pool.query(
      `SELECT id, name, contact, message, source, created_at
       FROM leads ORDER BY id DESC LIMIT 50`
    );
    sendJson(res, 200, { ok: true, count: r.rowCount, leads: r.rows });
  } catch (err) {
    sendJson(res, 500, { ok: false, error: err.message });
  }
}

function handleStatic(req, res) {
  let rel = decodeURIComponent(req.url.split("?")[0]);
  if (rel === "/") rel = "/index.html";

  const filePath = path.join(ROOT, path.normalize(rel));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
}

// --- Сервер -----------------------------------------------------------------
const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  if (req.method === "GET" && url === "/api/health/db") return handleHealthDb(res);
  if (req.method === "GET" && url === "/api/leads") return handleLeadsList(req, res);
  if (req.method === "POST" && url === "/api/lead") return handleLead(req, res);
  if (url.startsWith("/api/")) return sendJson(res, 404, { ok: false, error: "Неизвестный маршрут" });

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }
  handleStatic(req, res);
});

initDb().finally(() => {
  server.listen(PORT, () => console.log(`Site is running on port ${PORT}`));
});
