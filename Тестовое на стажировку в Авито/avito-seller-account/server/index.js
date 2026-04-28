const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

let items = [
  {
    id: uuidv4(),
    category: 'electronics',
    title: 'MacBook Pro 16"',
    description: 'Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется.',
    price: 120000,
    params: { type: 'laptop', brand: 'Apple', model: 'M1 Pro', condition: 'used', color: 'Серый' },
    createdAt: '2025-03-10T22:39:00.000Z',
    updatedAt: '2025-03-10T23:12:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'auto',
    title: 'Volkswagen Polo',
    description: 'Отличное состояние, один владелец, ПТС оригинал. Все ТО у официального дилера. Комплектация Comfortline: кондиционер, подогрев сидений, электростеклоподъемники.',
    price: 1100000,
    params: { brand: 'Volkswagen', model: 'Polo', yearOfManufacture: 2020, transmission: 'automatic', mileage: 50000, enginePower: 110 },
    createdAt: '2025-03-08T14:20:00.000Z',
    updatedAt: '2025-03-09T10:15:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'auto',
    title: 'Toyota Camry',
    description: '',
    price: 3900000,
    params: { brand: 'Toyota', model: 'Camry', yearOfManufacture: 2022, transmission: 'automatic', mileage: 35000, enginePower: 194 },
    createdAt: '2025-03-11T09:00:00.000Z',
    updatedAt: '2025-03-11T09:00:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'auto',
    title: 'Omoda C5',
    description: 'Новый автомобиль, куплен в 2024 году. Гарантия до 2029 года. Максимальная комплектация Ultimate: панорамная крыша, кожаный салон, камеры 360, адаптивный круиз.',
    price: 2900000,
    params: { brand: 'Omoda', model: 'C5', yearOfManufacture: 2024, transmission: 'automatic', mileage: 5000, enginePower: 147 },
    createdAt: '2025-03-05T16:30:00.000Z',
    updatedAt: '2025-03-06T11:20:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'real_estate',
    title: 'Студия, 25м²',
    description: 'Уютная студия в новом ЖК. Ремонт от застройщика, вся мебель и техника остаются. Рядом метро, магазины, школы. Идеально для одного человека или пары.',
    price: 15000000,
    params: { type: 'flat', address: 'г. Москва, ул. Новая, д. 15', area: 25, floor: 8 },
    createdAt: '2025-03-07T12:00:00.000Z',
    updatedAt: '2025-03-08T14:30:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'real_estate',
    title: '1-кк, 44м²',
    description: '',
    price: 19000000,
    params: { type: 'flat', address: 'г. Москва, ул. Ленина, д. 25', area: 44, floor: 5 },
    createdAt: '2025-03-09T10:00:00.000Z',
    updatedAt: '2025-03-09T10:00:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'electronics',
    title: 'Наушники Sony WH-1000XM5',
    description: 'Флагманские наушники с шумоподавлением. Покупал 3 месяца назад, состояние идеальное. Полный комплект: чехол, кабеля, коробка. Звук превосходный, батарея держит до 30 часов.',
    price: 29900,
    params: { type: 'misc', brand: 'Sony', model: 'WH-1000XM5', condition: 'used', color: 'Черный' },
    createdAt: '2025-03-12T18:45:00.000Z',
    updatedAt: '2025-03-12T19:00:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'electronics',
    title: 'iPad Air 11, 2024 г.',
    description: 'Новый iPad Air на чипе M2. 128GB, WiFi. Покупал неделю назад, ни разу не использовал. Пленка на экране с завода. Отличный планшет для работы и развлечений.',
    price: 37000,
    params: { type: 'misc', brand: 'Apple', model: 'iPad Air 11', condition: 'new', color: 'Синий' },
    createdAt: '2025-03-13T11:20:00.000Z',
    updatedAt: '2025-03-13T11:20:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'electronics',
    title: 'MAJOR VI',
    description: 'Игровой монитор 27", 165Hz, 1ms. Покупал 6 месяцев назад. Отличное состояние, без битых пикселей. Идеален для игр и работы. Причина продажи - переход на ultrawide.',
    price: 20000,
    params: { type: 'misc', brand: 'MAJOR', model: 'VI', condition: 'used', color: 'Черный' },
    createdAt: '2025-03-10T15:30:00.000Z',
    updatedAt: '2025-03-11T09:45:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'electronics',
    title: 'iPhone 17 Pro Max',
    description: 'Новейший iPhone 17 Pro Max, 256GB. Покупал месяц назад. Состояние идеальное, всегда в чехле и с защитным стеклом. Полный комплект, гарантия до 2026 года. Обмен не интересует.',
    price: 107000,
    params: { type: 'phone', brand: 'Apple', model: 'iPhone 17 Pro Max', condition: 'used', color: 'Titanium Natural' },
    createdAt: '2025-03-14T09:15:00.000Z',
    updatedAt: '2025-03-14T10:00:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'auto',
    title: 'Hyundai Solaris',
    description: '',
    price: 950000,
    params: { brand: 'Hyundai', model: 'Solaris', transmission: 'manual', mileage: 80000 },
    createdAt: '2025-03-06T13:00:00.000Z',
    updatedAt: '2025-03-06T13:00:00.000Z'
  },
  {
    id: uuidv4(),
    category: 'real_estate',
    title: '2-к квартира, 65м²',
    description: 'Просторная двушка в спальном районе. Раздельные комнаты, большая кухня, балкон застеклен. Рядом парк, детский сад, школа. Тихие соседи, чистый подъезд.',
    price: 28000000,
    params: { type: 'flat', address: 'г. Москва, ул. Мира, д. 42', area: 65, floor: 3 },
    createdAt: '2025-03-04T10:00:00.000Z',
    updatedAt: '2025-03-05T16:20:00.000Z'
  }
];

function checkNeedsRevision(item) {
  const p = item.params || {};
  let needsRev = !item.description || item.description.trim() === '';

  if (item.category === 'auto') {
    if (!p.yearOfManufacture || p.mileage === undefined || p.mileage === null || !p.transmission || !p.enginePower) {
      needsRev = true;
    }
  } else if (item.category === 'electronics') {
    if (!p.condition || !p.color) needsRev = true;
  } else if (item.category === 'real_estate') {
    if (!p.area || !p.floor) needsRev = true;
  }

  return needsRev;
}

app.get('/items', (req, res) => {
  const { q, limit = 10, skip = 0, categories, needsRevision } = req.query;
  let filtered = items;

  if (q) {
    filtered = filtered.filter(item => item.title.toLowerCase().includes(q.toLowerCase()));
  }

  if (categories) {
    const cats = categories.split(',');
    filtered = filtered.filter(item => cats.includes(item.category));
  }

  if (needsRevision === 'true') {
    filtered = filtered.filter(item => checkNeedsRevision(item));
  }

  const itemsWithRevision = filtered.map(item => ({
    ...item,
    needsRevision: checkNeedsRevision(item)
  }));

  const total = itemsWithRevision.length;
  const paginated = itemsWithRevision.slice(Number(skip), Number(skip) + Number(limit));

  res.json({ items: paginated, total });
});

app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({ ...item, needsRevision: checkNeedsRevision(item) });
});

app.put('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  items[index] = {
    ...items[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json(items[index]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});