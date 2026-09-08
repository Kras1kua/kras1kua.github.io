// Небольшая программа: берёт ключ из .env, задаёт вопрос бесплатной модели
// через OpenRouter и печатает ответ + сырой JSON от сервера.

const fs = require('fs');
const path = require('path');

// 1. Читаем .env и достаём OPENROUTER_API_KEY
const envPath = path.join(__dirname, '.env');
const envText = fs.readFileSync(envPath, 'utf-8');
const match = envText.match(/^OPENROUTER_API_KEY=(.*)$/m);
const apiKey = match ? match[1].trim() : '';

if (!apiKey) {
  console.error('Ключ OPENROUTER_API_KEY не найден в .env');
  process.exit(1);
}

const MODEL = 'minimax/minimax-m3:free';

async function main() {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'user', content: 'Объясни в двух предложениях, что такое API' },
      ],
    }),
  });

  const json = await response.json();

  console.log('=== Ответ модели ===');
  console.log(json.choices?.[0]?.message?.content ?? '(ответа нет, смотри сырой JSON ниже)');

  console.log('\n=== Сырой JSON от сервера ===');
  console.log(JSON.stringify(json, null, 2));
}

main().catch((err) => {
  console.error('Ошибка запроса:', err.message);
  process.exit(1);
});
