import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductPhoto } from "@/components/product-photo";
import { formatPrice, formatQuantity, PRODUCT_COLUMNS, type Product } from "@/lib/products";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .gt("quantity", 0)
    .order("created_at", { ascending: false })
    .limit(6);

  const products = (data ?? []) as Product[];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <section className="text-center">
        <p className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">
          Little Store Club
        </p>
        <p className="mt-4 text-lg text-muted sm:text-xl">
          The Little Store Next Door
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Browse items
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-md border border-foreground/15 bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-foreground/15 bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Latest from the neighborhood
          </h2>
          <Link href="/products" className="text-sm text-accent hover:underline">
            See all
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="mt-8 text-muted">
            No listings yet. Sign in and list the first item.
          </p>
        ) : (
          <ul className="mt-8 space-y-5">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/products/${product.id}`}
                  className="flex items-center justify-between gap-4 border-b border-foreground/10 pb-5 transition hover:opacity-80"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <ProductPhoto
                        src={product.image_url}
                        alt={product.title}
                        sizes="56px"
                      />
                    </span>
                    <span>
                      <span className="font-medium text-foreground">
                        {product.title}
                      </span>
                      <span className="mt-1 block text-sm text-accent">
                        {formatQuantity(product.quantity)}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-foreground">
                    {formatPrice(product.price_cents)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
