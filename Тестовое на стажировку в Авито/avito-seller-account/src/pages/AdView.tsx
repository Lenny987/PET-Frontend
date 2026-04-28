import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  Box,
  Image,
  Paper,
  Alert,
  SimpleGrid,
  Loader,
  Center,
  List,
} from '@mantine/core';
import { IconArrowLeft, IconEdit, IconAlertCircle } from '@tabler/icons-react';
import { useAd } from '../hooks/useAds';
import { formatPrice, formatDate, getCategoryLabel } from '../utils/formatters';
import { ThemeToggle } from '../components/ThemeToggle';
import { getMissingFields } from '../utils/checkRevision';

export function AdView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ad, isLoading, error } = useAd(id);

  if (isLoading) {
    return (
      <Container>
        <Center h="100vh">
          <Loader />
        </Center>
      </Container>
    );
  }

  if (error || !ad) {
    return (
      <Container>
        <Alert color="red" mb="md">Не удалось загрузить объявление</Alert>
        <Button onClick={() => navigate('/ads')} leftSection={<IconArrowLeft />}>Назад</Button>
      </Container>
    );
  }

  const missingFields = getMissingFields(ad);
  const needsRevision = missingFields.length > 0;
  const params = ad.params as any;
  const paramEntries = Object.entries(params).filter(([_, value]) => value !== undefined);

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Button
          variant="light"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/ads')}
        >
          Назад к списку
        </Button>
        <ThemeToggle />
      </Group>

      <Group justify="space-between" mb="xl" align="start">
        <Box>
          <Title order={1} mb="xs">{ad.title}</Title>
          <Button
            leftSection={<IconEdit size={16} />}
            onClick={() => navigate(`/ads/${id}/edit`)}
            color="blue"
          >
            Редактировать
          </Button>
        </Box>
        <Box style={{ textAlign: 'right' }}>
          <Text size="xl" fw={700}>{formatPrice(ad.price)}</Text>
          <Text size="sm" c="dimmed">Опубликовано: {formatDate(ad.createdAt)}</Text>
          <Text size="sm" c="dimmed">Отредактировано: {formatDate(ad.updatedAt)}</Text>
        </Box>
      </Group>

      {needsRevision && (
        <Alert
          icon={<IconAlertCircle />}
          title="Требуются доработки"
          color="orange"
          variant="light"
          mb="xl"
        >
          <Text size="sm">У объявления не заполнены поля:</Text>
          <List size="sm" mt="xs" spacing="xs" withPadding>
            {missingFields.map((field) => (
              <List.Item key={field}>{field}</List.Item>
            ))}
          </List>
        </Alert>
      )}

      <SimpleGrid cols={2} spacing="xl">
        <Paper p="md" shadow="sm">
          <Image
            src="/placeholder.png"
            alt={ad.title}
            h={400}
            fit="cover"
            radius="md"
            mb="md"
          />
          <Group gap="xs">
            {[1, 2, 3, 4].map((i) => (
              <Image
                key={i}
                src="/placeholder.png"
                alt={`Фото ${i}`}
                h={80}
                w={80}
                fit="cover"
                radius="md"
              />
            ))}
          </Group>
        </Paper>

        <Box>
          <Paper p="md" mb="md" shadow="sm">
            <Title order={3} mb="md">Характеристики</Title>
            {paramEntries.map(([key, value]) => (
              <Group key={key} justify="space-between" mb="xs">
                <Text c="dimmed" style={{ textTransform: 'capitalize' }}>{key}:</Text>
                <Text fw={500}>{String(value)}</Text>
              </Group>
            ))}
          </Paper>

          {ad.description && (
            <Paper p="md" shadow="sm">
              <Title order={3} mb="md">Описание</Title>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{ad.description}</Text>
            </Paper>
          )}
        </Box>
      </SimpleGrid>
    </Container>
  );
}