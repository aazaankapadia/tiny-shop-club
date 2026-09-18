import Link from "next/link";
import { BuyerShell } from "@/components/buyer-shell";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_COLUMNS, type Product } from "@/lib/products";
import { SHOP_CATEGORIES } from "@/lib/shop-categories";

type ProductsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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

  const selectedSlug =
    SHOP_CATEGORIES.find(
      (category) => category.query && query.includes(category.query),
    )?.slug ?? "all";

  return (
    <BuyerShell>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pb-16 pt-8">
        <p className="text-sm font-medium text-[#397A45]">Shop</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#173C2E] sm:text-4xl">
          Neighborhood items
        </h1>
        <p className="mt-2 text-[#4f645a]">
          {query
            ? `Showing items matching “${q?.trim()}”.`
            : "Browse what neighbors are listing."}
        </p>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {SHOP_CATEGORIES.map((category) => {
            const href = category.query
              ? `/products?q=${encodeURIComponent(category.query)}`
              : "/products";
            const selected = category.slug === selectedSlug;
            return (
              <Link
                key={category.slug}
                href={href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  selected
                    ? "bg-[#397A45] text-white"
                    : "bg-[#FFF8EA] text-[#173C2E] ring-1 ring-[rgba(25,60,45,0.10)] hover:bg-white"
                }`}
              >
                {category.label}
              </Link>
            );
          })}
        </div>

        {error ? (
          <p className="mt-10 text-sm text-red-700" role="alert">
            Could not load products. If quantity was just added, run the quantity
            SQL in Supabase.
          </p>
        ) : null}

        {!error && products.length === 0 ? (
          <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white px-6 py-8 text-center ring-1 ring-[rgba(25,60,45,0.10)]">
            <p className="font-display text-lg font-semibold text-[#173C2E]">
              {query ? "No matches" : "Nothing here yet ✨"}
            </p>
            <p className="mt-2 text-sm text-[#4f645a]">
              {query ? (
                <>
                  Try another search.{" "}
                  <Link href="/products" className="text-[#397A45] hover:underline">
                    See all items
                  </Link>
                  .
                </>
              ) : (
                "Cookies, crafts, plants and toys will appear here as neighbors start listing."
              )}
            </p>
          </div>
        ) : null}

        {!error && products.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <MarketplaceProductCard
                key={product.id}
                product={product}
                signedIn={Boolean(user)}
              />
            ))}
          </ul>
        ) : null}
      </main>
    </BuyerShell>
  );
}
