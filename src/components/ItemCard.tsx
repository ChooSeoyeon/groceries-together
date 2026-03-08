import { ShoppingItem } from '@/types/shopping';
import { useRef, useCallback, useEffect } from 'react';

interface ItemCardProps {
  item: ShoppingItem;
  onLongPress: (item: ShoppingItem) => void;
  onShortPress: (item: ShoppingItem) => void;
}

export function ItemCard({ item, onLongPress, onShortPress }: ItemCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const handleStart = useCallback(() => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress(item);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
  }, [item, onLongPress]);

  const handleMove = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isLongPress.current) {
      onShortPress(item);
    }
  }, [item, onShortPress]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const cardClasses = item.inCart
    ? 'bg-[hsl(var(--history-card))] text-[hsl(var(--history-card-foreground))]'
    : item.urgency === 'urgent'
      ? 'bg-urgent-card text-urgent-card-foreground'
      : 'bg-relaxed-card text-relaxed-card-foreground';

  return (
    <div
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => { e.preventDefault(); handleStart(); }}
      onMouseUp={handleEnd}
      className={`relative flex flex-col items-center justify-center aspect-square rounded-xl
        transition-all active:scale-95 cursor-pointer select-none
        ${cardClasses}`}
    >
      <span className="text-xs font-semibold text-center leading-tight line-clamp-2 px-1">
        {item.name}
      </span>
      <span className="text-[10px] opacity-60 mt-0.5">
        {item.quantity}{item.unit}
      </span>
    </div>
  );
}
