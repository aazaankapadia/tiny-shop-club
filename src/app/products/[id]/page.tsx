import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductPhoto } from "@/components/product-photo";
import { formatPrice, formatQuantity, PRODUCT_COLUMNS, type Product } from "@/lib/products";
import { deleteProduct } from "../actions";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;
  const isOwner = user?.id === product.seller_id;
  const inStock = product.quantity > 0;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
      <Link href="/products" className="text-sm text-muted hover:text-foreground">
        ← Back to items
      </Link>

      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">
        {product.title}
      </h1>
      {product.image_url ? (
        <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-foreground/10">
          <ProductPhoto
            src={product.image_url}
            alt={product.title}
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>
      ) : null}
      <p className="mt-3 text-2xl text-foreground">
        {formatPrice(product.price_cents)}
      </p>
      <p className="mt-2 text-sm font-medium text-accent">
        {formatQuantity(product.quantity)}
      </p>

      {product.description ? (
        <p className="mt-6 whitespace-pre-wrap text-muted">{product.description}</p>
      ) : (
        <p className="mt-6 text-muted">No description provided.</p>
      )}

      <div className="mt-8 rounded-xl bg-surface p-4 ring-1 ring-foreground/10">
        <p className="text-sm text-muted">We pick this up from</p>
        <p className="mt-1 text-foreground">
          {product.location || "Seller location not provided"}
        </p>
        <p className="mt-2 text-xs text-muted">
          Then we deliver it to the buyer&apos;s door.
        </p>
      </div>

      <p className="mt-8 text-sm text-muted">
        Listed {new Date(product.created_at).toLocaleDateString()}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        {!isOwner ? (
          inStock ? (
            user ? (
              <Link
                href={`/products/${product.id}/buy`}
                className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Buy — deliver to my door
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Sign in to buy
              </Link>
            )
          ) : (
            <p className="text-sm text-muted">Sold out</p>
          )
        ) : null}

        {isOwner ? (
          <form action={deleteProduct}>
            <input type="hidden" name="productId" value={product.id} />
            <button
              type="submit"
              className="rounded-md border border-red-700/30 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-50"
            >
              Delete item
            </button>
          </form>
        ) : null}
      </div>
    </main>
  );
}
