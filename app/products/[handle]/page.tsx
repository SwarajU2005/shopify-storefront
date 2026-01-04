import { shopifyFetch } from "@/lib/shopify";
import AddToCartButton from "@/components/AddToCartButton";
import { notFound } from "next/navigation";

const PRODUCT_QUERY = `
query ProductByHandle($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    descriptionHtml
    images(first: 5) {
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
    variants(first: 1) {
      edges {
        node {
          id
        }
      }
    }
  }
}
`;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  // ✅ REQUIRED FOR NEXT.JS 15/16
  const { handle } = await params;

  const res = await shopifyFetch<any>(PRODUCT_QUERY, { handle });

  // 🔐 SAFETY CHECK
  if (!res?.data?.productByHandle) {
    console.error("Shopify response:", res);
    notFound();
  }

  const product = res.data.productByHandle;
  const variantId = product.variants.edges[0].node.id;

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: IMAGES */}
        <div>
          {product.images.edges.map((img: any, index: number) => (
            <img
              key={index}
              src={img.node.url}
              alt={img.node.altText || product.title}
              className="w-full rounded mb-4"
            />
          ))}
        </div>

        {/* RIGHT: INFO */}
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {product.title}
          </h1>

          <p className="text-xl mb-4">
            {product.priceRange.minVariantPrice.amount}{" "}
            {product.priceRange.minVariantPrice.currencyCode}
          </p>

          <div
            className="prose mb-6"
            dangerouslySetInnerHTML={{
              __html: product.descriptionHtml,
            }}
          />

          {/* 🛒 ADD TO CART */}
          <AddToCartButton variantId={variantId} />
        </div>
      </div>
    </main>
  );
}
