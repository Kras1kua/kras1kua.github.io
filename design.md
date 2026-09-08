==================================================================
СПЕЦИФИКАЦИЯ ЛЕНДИНГА-ВИЗИТКИ «ANTON SAPRYKIN» — для сборки с нуля
==================================================================

0. ОБЩЕЕ
--------
Тип: одностраничный тёмный лендинг, статический HTML, без JS.
Язык: ru. Заголовок вкладки: «Anton Saprykin — коммерческий директор».
Все кнопки и ссылки-контакты ведут на https://t.me/kras1k1654,
телефон — на tel:+380959379992.
Фото: uploads/photo-1788777511571-gsf5.webp, alt="Anton Saprykin",
исходник 452×678, webp.

Ширина контента: контейнер max-width: 1180px, по центру (margin: 0 auto),
боковые поля padding: 0 clamp(20px, 5vw, 64px) (т.е. от 20px на телефоне
до 64px на широком экране). Весь контент — внутри этого контейнера,
кроме фоновых заливок секций, которые всё равно ограничены контейнером
(фон рисуется только по ширине контейнера, не на всю ширину окна).

Базовый текст: font-size 16px, line-height 1.6,
-webkit-font-smoothing: antialiased.
На большинстве абзацев и заголовков стоит text-wrap: pretty.

ЦВЕТА (формат oklch — он основной; hex рядом — приблизительный)
--------------------------------------------------------------
Фон страницы / секций базовый  oklch(0.155 0.006 60)   ≈ #191714
Фон карточек и 2 секций         oklch(0.185 0.007 60)   ≈ #211e1b
Заливка outline-кнопки :hover   oklch(0.21 0.01 60)     ≈ #282420
Разделительные линии секций     oklch(0.26 0.008 60)    ≈ #332f2b
Верхняя линия карточек навыков  oklch(0.30 0.01 60)     ≈ #3d3934
Подчёркивание ссылки в шапке    oklch(0.34 0.01 60)     ≈ #47423d
Рамка outline-кнопки           oklch(0.42 0.02 70)     ≈ #5c554c
Текст футера                    oklch(0.56 0.012 70)    ≈ #837c73
Подпись «@kras1k1654» в hero    oklch(0.60 0.012 70)    ≈ #8f8880
Метки-надзаголовки (mono)       oklch(0.62 0.012 70)    ≈ #948d84
Текст шапки и ссылка в шапке    oklch(0.68 0.01 70)     ≈ #a49d94
Подпись навыка (note)           oklch(0.70 0.012 70)    ≈ #aaa39a
Текст карточек «Работы»         oklch(0.72 0.012 70)    ≈ #b0a89f
Акцент №2: цифры/периоды/@       oklch(0.72 0.045 75)    ≈ #c0a583
Текст абзацев «Обо мне»         oklch(0.76 0.012 70)    ≈ #bbb4ab
ГЛАВНЫЙ АКЦЕНТ (hover, точки)   oklch(0.80 0.05 75)     ≈ #d7b58f
Абзац большого CTA             oklch(0.86 0.01 70)     ≈ #d6d0c8
Подзаголовок hero              oklch(0.88 0.01 70)     ≈ #dcd6ce
Заголовки карточек навыков      oklch(0.93 0.008 70)    ≈ #e9e5df
ОСНОВНОЙ ТЕКСТ / светлая кнопка oklch(0.94 0.008 70)    ≈ #ece8e2

ШРИФТЫ (Google Fonts, один запрос)
----------------------------------
Подключение:
https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200;0,6..72,300;0,6..72,400;1,6..72,300&family=Instrument+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap

1) Newsreader (serif) — вес 200, 300, 400; курсив 300.
   Fallback: Georgia, serif. Все крупные заголовки, подзаголовки, h3.
2) Instrument Sans — вес 400, 500.
   Fallback: Helvetica, Arial, sans-serif. Весь основной текст (body).
3) IBM Plex Mono — вес 400.
   Fallback: monospace. Все надзаголовки-метки, номера, периоды, футер.

ГЛОБАЛЬНЫЙ CSS
--------------
body { margin: 0; background: oklch(0.155 0.006 60); }
* { box-sizing: border-box; }
a { color: oklch(0.94 0.008 70); text-decoration: none; }
a:hover { color: oklch(0.80 0.05 75); }
img { display: block; }

