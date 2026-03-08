import { ShoppingItem } from '@/types/shopping';
import { useRef, useCallback } from 'react';

// Global flag to prevent short press on neighboring items after a long press
let longPressJustFired = false;

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
      longPressJustFired = true;
      onLongPress(item);
      if (navigator.vibrate) navigator.vibrate(50);
      // Reset global flag after a short delay
      setTimeout(() => { longPressJustFired = false; }, 300);
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
    if (!isLongPress.current && !longPressJustFired) {
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
      className={`relative flex flex-col items-center justify-center aspect-square rounded-xl
        transition-all active:scale-95 cursor-pointer select-none
        ${urgencyClasses}
        ${item.inCart ? 'opacity-40' : ''}`}
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
