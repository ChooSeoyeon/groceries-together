import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingItem, Store, Urgency } from '@/types/shopping';
import { api } from '@/lib/api';

const QUERY_KEY = ['items'] as const;
const POLL_INTERVAL = 5000;

function toShoppingItem(raw: Record<string, unknown>): ShoppingItem {
  return {
    id: raw.id as string,
    name: raw.name as string,
    store: raw.store as Store,
    quantity: Number(raw.quantity),
    unit: raw.unit as string,
    urgency: raw.urgency as Urgency,
    memo: raw.memo as string | undefined,
    inCart: raw.inCart as boolean,
    checkedAt: raw.checkedAt as string | undefined,
    createdAt: raw.createdAt as string,
  };
}

export function useShoppingList() {
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await api.items.list();
      return (res.data as Record<string, unknown>[]).map(toShoppingItem);
    },
    refetchInterval: POLL_INTERVAL,
  });

  const activeItems = items.filter(i => i.inCart);
  const historyItems = items
    .filter(i => !i.inCart)
    .sort((a, b) => new Date(b.checkedAt ?? 0).getTime() - new Date(a.checkedAt ?? 0).getTime());

  const addItemMutation = useMutation({
    mutationFn: (args: { name: string; store: Store; quantity: number; unit: string; urgency: Urgency; memo?: string }) =>
      api.items.create(args),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const checkItem = useMutation({
    mutationFn: (id: string) => api.items.update(id, { inCart: false }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  }).mutate;

  const uncheckItem = useMutation({
    mutationFn: (id: string) => api.items.update(id, { inCart: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  }).mutate;

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.items.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  }).mutate;

  const updateItem = useMutation({
    mutationFn: ({ id, updates }: {
      id: string;
      updates: Partial<Pick<ShoppingItem, 'name' | 'store' | 'quantity' | 'unit' | 'urgency' | 'memo'>>;
    }) => api.items.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    items,
    activeItems,
    historyItems,
    isAdding: addItemMutation.isPending,
    addItem: (name: string, store: Store, quantity: number, unit: string, urgency: Urgency, memo?: string) =>
      addItemMutation.mutateAsync({ name, store, quantity, unit, urgency, memo }),
    checkItem: (id: string) => checkItem(id),
    uncheckItem: (id: string) => uncheckItem(id),
    deleteItem: (id: string) => deleteItem(id),
    updateItem: (id: string, updates: Partial<Pick<ShoppingItem, 'name' | 'store' | 'quantity' | 'unit' | 'urgency' | 'memo'>>) =>
      updateItem.mutate({ id, updates }),
  };
}