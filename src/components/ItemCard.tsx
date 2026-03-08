import { ShoppingItem, STORE_BADGE_CLASS } from '@/types/shopping';
import { useRef, useCallback } from 'react';

interface ItemCardProps {
  item: ShoppingItem;
  onLongPress: (item: ShoppingItem) => void;
  onShortPress: (item: ShoppingItem) => void;
}

export function ItemCard({ item, onLongPress, onShortPress }: ItemCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = useCallback((clientX: number, clientY: number) => {
    isLongPress.current = false;
    startPos.current = { x: clientX, y: clientY };
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress(item);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
  }, [item, onLongPress]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const dx = Math.abs(clientX - startPos.current.x);
    const dy = Math.abs(clientY - startPos.current.y);
    if (dx > 10 || dy > 10) {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, []);

  const handleEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isLongPress.current) {
      onShortPress(item);
    }
  }, [item, onShortPress]);

  const urgencyClasses = item.urgency === 'urgent'
    ? 'bg-urgent-card text-urgent-card-foreground'
    : 'bg-relaxed-card text-relaxed-card-foreground';

  return (
    <div
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => { if (e.buttons) handleMove(e.clientX, e.clientY); }}
      onMouseUp={handleEnd}
      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl
        transition-all active:scale-95 cursor-pointer select-none min-h-[90px]
        ${urgencyClasses}
        ${item.inCart ? 'opacity-40' : ''}`}
    >
      {/* Name */}
      <span className="text-sm font-semibold text-center leading-tight line-clamp-2">
        {item.name}
      </span>

      {/* Quantity */}
      <span className="text-xs opacity-80 mt-1">
        {item.quantity}{item.unit}
      </span>
    </div>
  );
}
