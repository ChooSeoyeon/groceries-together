import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { ShoppingItem } from '@/types/shopping';
import { ItemCard } from '@/components/ItemCard';
import { AddItemDrawer } from '@/components/AddItemDrawer';
import { Store, Urgency } from '@/types/shopping';

interface SearchBarProps {
  items: ShoppingItem[];
  onUncheck: (id: string) => void;
  onAdd: (name: string, store: Store, quantity: number, unit: string, urgency: Urgency) => void;
  onLongPress: (item: ShoppingItem) => void;
}

export function SearchBar({ items, onUncheck, onAdd, onLongPress }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [prefillName, setPrefillName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim();

  const results = trimmed
    ? items.filter(i => i.name.includes(trimmed))
    : [];

  const handleResultPress = (item: ShoppingItem) => {
    if (!item.inCart) return; // active items: short press does nothing
    onUncheck(item.id);
    setQuery('');
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleCreateNew = () => {
    setPrefillName(trimmed);
    setAddDrawerOpen(true);
  };

  const handleAdd = (name: string, store: Store, quantity: number, unit: string, urgency: Urgency) => {
    onAdd(name, store, quantity, unit, urgency);
    setQuery('');
    setFocused(false);
    setAddDrawerOpen(false);
  };

  const handleCancel = () => {
    setQuery('');
    setFocused(false);
    inputRef.current?.blur();
  };

  const isActive = focused || trimmed.length > 0;

  return (
    <>
      {/* Overlay when searching */}
      {isActive && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={handleCancel} />
      )}

      {/* Search results */}
      {isActive && trimmed && (
        <div className="fixed bottom-16 left-0 right-0 z-50 max-w-md mx-auto px-4 pb-2 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-4 gap-1.5">
            {results.map(item => (
              <div key={item.id} className={!item.inCart ? 'search-disabled-item' : ''}>
                <ItemCard
                  item={item}
                  onShortPress={handleResultPress}
                  onLongPress={onLongPress}
                  disabled={!item.inCart}
                />
              </div>
            ))}
          </div>
          {/* Show create button only if no exact name match */}
          {!items.some(i => i.name === trimmed) && (
            <button
              onClick={handleCreateNew}
              className="w-full py-3 mt-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
            >
              "{trimmed}" 새로 추가하기 +
            </button>
          )}
        </div>
      )}

      {/* Search bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto px-4 pb-5 pt-2 bg-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-secondary rounded-full px-3 h-10 gap-2">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="검색 또는 추가..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {trimmed && (
              <button onClick={() => setQuery('')}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          {isActive && (
            <button onClick={handleCancel} className="text-sm font-medium text-primary shrink-0">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* AddItemDrawer for creating new */}
      <AddItemDrawer
        onAdd={handleAdd}
        open={addDrawerOpen}
        onOpenChange={setAddDrawerOpen}
        prefillName={prefillName}
      />
    </>
  );
}