КНОПКИ И НАВЕДЕНИЕ
-----------------
Две светлые «точки» у кнопок — это <span> 5×5px, border-radius:50%.
У контурных кнопок точка цвета oklch(0.80 0.05 75);
у светлой кнопки точка цвета oklch(0.155 0.006 60) (т.е. фон страницы).

Контурная кнопка (.btn-outline):
  базово: display:inline-flex; align-items:center; gap:14px;
          padding:16px 30px; border:1px solid oklch(0.42 0.02 70);
          border-radius:999px; font-size:14px; letter-spacing:0.06em;
          text-transform:uppercase; color:oklch(0.94 0.008 70);
  transition: border-color .35s ease, background .35s ease, color .35s ease;
  :hover → border-color: oklch(0.80 0.05 75);
           background:  oklch(0.21 0.01 60);
           color:       oklch(0.94 0.008 70);
  Итог: за 0.35с рамка и текст «теплеют» до песочно-золотого,
  появляется еле заметная тёмная заливка.

Светлая кнопка (.btn-solid):
  базово: display:inline-flex; align-items:center; gap:14px;
          padding:18px 32px; border-radius:999px;
          background:oklch(0.94 0.008 70); color:oklch(0.155 0.006 60);
          font-size:15px; font-weight:500; letter-spacing:0.01em;
  transition: background .35s ease;
  :hover → background: oklch(0.80 0.05 75);
  Итог: почти белая кнопка за 0.35с становится песочно-золотой.

Плюс глобально: любая ссылка при наведении меняет цвет на
oklch(0.80 0.05 75).

БЛОКИ СВЕРХУ ВНИЗ
=================

--- 1. ШАПКА (header) ---
display:flex; align-items:baseline; justify-content:space-between;
gap:24px; padding:32px 0 0.
Стиль текста: font-size:12px; letter-spacing:0.14em; text-transform:
uppercase; color:oklch(0.68 0.01 70).
Слева: <span>Anton Saprykin</span>
Справа: <a> «Написать мне» — тот же цвет, border-bottom:1px solid
oklch(0.34 0.01 60); padding-bottom:3px.
На телефоне: flex-wrap: wrap (элементы переносятся при нехватке места).

--- 2. HERO (первый экран) ---
Секция: display:flex; flex-direction:column; justify-content:flex-end;
min-height: min(84vh, 760px);
padding: clamp(80px,14vh,160px) 0 clamp(56px,8vh,96px).
Содержимое прижато к низу секции. Порядок:
  a) Надзаголовок <p>: margin:0 0 clamp(28px,6vh,56px);
     IBM Plex Mono; 12px; letter-spacing:0.12em; uppercase;
     color:oklch(0.62 0.012 70).
     Текст: «Коммерческий директор · Sales & Web3».
  b) <h1>: margin:0; Newsreader; font-weight:200;
     font-size: clamp(46px, 9vw, 122px); line-height:0.98;
     letter-spacing:-0.02em.
     Текст: «Anton» <br> «Saprykin» (две строки).
  c) Подзаголовок <p>: margin: clamp(28px,5vh,44px) 0 0; max-width:620px;
     Newsreader; font-weight:300; font-size: clamp(20px,2.4vw,27px);
     line-height:1.45; color:oklch(0.88 0.01 70).
     Текст: «Строю продажи под ключ: от первого лендинга до системной
     команды продаж.»
  d) Ряд <div>: display:flex; flex-wrap:wrap; align-items:center;
     gap:28px; margin-top: clamp(36px,6vh,56px).
       - Контурная кнопка .btn-outline «Написать мне» + точка-span.
       - <span> «@kras1k1654»: IBM Plex Mono; 12px;
         color:oklch(0.60 0.012 70).

