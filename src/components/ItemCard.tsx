import { ShoppingItem } from '@/types/shopping';
import { useRef, useCallback, useEffect } from 'react';

// Global timestamp of last long press to prevent ghost taps on shifted items
let lastLongPressTime = 0;

interface ItemCardProps {
  item: ShoppingItem;
  onLongPress: (item: ShoppingItem) => void;
  onShortPress: (item: ShoppingItem) => void;
}

export function ItemCard({ item, onLongPress, onShortPress }: ItemCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const itemIdAtStart = useRef(item.id);

  // Track which item ID we started interacting with
  const handleStart = useCallback((clientX: number, clientY: number) => {
    isLongPress.current = false;
    itemIdAtStart.current = item.id;
    startPos.current = { x: clientX, y: clientY };
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      lastLongPressTime = Date.now();
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

  const handleEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Block short press if:
    // 1. This was a long press
    // 2. A long press happened recently (item shifted into this position)
    // 3. The item ID changed (meaning this card now shows a different item)
    const recentLongPress = Date.now() - lastLongPressTime < 500;
    
    if (!isLongPress.current && !recentLongPress) {
      onShortPress(item);
    }
    
    e.preventDefault();
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
