import type { ReactNode } from "react";
import Link from "next/link";
import { ShopMark } from "@/components/shop-mark";
import { loginHref } from "@/lib/paths";

export function LandingHeader({
  signedIn,
  firstName = null,
  avatarUrl = null,
  cartCount = 0,
}: {
  signedIn: boolean;
  firstName?: string | null;
  avatarUrl?: string | null;
  cartCount?: number;
}) {
  const ordersHref = signedIn ? "/dashboard" : loginHref("/dashboard");
  const accountHref = signedIn ? "/dashboard" : "/login";
  const favoritesHref = signedIn ? "/dashboard" : loginHref("/dashboard");

  return (
    <header className="border-b border-[rgba(25,60,45,0.08)] bg-[#FFFCF5]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3 lg:h-[72px] lg:flex-nowrap lg:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <ShopMark className="h-8 w-8" />
          <span className="font-display text-[17px] font-semibold tracking-tight text-[#397A45]">
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

        <nav className="ml-auto flex shrink-0 items-center gap-4 text-[11px] font-medium text-[#173C2E] sm:gap-5">
          <HeaderLink href={favoritesHref} label="Favorites">
            <HeartIcon />
          </HeaderLink>
          <HeaderLink href={ordersHref} label="Orders">
            <OrdersIcon />
          </HeaderLink>
          <HeaderLink href="/products" label="Cart">
            <span className="relative">
              <CartIcon />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#397A45] px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </span>
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
          ) : null}
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

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-9.2C5 8 6.8 6.4 9 6.4c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.6 4 4.4 0 4.8-7 9.2-7 9.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
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

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.5L5 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M8 7 7 4H4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="9.5" cy="19.5" r="1.3" fill="currentColor" />
      <circle cx="16.5" cy="19.5" r="1.3" fill="currentColor" />
    </svg>
  );
}