--- 3. ОБО МНЕ (секция .about-grid) ---
border-top:1px solid oklch(0.26 0.008 60);
padding: clamp(72px,12vh,132px) 0;
display:grid; grid-template-columns: minmax(0,1.25fr) minmax(0,0.75fr);
gap: clamp(32px,6vw,88px); align-items:start.
Левая колонка:
  Надзаголовок <p> «01 — Обо мне»: margin:0 0 clamp(28px,4vh,44px);
  IBM Plex Mono; 12px; letter-spacing:0.12em; uppercase;
  color:oklch(0.62 0.012 70).
  Внутренний <div>: display:flex; flex-direction:column;
  gap: clamp(32px,5vh,52px); max-width:640px. В нём два блока, каждый:
    <h3>: margin:0 0 14px; Newsreader; font-weight:300;
      font-size: clamp(21px,2.2vw,28px); line-height:1.35;
      color:oklch(0.94 0.008 70).
    <p>: margin:0; font-size:16px; line-height:1.7;
      color:oklch(0.76 0.012 70).
  Блок 1 h3: «Строю продажи, которые приносят стабильную прибыль.»
  Блок 1 p: «10 лет опыта на позиции КомДир : от упаковки смысла и
    создания конверсионного лендинга до сборки сильного отдела продаж
    с нуля. Возьму на себя весь цикл привлечения и конверсии клиентов.»
  Блок 2 h3: «Превращаю продукт в системную выручку.»
  Блок 2 p: «Объединяю продуктовый маркетинг и управление продажами:
    проведу аудит, упакую предложение, запущу посадочные страницы и
    выстрою команду продаж под ключ.»
Правая колонка <figure> (margin:0):
  <img>: width:100%; max-width:360px; height:auto;
  filter: grayscale(0.25) contrast(1.02);
  border:1px solid oklch(0.26 0.008 60).

--- 4. ЧТО Я УМЕЮ (секция) ---
border-top:1px solid oklch(0.26 0.008 60);
padding: clamp(72px,12vh,132px) 0.
Надзаголовок <p> «02 — Что я умею»: margin:0 0 clamp(40px,6vh,72px);
IBM Plex Mono; 12px; letter-spacing:0.12em; uppercase;
color:oklch(0.62 0.012 70).
Сетка <div>: display:grid;
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
gap: clamp(28px,4vw,56px) clamp(28px,5vw,72px)  (строки / столбцы).
4 карточки, каждая <div>: display:flex; flex-direction:column; gap:14px;
padding-top:22px; border-top:1px solid oklch(0.30 0.01 60).
  <span> номер: IBM Plex Mono; 11px; letter-spacing:0.1em;
    color:oklch(0.72 0.045 75).
  <h3>: margin:0; Newsreader; font-weight:300;
    font-size: clamp(20px,1.8vw,24px); line-height:1.3;
    color:oklch(0.93 0.008 70).
  <p> подпись: margin:0; font-size:14px; line-height:1.6;
    color:oklch(0.70 0.012 70).
Карточки:
  01 — «Управление и построение системных продаж» — «10+ лет SD»
  02 — «Crypto & Web3 Экспертиза» — «DeFi, On-Chain, Web3 Growth»
  03 — «Продуктовый запуск и маркетинг» — «Vibe Coding & Affiliation»
  04 — «Аудит и оптимизация» — ПОДПИСИ НЕТ (без <p>)

--- 5. РАБОТЫ (секция) ---
border-top:1px solid oklch(0.26 0.008 60);
padding: clamp(72px,12vh,132px) 0.
Надзаголовок <p> «03 — Работы»: margin:0 0 clamp(40px,6vh,72px);
стиль как у других надзаголовков.
Сетка <div>: display:grid;
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
gap: clamp(24px,3vw,40px).
3 карточки, каждая <div>: display:flex; flex-direction:column; gap:20px;
padding: clamp(24px,3vw,36px); background:oklch(0.185 0.007 60);
border:1px solid oklch(0.26 0.008 60).
  <span> период: IBM Plex Mono; 11px; letter-spacing:0.1em;
    color:oklch(0.72 0.045 75).
  <h3>: margin:0; Newsreader; font-weight:300;
    font-size: clamp(24px,2.2vw,30px); line-height:1.2.
  <p>: margin: auto 0 0 (прижат к низу карточки); font-size:14px;
    line-height:1.65; color:oklch(0.72 0.012 70).
Карточки:
  «2014—2026» · «Sales Dir» ·
    «Управление комерческой деятельностью заказчиков на аутсорсе.»
  «2022—2026» · «Crypto / DeFi Advisor» ·
    «Сопровождение, обучение, готовые решения в криптовалютном мире.»
  «2026» · «Web Designer» ·
    «Специалист по созданию лендингов и дашбордов.»

