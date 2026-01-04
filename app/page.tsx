import Link from "next/link";
import { shopifyFetch } from "@/lib/shopify";

const QUERY = `
{
  products(first: 6) {
    edges {
      node {
        id
        handle
        title
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`;

export default async function Home() {
  const res = await shopifyFetch<any>(QUERY);
  const products = res.data.products.edges;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((item: any) => {
          const product = item.node;
          const image = product.images.edges[0]?.node;

          return (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="border rounded-lg p-4 hover:shadow-lg transition block"
            >
              {image && (
                <img
                  src={image.url}
                  alt={image.altText || product.title}
                  className="w-full h-48 object-cover rounded"
                />
              )}

              <h2 className="mt-4 font-semibold text-lg">
                {product.title}
              </h2>

              <p className="text-gray-600 mt-1">
                {product.priceRange.minVariantPrice.amount}{" "}
                {product.priceRange.minVariantPrice.currencyCode}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
