import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SellerShell } from "@/components/seller-shell";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatQuantity, PRODUCT_COLUMNS, type Product } from "@/lib/products";
import { ProductPhoto } from "@/components/product-photo";
import { orderStatusLabel } from "@/lib/orders";
import { firstNameFromUser } from "@/lib/user-display";
import { loginHref } from "@/lib/paths";
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
    <li className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-[rgba(25,60,45,0.10)] transition hover:bg-[#FFF8EA]">
      <Link
        href={`/orders/${order.id}`}
        className="min-w-0 flex-1 transition hover:opacity-80"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-medium text-[#173C2E]">
            {product?.title ?? "Item"}
          </p>
          {product ? (
            <p className="shrink-0 text-sm text-[#173C2E]">
              {formatPrice(product.price_cents)}
              {order.quantity > 1 ? ` × ${order.quantity}` : ""}
            </p>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-[#4f645a]">
          {orderStatusLabel(order.status)}
          {order.quantity > 1 ? ` · qty ${order.quantity}` : ""}
        </p>
        {order.status === "paid" || order.status === "delivered" ? (
          <p className="mt-2 text-sm text-[#397A45]">
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
          className="shrink-0 text-sm text-[#4f645a] hover:text-[#173C2E] hover:underline"
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
    redirect(loginHref("/dashboard"));
  }

  const firstName = firstNameFromUser(user) ?? "neighbor";

  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("seller_id", user.id)
    .gt("quantity", 0)
    .order("created_at", { ascending: false });

  const myProducts = (data ?? []) as Product[];

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
    <SellerShell>
      <main className="mx-auto w-full max-w-[880px] flex-1 px-6 pb-16 pt-8">
        <section className="relative overflow-hidden rounded-3xl">
          <div className="relative h-40 w-full sm:h-48">
            <Image
              src="/dashboard-marketplace.png"
              alt="Neighborhood table with cookies, crafts, plants, toys, flowers, and lemonade"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 880px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173028]/60 via-[#173028]/20 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-sm font-medium text-white/80">Your shop</p>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Welcome back, {firstName}
              </h1>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-[rgba(25,60,45,0.10)]">
            <p className="text-sm text-[#4f645a]">Listings</p>
            <p className="mt-1 font-display text-2xl font-semibold text-[#173C2E]">
              {myProducts.length}
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-[rgba(25,60,45,0.10)]">
            <p className="text-sm text-[#4f645a]">Active sales</p>
            <p className="mt-1 font-display text-2xl font-semibold text-[#173C2E]">
              {sales.length}
            </p>
          </div>
          <Link
            href="/products/new"
            className="rounded-2xl bg-[#F47A2A] px-4 py-4 text-white transition hover:opacity-95"
          >
            <p className="font-display text-lg font-semibold">List an item</p>
            <p className="mt-1 text-sm text-white/85">Add something to your shop.</p>
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
              <h2 className="font-display text-2xl font-semibold tracking-tight text-[#173C2E]">
                Your listings
              </h2>
              <p className="mt-1 text-sm text-[#4f645a]">
                What neighbors can buy from you right now
              </p>
            </div>
          </div>
          {myProducts.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-white px-6 py-8 text-center ring-1 ring-[rgba(25,60,45,0.10)]">
              <p className="font-display text-lg font-semibold text-[#173C2E]">
                Your shop is empty
              </p>
              <p className="mt-2 text-sm text-[#4f645a]">
                Cookies, crafts, plants, or a toy — list the first one.
              </p>
              <Link
                href="/products/new"
                className="mt-5 inline-flex rounded-full bg-[#F47A2A] px-4 py-2 text-sm font-semibold text-white"
              >
                List an item
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {myProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-[rgba(25,60,45,0.10)]"
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
                    <p className="truncate font-medium text-[#173C2E]">
                      {product.title}
                    </p>
                    <p className="text-sm text-[#4f645a]">
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

        <section className="mt-12" id="sales">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-[#173C2E]">
                Your sales
              </h2>
              <p className="mt-1 text-sm text-[#4f645a]">
                When a neighbor pays, the delivery address shows up here
              </p>
            </div>
            <Link
              href={showArchived ? "/dashboard" : "/dashboard?show_archived=1"}
              className="shrink-0 text-sm text-[#397A45] transition hover:underline"
            >
              {showArchived ? "Hide archived" : "Show archived"}
            </Link>
          </div>
          {sales.length === 0 ? (
            <p className="mt-4 text-[#4f645a]">
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
              <h3 className="font-display text-lg font-semibold tracking-tight text-[#173C2E]">
                Archived sales
              </h3>
              <p className="mt-1 text-sm text-[#4f645a]">
                Hidden from your main list — unarchive to bring one back
              </p>
              {archivedSales.length === 0 ? (
                <p className="mt-4 text-[#4f645a]">No archived sales.</p>
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

        <form action={signOut} className="mt-12">
          <button
            type="submit"
            className="rounded-md border border-[rgba(25,60,45,0.15)] bg-white px-4 py-2 text-sm font-medium text-[#173C2E] transition hover:bg-[#FFF8EA]"
          >
            Sign out
          </button>
        </form>
      </main>
    </SellerShell>
  );
}
