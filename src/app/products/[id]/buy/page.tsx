import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_COLUMNS, type Product } from "@/lib/products";
import { BuyForm } from "./buy-form";

type BuyPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ cancelled?: string }>;
};

export default async function BuyPage({ params, searchParams }: BuyPageProps) {
  const { id } = await params;
  const { cancelled } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: product } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (!product) {
    redirect("/products");
  }

  const item = product as Product;

  if (item.seller_id === user.id) {
    redirect(`/products/${item.id}`);
  }

  if (item.quantity <= 0) {
    redirect(`/products/${item.id}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("delivery_address")
    .eq("id", user.id)
    .maybeSingle();

  const savedAddress = profile?.delivery_address?.trim() ?? "";

  return (
    <>
      {cancelled ? (
        <p className="mx-auto mt-8 max-w-lg px-6 text-sm text-red-700">
          Payment was cancelled. You can try again when you&apos;re ready.
        </p>
      ) : null}
      <BuyForm
        productId={item.id}
        productTitle={item.title}
        priceCents={item.price_cents}
        availableQuantity={item.quantity}
        imageUrl={item.image_url}
        savedAddress={savedAddress}
      />
    </>
  );
}
