# GamerStats — платформа статистики по играм 

Полноценное SPA-приложение с авторизацией, профилем, оценками и отзывами на игры.

---



### Структура проекта

```
GamerStats/
├── GamerStats.API/            # Бэкенд (ASP.NET Core)
└── gamerstats-frontend/       # Фронтенд (React + Vite + Tailwind)
```

---

## Установка и запуск

### 1. Установить зависимости

#### Требуется:

- .NET SDK 8+
- SQL Server Express

---

## Бэкенд (GamerStats.API)

```bash
cd GamerStats.API
```

1. Измените строку подключения в `appsettings.json`:

```
"DefaultConnection": "Server=localhost;Database=GamerStatsDb;Trusted_Connection=True;"
```

2. Примените миграции:

```bash
dotnet ef database update
```

> Если `dotnet ef` не установлен: `dotnet tool install --global dotnet-ef`

3. Запустите API:

```bash
dotnet run
```

API будет доступен на: `https://localhost:7129`

---

## Фронтенд (gamerstats-frontend)

```bash
cd gamerstats-frontend
```

1. Установите зависимости:

```bash
npm install
```

2. Создайте `.env` в корне:

```

VITE_API_URL=https://localhost:7129/api

```

3. Запустите клиент:

```bash

npm run dev

```

Сайт будет доступен по адресу:

```

http://localhost:5173

```

---

## Что можно проверить

- Регистрация и вход
- Просмотр игр, отзывов и рейтинга
- Добавление игр 
- Добавление комментариев, оценок
- Обновление статуса прохождения
- Удаление отзывов/игр

---

##  Роли

- **User** — может вести свою статистику
- **Admin** — может управлять всеми играми 

"email": "admin@gmail.com",
"password": "admin123"
для тестирования админки

---

## Контакты

Разработчики: Гуменюк А.И.  Чушкин Д.Д.



