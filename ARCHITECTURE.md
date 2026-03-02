# 🏗️ Архитектура приложения

## Обзор

Tennis Match Tracker - это Single Page Application (SPA) построенное на React с использованием современного стека технологий.

## Схема архитектуры

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  ┌───────────────────────────────────────────────┐  │
│  │           React Application                   │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │          Router (React Router)          │  │  │
│  │  │  ┌──────────┬──────────┬──────────────┐  │  │  │
│  │  │  │ HomePage │ Record   │ Player       │  │  │  │
│  │  │  │          │ Match    │ Profile      │  │  │  │
│  │  │  └──────────┴──────────┴──────────────┘  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                                │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │         Custom Hooks                    │  │  │
│  │  │  • usePlayers()                         │  │  │
│  │  │  • useMatches()                         │  │  │
│  │  │  • useLocalStorage()                    │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                     ↕                          │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │        LocalStorage API                 │  │  │
│  │  │  • tennis-players                       │  │  │
│  │  │  • tennis-matches                       │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │         Service Worker (PWA)                  │  │
│  │  • Кэширование ресурсов                       │  │
│  │  • Офлайн функционал                          │  │
│  │  • Автообновление                             │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Поток данных

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (usePlayers/useMatches)
    ↓
useLocalStorage Hook
    ↓
LocalStorage API
    ↓
React State Update
    ↓
Component Re-render
```

## Структура компонентов

```
App
├── Router
│   ├── HomePage
│   │   ├── MatchList
│   │   │   └── Match Items (with selection)
│   │   ├── PlayerList
│   │   │   └── Player Items (with selection)
│   │   ├── Modal
│   │   │   └── PlayerForm
│   │   └── Action Buttons (Import/Export/Generate)
│   │
│   ├── RecordMatchPage
│   │   ├── Player Buttons (score tracking)
│   │   ├── TennisCourt (SVG visualization)
│   │   ├── Stats Display (tempo, shots, rallies)
│   │   ├── PlayerSelector (Modal)
│   │   └── Control Buttons (Start/Pause/Finish)
│   │
│   └── PlayerProfilePage
│       ├── Stats Cards (wins, losses, tempo, etc.)
│       └── Match History List (collapsible)
```

## Модель данных

### Player
```typescript
interface Player {
  id: string              // UUID
  name: string            // Имя игрока
  createdAt: string       // ISO timestamp
}
```

### Match
```typescript
interface Match {
  id: string
  createdAt: string
  player1: MatchPlayer
  player2: MatchPlayer
  isDouble: boolean       // Парный матч (не реализовано)
  rallies: Rally[]        // История розыгрышей
  rallyTempo: number      // Средний темп розыгрыша (сек)
  status: 'playing' | 'finished' | 'paused'
  finishedAt?: string
}
```

### MatchPlayer
```typescript
interface MatchPlayer {
  playerId: string
  playerName: string
  score: number           // Очки
  tempo: number           // Средний темп (сек)
  shots: number           // Количество ударов
}
```

### Rally
```typescript
interface Rally {
  id: string
  startTime: string
  endTime: string
  duration: number        // Миллисекунды
  winner: 'player1' | 'player2' | null
}
```

## Жизненный цикл матча

```
1. CREATE MATCH
   ├── Выбор игроков (случайно или вручную)
   ├── Инициализация состояния (score: 0, tempo: 0, shots: 0)
   └── status: 'playing'

2. RALLY RECORDING
   ├── Start Rally (запись времени начала)
   ├── User Action (выбор победителя)
   ├── End Rally (запись времени конца)
   ├── Calculate Duration
   ├── Update Player Score (+1 победителю)
   ├── Update Player Shots (+1 обоим)
   ├── Recalculate Tempo
   └── Add Rally to History

3. PAUSE/RESUME
   ├── Toggle status: 'playing' ↔ 'paused'
   └── Сохранить состояние

4. FINISH MATCH
   ├── Set finishedAt timestamp
   ├── status: 'finished'
   └── Сохранить в LocalStorage
