# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

### Пример добавления новой категории:
```typescript
// 1. Добавляем в тип
export type Category = 
  | 'Электроника'
  | 'Одежда' 
  | 'Книги'
  | 'Другое'
  | 'Мебель' //  Новая категория

// 2. Добавляем в константу
export const CATEGORIES: Category[] = [
  'Электроника',
  'Одежда', 
  'Книги',
  'Другое',
  'Мебель' //  Новая категория
]

// 3. Добавляем цвет в конфиг
export const CHART_CONFIG = {
  colors: {
    'Электроника': '#6366F1',
    'Одежда': '#8B5CF6',
    'Книги': '#06B6D4',
    'Другое': '#10B981',
    'Мебель': '#F59E0B' //  Новый цвет
  } 
}
```

## Пройтись по stores/dashboard -> actions:
- calculateMetrics -> uniqueUsers??
- setPeriod -> case 'custom'
- разница refresh() и resetMetrics()

## Ключевые особенности реализации store:
1. типобезопасность
TypeScript проверяет корректность данных

2. валидация данных
Проверяем входящие данные от API

3. Реактивность
Автоматическая загрузка при смене периода

Watch на изменения dateRange

4. Обработка ошибок
Подробное логирование ошибок

User-friendly сообщения об ошибках

5. Расширенные computed свойства
hasData - проверка наличия данных

categories - список уникальных категорий

formattedDateRange - человеко-читаемый формат дат

6. Оптимизация производительности
Используем computed для производных данных

7. Гибкое API
setPeriod() - установка периода с автоматической загрузкой

setDateRange() - ручная установка дат

refresh() - принудительное обновление

validateSalesData() - переиспользуемая валидация

Пример данных после обработки в store:
```js

```


## Ключевые особенности API:
1. Типизация

2. Валидация параметров
Проверяем обязательные параметры

Валидируем формат дат

Проверяем логику дат (start ≤ end)

3. Генерация случайных данных

4. Обработка ошибок
Подробные сообщения об ошибках

Proper HTTP status codes

Логирование ошибок

## Пример обработки данных:

### Исходные данные из API:

```javascript
[
  { "date": "2024-06-01", "amount": 1200, "category": "Электроника" },
  { "date": "2024-06-01", "amount": 800, "category": "Одежда" },
  { "date": "2024-06-02", "amount": 1500, "category": "Электроника" }
]
```

### После обработки в store:

```javascript
{
  labels: ["2024-06-01", "2024-06-02"], // Ось X, уникальные даты
  datasets: [
    {
      label: "Электроника",
      data: [1200, 1500] // Ось Y для электроники
    },
    {
      label: "Одежда", 
      data: [800, 0] // Ось Y для одежды (0 потому что нет данных за 2024-06-02)
    }
  ]
}
```

## Кто за что отвечает:

### Store (dashboard.ts) контролирует:
- Какие даты показывать на оси X

- Какие значения показывать на оси Y для каждой даты

- Какие категории (линии) отображать

- Цвета для каждой категории

### Chart.js автоматически делает:
- Масштабирование оси Y

- Распределение подписей на оси Y

- Отображение сетки

- Позиционирование элементов

### Компонент (SalesChart.vue) контролирует:
- Форматирование чисел (добавление ₽)

- Цвета текста в зависимости от темы

- Стиль отображения (тени, скругления)

- Поведение при взаимодействии (tooltips, hover)

### Где можно изменить логику:
1. Изменить группировку данных - в stores/dashboard.ts в computed chartData

2. Изменить формат дат - можно преобразовать dates перед передачей в labels:

```typescript
const dates = [...new Set(salesData.value.map(item => item.date))].sort()
const formattedDates = dates.map(date => formatDate(date)) // ваша функция форматирования
return { labels: formattedDates, datasets }
```

3. Изменить шаг оси Y - в chartOptions можно добавить:

```typescript
y: {
  ticks: {
    stepSize: 1000 // шаг 1000 рублей
  }
}
```
