import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Button,
  Group,
  Box,
  Paper,
  Alert,
  Loader,
  Center,
  Badge,
  Modal,
  Text,
  Divider,
  SimpleGrid,
} from '@mantine/core';
import { IconArrowLeft, IconSparkles, IconAlertCircle, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAd, useUpdateAd } from '../hooks/useAds';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { llmService } from '../utils/llm';
import { Item, Category } from '../types';
import { ThemeToggle } from '../components/ThemeToggle';

const electronicsTypes = [
  { value: 'laptop', label: 'Ноутбук' },
  { value: 'phone', label: 'Телефон' },
  { value: 'misc', label: 'Другое' },
];

const autoTransmissions = [
  { value: 'automatic', label: 'Автомат' },
  { value: 'manual', label: 'Механика' },
];

const realEstateTypes = [
  { value: 'flat', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'room', label: 'Комната' },
];

const conditions = [
  { value: 'new', label: 'Новое' },
  { value: 'used', label: 'Б/У' },
];

export function AdEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ad, isLoading: isLoadingAd } = useAd(id);
  const updateMutation = useUpdateAd(id!, () => {
    notifications.show({
      title: 'Успешно',
      message: 'Объявление обновлено',
      color: 'green',
    });
    navigate(`/ads/${id}`);
  });

  const [formData, setFormData] = useLocalStorage<Item>(`ad-draft-${id}`, {
    id: '',
    category: 'electronics',
    title: '',
    description: '',
    price: 0,
    params: {},
    createdAt: '',
    updatedAt: '',
  });

  const [aiModal, setAiModal] = useState<{
    type: 'description' | 'price' | null;
    isOpen: boolean;
    loading: boolean;
    result: string | null;
  }>({ type: null, isOpen: false, loading: false, result: null });

  useEffect(() => {
    if (ad && !formData.id) {
      setFormData(ad);
    }
  }, [ad]);

  const handleGenerateDescription = async () => {
    setAiModal({ type: 'description', isOpen: true, loading: true, result: null });
    try {
      const description = await llmService.generateDescription({
        title: formData.title,
        category: formData.category,
        params: formData.params,
        price: formData.price,
      });
      setAiModal({ type: 'description', isOpen: true, loading: false, result: description });
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось сгенерировать описание',
        color: 'red',
      });
      setAiModal({ type: 'description', isOpen: true, loading: false, result: null });
    }
  };

  const handleGetMarketPrice = async () => {
    setAiModal({ type: 'price', isOpen: true, loading: true, result: null });
    try {
      const priceData = await llmService.getMarketPrice({
        title: formData.title,
        category: formData.category,
        params: formData.params,
      });
      
      console.log('Price recommendation:', priceData);
      
      setAiModal({
        type: 'price',
        isOpen: true,
        loading: false,
        result: `${priceData.recommendation}\n\n Диапазон цен: ${priceData.minPrice.toLocaleString()} - ${priceData.maxPrice.toLocaleString()} ₽\n Средняя: ${Math.round((priceData.minPrice + priceData.maxPrice) / 2).toLocaleString()} ₽`,
      });
    } catch (error) {
      console.error('Market price error:', error);
      notifications.show({
        title: 'Ошибка',
        message: error instanceof Error ? error.message : 'Не удалось получить рыночную цену',
        color: 'red',
      });
      setAiModal({ type: 'price', isOpen: true, loading: false, result: null });
    }
  };

  const applyAIResult = () => {
    if (aiModal.type === 'description' && aiModal.result) {
      setFormData({ ...formData, description: aiModal.result });
    } else if (aiModal.type === 'price' && aiModal.result) {
      const rangeMatch = aiModal.result.match(/(\d{1,3}(?:\s*\d{3})*)\s*[-–—]\s*(\d{1,3}(?:\s*\d{3})*)/);
      
      if (rangeMatch) {
        const min = parseInt(rangeMatch[1].replace(/\s/g, ''));
        const max = parseInt(rangeMatch[2].replace(/\s/g, ''));
        
        if (min > 1000 && max > 1000) {
          const avg = Math.round((min + max) / 2);
          setFormData({ ...formData, price: avg });
          notifications.show({
            title: 'Цена применена',
            message: `Установлена средняя цена: ${avg.toLocaleString()} ₽`,
            color: 'green',
          });
        } else {
          notifications.show({
            title: 'Внимание',
            message: 'AI предложил некорректную цену. Проверьте рекомендацию вручную.',
            color: 'yellow',
          });
        }
      } else {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось извлечь цену из ответа AI',
          color: 'red',
        });
      }
    }
    setAiModal({ ...aiModal, isOpen: false });
  };

  const handleSave = () => {
    updateMutation.mutate({
      category: formData.category,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      params: formData.params,
    });
  };

  const updateParam = (key: string, value: any) => {
    setFormData({
      ...formData,
      params: {
        ...formData.params,
        [key]: value,
      } as any,
    });
  };

  const clearParam = (key: string) => {
    const newParams = { ...formData.params } as any;
    delete newParams[key];
    setFormData({ ...formData, params: newParams });
  };

  const renderCharacteristics = () => {
    const params = formData.params as any;

    if (formData.category === 'electronics') {
      return (
        <SimpleGrid cols={2} spacing="md">
          <Select
            label="Тип"
            value={params.type || ''}
            onChange={(value) => updateParam('type', value)}
            data={electronicsTypes}
            clearable
          />
          <TextInput
            label="Бренд"
            value={params.brand || ''}
            onChange={(e) => updateParam('brand', e.target.value)}
            rightSection={params.brand ? <IconX size={14} style={{ cursor: 'pointer' }} onClick={() => clearParam('brand')} /> : undefined}
          />
          <TextInput
            label="Модель"
            value={params.model || ''}
            onChange={(e) => updateParam('model', e.target.value)}
            rightSection={params.model ? <IconX size={14} style={{ cursor: 'pointer' }} onClick={() => clearParam('model')} /> : undefined}
          />
          <Select
            label="Состояние"
            value={params.condition || ''}
            onChange={(value) => updateParam('condition', value)}
            data={conditions}
            clearable
          />
          <TextInput
            label="Цвет"
            value={params.color || ''}
            onChange={(e) => updateParam('color', e.target.value)}
            rightSection={params.color ? <IconX size={14} style={{ cursor: 'pointer' }} onClick={() => clearParam('color')} /> : undefined}
          />
        </SimpleGrid>
      );
    }

    if (formData.category === 'auto') {
      return (
        <SimpleGrid cols={2} spacing="md">
          <TextInput
            label="Бренд"
            value={params.brand || ''}
            onChange={(e) => updateParam('brand', e.target.value)}
            rightSection={params.brand ? <IconX size={14} style={{ cursor: 'pointer' }} onClick={() => clearParam('brand')} /> : undefined}
          />
          <TextInput
            label="Модель"
            value={params.model || ''}
            onChange={(e) => updateParam('model', e.target.value)}
            rightSection={params.model ? <IconX size={14} style={{ cursor: 'pointer' }} onClick={() => clearParam('model')} /> : undefined}
          />
          <NumberInput
            label="Год выпуска"
            value={params.yearOfManufacture || ''}
            onChange={(value) => updateParam('yearOfManufacture', value)}
            min={1900}
            max={new Date().getFullYear() + 1}
          />
          <Select
            label="Коробка передач"
            value={params.transmission || ''}
            onChange={(value) => updateParam('transmission', value)}
            data={autoTransmissions}
            clearable
          />
          <NumberInput
            label="Пробег (км)"
            value={params.mileage || ''}
            onChange={(value) => updateParam('mileage', value)}
            min={0}
          />
          <NumberInput
            label="Мощность двигателя (л.с.)"
            value={params.enginePower || ''}
            onChange={(value) => updateParam('enginePower', value)}
            min={0}
          />
        </SimpleGrid>
      );
    }

    if (formData.category === 'real_estate') {
      return (
        <SimpleGrid cols={2} spacing="md">
          <Select
            label="Тип"
            value={params.type || ''}
            onChange={(value) => updateParam('type', value)}
            data={realEstateTypes}
            clearable
          />
          <TextInput
            label="Адрес"
            value={params.address || ''}
            onChange={(e) => updateParam('address', e.target.value)}
            rightSection={params.address ? <IconX size={14} style={{ cursor: 'pointer' }} onClick={() => clearParam('address')} /> : undefined}
          />
          <NumberInput
            label="Площадь (м²)"
            value={params.area || ''}
            onChange={(value) => updateParam('area', value)}
            min={0}
          />
          <NumberInput
            label="Этаж"
            value={params.floor || ''}
            onChange={(value) => updateParam('floor', value)}
            min={1}
          />
        </SimpleGrid>
      );
    }

    return null;
  };

  if (isLoadingAd) {
    return (
      <Container>
        <Center h="100vh">
          <Loader />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl" style={{ width: '100%' }}>
        <Button
          variant="light"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(`/ads/${id}`)}
        >
          Назад
        </Button>
        <ThemeToggle />
      </Group>

      <Title order={1} mb="xl">Редактирование объявления</Title>

      <Paper p="xl" shadow="sm">
        <Box mb="xl">
          <Select
            label="Категория"
            required
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value as Category, params: {} })}
            data={[
              { value: 'electronics', label: 'Электроника' },
              { value: 'auto', label: 'Транспорт' },
              { value: 'real_estate', label: 'Недвижимость' },
            ]}
            mb="md"
          />

          <TextInput
            label="Название"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            mb="md"
            rightSection={formData.title ? <IconX size={14} style={{ cursor: 'pointer' }} onClick={() => setFormData({ ...formData, title: '' })} /> : undefined}
          />

          <Group mb="md" align="flex-end" grow>
            <NumberInput
              label="Цена"
              required
              value={formData.price}
              onChange={(value) => setFormData({ ...formData, price: Number(value) })}
              rightSection={<Text c="dimmed" size="sm">₽</Text>}
            />
            <Button
              variant="outline"
              leftSection={<IconSparkles size={16} />}
              onClick={handleGetMarketPrice}
              disabled={updateMutation.isPending}
              mt="auto"
            >
              Узнать цену
            </Button>
          </Group>
        </Box>

        <Box mb="xl">
          <Title order={3} mb="md">Характеристики</Title>
          {renderCharacteristics()}
        </Box>

        <Divider mb="xl" />

        <Box mb="xl">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Описание</Text>
            <Badge 
              variant="light" 
              color={formData.description && formData.description.length > 900 ? 'orange' : 'blue'}
              size="lg"
            >
              {formData.description?.length || 0} / 1000
            </Badge>
          </Group>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 1000) })}
            minRows={6}
            maxRows={10}
            placeholder="Введите описание товара..."
          />
          <Group mt="xs">
            <Button
              variant="light"
              leftSection={<IconSparkles size={16} />}
              onClick={handleGenerateDescription}
              disabled={updateMutation.isPending}
              size="sm"
            >
              Придумать описание
            </Button>
          </Group>
        </Box>

        <Group>
          <Button 
            onClick={handleSave} 
            loading={updateMutation.isPending}
            size="lg"
          >
            Сохранить
          </Button>
          <Button 
            variant="default" 
            onClick={() => navigate(`/ads/${id}`)}
            disabled={updateMutation.isPending}
            size="lg"
          >
            Отменить
          </Button>
        </Group>
      </Paper>

      <Modal
        opened={aiModal.isOpen}
        onClose={() => setAiModal({ ...aiModal, isOpen: false })}
        title={
          <Group>
            <IconSparkles color="#339af0" />
            <Text fw={600}>
              {aiModal.type === 'description' ? 'AI Описание' : 'Рыночная цена'}
            </Text>
          </Group>
        }
        size="lg"
      >
        {aiModal.loading ? (
          <Center h={200}>
            <Loader />
          </Center>
        ) : aiModal.result ? (
          <Box>
            <Alert 
              icon={<IconSparkles />} 
              title="Рекомендация AI" 
              color="blue"
              mb="md"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {aiModal.result}
            </Alert>
            <Group justify="flex-end">
              <Button 
                variant="default" 
                onClick={() => setAiModal({ ...aiModal, isOpen: false })}
              >
                Закрыть
              </Button>
              <Button onClick={applyAIResult}>
                Применить
              </Button>
            </Group>
          </Box>
        ) : (
          <Alert color="red" icon={<IconAlertCircle />}>
            Произошла ошибка при генерации
          </Alert>
        )}
      </Modal>
    </Container>
  );
}