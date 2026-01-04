"use client";

import { addToCart, createCart } from "@/lib/cart";
import { useCart } from "@/components/CartContext";

export default function AddToCartButton({
  variantId,
}: {
  variantId: string;
}) {
  const { openCart } = useCart();

  const handleAdd = async () => {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      const cart = await createCart();
      cartId = cart.id;
      localStorage.setItem("cartId", cartId);
      localStorage.setItem("checkoutUrl", cart.checkoutUrl);
    }

    await addToCart(cartId, variantId);
    await openCart();
  };

  return (
    <button
      onClick={handleAdd}
      className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
    >
      Add to Cart
    </button>
  );
}
