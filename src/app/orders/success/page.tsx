import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!sessionId) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Payment incomplete
        </h1>
        <p className="mt-2 text-muted">No Stripe session was found.</p>
        <Link href="/products" className="mt-8 text-accent hover:underline">
          Back to items
        </Link>
      </main>
    );
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = session.metadata?.order_id;

  if (!orderId) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Could not confirm payment
        </h1>
        <p className="mt-2 text-muted">This Stripe session is missing order info.</p>
        <Link href="/dashboard" className="mt-8 text-accent hover:underline">
          Go to dashboard
        </Link>
      </main>
    );
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, buyer_id, status, product_id, quantity")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.buyer_id !== user.id) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Could not confirm payment
        </h1>
        <p className="mt-2 text-muted">
          This payment does not match your account. Make sure you stay signed in
          through checkout.
        </p>
        <Link href="/dashboard" className="mt-8 text-accent hover:underline">
          Go to dashboard
        </Link>
      </main>
    );
  }

  if (session.payment_status === "paid" && order.status !== "paid") {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "paid",
        stripe_session_id: session.id,
      })
      .eq("id", orderId)
      .eq("buyer_id", user.id)
      .eq("status", "pending_payment");

    if (error) {
      return (
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Paid, but status update failed
          </h1>
          <p className="mt-2 text-muted">{error.message}</p>
          <Link
            href={`/orders/success?session_id=${sessionId}`}
            className="mt-8 text-accent hover:underline"
          >
            Try again
          </Link>
        </main>
      );
    }

    // Reduce stock; at 0 the listing is removed from the shop (deleted if possible)
    await supabase.rpc("reduce_product_stock", {
      p_product_id: order.product_id,
      p_qty: order.quantity ?? 1,
    });
  }

  if (session.payment_status !== "paid") {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Payment not completed
        </h1>
        <p className="mt-2 text-muted">
          Stripe status: {session.payment_status}. Go back and finish paying.
        </p>
        <Link href={`/orders/${orderId}`} className="mt-8 text-accent hover:underline">
          Back to order
        </Link>
      </main>
    );
  }

  redirect(`/orders/${orderId}`);
}
