/** 
 * Функция для добавления прозрачности (для background colors)
*/
export const addColorOpacity = (color: string, opacity: number = 0.2): string => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return color
}

/**
 * Возвращает объект стилей для отложенной анимации
*/
export const getAnimationDelay = (delay: number) => {
  return { animationDelay: `${delay}ms` }
}
