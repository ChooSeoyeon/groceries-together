import { useState } from 'react';
import { STORES, Store } from '@/types/shopping';
import { useShoppingList } from '@/hooks/useShoppingList';
import { ItemCard } from '@/components/ItemCard';
import { ItemDetailDrawer } from '@/components/ItemDetailDrawer';
import { SearchBar } from '@/components/SearchBar';
import { ShoppingItem, STORE_BADGE_CLASS } from '@/types/shopping';
import { History } from 'lucide-react';
import { toast } from 'sonner';

function getTurkiDisplayName(): string {
  const now = new Date();
  const day = now.getDate();
  // Monday-based week: find what day of week the 1st is (Mon=0)
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const mondayOffset = (firstDayOfMonth + 6) % 7; // days from Mon to 1st
  const weekOfMonth = Math.ceil((day + mondayOffset) / 7);
  const names = ['안나', '커비', '제리', '도라'];
  const name = names[Math.min(weekOfMonth, 4) - 1] || names[3];
  return `터키(${name})`;
}

const Index = () => {
  const { items, activeItems, historyItems, addItem, checkItem, uncheckItem, deleteItem, updateItem } = useShoppingList();
  const [detailItem, setDetailItem] = useState<ShoppingItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  

  // Group active items by store
  const groupedActive = STORES.reduce((acc, store) => {
    const storeItems = activeItems
      .filter(i => i.store === store)
      .sort((a, b) => {
        if (a.urgency === 'urgent' && b.urgency !== 'urgent') return -1;
        if (a.urgency !== 'urgent' && b.urgency === 'urgent') return 1;
        return b.createdAt - a.createdAt;
      });
    if (storeItems.length > 0) acc.push({ store, items: storeItems });
    return acc;
  }, [] as { store: Store; items: ShoppingItem[] }[]);

  const handleShortPress = (item: ShoppingItem) => {
    if (item.inCart) {
      uncheckItem(item.id);
    } else {
      checkItem(item.id);
      toast(`${item.name} 완료`, {
        action: {
          label: '↩︎',
          onClick: () => uncheckItem(item.id),
        },
        duration: 4000,
      });
    }
  };

  const handleLongPress = (item: ShoppingItem) => {
    setDetailItem(item);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg pt-safe">
        <div className="px-4 pt-3 pb-2">
          <h1 className="text-lg font-bold">🛒 우리집 장보기</h1>
          <p className="text-[10px] text-muted-foreground">짧게 탭 = 완료 · 길게 꾹 = 상세</p>
        </div>
      </header>

      {/* Shopping List grouped by store */}
      <section className="px-4 mt-2">
        {groupedActive.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            리스트가 비어있어요 ✨<br />+ 버튼으로 물건을 추가해보세요
          </div>
        ) : (
          groupedActive.map(({ store, items: storeItems }) => (
            <div key={store} className="mb-5">
              <h2 className="text-base font-bold mb-2 flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${STORE_BADGE_CLASS[store]}`} />
                {store === '터키' ? getTurkiDisplayName() : store}
                <span className="text-xs font-normal text-muted-foreground">({storeItems.length})</span>
              </h2>
              <div className="grid grid-cols-3 gap-1.5">
                {storeItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onShortPress={handleShortPress}
                    onLongPress={handleLongPress}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* History */}
      <section className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground">
            히스토리
            <span className="ml-1 font-normal">({historyItems.length})</span>
          </h2>
        </div>

        {historyItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            아직 완료한 물건이 없어요
          </div>
        ) : (
          STORES.filter(store => historyItems.some(i => i.store === store)).map(store => {
            const storeHistoryItems = historyItems.filter(i => i.store === store);
            return (
              <div key={store} className="mb-5">
                <h3 className="text-xs font-semibold mb-1.5 flex items-center gap-1.5 text-muted-foreground">
                  <span className={`inline-block w-3 h-3 rounded-full ${STORE_BADGE_CLASS[store]}`} />
                  {store}
                </h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {storeHistoryItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onShortPress={handleShortPress}
                      onLongPress={handleLongPress}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Drawers */}
      <ItemDetailDrawer
        item={detailItem}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setDetailItem(null); }}
        onUpdate={updateItem}
        onDelete={deleteItem}
        onCheck={checkItem}
        onUncheck={uncheckItem}
      />

      {/* Search Bar */}
      <SearchBar
        items={items}
        onUncheck={uncheckItem}
        onAdd={addItem}
        onLongPress={handleLongPress}
      />
    </div>
  );
};

export default Index;
