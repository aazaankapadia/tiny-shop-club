"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, getStripe } from "@/lib/stripe";

export type PlaceOrderState = {
  error: string | null;
};

export async function placeOrder(
  _prevState: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const productId = String(formData.get("productId") ?? "").trim();
  const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim();
  const saveAddress = formData.get("saveAddress") === "on";
  const buyQty = Number.parseInt(String(formData.get("quantity") ?? "1"), 10);

  if (!productId) {
    return { error: "Missing product." };
  }

  if (!deliveryAddress) {
    return { error: "Please enter your delivery address." };
  }

  if (!Number.isFinite(buyQty) || buyQty < 1) {
    return { error: "Please choose a quantity of at least 1." };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      error:
        "Stripe is not set up yet. Add STRIPE_SECRET_KEY to .env.local (test mode).",
    };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, seller_id, title, price_cents, quantity")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product) {
    return { error: "That item could not be found." };
  }

  if (product.seller_id === user.id) {
    return { error: "You can’t buy your own item." };
  }

  if (product.quantity <= 0) {
    return { error: "This item is sold out." };
  }

  if (buyQty > product.quantity) {
    return {
      error: `Only ${product.quantity} left. Please choose a smaller quantity.`,
    };
  }

  if (saveAddress) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      delivery_address: deliveryAddress,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      return { error: profileError.message };
    }
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      product_id: product.id,
      buyer_id: user.id,
      seller_id: product.seller_id,
      delivery_address: deliveryAddress,
      status: "pending_payment",
      quantity: buyQty,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return {
      error:
        orderError?.message ??
        "Could not create order. Did you run the quantity SQL in Supabase?",
    };
  }

  let checkoutUrl: string;

  try {
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
      cancel_url: `${siteUrl}/products/${product.id}/buy?cancelled=1`,
    });

    if (!session.url) {
      return { error: "Stripe did not return a checkout URL." };
    }

    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id)
      .eq("buyer_id", user.id);

    checkoutUrl = session.url;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start Stripe Checkout.";
    return { error: message };
  }

  redirect(checkoutUrl);
}
