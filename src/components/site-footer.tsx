import Link from "next/link";

export function SiteFooter({
  wide = false,
  compact = false,
  signedIn = false,
}: {
  wide?: boolean;
  compact?: boolean;
  signedIn?: boolean;
}) {
  const links = [
    { href: "/", label: "About" },
    { href: "/safety", label: "Safety" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/contact", label: "Contact" },
    signedIn
      ? { href: "/dashboard", label: "Dashboard" }
      : { href: "/login", label: "Sign in" },
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
          Tiny Shop Club · A parent-supervised neighborhood marketplace for kids
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
