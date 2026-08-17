import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import { ProductPhoto } from "@/components/product-photo";
import { orderStatusLabel } from "@/lib/orders";
import { cancelOrder, markOrderDelivered, resumePayment } from "../actions";
import { archiveSale, unarchiveSale } from "../../dashboard/actions";

type OrderPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = await params;
  const { error: actionError } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, product_id, buyer_id, seller_id, delivery_address, status, quantity, created_at, archived_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!order || (order.buyer_id !== user.id && order.seller_id !== user.id)) {
    notFound();
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, title, price_cents, image_url")
    .eq("id", order.product_id)
    .maybeSingle();

  const orderQty = order.quantity ?? 1;

  const isBuyer = order.buyer_id === user.id;
  const isSeller = order.seller_id === user.id;
  const isArchived = Boolean(order.archived_at);
  const needsPayment = isBuyer && order.status === "pending_payment";
  const canCancel =
    isBuyer && (order.status === "pending_payment" || order.status === "paid");
  const canMarkDelivered = isBuyer && order.status === "paid";
  const canArchiveSale =
    isSeller &&
    (order.status === "paid" ||
      order.status === "delivered" ||
      order.status === "cancelled");

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
      <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
        ← Back to dashboard
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
        {order.status === "paid"
          ? isBuyer
            ? "Payment received"
            : "Item sold"
          : order.status === "delivered"
            ? "Delivered"
            : order.status === "cancelled"
              ? "Cancelled"
              : needsPayment
                ? "Payment incomplete"
                : isBuyer
                  ? "Order"
                  : "Incoming order"}
      </h1>
      <p className="mt-2 text-muted">
        {order.status === "paid"
          ? isBuyer
            ? "Thanks! We’ll deliver this to your door. Mark delivered when it arrives."
            : "A neighbor paid — deliver to the address below."
          : order.status === "delivered"
            ? "This order was marked as delivered."
            : order.status === "cancelled"
              ? "This order was cancelled."
              : needsPayment
                ? "You haven’t finished paying yet. Click below to complete Stripe checkout."
                : orderStatusLabel(order.status)}
      </p>

      <div className="mt-8 space-y-5 rounded-2xl bg-surface p-5 ring-1 ring-foreground/10">
        <div className="flex gap-4">
          {product?.image_url ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <ProductPhoto
                src={product.image_url}
                alt={product.title}
                sizes="80px"
              />
            </div>
          ) : null}
          <div>
            <p className="text-sm text-muted">Item</p>
            <p className="mt-1 text-lg text-foreground">
              {product?.title ?? "Item"}
            </p>
            {product ? (
              <p className="mt-1 text-muted">
                {formatPrice(product.price_cents)} each · qty {orderQty}
                {orderQty > 1
                  ? ` · total ${formatPrice(product.price_cents * orderQty)}`
                  : ""}
              </p>
            ) : (
              <p className="mt-1 text-muted">Qty {orderQty}</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted">Deliver to</p>
          <p className="mt-1 whitespace-pre-wrap text-foreground">
            {order.delivery_address}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Status</p>
          <p className="mt-1 text-foreground">{orderStatusLabel(order.status)}</p>
          {isSeller && isArchived ? (
            <p className="mt-1 text-sm text-muted">Archived — hidden from Your sales</p>
          ) : null}
        </div>
      </div>

      {actionError ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {needsPayment ? (
          <form action={resumePayment}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Complete payment
            </button>
          </form>
        ) : null}

        {canMarkDelivered ? (
          <form action={markOrderDelivered}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Mark as delivered
            </button>
          </form>
        ) : null}

        {canCancel ? (
          <form action={cancelOrder}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              className="rounded-md border border-red-700/30 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-50"
            >
              Cancel order
            </button>
          </form>
        ) : null}

        {canArchiveSale ? (
          <form action={isArchived ? unarchiveSale : archiveSale}>
            <input type="hidden" name="orderId" value={order.id} />
            <input type="hidden" name="next" value={`/orders/${order.id}`} />
            <button
              type="submit"
              className="rounded-md border border-foreground/15 bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white"
            >
              {isArchived ? "Unarchive sale" : "Archive sale"}
            </button>
          </form>
        ) : null}

        <Link
          href="/dashboard"
          className="rounded-md border border-foreground/15 bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
