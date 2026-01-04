"use client";

import { createCart, addToCart } from "@/lib/cart";

export default function AddToCartButton({
  variantId,
}: {
  variantId: string;
}) {
  const handleAddToCart = async () => {
    if (typeof window === "undefined") return;

    let cartId = localStorage.getItem("cartId");

    // ✅ Create cart if missing
    if (!cartId) {
      const cart = await createCart();
      cartId = cart.id;

      // ✅ Type-safe guards
      if (cartId) {
        localStorage.setItem("cartId", cartId);
        localStorage.setItem("checkoutUrl", cart.checkoutUrl);
      }
    }

    // ✅ Final safety check (TypeScript + runtime)
    if (!cartId) {
      console.error("Failed to create cart");
      return;
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
