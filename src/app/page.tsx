import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteFooter } from "@/components/site-footer";

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

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
        <section className="text-center">
          <h1 className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">
            Tiny Shop Club
          </h1>
          <p className="mt-4 text-lg text-muted sm:text-xl">
            A safe, educational marketplace experience for kids.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-muted">
            Kids list neighborhood items, browse what others are selling, and
            practice buying and selling with a parent nearby. Accounts are
            signed in with Google or email. Family Link accounts can use an
            email sign-in link.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <>
                <Link
                  href="/products"
                  className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Browse items
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-md border border-foreground/15 bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Sign in
                </Link>
                <Link
                  href="/safety"
                  className="rounded-md border border-foreground/15 bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white"
                >
                  Parent &amp; school info
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-foreground/10">
            <h2 className="font-display text-lg font-semibold text-foreground">
              For kids
            </h2>
            <p className="mt-2 text-sm text-muted">
              Learn to list an item, set a price and quantity, and treat
              neighbors fairly.
            </p>
          </div>
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-foreground/10">
            <h2 className="font-display text-lg font-semibold text-foreground">
              For parents
            </h2>
            <p className="mt-2 text-sm text-muted">
              Supervise the account, review listings, and help with delivery
              details. Google Family Link users can sign in with email.
            </p>
          </div>
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-foreground/10">
            <h2 className="font-display text-lg font-semibold text-foreground">
              For schools
            </h2>
            <p className="mt-2 text-sm text-muted">
              This is a legitimate kids&apos; club website. IT can allow{" "}
              tinyshopclub.com in Lightspeed or other filters.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
