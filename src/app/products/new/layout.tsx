import { redirect } from "next/navigation";
import { SellerShell } from "@/components/seller-shell";
import { createClient } from "@/lib/supabase/server";
import { loginHref } from "@/lib/paths";

export default async function NewProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(loginHref("/products/new"));
  }

  return <SellerShell>{children}</SellerShell>;
}
