import { apiClient } from './client';
import { Item, ItemUpdateIn, ItemsGetOut, ListFilters, Category } from '../types';

export const itemsApi = {
  getAll: async (filters: ListFilters): Promise<ItemsGetOut> => {
    const params = new URLSearchParams();
    
    if (filters.q) params.append('q', filters.q);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters.needsRevision !== undefined) params.append('needsRevision', String(filters.needsRevision));
    if (filters.categories && filters.categories.length > 0) {
      params.append('categories', filters.categories.join(','));
    }
    if (filters.sortColumn) params.append('sortColumn', filters.sortColumn);
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

    const response = await apiClient.get<ItemsGetOut>(`/items?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Item> => {
    const response = await apiClient.get<Item>(`/items/${id}`);
    return response.data;
  },

  update: async (id: string, data: ItemUpdateIn): Promise<Item> => {
    const response = await apiClient.put<Item>(`/items/${id}`, data);
    return response.data;
  },
};