import Link from "next/link";
import { ShopMark } from "@/components/shop-mark";
import { ModeSwitch } from "@/components/mode-switch";

export function SellerHeader({
  firstName = null,
  avatarUrl = null,
}: {
  firstName?: string | null;
  avatarUrl?: string | null;
}) {
  return (
    <header className="bg-[#173C2E] text-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-3 px-6 py-3 lg:h-[72px] lg:flex-nowrap lg:py-0">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
          <ShopMark className="h-11 w-11" />
          <span className="font-display text-[22px] font-semibold tracking-tight">
            Tiny Shop Club
          </span>
          <span className="rounded-full bg-[#F47A2A] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            Seller
          </span>
        </Link>

        <nav className="ml-auto flex shrink-0 items-center gap-3 text-sm sm:gap-4">
          <ModeSwitch mode="sell" sellHref="/dashboard" tone="dark" />
          <Link
            href="/dashboard"
            className="hidden text-white/85 transition hover:text-white sm:inline"
          >
            My shop
          </Link>
          <Link
            href="/products/new"
            className="rounded-full bg-[#F47A2A] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            List an item
          </Link>
          <Link
            href="/dashboard"
            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20"
            aria-label={firstName ? `${firstName}'s shop` : "Your shop"}
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
              <span className="flex h-full w-full items-center justify-center bg-[#397A45] text-xs font-semibold">
                {firstName?.[0]?.toUpperCase() ?? "T"}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
