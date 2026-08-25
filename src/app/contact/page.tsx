import type { Metadata } from "next";
import { PublicPage } from "@/components/public-page";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact and support information for Tiny Shop Club, including school filter allowlisting.",
};

export default function ContactPage() {
  return (
    <PublicPage title="Contact">
      <p>
        Tiny Shop Club is a family-run neighborhood club website for kids
        who are learning to list, browse, and sell items with a parent
        nearby.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Families
      </h2>
      <p>
        For help with an account, use the same email address used to sign
        in. A parent should be involved in Google or email sign-in,
        especially for Family Link accounts.
      </p>
      <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
        Schools and IT
      </h2>
      <p>
        Website:{" "}
        <a href="https://www.tinyshopclub.com" className="text-accent hover:underline">
          https://www.tinyshopclub.com
        </a>
      </p>
      <p>
        If a school filter such as Lightspeed blocks this site, ask the
        Lightspeed administrator to run Access Checker on tinyshopclub.com.
        This site is a parent-supervised educational marketplace for children,
        not an unknown login-only app. Schools can allowlist the domain even
        before a global category change is finished.
      </p>
    </PublicPage>
  );
}
