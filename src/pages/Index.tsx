import { useState } from 'react';
import { Store } from '@/types/shopping';
import { useShoppingList } from '@/hooks/useShoppingList';
import { StoreTabs } from '@/components/StoreTabs';
import { ItemCard } from '@/components/ItemCard';
import { ItemDetailDrawer } from '@/components/ItemDetailDrawer';
import { AddItemDrawer } from '@/components/AddItemDrawer';
import { ShoppingItem } from '@/types/shopping';
import { ShoppingCart, History } from 'lucide-react';

const Index = () => {
  const { items, activeItems, historyItems, addItem, checkItem, uncheckItem, deleteItem, updateItem } = useShoppingList();
  const [selectedStore, setSelectedStore] = useState<Store | 'all'>('all');
  const [detailItem, setDetailItem] = useState<ShoppingItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const filteredActive = selectedStore === 'all'
    ? activeItems
    : activeItems.filter(i => i.store === selectedStore);

  const filteredHistory = selectedStore === 'all'
    ? historyItems
    : historyItems.filter(i => i.store === selectedStore);

  // Sort: urgent first
  const sortedActive = [...filteredActive].sort((a, b) => {
    if (a.urgency === 'urgent' && b.urgency !== 'urgent') return -1;
    if (a.urgency !== 'urgent' && b.urgency === 'urgent') return 1;
    return b.createdAt - a.createdAt;
  });

  const handleShortPress = (item: ShoppingItem) => {
    setDetailItem(item);
    setDrawerOpen(true);
  };

  const handleLongPress = (item: ShoppingItem) => {
    if (item.inCart) {
      uncheckItem(item.id);
    } else {
      checkItem(item.id);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg pt-safe">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold">🛒 우리집 장보기</h1>
          <p className="text-xs text-muted-foreground mt-0.5">짧게 탭 = 상세 · 길게 꾹 = 완료</p>
        </div>
        <StoreTabs selectedStore={selectedStore} onSelect={setSelectedStore} items={items} />
      </header>

      {/* Shopping List */}
      <section className="px-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">
            쇼핑 리스트
            <span className="ml-1 text-muted-foreground font-normal">({sortedActive.length})</span>
          </h2>
        </div>

        {sortedActive.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            리스트가 비어있어요 ✨<br />+ 버튼으로 물건을 추가해보세요
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {sortedActive.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onShortPress={handleShortPress}
                onLongPress={handleLongPress}
              />
            ))}
          </div>
        )}
      </section>

      {/* History Toggle */}
      <section className="px-4 mt-8">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 mb-3 w-full"
        >
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground">
            히스토리
            <span className="ml-1 font-normal">({filteredHistory.length})</span>
          </h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {showHistory ? '접기 ▲' : '펼치기 ▼'}
          </span>
        </button>

        {showHistory && (
          filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              아직 완료한 물건이 없어요
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredHistory.map(item => (
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

      <AddItemDrawer onAdd={addItem} />
    </div>
  );
};

export default Index;
