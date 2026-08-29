import type { ReactNode } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";
import { ShopMark } from "@/components/shop-mark";
import { loginHref } from "@/lib/paths";
import { SHOP_CATEGORIES } from "@/lib/shop-categories";
import type { Product } from "@/lib/products";

export function LandingPage({
  signedIn,
  firstName = null,
  avatarUrl = null,
  products,
  cartCount = 0,
}: {
  signedIn: boolean;
  firstName?: string | null;
  avatarUrl?: string | null;
  products: Product[];
  cartCount?: number;
}) {
  const listHref = signedIn ? "/products/new" : loginHref("/products/new");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#FFFCF5] text-[#173C2E]">
      <LandingHeader
        signedIn={signedIn}
        firstName={firstName}
        avatarUrl={avatarUrl}
        cartCount={cartCount}
      />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6">
        <section className="grid items-center gap-8 pt-8 lg:grid-cols-[0.44fr_0.56fr] lg:gap-10">
          <div className="relative max-w-xl">
            {signedIn ? (
              <p className="mb-3 text-base font-medium text-[#397A45] sm:text-[17px]">
                Welcome{firstName ? ` ${firstName}` : ""}
              </p>
            ) : null}
            <div className="relative">
              <StarDoodle className="absolute -left-2 top-1 hidden sm:block" />
              <h1 className="font-display text-[40px] font-semibold leading-[1.08] tracking-tight text-[#173C2E] sm:text-5xl lg:text-[58px]">
                Little things.
                <br />
                <span className="text-[#F47A2A]">Big smiles.</span>
              </h1>
            </div>
            <p className="mt-4 max-w-md text-base text-[#4f645a] sm:text-[17px]">
              A marketplace run by kids, loved by neighbors.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="rounded-full bg-[#397A45] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Start Shopping
              </Link>
              <Link
                href="/safety"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#173C2E] ring-1 ring-[rgba(25,60,45,0.10)] transition hover:bg-white/80"
              >
                <PlayIcon />
                How it works
              </Link>
            </div>
          </div>

          <div className="relative">
            <HeartDoodle className="absolute -right-1 -top-3 z-10 hidden sm:block" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_14px_36px_rgba(23,60,46,0.10)] lg:aspect-auto lg:h-[410px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/landing-hero.jpg"
                alt="Homemade chocolate chip cookies on a table"
                className="h-full w-full object-cover object-[center_48%]"
              />
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(23,60,46,0.04)] ring-1 ring-[rgba(25,60,45,0.10)]">
          <div className="grid grid-cols-2 divide-x divide-y divide-[rgba(25,60,45,0.08)] lg:grid-cols-4 lg:divide-y-0">
            <TrustBadge
              title="Parent supervised"
              subtitle="Safe and trusted"
              icon={<ShieldIcon />}
              color="#E8F3EA"
            />
            <TrustBadge
              title="Local delivery"
              subtitle="Right in your neighborhood"
              icon={<PinIcon />}
              color="#FCE8EB"
            />
            <TrustBadge
              title="Same-day nearby"
              subtitle="Fast and convenient"
              icon={<ClockIcon />}
              color="#E8F3FA"
            />
            <TrustBadge
              title="Kid-friendly marketplace"
              subtitle="Made with care"
              icon={<SmileIcon />}
              color="#F0E8FA"
            />
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Shop by category
            </h2>
            <Link
              href="/products"
              className="shrink-0 text-sm font-medium text-[#397A45] hover:underline"
            >
              View all categories →
            </Link>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {SHOP_CATEGORIES.map((category) => {
              const href = category.query
                ? `/products?q=${encodeURIComponent(category.query)}`
                : "/products";
              const selected = category.slug === "all";
              return (
                <Link
                  key={category.slug}
                  href={href}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    selected
                      ? "bg-[#397A45] text-white"
                      : "bg-[#FFF8EA] text-[#173C2E] ring-1 ring-[rgba(25,60,45,0.10)] hover:bg-white"
                  }`}
                >
                  {category.label}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16 pb-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Featured from local kids{" "}
              <span className="text-[#F47A2A]" aria-hidden>
                ♡
              </span>
            </h2>
            <Link
              href="/products"
              className="shrink-0 text-sm font-medium text-[#397A45] hover:underline"
            >
              See all items →
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="mx-auto mt-6 max-w-md rounded-2xl bg-white px-6 py-8 text-center shadow-[0_6px_18px_rgba(23,60,46,0.04)] ring-1 ring-[rgba(25,60,45,0.10)]">
              <p className="font-display text-lg font-semibold">
                Nothing here yet ✨
              </p>
              <p className="mt-2 text-sm text-[#4f645a]">
                Cookies, crafts, plants and toys will appear here as neighbors
                start listing.
              </p>
              <Link
                href={listHref}
                className="mt-5 inline-flex rounded-full bg-[#397A45] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                List the first item
              </Link>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <MarketplaceProductCard
                  key={product.id}
                  product={product}
                  signedIn={signedIn}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      <section className="bg-[#FFF1B8]">
        <div className="mx-auto flex h-auto min-h-[130px] max-w-[1200px] items-center justify-between gap-6 px-6 py-8 lg:h-[150px] lg:py-0">
          <ShopMark className="hidden h-12 w-12 sm:block" />
          <div className="max-w-2xl text-center sm:text-left">
            <p className="font-display text-xl font-semibold text-[#173C2E] sm:text-2xl">
              Made by kids. Loved by neighbors.
            </p>
            <p className="mt-1 text-sm text-[#4f645a] sm:text-[15px]">
              Every purchase supports young entrepreneurs in our community.
            </p>
          </div>
          <ShopMark className="hidden h-12 w-12 md:block" />
        </div>
      </section>
    </div>
  );
}

function TrustBadge({
  title,
  subtitle,
  icon,
  color,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        {icon}
      </span>
      <span>
        <p className="text-sm font-semibold text-[#173C2E]">{title}</p>
        <p className="text-xs text-[#5d7166]">{subtitle}</p>
      </span>
    </div>
  );
}

function StarDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 3 16 11l8 2-8 2-2 8-2-8-8-2 8-2 2-8Z" fill="#F4C14B" />
    </svg>
  );
}

function HeartDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="16" viewBox="0 0 28 26" fill="none" aria-hidden="true">
      <path
        d="M14 23s-9-5.4-9-11.2C5 8.3 7.2 6.4 10 6.4c1.6 0 3 .8 4 2 1-1.2 2.4-2 4-2 2.8 0 5 1.9 5 5.4C23 17.6 14 23 14 23Z"
        fill="#F47A2A"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.6 5.2 11 8 6.6 10.8V5.2Z" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 6v6c0 5 3.2 8.2 7 9 3.8-.8 7-4 7-9V6l-7-3Z" fill="#397A45" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" fill="#F47A2A" />
      <circle cx="12" cy="10" r="2.1" fill="white" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="#3b7cae" />
      <path d="M12 8v4.2L15 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="#8a5bb5" />
      <circle cx="9" cy="10" r="1.1" fill="white" />
      <circle cx="15" cy="10" r="1.1" fill="white" />
      <path
        d="M8.5 14c1.2 1.5 2.6 2.2 3.5 2.2S14.3 15.5 15.5 14"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
