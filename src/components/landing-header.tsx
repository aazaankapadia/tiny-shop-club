import type { ReactNode } from "react";
import Link from "next/link";
import { ShopMark } from "@/components/shop-mark";
import { ModeSwitch } from "@/components/mode-switch";
import { loginHref } from "@/lib/paths";

export function LandingHeader({
  signedIn,
  firstName = null,
  avatarUrl = null,
}: {
  signedIn: boolean;
  firstName?: string | null;
  avatarUrl?: string | null;
  cartCount?: number;
}) {
  const ordersHref = signedIn ? "/orders" : loginHref("/orders");
  const accountHref = signedIn ? "/orders" : "/login";
  const sellHref = signedIn ? "/dashboard" : loginHref("/dashboard");

  return (
    <header className="border-b border-[rgba(25,60,45,0.08)] bg-[#FFFCF5]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3 lg:h-[72px] lg:flex-nowrap lg:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <ShopMark className="h-11 w-11" />
          <span className="font-display text-[22px] font-semibold tracking-tight text-[#397A45]">
            Tiny Shop Club
          </span>
        </Link>

        <form action="/products" className="order-3 min-w-0 flex-1 basis-full lg:order-none lg:basis-auto">
          <label className="sr-only" htmlFor="landing-search">
            Search the club
          </label>
          <div className="flex h-11 items-center gap-2 rounded-full bg-white px-3 ring-1 ring-[rgba(25,60,45,0.10)]">
            <SearchIcon />
            <input
              id="landing-search"
              name="q"
              type="search"
              placeholder="Search for cookies, crafts, toys and more..."
              className="w-full bg-transparent text-sm text-[#173C2E] outline-none placeholder:text-[#7d8a7a]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#397A45] px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              Search
            </button>
          </div>
        </form>

        <nav className="ml-auto flex shrink-0 items-center gap-3 text-[11px] font-medium text-[#173C2E] sm:gap-4">
          <ModeSwitch mode="buy" sellHref={sellHref} />
          <HeaderLink href={ordersHref} label="Orders">
            <OrdersIcon />
          </HeaderLink>
          {signedIn ? (
            <Link
              href={accountHref}
              className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(25,60,45,0.10)]"
              aria-label={
                firstName ? `Welcome ${firstName}` : "Your account"
              }
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-[#397A45] text-xs font-semibold text-white">
                  {firstName?.[0]?.toUpperCase() ?? "T"}
                </span>
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#173C2E] ring-1 ring-[rgba(25,60,45,0.10)]"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 transition hover:text-[#397A45]"
    >
      {children}
      {label}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="#6b7c70" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="#6b7c70" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 9h6M9 13h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
