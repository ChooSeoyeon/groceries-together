export type Store = '터키' | 'D마트' | '고아시아' | '에데카' | '리들' | '페니' | '알디' | '카우플란트' | '아무데나';

export type Urgency = 'urgent' | 'relaxed';

export interface ShoppingItem {
  id: string;
  name: string;
  store: Store;
  quantity: number;
  unit: string;
  urgency: Urgency;
  memo?: string;
  inCart: boolean; // true = cart (사야 할 것), false = history (이미 산 것)
  checkedAt?: string; // ISO timestamp, 히스토리로 이동된 시각
  createdAt: string;  // ISO timestamp
}

export const STORES: Store[] = ['터키', 'D마트', '고아시아', '에데카', '리들', '페니', '알디', '카우플란트', '아무데나'];

export const STORE_BADGE_CLASS: Record<Store, string> = {
  '터키': 'store-badge-turk',
  'D마트': 'store-badge-dmart',
  '고아시아': 'store-badge-goasia',
  '에데카': 'store-badge-edeka',
  '리들': 'store-badge-lidl',
  '페니': 'store-badge-penny',
  '알디': 'store-badge-aldi',
  '카우플란트': 'store-badge-kaufland',
  '아무데나': 'store-badge-any',
};

export const UNITS = ['개', 'kg'];
