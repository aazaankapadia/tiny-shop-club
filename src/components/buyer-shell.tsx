import type { ReactNode } from "react";
import { LandingHeader } from "@/components/landing-header";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import { avatarUrlFromUser, firstNameFromUser } from "@/lib/user-display";

export async function BuyerShell({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#FFFCF5] text-[#173C2E]">
      <LandingHeader
        signedIn={Boolean(user)}
        firstName={firstNameFromUser(user)}
        avatarUrl={avatarUrlFromUser(user)}
      />
      {children}
      <SiteFooter wide compact signedIn={Boolean(user)} mode="buy" />
    </div>
  );
}
