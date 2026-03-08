export type Store = '터키' | 'D마트' | '고아시아' | '에데카' | '리들' | '페니' | '아무데나';

export type Urgency = 'urgent' | 'relaxed';

export interface ShoppingItem {
  id: string;
  name: string;
  store: Store;
  quantity: number;
  unit: string;
  urgency: Urgency;
  inCart: boolean; // false = shopping list, true = history
  checkedAt?: number; // timestamp when moved to history
  createdAt: number;
}

export const STORES: Store[] = ['터키', 'D마트', '고아시아', '에데카', '리들', '페니', '아무데나'];

export const STORE_BADGE_CLASS: Record<Store, string> = {
  '터키': 'store-badge-turk',
  'D마트': 'store-badge-dmart',
  '고아시아': 'store-badge-goasia',
  '에데카': 'store-badge-edeka',
  '리들': 'store-badge-lidl',
  '페니': 'store-badge-penny',
  '아무데나': 'store-badge-any',
};

export const UNITS = ['개', '팩', '병', '봉', 'kg', 'g', 'L', 'ml'];
