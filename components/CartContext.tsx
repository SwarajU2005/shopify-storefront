"use client";

import { createContext, useContext, useState } from "react";
import { getCart } from "@/lib/cart";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const refreshCart = async () => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;
    const data = await getCart(cartId);
    setCart(data);
  };

  const openCart = async () => {
    await refreshCart();
    setOpen(true);
  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, open, setOpen, openCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
