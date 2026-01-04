"use client";

import { useState } from "react";
import { createCart, addToCart } from "@/lib/cart";

type Props = {
  variantId: string;
};

export default function AddToCartButton({ variantId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);

      if (typeof window === "undefined") return;

      let cartId = window.localStorage.getItem("cartId");

      // 🆕 Create cart if not exists
      if (!cartId) {
        const cart = await createCart();

        if (!cart?.id || !cart?.checkoutUrl) {
          throw new Error("Failed to create cart");
        }

        cartId = cart.id;

        window.localStorage.setItem("cartId", cart.id);
        window.localStorage.setItem("checkoutUrl", cart.checkoutUrl);
      }

      // ➕ Add product to cart
      await addToCart(cartId, variantId);

      alert("Added to cart ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="mt-4 w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