--- 6. БОЛЬШОЙ ПРИЗЫВ (секция с фоном) ---
border-top:1px solid oklch(0.26 0.008 60);
padding: clamp(72px,12vh,132px) 0;
background: oklch(0.185 0.007 60).
Внутренний <div>: max-width:780px.
  <h2>: margin:0; Newsreader; font-weight:200;
    font-size: clamp(32px,4.6vw,56px); line-height:1.12;
    letter-spacing:-0.015em.
    Текст: «Готовы найти скрытые точки роста вашего бизнеса?»
  <p>: margin: clamp(24px,3vh,36px) 0 0; Newsreader; font-weight:300;
    font-size: clamp(18px,1.8vw,22px); line-height:1.6;
    color:oklch(0.86 0.01 70).
    Текст: «Пришлите ссылку на ваш сайт или проект. Я бесплатно проведу
    экспресс-аудит: разберу текущую воронку, сравню позиционирование с
    топовыми конкурентами и дам 3–5 конкретных шагов по оптимизации
    продаж и привлечения.»
  Светлая кнопка .btn-solid: + margin-top: clamp(32px,5vh,48px).
    Текст: «Отправить проект на аудит» + тёмная точка-span
    (background:oklch(0.155 0.006 60)).

--- 7. КОНТАКТЫ (секция) ---
border-top:1px solid oklch(0.26 0.008 60);
padding: clamp(72px,12vh,132px) 0 clamp(48px,8vh,80px).
Надзаголовок <p> «05 — Контакты»: margin:0 0 clamp(32px,5vh,56px);
стиль как у других надзаголовков.
<h2>: margin:0; max-width:760px; Newsreader; font-weight:200;
  font-size: clamp(32px,5.4vw,68px); line-height:1.06;
  letter-spacing:-0.015em.
  Текст: «Напиши мне в телеграм — отвечу сам.»
Ряд <div>: display:flex; flex-wrap:wrap; align-items:center; gap:28px;
margin-top: clamp(36px,6vh,56px).
  - Контурная кнопка .btn-outline «Написать мне» + точка-span.
  - <a> «@kras1k1654»: IBM Plex Mono; font-size:13px;
    color:oklch(0.72 0.045 75).
Сетка деталей <div>: display:grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:24px;
margin-top: clamp(48px,8vh,88px).
2 элемента, каждый <div>: padding-top:18px;
border-top:1px solid oklch(0.30 0.01 60).
  <p> метка: margin:0 0 8px; IBM Plex Mono; 11px; letter-spacing:0.1em;
    uppercase; color:oklch(0.60 0.012 70).
  <a>: font-size:15px.
  Элемент 1: «Телеграм» → «@kras1k1654» (href https://t.me/kras1k1654)
  Элемент 2: «Телефон» → «095 937 99 92» (href tel:+380959379992)

--- 8. ФУТЕР ---
display:flex; flex-wrap:wrap; gap:16px; justify-content:space-between;
padding:28px 0 40px; border-top:1px solid oklch(0.26 0.008 60);
IBM Plex Mono; font-size:11px; letter-spacing:0.08em; uppercase;
color:oklch(0.56 0.012 70).
Слева <span> «Anton Saprykin», справа <span> «2026».

ПОВЕДЕНИЕ НА ТЕЛЕФОНЕ
====================
Один медиа-запрос: @media (max-width: 760px)
  .about-grid       → grid-template-columns: 1fr;
                      (секция «Обо мне» в одну колонку: сначала текст,
                       фото — под ним)
  .about-figure img → max-width: 100%;
                      (фото на всю ширину, ограничение 360px снимается)
  .site-header      → flex-wrap: wrap;
                      (элементы шапки переносятся)

Всё остальное подстраивается само, без медиа-запросов:
  - Боковые поля контейнера clamp(20px,5vw,64px) сжимаются до 20px.
  - Вертикальные отступы секций clamp(72px,12vh,132px) сжимаются к 72px.
  - Все размеры шрифта на clamp() уходят к своему минимуму:
    h1 → 46px, подзаголовок hero → 20px, h2 CTA → 32px,
    h2 контактов → 32px, h3 карточек → 20–21px и т.д.
  - Сетка «Что я умею» minmax(240px,1fr): на телефоне 1 колонка,
    на среднем экране 2.
  - Сетка «Работы» minmax(260px,1fr): на телефоне 1 колонка.
  - Сетка контактов minmax(200px,1fr): на узком телефоне обычно
    1 колонка, на широком — 2.
  - Ряды hero и контактов имеют flex-wrap: wrap, поэтому кнопка и
    «@kras1k1654» встают друг под друга.
==================================================================
