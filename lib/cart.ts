import { shopifyFetch } from "./shopify";

/* ---------------- CREATE CART ---------------- */

const CREATE_CART = `
mutation {
  cartCreate {
    cart {
      id
      checkoutUrl
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
`;

export async function createCart() {
  const res = await shopifyFetch<any>(CREATE_CART);
  return res.data.cartCreate.cart;
}

/* ---------------- ADD TO CART ---------------- */

const ADD_TO_CART = `
mutation AddToCart($cartId: ID!, $variantId: ID!) {
  cartLinesAdd(
    cartId: $cartId
    lines: [{ quantity: 1, merchandiseId: $variantId }]
  ) {
    cart {
      id
      checkoutUrl
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
`;

export async function addToCart(cartId: string, variantId: string) {
  const res = await shopifyFetch<any>(ADD_TO_CART, {
    cartId,
    variantId,
  });
  return res.data.cartLinesAdd.cart;
}

/* ---------------- UPDATE QUANTITY ---------------- */

const UPDATE_CART_LINE = `
mutation UpdateCartLine($cartId: ID!, $lineId: ID!, $quantity: Int!) {
  cartLinesUpdate(
    cartId: $cartId
    lines: [{ id: $lineId, quantity: $quantity }]
  ) {
    cart {
      id
      checkoutUrl
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 20) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                product {
                  title
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
) {
  const res = await shopifyFetch<any>(UPDATE_CART_LINE, {
    cartId,
    lineId,
    quantity,
  });
  return res.data.cartLinesUpdate.cart;
}

/* ---------------- REMOVE LINE ---------------- */

const REMOVE_CART_LINE = `
mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id
      checkoutUrl
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
`;

export async function removeCartLine(cartId: string, lineId: string) {
  const res = await shopifyFetch<any>(REMOVE_CART_LINE, {
    cartId,
    lineIds: [lineId],
  });
  return res.data.cartLinesRemove.cart;
}

/* ---------------- GET CART ---------------- */

const GET_CART = `
query GetCart($id: ID!) {
  cart(id: $id) {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 20) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              product {
                title
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
`;

export async function getCart(cartId: string) {
  const res = await shopifyFetch<any>(GET_CART, { id: cartId });
  return res.data.cart;
}
