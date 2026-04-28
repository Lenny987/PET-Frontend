export type Category = 'auto' | 'real_estate' | 'electronics';

export interface AutoItemParams {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
}

export interface RealEstateItemParams {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
}

export interface ElectronicsItemParams {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
}

export type ItemParams = AutoItemParams | RealEstateItemParams | ElectronicsItemParams;

export interface Item {
  id: string;
  category: Category;
  title: string;
  description?: string;
  price: number;
  params: ItemParams;
  createdAt: string;
  updatedAt: string;
}

export interface ItemWithRevision extends Item {
  needsRevision: boolean;
}

export interface ItemsGetOut {
  items: ItemWithRevision[];
  total: number;
}

export interface ItemUpdateIn {
  category: Category;
  title: string;
  description?: string;
  price: number;
  params: ItemParams;
}

export interface ListFilters {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: Category[];
  sortColumn?: 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}