import { Item } from '../types';

export function getMissingFields(item: Item): string[] {
  const missing: string[] = [];
  const p = item.params as Record<string, any>;

  if (!item.description || item.description.trim() === '') {
    missing.push('Описание');
  }

  if (item.category === 'electronics') {
    if (!p.condition || p.condition === '') missing.push('Состояние');
    if (!p.color || p.color === '') missing.push('Цвет');
  }

  if (item.category === 'auto') {
    if (!p.yearOfManufacture || p.yearOfManufacture === 0 || p.yearOfManufacture === null) {
      missing.push('Год выпуска');
    }
    if (p.mileage === undefined || p.mileage === null || p.mileage === '') {
      missing.push('Пробег');
    }
    if (!p.transmission || p.transmission === '') {
      missing.push('Коробка передач');
    }
    if (!p.enginePower || p.enginePower === 0 || p.enginePower === null || p.enginePower === undefined) {
      missing.push('Мощность двигателя');
    }
  }

  if (item.category === 'real_estate') {
    if (!p.area || p.area === 0 || p.area === null) {
      missing.push('Площадь');
    }
    if (!p.floor || p.floor === 0 || p.floor === null) {
      missing.push('Этаж');
    }
  }

  return missing;
}