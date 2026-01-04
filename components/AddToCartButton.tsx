"use client";

import { useState } from "react";
import { createCart, addToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  variantId: string;
};

export default function AddToCartButton({
  variantId,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);

      if (typeof window === "undefined") return;

      let cartId = window.localStorage.getItem("cartId");

      // 1️⃣ Create cart if it doesn't exist
      if (!cartId) {
        const cart = await createCart();

        if (!cart?.id || !cart?.checkoutUrl) {
          throw new Error("Failed to create cart");
        }

        cartId = cart.id;
        window.localStorage.setItem("cartId", cart.id);
        window.localStorage.setItem("checkoutUrl", cart.checkoutUrl);
      }

      // 2️⃣ Final type guard (fixes Vercel + TS)
      if (!cartId) {
        throw new Error("Cart ID could not be established");
      }

      // 3️⃣ Add to cart
      await addToCart(cartId, variantId);

      alert("Added to cart ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
