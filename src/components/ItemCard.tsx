import { ShoppingItem } from '@/types/shopping';
import { useRef, useCallback, useEffect } from 'react';
import memoIcon from '@/assets/memo-icon.png';

interface ItemCardProps {
  item: ShoppingItem;
  onLongPress: (item: ShoppingItem) => void;
  onShortPress: (item: ShoppingItem) => void;
  disabled?: boolean;
}

export function ItemCard({ item, onLongPress, onShortPress, disabled }: ItemCardProps) {
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

  const cardClasses = disabled
    ? 'bg-background border-2 border-dashed border-muted-foreground/30 text-muted-foreground'
    : item.inCart
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
      {item.memo && (
        <svg className="absolute top-1 right-1 w-[18px] h-[18px] opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )}
    </div>
  );
}
