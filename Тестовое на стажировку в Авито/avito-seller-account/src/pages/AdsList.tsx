import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Text, TextInput, Select, Group, Box, SimpleGrid, Loader, Center, ActionIcon, Button, ThemeIcon } from '@mantine/core';
import { IconSearch, IconLayoutGrid, IconList } from '@tabler/icons-react';
import { AdCard } from '../components/AdCard';
import { AdFilters } from '../components/AdFilters';
import { Pagination } from '../components/Pagination';
import { useAds } from '../hooks/useAds';
import { ListFilters } from '../types';
import { ThemeToggle } from '../components/ThemeToggle';

const ITEMS_PER_PAGE = 8;

export function AdsList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ListFilters>({ 
    limit: ITEMS_PER_PAGE, 
    skip: 0, 
    sortColumn: 'createdAt', 
    sortDirection: 'desc',
    categories: [] 
  });
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const { data, isLoading, error } = useAds(filters);

  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, skip: (page - 1) * ITEMS_PER_PAGE }));
  const handleFilterChange = (newFilters: Partial<ListFilters>) => setFilters((prev) => ({ ...prev, ...newFilters, skip: 0 }));
  
  const resetFilters = () => setFilters({ 
    limit: ITEMS_PER_PAGE, 
    skip: 0, 
    sortColumn: 'createdAt', 
    sortDirection: 'desc',
    categories: [],
    needsRevision: false,
    q: ''
  });

  const currentPage = Math.floor((filters.skip || 0) / ITEMS_PER_PAGE) + 1;

  if (error) {
    return (
      <Container>
        <Center h="100vh">
          <Box>
            <Text c="red">Ошибка загрузки</Text>
            <Button onClick={() => window.location.reload()} mt="md">Повторить</Button>
          </Box>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={1}>Мои объявления</Title>
          <Text c="dimmed">{data?.total || 0} объявлений</Text>
        </Box>
        <Group>
          <ThemeToggle />
          <ActionIcon variant={layout === 'grid' ? 'filled' : 'default'} onClick={() => setLayout('grid')} size="lg">
            <IconLayoutGrid size={20} />
          </ActionIcon>
          <ActionIcon variant={layout === 'list' ? 'filled' : 'default'} onClick={() => setLayout('list')} size="lg">
            <IconList size={20} />
          </ActionIcon>
        </Group>
      </Group>

      <Group align="start" gap="lg">
        <AdFilters filters={filters} onChange={handleFilterChange} onReset={resetFilters} />
        <Box style={{ flex: 1 }}>
          <Group mb="md">
            <TextInput 
              placeholder="Найти объявление..." 
              leftSection={<IconSearch size={16} />} 
              style={{ flex: 1 }} 
              value={filters.q || ''} 
              onChange={(e) => handleFilterChange({ q: e.target.value })} 
            />
            <Select 
              value={filters.sortDirection || 'desc'} 
              onChange={(value) => handleFilterChange({ sortDirection: value as 'asc' | 'desc' })} 
              data={[{ value: 'desc', label: 'Сначала новые' }, { value: 'asc', label: 'Сначала старые' }]} 
              w={200} 
            />
          </Group>

          {isLoading ? (
            <Center h={400}><Loader size="xl" /></Center>
          ) : (
            <>
              <SimpleGrid cols={layout === 'grid' ? { base: 1, sm: 2, md: 3, lg: 4 } : 1} spacing="md" verticalSpacing="md">
                {data?.items.map((ad) => <AdCard key={ad.id} ad={ad} layout={layout} onClick={() => navigate(`/ads/${ad.id}`)} />)}
              </SimpleGrid>
              {data && data.total > ITEMS_PER_PAGE && <Pagination total={data.total} currentPage={currentPage} pageSize={ITEMS_PER_PAGE} onChange={handlePageChange} />}
            </>
          )}
        </Box>
      </Group>
    </Container>
  );
}