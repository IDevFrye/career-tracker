# Career Tracker - Трекер откликов на вакансии

Веб-приложение для отслеживания откликов на вакансии, управления этапами собеседований и анализа статистики поиска работы.

## Описание проекта

Career Tracker - это полнофункциональное веб-приложение, которое помогает соискателям:

- Отслеживать все отклики на вакансии в одном месте
- Управлять этапами собеседований и статусами откликов
- Сохранять вопросы с собеседований и ответы на них
- Анализировать статистику по должностям и общую эффективность поиска работы
- Получать автоматическую информацию о вакансиях через интеграцию с HeadHunter API

## Деплой

Полноцфункционально сайт доступен по адресу: `https://frontend-alpha-nine-77.vercel.app/`

Сервер доступен по адресу: `https://career-tracker-h4v9.onrender.com/api`

## Архитектура

Проект построен по принципу разделения на фронтенд и бэкенд:

```
career-tracker/
├── backend/          # Go API сервер
├── frontend/         # React SPA приложение
└── README.md
```

## Основные функции

### 1. Управление откликами

- Добавление новых откликов по URL вакансии
- Автоматическое получение информации о вакансии через HeadHunter API
- Отслеживание этапов собеседования (отклик, звонок, интервью, оффер и т.д.)
- Управление контактами рекрутеров
- Два режима просмотра: карточки и таблица

### 2. Система вопросов и заметок

- Сохранение вопросов с собеседований
- Записывание ответов и заметок
- Система тегов для категоризации
- Оценка сложности вопросов (1-5 баллов)
- Поиск и фильтрация по вопросам, ответам и тегам

### 3. Аналитика и статистика

- Общая статистика по всем откликам
- Детальная статистика по должностям
- Визуализация данных через круговые диаграммы
- Метрики эффективности (процент офферов, отказов и т.д.)

### 4. Аутентификация и безопасность

- Регистрация и вход через Supabase Auth
- JWT токены для защиты API
- Изоляция данных по пользователям

## 🛠️ Технологический стек

### Backend

- **Go 1.23.1** - основной язык
- **Gin** - веб-фреймворк
- **Supabase** - база данных и аутентификация
- **JWT** - токены аутентификации
- **CORS** - поддержка кросс-доменных запросов

### Frontend

- **React 18.3.1** - UI библиотека
- **TypeScript 5.8.3** - типизация
- **Redux Toolkit 2.8.2** - управление состоянием
- **React Router DOM 7.6.3** - маршрутизация
- **Chart.js 4.5.0** - графики
- **Axios 1.10.0** - HTTP клиент
- **SCSS** - стилизация
- **Webpack 5** - сборка

## Структура проекта

### Backend структура

```
backend/
├── cmd/services/main.go          # Точка входа приложения
├── internal/
│   ├── api/                      # HTTP обработчики
│   │   ├── applications.go       # API откликов
│   │   ├── questions.go          # API вопросов
│   │   └── stats.go              # API статистики
│   ├── middleware/
│   │   └── auth.go               # JWT аутентификация
│   ├── models/                   # Структуры данных
│   │   ├── application.go        # Модели откликов
│   │   ├── question.go           # Модели вопросов
│   │   └── vacancy.go            # Модели вакансий
│   ├── services/                 # Бизнес-логика
│   │   ├── application_service.go
│   │   ├── question_service.go
│   │   ├── stats_service.go
│   │   └── supabase_service.go
│   └── utils/
│       └── hh_api.go             # Интеграция с HeadHunter
├── go.mod                        # Зависимости Go
└── go.sum
```

### Frontend структура

```
frontend/
├── src/
│   ├── components/               # React компоненты
│   │   ├── VacancyCard.tsx       # Карточка вакансии
│   │   ├── QuestionCard.tsx      # Карточка вопроса
│   │   ├── StatsChart.tsx        # Компоненты графиков
│   │   ├── Modals/               # Модальные окна
│   │   └── ...
│   ├── pages/                    # Страницы приложения
│   │   ├── TrackerPage.tsx       # Главная страница
│   │   ├── QuestionsPage.tsx     # Страница вопросов
│   │   ├── StatsPage.tsx         # Страница статистики
│   │   └── AuthPage.tsx          # Страница авторизации
│   ├── store/                    # Redux store
│   │   ├── index.ts              # Конфигурация store
│   │   ├── api.ts                # API клиент
│   │   ├── vacanciesSlice.ts     # Слайс вакансий
│   │   ├── questionsSlice.ts     # Слайс вопросов
│   │   └── statsSlice.ts         # Слайс статистики
│   ├── contexts/
│   │   └── ThemeContext.tsx      # Контекст темы
│   ├── utils/
│   │   └── chartConfig.ts        # Конфигурация графиков
│   ├── styles/                   # Глобальные стили
│   ├── images/                   # Изображения и иконки
│   ├── App.tsx                   # Главный компонент
│   └── index.tsx                 # Точка входа
├── public/
│   └── index.html                # HTML шаблон
├── package.json                  # Зависимости npm
├── webpack.config.js             # Конфигурация сборки
└── tsconfig.json                 # Конфигурация TypeScript
```

## Установка и запуск

### Предварительные требования

- **Go 1.23+** для backend
- **Node.js 18+** и **npm** для frontend
- **Supabase** аккаунт и проект

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd career-tracker
```

### 2. Настройка Backend

#### Установка зависимостей

```bash
cd backend
go mod download
```

#### Настройка переменных окружения

Создайте файл `.env` в папке `backend`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
PORT=8080
```

#### Запуск сервера

```bash
go run cmd/services/main.go
```

Сервер будет доступен по адресу: `http://localhost:8080`

### 3. Настройка Frontend

#### Установка зависимостей

```bash
cd frontend
npm install
```

#### Настройка переменных окружения

Создайте файл `.env` в папке `frontend`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8080
VITE_REACT_CLIENT_URL=http://localhost:3000/auth
```

#### Запуск приложения

```bash
npm start
```

Приложение будет доступно по адресу: `http://localhost:3000`

### 4. Настройка Supabase

1. Создайте новый проект в Supabase
2. Настройте аутентификацию (Email/Password)
3. Создайте необходимые таблицы в базе данных
4. Получите URL и ключи для настройки переменных окружения

## API Endpoints

### Аутентификация

Все API endpoints (кроме `/health`) требуют JWT токен в заголовке `Authorization: Bearer <token>`

### Основные endpoints

#### Отклики (Vacancies)

- `GET /api/vacancies` - список всех откликов пользователя
- `POST /api/vacancies` - создание нового отклика
- `GET /api/vacancies/:id` - получение детальной информации об отклике
- `PUT /api/vacancies/:id` - обновление отклика
- `DELETE /api/vacancies/:id` - удаление отклика

#### Вопросы (Questions)

- `GET /api/vacancies/:id/questions` - список всех вопросов по отклику
- `GET /api/questions` - список всех вопросов пользователя
- `POST /api/questions` - создание нового вопроса
- `PUT /api/questions/:id` - обновление вопроса
- `DELETE /api/questions/:id` - удаление вопроса

#### Статистика (Stats)

- `GET /api/stats/roles` - статистика по должностям

#### Системные

- `GET /health` - проверка состояния сервера
