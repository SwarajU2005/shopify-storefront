"use client";

import { useCart } from "@/components/CartContext";
import { updateCartLine, removeCartLine } from "@/lib/cart";

export default function CartDrawer() {
  const { cart, open, setOpen, refreshCart } = useCart();

  if (!open || !cart) return null;

  const cartId = cart.id;
  const subtotal = cart.cost?.subtotalAmount;

  const updateQty = async (lineId: string, qty: number) => {
    if (qty < 1) return;
    await updateCartLine(cartId, lineId, qty);
    await refreshCart();
  };

  const removeItem = async (lineId: string) => {
    await removeCartLine(cartId, lineId);
    await refreshCart();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="absolute right-0 top-0 h-full w-96 bg-white p-6">
        <button onClick={() => setOpen(false)}>Close</button>

        <h2 className="text-xl font-bold my-4">Cart</h2>

        {cart.lines.edges.length === 0 && (
          <p>Your cart is empty.</p>
        )}

        {cart.lines.edges.map((line: any) => (
          <div key={line.node.id} className="mb-4 border-b pb-2">
            <p>{line.node.merchandise.product.title}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() =>
                  updateQty(line.node.id, line.node.quantity - 1)
                }
              >
                -
              </button>

              <span>{line.node.quantity}</span>

              <button
                onClick={() =>
                  updateQty(line.node.id, line.node.quantity + 1)
                }
              >
                +
              </button>

              <button
                onClick={() => removeItem(line.node.id)}
                className="ml-4 text-sm underline"
              >
                Remove
              </button>
            </div>

            <p className="text-sm mt-1">
              {line.node.merchandise.price.amount}{" "}
              {line.node.merchandise.price.currencyCode}
            </p>
          </div>
        ))}

        {subtotal && (
          <div className="mt-6 font-bold">
            Subtotal: {subtotal.amount} {subtotal.currencyCode}
          </div>
        )}

        {cart.lines.edges.length > 0 && (
          <a
            href={cart.checkoutUrl}
            className="block mt-4 bg-black text-white text-center py-3"
          >
            Checkout
          </a>
        )}
      </div>
    </div>
  );
}
