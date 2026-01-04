import Link from "next/link";
import { shopifyFetch } from "@/lib/shopify";
import { notFound } from "next/navigation";

const COLLECTION_QUERY = `
query CollectionByHandle($handle: String!) {
  collectionByHandle(handle: $handle) {
    title
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
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
}
`;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const res = await shopifyFetch<any>(COLLECTION_QUERY, { handle });

  const collection = res.data.collectionByHandle;
  if (!collection) notFound();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {collection.title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collection.products.edges.map((item: any) => {
          const product = item.node;
          const image = product.images.edges[0]?.node;

          return (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="border p-4 block"
            >
              {image && (
                <img
                  src={image.url}
                  className="w-full h-40 object-cover mb-2"
                />
              )}

              <h2 className="font-semibold">{product.title}</h2>

              <p className="text-sm">
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
