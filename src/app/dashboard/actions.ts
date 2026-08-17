"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

function nextPath(formData: FormData) {
  const next = String(formData.get("next") ?? "").trim();
  if (next.startsWith("/dashboard") || next.startsWith("/orders/")) {
    return next;
  }
  return "/dashboard";
}

async function setSaleArchived(formData: FormData, archived: boolean) {
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
    .select("id, seller_id")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.seller_id !== user.id) {
    redirect("/dashboard");
  }

  const { error } = await supabase
    .from("orders")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", order.id)
    .eq("seller_id", user.id);

  if (error) {
    const destination = nextPath(formData);
    const separator = destination.includes("?") ? "&" : "?";
    redirect(
      `${destination}${separator}error=${encodeURIComponent(
        error.message ||
          "Could not update this sale. Run the archive-sales SQL in Supabase.",
      )}`,
    );
  }

  revalidatePath("/dashboard");
  revalidatePath(`/orders/${order.id}`);
  redirect(nextPath(formData));
}

export async function archiveSale(formData: FormData) {
  await setSaleArchived(formData, true);
}

export async function unarchiveSale(formData: FormData) {
  await setSaleArchived(formData, false);
}
