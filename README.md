# KoCards - Korean Language Learning App

Персональный тренажёр для изучения корейских слов и фраз с использованием карточек и интервальных повторений (SRS).

## Технологический стек

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- React Query (TanStack Query)
- Zustand
- React Router
- Axios

## Начало работы

### Требования

- Node.js 18+
- PostgreSQL
- npm или yarn

### Установка

1. Клонируйте репозиторий

2. Установите зависимости для всего проекта:
```bash
npm install
```

3. Настройте базу данных PostgreSQL

Создайте базу данных:
```sql
CREATE DATABASE kocards;
```

4. Настройте переменные окружения

Backend (`korean-words-back/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kocards?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

Frontend (`korean-words-front/.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

5. Установите зависимости для backend:
```bash
cd korean-words-back
npm install
```

6. Запустите миграции Prisma:
```bash
npm run prisma:generate
npm run prisma:migrate
```

7. Установите зависимости для frontend:
```bash
cd ../korean-words-front
npm install
```

### Запуск проекта

#### Из корневой директории (рекомендуется):
```bash
npm run dev
```

Это запустит одновременно backend и frontend.

#### Или раздельно:

Backend:
```bash
cd korean-words-back
npm run start:dev
```

Frontend:
```bash
cd korean-words-front
npm run dev
```

Backend будет доступен на `http://localhost:3000`
Frontend будет доступен на `http://localhost:5173`

## Функционал

### Реализовано (MVP)

- ✅ Регистрация и авторизация пользователей (JWT)
- ✅ Создание и управление колодами карточек
- ✅ Создание и редактирование карточек (корейское слово/фраза ↔ перевод)
- ✅ Интервальные повторения (SRS алгоритм)
- ✅ Режим изучения (Flashcards)
- ✅ Отслеживание прогресса
- ✅ Адаптивный дизайн
- ✅ Минималистичный UI

### Возможные улучшения

- 🔲 Импорт/экспорт карточек (CSV)
- 🔲 Произношение слов (TTS)
- 🔲 Режим тестирования (Multiple choice)
- 🔲 Режим письма
- 🔲 Примеры использования слов
- 🔲 Статистика обучения
- 🔲 Streaks (дни подряд)
- 🔲 Публичные колоды
- 🔲 Темная тема
- 🔲 Mobile app (React Native)

## Структура проекта

```
KOREAN/
├── korean-words-back/       # Backend (NestJS)
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # Users module
│   │   ├── decks/           # Decks module
│   │   ├── cards/           # Cards module with SRS
│   │   └── prisma/          # Prisma service
│   └── package.json
│
├── korean-words-front/      # Frontend (React)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management (Zustand)
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   └── package.json
│
├── package.json             # Root package.json (workspace)
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Decks
- `GET /api/decks` - Get all user decks
- `GET /api/decks/:id` - Get deck by ID
- `GET /api/decks/:id/stats` - Get deck statistics
- `POST /api/decks` - Create new deck
- `PATCH /api/decks/:id` - Update deck
- `DELETE /api/decks/:id` - Delete deck

### Cards
- `GET /api/cards?deckId=:deckId` - Get cards by deck
- `GET /api/cards/:id` - Get card by ID
- `GET /api/cards/due/:deckId` - Get due cards for study
- `POST /api/cards` - Create new card
- `PATCH /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card
- `POST /api/cards/:id/review` - Review card (SRS)

## SRS Algorithm

Алгоритм интервальных повторений:

- **Hard**: +1 день
- **Normal**: +3 дня
- **Easy**: +7 дней

Интервал увеличивается с каждым успешным повторением (multiplier 1.5x).
Максимальный интервал - 180 дней.

## Деплой

### Backend (Railway / Render)

1. Создайте проект на Railway/Render
2. Подключите PostgreSQL базу данных
3. Настройте переменные окружения
4. Деплойте из папки `korean-words-back`

### Frontend (Vercel)

1. Создайте проект на Vercel
2. Укажите root directory: `korean-words-front`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Настройте переменную `VITE_API_URL`

## Лицензия

MIT
