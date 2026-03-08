import { useState, useEffect, useCallback } from 'react';
import { ShoppingItem, Store, Urgency } from '@/types/shopping';

const STORAGE_KEY = 'shopping-list-v1';

function loadItems(): ShoppingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems(items: ShoppingItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(loadItems);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const addItem = useCallback((name: string, store: Store, quantity: number, unit: string, urgency: Urgency) => {
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name,
      store,
      quantity,
      unit,
      urgency,
      inCart: false,
      createdAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
  }, []);

  const checkItem = useCallback((id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, inCart: true, checkedAt: Date.now() } : item
    ));
  }, []);

  const uncheckItem = useCallback((id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, inCart: false, checkedAt: undefined } : item
    ));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<Pick<ShoppingItem, 'name' | 'store' | 'quantity' | 'unit' | 'urgency'>>) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const activeItems = items.filter(i => !i.inCart);
  const historyItems = items.filter(i => i.inCart).sort((a, b) => (b.checkedAt ?? 0) - (a.checkedAt ?? 0));

  return { items, activeItems, historyItems, addItem, checkItem, uncheckItem, deleteItem, updateItem };
}
