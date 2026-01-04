"use client";

import { createCart, addToCart } from "@/lib/cart";

export default function AddToCartButton({
  variantId,
}: {
  variantId: string;
}) {
  const handleAddToCart = async () => {
    if (typeof window === "undefined") return;

    const storedCartId = window.localStorage.getItem("cartId");

    let cartId: string;

    if (storedCartId) {
      cartId = storedCartId;
    } else {
      const cart = await createCart();

      if (!cart || !cart.id) {
        console.error("Failed to create cart");
        return;
      }

      cartId = cart.id;

      // ✅ cartId is GUARANTEED string here
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
