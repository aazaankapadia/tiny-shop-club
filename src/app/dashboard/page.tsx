import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatQuantity, PRODUCT_COLUMNS, type Product } from "@/lib/products";
import { ProductPhoto } from "@/components/product-photo";
import { orderStatusLabel } from "@/lib/orders";
import { archiveSale, signOut, unarchiveSale } from "./actions";
import { deleteProduct } from "../products/actions";

type DashboardPageProps = {
  searchParams: Promise<{ error?: string; show_archived?: string }>;
};

type SaleRow = {
  id: string;
  product_id: string;
  delivery_address: string;
  status: string;
  quantity: number;
  created_at: string;
  archived_at: string | null;
};

function SaleListItem({
  order,
  product,
  archived,
}: {
  order: SaleRow;
  product: { id: string; title: string; price_cents: number } | undefined;
  archived: boolean;
}) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-surface p-4 ring-1 ring-foreground/8 transition hover:bg-white">
      <Link
        href={`/orders/${order.id}`}
        className="min-w-0 flex-1 transition hover:opacity-80"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-medium text-foreground">
            {product?.title ?? "Item"}
          </p>
          {product ? (
            <p className="shrink-0 text-sm text-foreground">
              {formatPrice(product.price_cents)}
              {order.quantity > 1 ? ` × ${order.quantity}` : ""}
            </p>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted">
          {orderStatusLabel(order.status)}
          {order.quantity > 1 ? ` · qty ${order.quantity}` : ""}
        </p>
        {order.status === "paid" || order.status === "delivered" ? (
          <p className="mt-2 text-sm text-accent">
            Deliver to: {order.delivery_address}
          </p>
        ) : null}
      </Link>
      <form action={archived ? unarchiveSale : archiveSale}>
        <input type="hidden" name="orderId" value={order.id} />
        <input
          type="hidden"
          name="next"
          value={archived ? "/dashboard?show_archived=1" : "/dashboard"}
        />
        <button
          type="submit"
          className="shrink-0 text-sm text-muted hover:text-foreground hover:underline"
        >
          {archived ? "Unarchive" : "Archive"}
        </button>
      </form>
    </li>
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { error: actionError, show_archived: showArchivedParam } =
    await searchParams;
  const showArchived = showArchivedParam === "1";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "Neighbor";
  const email = user.email ?? "No email on file";
  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("");

  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("seller_id", user.id)
    .gt("quantity", 0)
    .order("created_at", { ascending: false });

  const myProducts = (data ?? []) as Product[];

  const { data: purchaseRows } = await supabase
    .from("orders")
    .select("id, product_id, delivery_address, status, quantity, created_at")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const purchases = purchaseRows ?? [];
  const purchaseProductIds = purchases.map((order) => order.product_id);
  const { data: purchaseProducts } = purchaseProductIds.length
    ? await supabase
        .from("products")
        .select("id, title, price_cents")
        .in("id", purchaseProductIds)
    : { data: [] };

  const purchaseTitleById = new Map(
    (purchaseProducts ?? []).map((product) => [product.id, product]),
  );

  const salesSelect =
    "id, product_id, delivery_address, status, quantity, created_at, archived_at";

  const { data: salesRows } = await supabase
    .from("orders")
    .select(salesSelect)
    .eq("seller_id", user.id)
    .in("status", ["paid", "delivered", "cancelled"])
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: archivedSalesRows } = showArchived
    ? await supabase
        .from("orders")
        .select(salesSelect)
        .eq("seller_id", user.id)
        .in("status", ["paid", "delivered", "cancelled"])
        .not("archived_at", "is", null)
        .order("archived_at", { ascending: false })
        .limit(20)
    : { data: [] as SaleRow[] };

  const sales = (salesRows ?? []) as SaleRow[];
  const archivedSales = (archivedSalesRows ?? []) as SaleRow[];
  const salesProductIds = [
    ...new Set([
      ...sales.map((order) => order.product_id),
      ...archivedSales.map((order) => order.product_id),
    ]),
  ];
  const { data: salesProducts } = salesProductIds.length
    ? await supabase
        .from("products")
        .select("id, title, price_cents")
        .in("id", salesProductIds)
    : { data: [] };

  const salesTitleById = new Map(
    (salesProducts ?? []).map((product) => [product.id, product]),
  );

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-16 top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-10 top-80 h-64 w-64 rounded-full bg-[#c9e2d4]/50 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(31,107,74,0.18) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-3xl px-6 pb-16 pt-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-foreground transition hover:opacity-80"
          >
            Tiny Shop Club
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted">
            <Link href="/products" className="transition hover:text-foreground">
              Browse
            </Link>
            <Link
              href="/products/new"
              className="transition hover:text-foreground"
            >
              List item
            </Link>
          </nav>
        </div>

        <section className="relative mt-8 overflow-hidden rounded-3xl">
          <div className="relative h-44 w-full sm:h-52">
            <Image
              src="/dashboard-banner.png"
              alt="Neighborhood market table with fresh produce and baked goods"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173028]/55 via-[#173028]/15 to-transparent" />
          </div>
        </section>

        <section className="mt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-white shadow-md">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={`${name}'s profile photo`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-accent text-xl font-semibold text-white">
                  {initials || "LS"}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted">Your corner of the club</p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Welcome back, {name.split(" ")[0]}
              </h1>
              <p className="mt-2 truncate text-muted">{email}</p>
              <p className="mt-2 text-sm text-accent">
                Glad you&apos;re here — list something neighbors might love.
              </p>
            </div>

            <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {myProducts.length} listing{myProducts.length === 1 ? "" : "s"}
            </span>
          </div>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link
            href="/products/new"
            className="group rounded-2xl bg-accent px-5 py-5 text-white transition hover:opacity-95"
          >
            <p className="font-display text-lg font-semibold">List an item</p>
            <p className="mt-1 text-sm text-white/80">
              Put something on the neighborhood table
            </p>
            <span className="mt-4 inline-block text-sm transition group-hover:translate-x-1">
              Get started →
            </span>
          </Link>
          <Link
            href="/products"
            className="group rounded-2xl bg-surface px-5 py-5 ring-1 ring-foreground/10 transition hover:bg-white"
          >
            <p className="font-display text-lg font-semibold text-foreground">
              Browse items
            </p>
            <p className="mt-1 text-sm text-muted">
              See what&apos;s new next door
            </p>
            <span className="mt-4 inline-block text-sm text-accent transition group-hover:translate-x-1">
              Take a look →
            </span>
          </Link>
        </section>

        {actionError ? (
          <p className="mt-6 text-sm text-red-700" role="alert">
            {actionError}
          </p>
        ) : null}

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Your sales
              </h2>
              <p className="mt-1 text-sm text-muted">
                When a neighbor pays, it shows up here with the delivery address
              </p>
            </div>
            <Link
              href={showArchived ? "/dashboard" : "/dashboard?show_archived=1"}
              className="shrink-0 text-sm text-accent transition hover:underline"
            >
              {showArchived ? "Hide archived" : "Show archived"}
            </Link>
          </div>
          {sales.length === 0 ? (
            <p className="mt-4 text-muted">
              {showArchived ? "No active sales." : "No sales yet."}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {sales.map((order) => (
                <SaleListItem
                  key={order.id}
                  order={order}
                  product={salesTitleById.get(order.product_id)}
                  archived={false}
                />
              ))}
            </ul>
          )}
          {showArchived ? (
            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                Archived sales
              </h3>
              <p className="mt-1 text-sm text-muted">
                Hidden from your main list — unarchive to bring one back
              </p>
              {archivedSales.length === 0 ? (
                <p className="mt-4 text-muted">No archived sales.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {archivedSales.map((order) => (
                    <SaleListItem
                      key={order.id}
                      order={order}
                      product={salesTitleById.get(order.product_id)}
                      archived
                    />
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Your orders
          </h2>
          <p className="mt-1 text-sm text-muted">Items coming to your door</p>
          {purchases.length === 0 ? (
            <p className="mt-4 text-muted">No orders yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {purchases.map((order) => {
                const product = purchaseTitleById.get(order.product_id);
                return (
                  <li key={order.id}>
                    <Link
                      href={`/orders/${order.id}`}
                      className="block rounded-2xl bg-surface p-4 ring-1 ring-foreground/8 transition hover:bg-white"
                    >
                      <p className="font-medium text-foreground">
                        {product?.title ?? "Item"}
                        {order.quantity > 1 ? ` × ${order.quantity}` : ""}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {orderStatusLabel(order.status)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Your listings
              </h2>
              <p className="mt-1 text-sm text-muted">
                Things you&apos;ve shared with the club
              </p>
            </div>
          </div>

          {myProducts.length === 0 ? (
            <div className="mt-6 overflow-hidden rounded-2xl bg-surface ring-1 ring-foreground/10">
              <div className="relative h-36 w-full">
                <Image
                  src="/dashboard-banner.png"
                  alt=""
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <div className="absolute inset-0 bg-[#173028]/45" />
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                  <p className="max-w-sm text-sm text-white">
                    No listings yet — your first item could be cookies, crafts,
                    or something from the garden.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {myProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl bg-surface p-4 ring-1 ring-foreground/8 transition hover:bg-white"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <ProductPhoto
                      src={product.image_url}
                      alt={product.title}
                      sizes="48px"
                    />
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="min-w-0 flex-1 transition hover:opacity-80"
                  >
                    <p className="truncate font-medium text-foreground">
                      {product.title}
                    </p>
                    <p className="text-sm text-muted">
                      {formatPrice(product.price_cents)} ·{" "}
                      {formatQuantity(product.quantity)}
                    </p>
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="productId" value={product.id} />
                    <button
                      type="submit"
                      className="text-sm text-red-800/80 hover:text-red-800 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>

        <form action={signOut} className="mt-12">
          <button
            type="submit"
            className="rounded-md border border-foreground/15 bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
