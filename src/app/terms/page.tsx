import type { Metadata } from "next";
import { PublicPage } from "@/components/public-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms for using Tiny Shop Club, a parent-supervised neighborhood marketplace for kids.",
};

export default function TermsPage() {
  return (
    <PublicPage title="Terms of Service">
      <p>
        Tiny Shop Club is a neighborhood club website where kids, with a
        parent nearby, can list items and practice buying and selling. It is
        not a large commercial marketplace, and it does not guarantee sales,
        payments, or deliveries.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Who may use it
      </h2>
      <p>
        Anyone using the site should have permission from a parent or
        guardian if they are under 18. Parents are responsible for supervising
        accounts, listings, and meetups or deliveries.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Listings and orders
      </h2>
      <p>
        List only neighborhood-appropriate items you are allowed to sell.
        Keep titles, photos, and locations honest. Pickup and door delivery
        are arranged locally between families. Follow school and family rules
        about money, meeting people, and sharing addresses.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Accounts
      </h2>
      <p>
        Do not share sign-in links. If you need to stop using the site, a
        parent can stop signing in and can ask for a listing to be removed.
      </p>
      <p>
        The site is provided as-is for this neighborhood club. We may update
        these terms as the club grows.
      </p>
    </PublicPage>
  );
}
