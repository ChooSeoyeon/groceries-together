import { Store, STORES, STORE_BADGE_CLASS } from '@/types/shopping';
import { ShoppingItem } from '@/types/shopping';

interface StoreTabsProps {
  selectedStore: Store | 'all';
  onSelect: (store: Store | 'all') => void;
  items: ShoppingItem[];
}

export function StoreTabs({ selectedStore, onSelect, items }: StoreTabsProps) {
  const activeItems = items.filter(i => !i.inCart);

  const getCount = (store: Store | 'all') => {
    if (store === 'all') return activeItems.length;
    return activeItems.filter(i => i.store === store).length;
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
      <button
        onClick={() => onSelect('all')}
        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          selectedStore === 'all'
            ? 'bg-foreground text-background'
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        전체 {getCount('all') > 0 && <span className="ml-1 opacity-70">{getCount('all')}</span>}
      </button>
      {STORES.map(store => {
        const count = getCount(store);
        return (
          <button
            key={store}
            onClick={() => onSelect(store)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedStore === store
                ? STORE_BADGE_CLASS[store]
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {store} {count > 0 && <span className="ml-1 opacity-70">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
