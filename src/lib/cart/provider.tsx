"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export interface CartItem {
  variantId: string;
  qty: number;
  // Görüntüleme snapshot'ı (sepet sayfası DB sorgulamadan gösterir)
  productSlug: string;
  productName: string;
  variantLabel: string;
  priceTRY: number; // taban TRY fiyat
  imagePath: string | null;
}

interface CartContextValue {
  items: CartItem[];
  count: number; // toplam adet
  totalTRY: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "epinfox_cart";
const MAX_QTY = 20;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // İlk yüklemede localStorage'tan oku
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* no-op */
    }
    setLoaded(true);
  }, []);

  // Değişince kaydet
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* no-op */
    }
  }, [items, loaded]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) }
            : i,
        );
      }
      return [...prev, { ...item, qty: Math.min(MAX_QTY, qty) }];
    });
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.variantId !== variantId)
        : prev.map((i) =>
            i.variantId === variantId
              ? { ...i, qty: Math.min(MAX_QTY, qty) }
              : i,
          ),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, totalTRY } = useMemo(
    () => ({
      count: items.reduce((s, i) => s + i.qty, 0),
      totalTRY: items.reduce((s, i) => s + i.priceTRY * i.qty, 0),
    }),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, count, totalTRY, add, setQty, remove, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
