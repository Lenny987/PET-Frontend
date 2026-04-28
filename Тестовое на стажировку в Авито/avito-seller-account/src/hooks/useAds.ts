import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '../api/items';
import { ListFilters, ItemUpdateIn } from '../types';

export function useAds(filters: ListFilters) {
  return useQuery({
    queryKey: ['ads', filters],
    queryFn: () => itemsApi.getAll(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAd(id: string | undefined) {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: () => itemsApi.getById(id!),
    enabled: !!id,
  });
}

export function useUpdateAd(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ItemUpdateIn) => itemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad', id] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      onSuccess?.();
    },
  });
}