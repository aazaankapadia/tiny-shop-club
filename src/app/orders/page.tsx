import Link from "next/link";
import { redirect } from "next/navigation";
import { BuyerShell } from "@/components/buyer-shell";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import { orderStatusLabel } from "@/lib/orders";
import { loginHref } from "@/lib/paths";

export const dynamic = "force-dynamic";

export default async function BuyerOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(loginHref("/orders"));
  }

  const { data: purchaseRows } = await supabase
    .from("orders")
    .select("id, product_id, status, quantity, created_at")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(40);

  const purchases = purchaseRows ?? [];
  const productIds = purchases.map((order) => order.product_id);
  const { data: purchaseProducts } = productIds.length
    ? await supabase
        .from("products")
        .select("id, title, price_cents")
        .in("id", productIds)
    : { data: [] };

  const productById = new Map(
    (purchaseProducts ?? []).map((product) => [product.id, product]),
  );

  return (
    <BuyerShell>
      <main className="mx-auto w-full max-w-[800px] flex-1 px-6 py-10">
        <p className="text-sm font-medium text-[#397A45]">Buyer</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#173C2E]">
          Your orders
        </h1>
        <p className="mt-2 text-[#4f645a]">
          Items coming to your door. Switch to Sell when you want to list something.
        </p>

        {purchases.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white px-6 py-8 text-center ring-1 ring-[rgba(25,60,45,0.10)]">
            <p className="font-display text-lg font-semibold text-[#173C2E]">
              No orders yet
            </p>
            <p className="mt-2 text-sm text-[#4f645a]">
              Browse the neighborhood shop and something you like can come to your door.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex rounded-full bg-[#397A45] px-4 py-2 text-sm font-semibold text-white"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {purchases.map((order) => {
              const product = productById.get(order.product_id);
              return (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="block rounded-2xl bg-white p-4 ring-1 ring-[rgba(25,60,45,0.10)] transition hover:bg-[#FFF8EA]"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-medium text-[#173C2E]">
                        {product?.title ?? "Item"}
                        {order.quantity > 1 ? ` × ${order.quantity}` : ""}
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
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </BuyerShell>
  );
}
