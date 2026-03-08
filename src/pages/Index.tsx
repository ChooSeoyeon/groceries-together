import { useState, useRef, useCallback } from 'react';
import { STORES, Store } from '@/types/shopping';
import { useShoppingList } from '@/hooks/useShoppingList';
import { ItemCard } from '@/components/ItemCard';
import { ItemDetailDrawer } from '@/components/ItemDetailDrawer';
import { AddItemDrawer } from '@/components/AddItemDrawer';
import { ShoppingItem, STORE_BADGE_CLASS } from '@/types/shopping';
import { History, Undo2 } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { items, activeItems, historyItems, addItem, checkItem, uncheckItem, deleteItem, updateItem } = useShoppingList();
  const [detailItem, setDetailItem] = useState<ShoppingItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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
      toast(`${item.name} 복원`, {
        action: {
          label: '↩︎',
          onClick: () => checkItem(item.id),
        },
        duration: 4000,
      });
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
                {store}
                <span className="text-xs font-normal text-muted-foreground">({storeItems.length})</span>
              </h2>
              <div className="grid grid-cols-4 gap-1.5">
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

      {/* History Toggle */}
      <section className="px-4 mt-6">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 mb-3 w-full"
        >
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground">
            히스토리
            <span className="ml-1 font-normal">({historyItems.length})</span>
          </h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {showHistory ? '접기 ▲' : '펼치기 ▼'}
          </span>
        </button>

        {showHistory && (
          historyItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              아직 완료한 물건이 없어요
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1.5">
              {historyItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onShortPress={handleShortPress}
                  onLongPress={handleLongPress}
                />
              ))}
            </div>
          )
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

      {/* FAB */}
      <div className="sticky bottom-5 z-50 flex justify-end pr-4 pointer-events-none">
        <div className="pointer-events-auto">
          <AddItemDrawer onAdd={addItem} />
        </div>
      </div>
    </div>
  );
};

export default Index;
