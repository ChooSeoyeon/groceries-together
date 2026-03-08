import { ShoppingItem } from '@/types/shopping';
import { useRef, useCallback, useEffect } from 'react';

// Global: true while ANY finger/mouse is held down after a long press
let isAnyPressActive = false;

interface ItemCardProps {
  item: ShoppingItem;
  onLongPress: (item: ShoppingItem) => void;
  onShortPress: (item: ShoppingItem) => void;
}

export function ItemCard({ item, onLongPress, onShortPress }: ItemCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const isDown = useRef(false);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    // If another card's long press is still active (finger held), ignore
    if (isAnyPressActive) return;

    isLongPress.current = false;
    isDown.current = true;

    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      isAnyPressActive = true;
      onLongPress(item);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
  }, [item, onLongPress]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    // Cancel timer on movement (not the global flag though)
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Only fire short press if this card started the interaction and it wasn't a long press
    if (isDown.current && !isLongPress.current && !isAnyPressActive) {
      onShortPress(item);
    }

    isDown.current = false;
    // Release global lock
    isAnyPressActive = false;
  }, [item, onShortPress]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const urgencyClasses = item.urgency === 'urgent'
    ? 'bg-urgent-card text-urgent-card-foreground'
    : 'bg-relaxed-card text-relaxed-card-foreground';

  return (
    <div
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX, e.clientY); }}
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
