"use server";

import { redirect } from "next/navigation";
import { uploadProductPhoto } from "@/lib/product-photos";
import { createClient } from "@/lib/supabase/server";

export type CreateProductState = {
  error: string | null;
};

export async function createProduct(
  _prevState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const quantityRaw = String(formData.get("quantity") ?? "").trim();
  const price = Number.parseFloat(priceRaw);
  const quantity = Number.parseInt(quantityRaw, 10);

  if (!title) {
    return { error: "Please enter a title." };
  }

  if (!location) {
    return { error: "Please enter the address where we should pick up the item." };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { error: "Please enter a valid price (for example 12.50)." };
  }

  if (!Number.isFinite(quantity) || quantity < 1) {
    return { error: "Please enter a quantity of at least 1." };
  }

  const photo = formData.get("photo");
  let imageUrl: string | null = null;

  if (photo instanceof File && photo.size > 0) {
    const uploaded = await uploadProductPhoto(supabase, user.id, photo);
    if ("error" in uploaded) {
      return { error: uploaded.error };
    }
    imageUrl = uploaded.url;
  }

  const priceCents = Math.round(price * 100);

  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: user.id,
      title,
      description,
      location,
      price_cents: priceCents,
      quantity,
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/products/${data.id}`);
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const productId = String(formData.get("productId") ?? "");

  if (!productId) {
    redirect("/dashboard");
  }

  // Remove unfinished checkouts so the product can be deleted
  await supabase
    .from("orders")
    .delete()
    .eq("product_id", productId)
    .eq("seller_id", user.id)
    .in("status", ["pending_payment", "cancelled"]);

  const { data: activeOrders } = await supabase
    .from("orders")
    .select("id")
    .eq("product_id", productId)
    .in("status", ["paid", "delivered"])
    .limit(1);

  // Paid orders still need this product row, so hide it instead of deleting
  if (activeOrders && activeOrders.length > 0) {
    const { error } = await supabase
      .from("products")
      .update({ quantity: 0 })
      .eq("id", productId)
      .eq("seller_id", user.id);

    if (error) {
      redirect(
        `/dashboard?error=${encodeURIComponent(
          error.message || "Could not remove listing.",
        )}`,
      );
    }

    redirect("/dashboard");
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("seller_id", user.id);

  if (error) {
    redirect(
      `/dashboard?error=${encodeURIComponent(
        error.message ||
          "Could not delete listing. Run the fix-delete-listings SQL in Supabase.",
      )}`,
    );
  }

  redirect("/dashboard");
}
