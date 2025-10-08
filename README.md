# Nuxt-Chart Analytics Dashboard

[Ссылка на рабочее приложение](https://nuxt-chart-dashboard.vercel.app/)

Интерактивный аналитический дашборд для визуализации данных о продажах и пользовательской активности, построенный на современном стеке технологий.

## 🚀 Технологии

- **Фреймворк**: Nuxt 3 (SSR)
- **Язык**: TypeScript
- **UI-библиотека**: Vuetify 3
- **Графики**: Chart.js с vue-chartjs
- **Управление состоянием**: Pinia

## 📦 Быстрый старт

### Установка зависимостей

```bash
# npm
npm install
```

### Запуск в режиме разработки

```bash
# npm
npm run dev
```

### Сборка для production

```bash
# npm
npm run build
```

## 🎯 Функциональность

### Основные возможности
- 📊 **Линейный график** продаж по категориям с анимациями
- 📈 **Ключевые метрики**: общий доход, количество заказов, средний чек, уникальные пользователи
- ⏱️ **Фильтрация по периодам**: сегодня, неделя, месяц, произвольный диапазон
- 🌙 **Темная/светлая тема** с мгновенным переключением
- 📱 **Адаптивный дизайн** для всех устройств
- ⚡ **Оптимизированная производительность** без лишних перерисовок

### Особенности реализации

#### Store (Pinia) - `stores/dashboard.ts`
```typescript
// Типобезопасность и валидация
const validatedData = validateSalesData(data)

// Реактивность
watch(dateRange, () => {
  if (selectedPeriod.value === 'custom') {
    fetchData()
  }
}, { deep: true })

// Расширенные computed свойства
const hasData = computed(() => salesData.value.length > 0)
const categories = computed(() => [...new Set(salesData.value.map(item => item.category))])
```

#### API - `server/api/sales.get.ts`
- **Валидация параметров** с проверкой формата дат
- **Генерация реалистичных mock-данных**
- **Обработка ошибок** с детальными сообщениями

## 🏗️ Архитектура

### Обработка данных

#### Исходные данные из API:
```javascript
[
  { "date": "2024-06-01", "amount": 1200, "category": "Электроника" },
  { "date": "2024-06-01", "amount": 800, "category": "Одежда" },
  { "date": "2024-06-02", "amount": 1500, "category": "Электроника" }
]
```

#### После обработки в store:
```javascript
{
  labels: ["2024-06-01", "2024-06-02"], // Ось X - уникальные даты
  datasets: [
    {
      label: "Электроника",
      data: [1200, 1500], // Сумма продаж по датам
      borderColor: "#6366F1",
      backgroundColor: "rgba(99, 102, 241, 0.2)"
    },
    {
      label: "Одежда", 
      data: [800, 0], // 0 = нет данных за эту дату
      borderColor: "#8B5CF6",
      backgroundColor: "rgba(139, 92, 246, 0.2)"
    }
  ]
}
```

## 🔧 Расширение функциональности

### Добавление новой категории

```typescript
// 1. Добавляем в тип types/index.ts
export type TCategory = 
  | 'Электроника'
  | 'Одежда' 
  | 'Книги'
  | 'Другое'
  | 'Мебель' // 👈 Новая категория

// 2. Добавляем в константу types/index.ts
export const CATEGORIES: TCategory[] = [
  'Электроника',
  'Одежда', 
  'Книги',
  'Другое',
  'Мебель' // 👈 Новая категория
]

// 3. Добавляем цвет в конфиг config/chart.ts
export const CHART_CONFIG = {
  colors: {
    'Электроника': '#6366F1',
    'Одежда': '#8B5CF6',
    'Книги': '#06B6D4',
    'Другое': '#10B981',
    'Мебель': '#F59E0B' // 👈 Новый цвет
  } 
}

// 4. Добавляем конфиг диапазона цен в server/api/sales.get.ts для генерации mock-данных
const categoryRanges = {
  'Электроника': { min: 500, max: 3000 },
  'Одежда': { min: 200, max: 1200 },
  'Книги': { min: 100, max: 600 },
  'Другое': { min: 50, max: 400 },
  'Мебель': { min: 50, max: 400 },
}
```

## Настройки графика

### Настройка шкалы оси X

```typescript
// В stores/dashboard.ts
const chartData = computed(() => {
  const dates = [...new Set(salesData.value.map(item => item.date))].sort()
  
  // Кастомное форматирование дат
  const formattedDates = dates.map(date => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  })
  
  return { labels: formattedDates, datasets }
})
```

### Настройка шкалы оси Y

```typescript
// В SalesChart.vue
y: {
  ticks: {
    stepSize: 1000, // 👈 Шаг 1000 рублей
    callback: function(value) {
      return value.toLocaleString('ru-RU') + ' ₽'
    }
  }
}
```

## 📊 Ключевые метрики

### Расчет метрик в store:

```typescript
function calculateMetrics(data: ISalesData[]) {
  const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0)
  const totalOrders = data.length
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
  
  // Уникальные пользователи - mock расчет
  // В реальном приложении данные брались бы из API
  const uniqueDates = new Set(data.map(item => item.date)).size
  const uniqueUsers = uniqueDates * 150 // Примерная конверсия

  return {
    totalRevenue,
    totalOrders,
    averageOrder: Math.round(averageOrder),
    uniqueUsers
  }
}
```

## 🎨 Кастомизация

### Темы
- **Светлая тема**: Сине-фиолетовая палитра
- **Темная тема**: Глубокие тона с хорошей контрастностью
- **Переключение**: Мгновенное, без перезагрузки страницы

### Анимации
- Плавные переходы между состояниями
- Последовательная загрузка элементов
- Кастомные скелетоны для состояний загрузки

## 🔄 API эндпоинты

### GET `/api/sales`
Параметры:
- `period`: `today` | `week` | `month` | `custom`
- `start`: Дата начала периода (YYYY-MM-DD)
- `end`: Дата окончания периода (YYYY-MM-DD)

Ответ:
```typescript
interface ISalesData {
  date: string; // YYYY-MM-DD
  amount: number;
  category: TCategory; // поддерживаемые категории
}
```

## 🚀 Деплой

Приложение готово к деплою на любую платформу, поддерживающую Node.js:

- **Vercel** / **Netlify** (статическая генерация)
- **Heroku** / **Railway** (серверный рендеринг)
- **Docker** контейнеризация

[Ссылка на рабочее приложение](https://nuxt-chart-dashboard.vercel.app/)

## 🤝 Разработка

### Структура проекта
```
src/
├── components/     # Vue компоненты
├── stores/        # Pinia stores
├── server/        # API routes
├── types/         # TypeScript типы
└── utils/         # Вспомогательные функции
```

### Основные команды
```bash
npm run dev        # Разработка
npm run build      # Сборка
npm run preview    # Предпросмотр
npm run generate   # Статическая генерация
```

## 📈 Производительность

- **Оптимизированные перерисовки** с `v-memo`
- **Кэширование вычислений** в computed свойствах
- **Ленивая загрузка** компонентов
- **Оптимизированные анимации** Chart.js

---
