import { ShoppingItem, STORE_BADGE_CLASS } from '@/types/shopping';
import { useRef, useCallback } from 'react';
import { Flame, Clock } from 'lucide-react';

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
      // Vibrate feedback if available
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

  return (
    <div
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => { if (e.buttons) handleMove(e.clientX, e.clientY); }}
      onMouseUp={handleEnd}
      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border
        transition-all active:scale-95 cursor-pointer select-none min-h-[90px]
        ${item.inCart ? 'opacity-50' : ''}`}
    >
      {/* Urgency indicator */}
      {item.urgency === 'urgent' && (
        <div className="absolute top-1.5 right-1.5">
          <Flame className="w-3.5 h-3.5 text-urgent" />
        </div>
      )}
      {item.urgency === 'relaxed' && (
        <div className="absolute top-1.5 right-1.5">
          <Clock className="w-3.5 h-3.5 text-relaxed" />
        </div>
      )}

      {/* Name */}
      <span className="text-sm font-semibold text-center leading-tight line-clamp-2">
        {item.name}
      </span>

      {/* Quantity */}
      <span className="text-xs text-muted-foreground mt-1">
        {item.quantity}{item.unit}
      </span>

      {/* Store badge */}
      <span className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${STORE_BADGE_CLASS[item.store]}`}>
        {item.store}
      </span>
    </div>
  );
}
