import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/components/landing-page";
import { SiteFooter } from "@/components/site-footer";
import { PRODUCT_COLUMNS, type Product } from "@/lib/products";
import { avatarUrlFromUser, firstNameFromUser } from "@/lib/user-display";

export const metadata: Metadata = {
  title: {
    absolute: "Tiny Shop Club | Safe Educational Marketplace for Kids",
  },
  description:
    "Tiny Shop Club is a safe, parent-supervised educational platform where children learn entrepreneurship, creativity, and responsible buying and selling.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tiny Shop Club",
  url: "https://www.tinyshopclub.com",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "A parent-supervised neighborhood marketplace where kids list items, browse, and practice responsible buying and selling.",
  audience: {
    "@type": "PeopleAudience",
    suggestedMinAge: 8,
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .gt("quantity", 0)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage
        signedIn={Boolean(user)}
        firstName={firstNameFromUser(user)}
        avatarUrl={avatarUrlFromUser(user)}
        products={(data ?? []) as Product[]}
        cartCount={0}
      />
      <SiteFooter wide compact signedIn={Boolean(user)} mode="buy" />
    </div>
  );
}
