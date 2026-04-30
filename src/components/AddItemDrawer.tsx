import { STORES, Store, UNITS, STORE_BADGE_CLASS } from '@/types/shopping';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Plus, Minus, X } from 'lucide-react';

interface AddItemDrawerProps {
  onAdd: (name: string, store: Store, quantity: number, unit: string, urgency: 'urgent' | 'relaxed', memo?: string) => Promise<unknown>;
  isAdding?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  prefillName?: string;
}

export function AddItemDrawer({ onAdd, isAdding = false, open: controlledOpen, onOpenChange, prefillName }: AddItemDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;
  
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('개');
  const [store, setStore] = useState<Store>('아무데나');
  const [urgency, setUrgency] = useState<'urgent' | 'relaxed'>('relaxed');
  const [memo, setMemo] = useState('');
  
  useEffect(() => {
    if (open && prefillName) {
      setName(prefillName);
    }
  }, [open, prefillName]);

  const handleAdd = async () => {
    if (!name.trim()) return;
    await onAdd(name.trim(), store, quantity, unit, urgency, memo.trim() || undefined);
    setName('');
    setQuantity(1);
    setUnit('개');
    setStore('아무데나');
    setUrgency('relaxed');
    setMemo('');
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DrawerTrigger asChild>
          <Button size="icon" className="rounded-full h-11 w-11 shadow-md z-50 p-0">
            <Plus className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="max-w-md mx-auto px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <DrawerHeader className="px-0 pb-2">
          <DrawerTitle className="text-left text-sm">물건 추가</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-3 overflow-y-auto max-h-[70dvh] p-1" onPointerDown={(e) => e.stopPropagation()}>
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">이름</label>
            <div className="relative">
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="물건 이름"
                className="bg-secondary border-0 h-9 text-sm pr-8"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              {name && (
                <button
                  type="button"
                  onClick={() => setName('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">수량</label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="text-base font-bold min-w-[2rem] text-center">{quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
              <div className="flex gap-1 ml-1 flex-wrap">
                {UNITS.map(u => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      unit === u ? 'bg-foreground text-background' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">마트</label>
            <div className="flex flex-wrap gap-1">
              {STORES.map(s => (
                <button
                  key={s}
                  onClick={() => setStore(s)}
                  className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                    store === s ? STORE_BADGE_CLASS[s] : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">긴급도</label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setUrgency('urgent')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  urgency === 'urgent' ? 'bg-urgent text-urgent-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                🔥 긴급
              </button>
              <button
                onClick={() => setUrgency('relaxed')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  urgency === 'relaxed' ? 'bg-relaxed text-relaxed-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                🕐 여유
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">메모</label>
            <Textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="메모 (선택)"
              className="bg-secondary border-0 text-sm min-h-[60px] resize-none"
            />
          </div>

        </div>
        <Button
          onClick={handleAdd}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-full rounded-full h-9 text-sm mt-3"
          disabled={!name.trim() || isAdding}
        >
          {isAdding ? '추가 중...' : '추가하기'}
        </Button>
      </DrawerContent>
    </Drawer>
  );
}
