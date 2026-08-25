import type { Metadata } from "next";
import { PublicPage } from "@/components/public-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Tiny Shop Club collects and uses account, listing, and order information for this parent-supervised kids marketplace.",
};

export default function PrivacyPage() {
  return (
    <PublicPage title="Privacy Policy">
      <p>
        Tiny Shop Club is a parent-supervised neighborhood marketplace for
        kids. This page explains what information the site uses so families
        and schools can understand how it works.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Information we use
      </h2>
      <p>
        When someone signs in with Google or an email sign-in link, we store
        the account email so they can list items, browse, and place orders.
        Listings can include a title, description, photo, price, quantity, and
        a pickup location. Orders can include a delivery address so a parent
        or neighbor can complete a door delivery.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Where it is stored
      </h2>
      <p>
        Sign-in and app data are stored with Supabase. The website is hosted
        on Vercel. Payments go through Stripe. We do not sell this information
        to advertisers.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Children and parents
      </h2>
      <p>
        This site is meant to be used with a parent or guardian nearby. Google
        Family Link accounts can use an email sign-in link if Google sign-in
        is blocked. Parents should review listings, photos, and delivery
        details before they are shared.
      </p>
      <p>
        Questions about a specific account should go through the email used
        to sign in. See the contact page for school and filter questions.
      </p>
    </PublicPage>
  );
}
