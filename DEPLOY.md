# Инструкция по деплою

## 🚀 Способы деплоя Tennis Match Tracker

### 1. Vercel (Рекомендуется)

**Самый простой способ:**

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Vercel автоматически определит настройки
4. Нажмите Deploy
5. Готово! Ваше приложение доступно по URL

**Через CLI:**

```bash
npm install -g vercel
vercel login
vercel
```

### 2. Netlify

**Через веб-интерфейс:**

1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. New site from Git
3. Выберите репозиторий
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy!

**Через CLI:**

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages

**Создайте `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Настройте репозиторий:**

1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Folder: / (root)

### 4. Своё собственное VPS/сервер

**Nginx конфигурация:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/tennis-tracker;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Деплой:**

```bash
# На локальной машине
npm run build

# Скопируйте на сервер
scp -r dist/* user@your-server:/var/www/tennis-tracker/

# На сервере
sudo systemctl reload nginx
```

### 5. Cloudflare Pages

1. Зарегистрируйтесь на [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create a project
3. Connect to Git
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Deploy

### 6. Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📱 После деплоя

После деплоя ваше приложение:

- ✅ Будет доступно по HTTPS
- ✅ Можно установить как PWA на любое устройство
- ✅ Работает офлайн после первой загрузки
- ✅ Автоматически обновляется при изменениях

## 🔧 Важные настройки

### Base URL для GitHub Pages

Если деплоите на GitHub Pages с путём (например `username.github.io/tennis-tracker`), измените `vite.config.ts`:

```ts
export default defineConfig({
  base: '/tennis-tracker/',
  // ...
})
```

### Переменные окружения

Создайте `.env` файл для продакшена:

```env
VITE_APP_TITLE=Tennis Match Tracker
VITE_APP_VERSION=1.0.0
```

## 📊 Мониторинг

После деплоя вы можете добавить:

- Google Analytics
- Sentry для отслеживания ошибок
- Hotjar для аналитики UX

## 🔒 HTTPS

Все перечисленные хостинги предоставляют HTTPS автоматически. Это необходимо для полноценной работы PWA.
