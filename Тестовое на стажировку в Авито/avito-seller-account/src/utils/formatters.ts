export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    auto: 'Транспорт',
    real_estate: 'Недвижимость',
    electronics: 'Электроника',
  };
  return labels[category] || category;
};