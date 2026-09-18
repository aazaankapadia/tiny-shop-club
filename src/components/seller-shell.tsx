import type { ReactNode } from "react";
import { SellerHeader } from "@/components/seller-header";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import { avatarUrlFromUser, firstNameFromUser } from "@/lib/user-display";

export async function SellerShell({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#F4F1E8] text-[#173C2E]">
      <SellerHeader
        firstName={firstNameFromUser(user)}
        avatarUrl={avatarUrlFromUser(user)}
      />
      {children}
      <SiteFooter wide compact signedIn={Boolean(user)} mode="sell" />
    </div>
  );
}
