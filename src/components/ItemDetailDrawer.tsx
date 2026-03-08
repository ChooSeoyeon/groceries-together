import { ShoppingItem, STORES, Store, UNITS, STORE_BADGE_CLASS } from '@/types/shopping';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, RotateCcw, Check } from 'lucide-react';

interface ItemDetailDrawerProps {
  item: ShoppingItem | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Pick<ShoppingItem, 'name' | 'store' | 'quantity' | 'unit' | 'urgency'>>) => void;
  onDelete: (id: string) => void;
  onCheck: (id: string) => void;
  onUncheck: (id: string) => void;
}

export function ItemDetailDrawer({ item, open, onClose, onUpdate, onDelete, onCheck, onUncheck }: ItemDetailDrawerProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('개');
  const [store, setStore] = useState<Store>('아무데나');
  const [urgency, setUrgency] = useState<'urgent' | 'relaxed'>('relaxed');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setUnit(item.unit);
      setStore(item.store);
      setUrgency(item.urgency);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    onUpdate(item.id, { name, quantity, unit, store, urgency });
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="px-4 pb-8">
        <DrawerHeader className="px-0">
          <DrawerTitle className="text-left">물건 상세</DrawerTitle>
        </DrawerHeader>

        {/* Name */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">이름</label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-secondary border-0" />
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">수량</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-bold min-w-[3rem] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              {/* Unit selector */}
              <div className="flex gap-1 ml-2 flex-wrap">
                {UNITS.map(u => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      unit === u ? 'bg-foreground text-background' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Store */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">마트</label>
            <div className="flex flex-wrap gap-1.5">
              {STORES.map(s => (
                <button
                  key={s}
                  onClick={() => setStore(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    store === s ? STORE_BADGE_CLASS[s] : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">긴급도</label>
            <div className="flex gap-2">
              <button
                onClick={() => setUrgency('urgent')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  urgency === 'urgent' ? 'bg-urgent text-urgent-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                🔥 긴급
              </button>
              <button
                onClick={() => setUrgency('relaxed')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  urgency === 'relaxed' ? 'bg-relaxed text-relaxed-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                🕐 여유
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1 rounded-full">
              <Check className="w-4 h-4 mr-1" /> 저장
            </Button>
            {item.inCart ? (
              <Button variant="outline" className="rounded-full" onClick={() => { onUncheck(item.id); onClose(); }}>
                <RotateCcw className="w-4 h-4 mr-1" /> 리스트로
              </Button>
            ) : (
              <Button variant="outline" className="rounded-full" onClick={() => { onCheck(item.id); onClose(); }}>
                <Check className="w-4 h-4 mr-1" /> 완료
              </Button>
            )}
            <Button variant="destructive" size="icon" className="rounded-full" onClick={() => { onDelete(item.id); onClose(); }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
