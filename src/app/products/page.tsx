import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductPhoto } from "@/components/product-photo";
import { formatPrice, formatQuantity, PRODUCT_COLUMNS, type Product } from "@/lib/products";

type ProductsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .gt("quantity", 0)
    .order("created_at", { ascending: false });

  const products = ((data ?? []) as Product[]).filter((product) => {
    if (!query) return true;
    return (
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            Tiny Shop Club
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
            Neighborhood items
          </h1>
          <p className="mt-2 text-muted">
            {query
              ? `Showing items matching “${q?.trim()}”.`
              : "Browse what neighbors are listing."}
          </p>
        </div>
        <Link
          href="/products/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          List an item
        </Link>
      </div>

      {error ? (
        <p className="mt-10 text-sm text-red-700" role="alert">
          Could not load products. If quantity was just added, run the quantity
          SQL in Supabase.
        </p>
      ) : null}

      {!error && products.length === 0 ? (
        <p className="mt-10 text-muted">
          {query ? (
            <>
              No items match that search.{" "}
              <Link href="/products" className="text-accent hover:underline">
                See all items
              </Link>
              .
            </>
          ) : (
            "No items yet. Be the first to list one."
          )}
        </p>
      ) : null}

      <ul className="mt-10 space-y-6">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="flex gap-4 border-b border-foreground/10 pb-6 transition hover:opacity-80"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <ProductPhoto
                  src={product.image_url}
                  alt={product.title}
                  sizes="96px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-xl font-medium text-foreground">
                    {product.title}
                  </h2>
                  <p className="shrink-0 text-foreground">
                    {formatPrice(product.price_cents)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-accent">
                  {formatQuantity(product.quantity)}
                </p>
                {product.description ? (
                  <p className="mt-2 line-clamp-2 text-muted">
                    {product.description}
                  </p>
                ) : null}
                <p className="mt-2 text-sm text-muted">
                  Pickup from seller · door delivery
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
