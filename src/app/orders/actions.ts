"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, getStripe } from "@/lib/stripe";

export async function resumePayment(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "").trim();

  if (!orderId) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, product_id, buyer_id, status, quantity")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.buyer_id !== user.id) {
    redirect("/dashboard");
  }

  if (order.status !== "pending_payment") {
    redirect(`/orders/${order.id}`);
  }

  const buyQty = order.quantity ?? 1;

  const { data: product } = await supabase
    .from("products")
    .select("id, title, price_cents, quantity")
    .eq("id", order.product_id)
    .maybeSingle();

  if (!product) {
    redirect("/dashboard");
  }

  if (product.quantity < buyQty) {
    redirect(
      `/orders/${order.id}?error=${encodeURIComponent(
        `Only ${product.quantity} left in stock. Cancel this order and try again.`,
      )}`,
    );
  }

  const stripe = getStripe();
  const siteUrl = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: buyQty,
        price_data: {
          currency: "usd",
          unit_amount: product.price_cents,
          product_data: {
            name: product.title,
            description: "Little Store Club · door delivery",
          },
        },
      },
    ],
    metadata: {
      order_id: order.id,
      product_id: product.id,
      buyer_id: user.id,
      quantity: String(buyQty),
    },
    success_url: `${siteUrl}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/orders/${order.id}`,
  });

  if (!session.url) {
    redirect(`/orders/${order.id}`);
  }

  await supabase
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", order.id)
    .eq("buyer_id", user.id);

  redirect(session.url);
}

export async function cancelOrder(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!orderId) {
    redirect("/dashboard");
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, buyer_id, status")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.buyer_id !== user.id) {
    redirect("/dashboard");
  }

  if (order.status !== "pending_payment" && order.status !== "paid") {
    redirect(`/orders/${order.id}`);
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", order.id)
    .eq("buyer_id", user.id)
    .select("id")
    .single();

  if (error) {
    redirect(
      `/orders/${order.id}?error=${encodeURIComponent(
        error.message || "Could not cancel. Run the buyer order SQL in Supabase.",
      )}`,
    );
  }

  revalidatePath(`/orders/${order.id}`);
  revalidatePath("/dashboard");
  redirect(`/orders/${order.id}`);
}

export async function markOrderDelivered(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!orderId) {
    redirect("/dashboard");
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, buyer_id, status")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.buyer_id !== user.id) {
    redirect("/dashboard");
  }

  if (order.status !== "paid") {
    redirect(
      `/orders/${order.id}?error=${encodeURIComponent(
        "Only paid orders can be marked delivered.",
      )}`,
    );
  }

  const { data: updated, error } = await supabase
    .from("orders")
    .update({ status: "delivered" })
    .eq("id", order.id)
    .eq("buyer_id", user.id)
    .eq("status", "paid")
    .select("id, status")
    .maybeSingle();

  if (error || !updated) {
    redirect(
      `/orders/${order.id}?error=${encodeURIComponent(
        error?.message ||
          "Could not mark delivered. Run the buyer-order SQL in Supabase, then try again.",
      )}`,
    );
  }

  revalidatePath(`/orders/${order.id}`);
  revalidatePath("/dashboard");
  redirect(`/orders/${order.id}`);
}
