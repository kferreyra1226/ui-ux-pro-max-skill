'use client';

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import { countItems, toCartLine, totals as computeTotals } from '@/lib/cart';
import { clampStock } from '@/lib/inventory';
import type { CartLine, CartTotals, Product } from '@/lib/types';

/**
 * Cart state.
 *
 * PRODUCTION: the cart must be revalidated server-side at checkout against live inventory.
 * Client state can go stale, and a stale quantity must never be allowed to oversell the
 * last unit. Nothing here reserves or deducts stock - that happens only after a human
 * owner accepts the request.
 */

const STORAGE_KEY = 'fp_cart_v1';

interface CartContextValue {
  lines: CartLine[];
  count: number;
  totals: CartTotals;
  drawerOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // A corrupt or unavailable store just means an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage may be unavailable in private mode; the cart still works for this session.
    }
  }, [lines, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const available = clampStock(product.stockQuantity);
    if (available === 0) return; // Sold out items can never be added.
    setLines((current) => {
      const existing = current.find((l) => l.productId === product.id);
      if (existing) {
        return current.map((l) =>
          l.productId === product.id
            ? { ...l, quantity: Math.min(available, l.quantity + quantity) }
            : l,
        );
      }
      return [...current, toCartLine(product, Math.min(available, quantity))];
    });
    setDrawerOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((l) => l.productId !== productId)
        : current.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.min(Math.max(1, quantity), Math.max(1, l.stockAtAdd)) }
              : l,
          ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((current) => current.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: countItems(lines),
      totals: computeTotals(lines),
      drawerOpen,
      addItem,
      setQuantity,
      removeItem,
      clear,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [lines, drawerOpen, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
