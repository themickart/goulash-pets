# Goulash.tech Pets

Концепт лендинга автоматизации доставки из зоомагазинов. Собран на Vite, Vanilla JS и CSS. Демо-данные вымышлены; форма и push не отправляют сообщения.

## Локальный запуск

Для первого запуска после клонирования: `npm ci`, затем `npm run dev`. Для проверки production-сборки: `npm run build`, затем `npm run preview`. Открывайте адрес сервера из терминала, а не `dist/index.html` через файловую систему.

## Исходники

- `frags/` — разделы страницы; `css/base.css` и `css_frags/` — стили.
- `scripts/generate.mjs` собирает `index.html` и `css/styles.css` перед dev/build. Python и соседние проекты не нужны.
- `js/led-art.js` — точечные рисунки животных и курьера.
- `js/events.js` — сезонные сценарии; `js/stock.js` — прогноз остатков; `js/crm.js` — повторные покупки.

## Видео

Подключены `public/assets/video/goulash-pets.mp4` и `public/assets/video/poster.jpg`. Главы находятся в `frags/how.html`: `data-at` — абсолютный таймкод `H:MM:SS:FF`, `data-film-fps="60"` — частота кадров. Например, `0:00:02:40` = 2 + 40/60 секунды. `data-time` задаёт условное время доставки на плашке и не зависит от позиции в коротком ролике. При ошибке загрузки показывается постер.

## Публикация

Репозиторий: https://github.com/themickart/goulash-pets

1. В GitHub Desktop выберите этот репозиторий и ветку `main`, проверьте изменения и создайте коммит, например `Prepare Pets landing page for release`.
2. Нажмите **Publish branch** (при первом пуше) или **Push origin**.
3. В терминале из корня проекта выполните `npm run deploy`. Команда пересоберёт сайт и отправит только содержимое `dist/` в ветку `gh-pages` с файлом `.nojekyll`.
4. В настройках репозитория откройте **Settings → Pages**, выберите **Deploy from a branch**, ветку **gh-pages**, папку **/ (root)** и сохраните.

Адрес после публикации: https://themickart.github.io/goulash-pets/

Для следующих обновлений повторите коммит и пуш в `main`, затем `npm run deploy`. Обычный пуш исходников в `main` сам по себе сайт не обновляет.

В `main` входят исходники, генератор, `package-lock.json`, видео и постер. `dist/`, `node_modules/`, файлы `.env` и локальные журналы исключены через `.gitignore`.

`npm run build` и `npm run preview` ничего не публикуют. `npm run deploy` выполняет реальный пуш сборки, поэтому его запускает владелец после одобрения изменений.
