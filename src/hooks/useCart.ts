import { useState, useEffect, useCallback } from "react";

const CART_KEY = "gentlemen-cart";
const CUSTOM_ITEMS_KEY = "gentlemen-custom-items";

export interface CartItem {
  id: string;
  quantity: number;
}

export interface CustomItem {
  name: string;
  price: number;
}

export function useCart() {
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [customItems, setCustomItems] = useState<Record<string, CustomItem>>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_ITEMS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(customItems));
  }, [customItems]);

  const addItem = useCallback((id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
        // Also remove custom item metadata
        setCustomItems((ci) => {
          const copy = { ...ci };
          delete copy[id];
          return copy;
        });
      }
      return next;
    });
  }, []);

  const addCustomItem = useCallback((name: string, price: number) => {
    const key = `custom::${Date.now()}`;
    setCustomItems((prev) => ({ ...prev, [key]: { name, price } }));
    setCart((prev) => ({ ...prev, [key]: 1 }));
  }, []);

  const getQuantity = useCallback((id: string) => cart[id] || 0, [cart]);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const clearCart = useCallback(() => {
    setCart({});
    setCustomItems({});
  }, []);

  return { cart, customItems, addItem, removeItem, addCustomItem, getQuantity, totalItems, clearCart };
}
