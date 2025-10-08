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


