import Link from "next/link";

export function SiteFooter({
  wide = false,
  compact = false,
  signedIn = false,
  mode = "buy",
}: {
  wide?: boolean;
  compact?: boolean;
  signedIn?: boolean;
  mode?: "buy" | "sell";
}) {
  const accountLink = signedIn
    ? mode === "sell"
      ? { href: "/dashboard", label: "My shop" }
      : { href: "/orders", label: "My orders" }
    : { href: "/login", label: "Sign in" };
  const links = [
    { href: "/", label: "Shop" },
    { href: "/safety", label: "Safety" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/contact", label: "Contact" },
    accountLink,
  ];
  return (
    <footer
      className={`mt-auto border-t border-[rgba(25,60,45,0.10)] bg-white px-6 ${
        compact ? "py-4" : "py-8"
      }`}
    >
      <div
        className={`mx-auto flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
          wide ? "max-w-[1200px]" : "max-w-3xl"
        }`}
      >
        <p className="text-sm text-[#4f645a]">
          Tiny Shop Club{" "}
          <a
            href="https://games6741.netlify.app"
            className="text-[#4f645a] no-underline"
            aria-label="Class notes"
          >
            ·
          </a>{" "}
          A parent-supervised neighborhood marketplace for kids
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-accent hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
