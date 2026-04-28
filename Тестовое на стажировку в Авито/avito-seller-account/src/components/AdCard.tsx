import { Card, Image, Text, Group, Badge, Box } from '@mantine/core';
import { ItemWithRevision } from '../types';
import { getCategoryLabel, formatPrice } from '../utils/formatters';

interface AdCardProps {
  ad: ItemWithRevision;
  layout: 'grid' | 'list';
  onClick: () => void;
}

export function AdCard({ ad, layout, onClick }: AdCardProps) {
  if (layout === 'list') {
    return (
      <Card onClick={onClick} style={{ cursor: 'pointer' }} p="md" shadow="sm">
        <Group>
          <Image src="/placeholder.png" alt={ad.title} w={120} h={120} fit="cover" radius="md" />
          <Box style={{ flex: 1 }}>
            <Group justify="space-between">
              <Text fw={500} size="lg">{ad.title}</Text>
              <Text fw={700} size="xl">{formatPrice(ad.price)}</Text>
            </Group>
            <Text size="sm" c="dimmed" mt="xs">{getCategoryLabel(ad.category)}</Text>
            {ad.needsRevision && (
              <Badge color="orange" mt="xs" size="sm">Требует доработок</Badge>
            )}
          </Box>
        </Group>
      </Card>
    );
  }

  return (
    <Card 
      onClick={onClick} 
      style={{ 
        cursor: 'pointer',
        height: 320,
        display: 'flex',
        flexDirection: 'column'
      }} 
      p="md" 
      shadow="sm"
    >
      <Image
        src="/placeholder.png"
        alt={ad.title}
        h={160}
        fit="cover"
        radius="md"
        mb="md"
      />
      <Badge size="sm" mb="xs">
        {getCategoryLabel(ad.category)}
      </Badge>
      <Text 
        fw={500} 
        lineClamp={2} 
        mb="xs" 
        style={{ 
          height: 40,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}
      >
        {ad.title}
      </Text>
      <Box style={{ marginTop: 'auto' }}>
        <Group justify="space-between" align="flex-end">
          <Text fw={700} size="lg">{formatPrice(ad.price)}</Text>
          {ad.needsRevision && (
            <Badge color="orange" size="sm">Требует доработок</Badge>
          )}
        </Group>
      </Box>
    </Card>
  );
}