```

## PWA архитектура

```
┌─────────────────────────────────────────┐
│          Initial Load                   │
│  1. Browser requests index.html         │
│  2. Download JS/CSS/Images              │
│  3. Register Service Worker             │
│  4. Cache all resources                 │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       Subsequent Visits                 │
│  1. Service Worker intercepts request   │
│  2. Check cache                         │
│  3. Return cached version               │
│  4. Check for updates in background     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│          Offline Mode                   │
│  • All resources from cache             │
│  • Data from LocalStorage               │
│  • Full functionality available         │
└─────────────────────────────────────────┘
```

## Кэширование стратегии

### Workbox рантайм кэширование

```javascript
// Статические ресурсы - Cache First
assets/ → Cache First (1 год)

// Внешние ресурсы (шрифты) - Cache First
fonts.googleapis.com → Cache First (1 год)

// HTML - Network First
*.html → Network First (fallback to cache)

// API запросы (если будут) - Network First
/api/* → Network First (timeout: 3s, fallback to cache)
```

## Оптимизации

### Build Time
- ✅ Tree shaking (Vite)
- ✅ Code splitting
- ✅ Minification
- ✅ Asset optimization

### Runtime
- ✅ React.memo для предотвращения ненужных ре-рендеров
- ✅ useCallback для стабильности функций
- ✅ LocalStorage батчинг
- ✅ Lazy loading routes (можно добавить)

### Bundle Size
```
Примерные размеры после сборки:
├── index.html: ~2KB
├── assets/index.js: ~150KB (gzipped: ~50KB)
├── assets/index.css: ~15KB (gzipped: ~3KB)
└── assets/icons/fonts: ~20KB
Total: ~187KB (~73KB gzipped)
```

## Масштабируемость

### Текущие ограничения
- LocalStorage: ~5-10MB
- ~1000 игроков
- ~5000 матчей

### Решения для роста
1. **IndexedDB** вместо LocalStorage (больше места)
2. **Облачное хранилище** (Firebase, Supabase)
3. **Пагинация** для больших списков
4. **Виртуализация** списков (react-window)
5. **Архивация** старых данных

## Безопасность

### Текущая реализация
- ✅ Все данные локально
- ✅ Нет отправки на сервер
- ✅ Нет сторонних трекеров
- ✅ HTTPS только (для PWA)

### CSP Headers (для продакшена)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
```

## Мониторинг и аналитика

### Можно добавить
- **Sentry** для отслеживания ошибок
- **Google Analytics** для аналитики использования
- **Lighthouse CI** для мониторинга производительности
- **Web Vitals** для Core Web Vitals

## Тестирование

### Рекомендуемый стек
```bash
# Unit тесты
npm install --save-dev vitest @testing-library/react

# E2E тесты
npm install --save-dev @playwright/test

# Coverage
npm install --save-dev @vitest/coverage-v8
```

### Структура тестов
```
src/
├── components/
│   ├── MatchList.tsx
│   └── MatchList.test.tsx
├── hooks/
│   ├── usePlayers.ts
│   └── usePlayers.test.ts
└── utils/
    ├── stats.ts
    └── stats.test.ts
```

## CI/CD Pipeline

### Рекомендуемый workflow

```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    - Install dependencies
    - Run linter
    - Run tests
    - Build project
    
  deploy:
    if: branch == main
    - Deploy to Vercel/Netlify
```

## Документация API (для будущего бэкенда)

Если планируете добавить бэкенд:

```
POST   /api/players          - Создать игрока
GET    /api/players          - Получить всех игроков
GET    /api/players/:id      - Получить игрока
PUT    /api/players/:id      - Обновить игрока
DELETE /api/players/:id      - Удалить игрока

POST   /api/matches          - Создать матч
GET    /api/matches          - Получить все матчи
GET    /api/matches/:id      - Получить матч
PUT    /api/matches/:id      - Обновить матч
DELETE /api/matches/:id      - Удалить матч

GET    /api/stats/player/:id - Статистика игрока
```

## Производительность

### Целевые метрики
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1

### Текущая реализация
- ✅ Minimal JavaScript bundle
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Service Worker caching
- ✅ Tailwind CSS purging

---

**Документация актуальна на:** Март 2026
