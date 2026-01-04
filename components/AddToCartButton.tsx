"use client";

import { createCart, addToCart } from "@/lib/cart";

export default function AddToCartButton({
  variantId,
}: {
  variantId: string;
}) {
  const handleAddToCart = async () => {
    // ✅ GUARANTEE CLIENT SIDE
    if (typeof window === "undefined") return;

    let cartId: string | null = null;

    try {
      cartId = window.localStorage.getItem("cartId");
    } catch {
      console.error("localStorage not available");
    }

    // Create cart if missing
    if (!cartId) {
      const cart = await createCart();

      if (!cart?.id) {
        console.error("Failed to create cart");
        return;
      }

      cartId = cart.id;

      window.localStorage.setItem("cartId", cartId);
      window.localStorage.setItem("checkoutUrl", cart.checkoutUrl);
    }

    await addToCart(cartId, variantId);
    alert("Added to cart");
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-4 bg-black text-white px-4 py-2"
    >
      Add to cart
    </button>
  );
}
