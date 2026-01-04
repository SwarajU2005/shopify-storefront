import Link from "next/link";
import { shopifyFetch } from "@/lib/shopify";

const COLLECTIONS_QUERY = `
{
  collections(first: 20) {
    edges {
      node {
        id
        title
        handle
      }
    }
  }
}
`;

export default async function CollectionsPage() {
  const res = await shopifyFetch<any>(COLLECTIONS_QUERY);
  const collections = res.data.collections.edges;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Collections</h1>

      <ul className="space-y-4">
        {collections.map((item: any) => (
          <li key={item.node.id}>
            <Link
              href={`/collections/${item.node.handle}`}
              className="underline"
            >
              {item.node.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
