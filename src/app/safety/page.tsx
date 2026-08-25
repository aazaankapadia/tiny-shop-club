import type { Metadata } from "next";
import { PublicPage } from "@/components/public-page";

export const metadata: Metadata = {
  title: "Child Safety and Parent Information",
  description:
    "How Tiny Shop Club is meant to be used by kids with parent and school supervision.",
};

export default function SafetyPage() {
  return (
    <PublicPage title="Child Safety and Parent Information">
      <p>
        Tiny Shop Club is a safe, educational marketplace experience for
        kids. It is designed so children can learn entrepreneurship,
        creativity, and responsible buying and selling while a parent or
        school stays in the loop.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Parent supervision
      </h2>
      <p>
        Kids sign in with Google or an email sign-in link. A parent should
        review what is listed, including photos, prices, pickup locations, and
        delivery addresses. Google Family Link accounts can use email sign-in
        if Google sign-in is blocked.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Neighborhood use
      </h2>
      <p>
        This is a neighborhood club, not an open public storefront for
        strangers. Families should only arrange pickup or door delivery with
        people they know, and a parent should be involved in any handoff.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        For schools
      </h2>
      <p>
        Tiny Shop Club is a legitimate child-focused educational website.
        School devices may block new or unknown sites until they are
        classified. If Lightspeed or another filter blocks tinyshopclub.com,
        ask the school&apos;s IT administrator to run Access Checker on
        tinyshopclub.com and allow the domain for educational / kids use.
      </p>
    </PublicPage>
  );
}
