import { Paper, Checkbox, Button, Text, Switch, Group } from '@mantine/core';
import { ListFilters, Category } from '../types';

interface AdFiltersProps {
  filters: ListFilters;
  onChange: (filters: Partial<ListFilters>) => void;
  onReset: () => void;
}

const categories: { value: Category; label: string }[] = [
  { value: 'auto', label: 'Транспорт' },
  { value: 'real_estate', label: 'Недвижимость' },
  { value: 'electronics', label: 'Электроника' },
];

export function AdFilters({ filters, onChange, onReset }: AdFiltersProps) {
  return (
    <Paper p="md" w={250} shadow="sm">
      <Text fw={600} mb="md" size="lg">Фильтры</Text>
      
      <Checkbox.Group
        value={filters.categories || []}
        onChange={(val) => onChange({ categories: val as Category[] })}
        mb="md"
      >
        <Text size="sm" c="dimmed" mb="xs" fw={500}>Категория</Text>
        {categories.map((cat) => (
          <Checkbox
            key={cat.value}
            value={cat.value}
            label={cat.label}
            mb="xs"
          />
        ))}
      </Checkbox.Group>

      <Switch
        label="Только требующие доработок"
        checked={filters.needsRevision || false}
        onChange={(e) => onChange({ needsRevision: e.target.checked })}
        mb="md"
      />

      <Button variant="light" fullWidth onClick={onReset}>Сбросить фильтры</Button>
    </Paper>
  );
}