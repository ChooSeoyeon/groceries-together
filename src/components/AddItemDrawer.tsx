import { STORES, Store, UNITS, STORE_BADGE_CLASS } from '@/types/shopping';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface AddItemDrawerProps {
  onAdd: (name: string, store: Store, quantity: number, unit: string, urgency: 'urgent' | 'relaxed') => void;
}

export function AddItemDrawer({ onAdd }: AddItemDrawerProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('개');
  const [store, setStore] = useState<Store>('아무데나');
  const [urgency, setUrgency] = useState<'urgent' | 'relaxed'>('relaxed');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), store, quantity, unit, urgency);
    setName('');
    setQuantity(1);
    setUnit('개');
    setStore('아무데나');
    setUrgency('relaxed');
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" className="rounded-full fixed bottom-4 right-4 h-12 w-12 shadow-lg z-50">
          <Plus className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto px-4 pb-6">
        <DrawerHeader className="px-0 pb-2">
          <DrawerTitle className="text-left text-sm">물건 추가</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">이름</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="물건 이름"
              className="bg-secondary border-0 h-9 text-sm"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
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

          <Button onClick={handleAdd} className="w-full rounded-full h-9 text-sm" disabled={!name.trim()}>
            추가하기
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
