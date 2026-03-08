import { ShoppingItem, STORES, Store, UNITS, STORE_BADGE_CLASS } from '@/types/shopping';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, RotateCcw, Check } from 'lucide-react';

interface ItemDetailDrawerProps {
  item: ShoppingItem | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Pick<ShoppingItem, 'name' | 'store' | 'quantity' | 'unit' | 'urgency' | 'memo'>>) => void;
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
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setUnit(item.unit);
      setStore(item.store);
      setUrgency(item.urgency);
      setMemo(item.memo || '');
    }
  }, [item]);

  if (!item) return null;

  const handleClose = () => {
    onUpdate(item.id, { name, quantity, unit, store, urgency, memo: memo.trim() || undefined });
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && handleClose()}>
      <DrawerContent className="max-w-md mx-auto px-4 pb-6">
        <DrawerHeader className="px-0 pb-2 flex items-center justify-between">
          <DrawerTitle className="text-left text-sm">물건 상세</DrawerTitle>
          <button onClick={handleClose} className="text-sm font-semibold text-primary">done</button>
        </DrawerHeader>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">이름</label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-secondary border-0 h-9 text-sm" />
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full rounded-full h-9 text-sm opacity-60">
                <Trash2 className="w-3.5 h-3.5 mr-1" /> 삭제하기
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[280px] rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-sm">정말 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs">이 항목을 삭제하면 되돌릴 수 없습니다.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full h-8 text-xs">취소</AlertDialogCancel>
                <AlertDialogAction className="rounded-full h-8 text-xs" onClick={() => { onDelete(item.id); onClose(); }}>확인</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
