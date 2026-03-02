# Инструкция по установке

## Проблема с npm

Если вы видите ошибку `Cannot find module 'semver'`, выполните следующие шаги:

### Вариант 1: Переустановка npm

```bash
# Удалите текущий npm
sudo apt remove npm

# Установите npm через nvm (рекомендуется)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

### Вариант 2: Установка через snap

```bash
sudo snap install node --classic
```

### Вариант 3: Использование готовой сборки

Если у вас уже есть собранный проект:

1. Скопируйте папку `dist` на хостинг
2. Настройте веб-сервер (nginx, apache) для раздачи статических файлов
3. Готово!

## После установки npm

```bash
# Установите зависимости
npm install

# Запустите dev сервер
npm run dev

# Откройте http://localhost:3000
```

## Быстрый старт без npm

Если вы хотите просто посмотреть на проект без установки зависимостей, можете использовать CDN версии библиотек. Создан файл `index-standalone.html` для этого случая.

## Деплой на хостинг

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### GitHub Pages
1. Создайте репозиторий на GitHub
2. Добавьте workflow `.github/workflows/deploy.yml`
3. Push изменения

Подробнее в README.md
