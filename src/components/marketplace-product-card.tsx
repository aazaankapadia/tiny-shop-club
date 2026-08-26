import Link from "next/link";
import { ProductPhoto } from "@/components/product-photo";
import { loginHref } from "@/lib/paths";
import { formatPrice, type Product } from "@/lib/products";

export function MarketplaceProductCard({
  product,
  signedIn,
  sellerName,
}: {
  product: Product;
  signedIn: boolean;
  sellerName?: string | null;
}) {
  const buyHref = signedIn
    ? `/products/${product.id}/buy`
    : loginHref(`/products/${product.id}/buy`);
  const favoriteHref = signedIn ? "/dashboard" : loginHref("/dashboard");

  return (
    <li className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_6px_18px_rgba(23,60,46,0.06)] ring-1 ring-[rgba(25,60,45,0.10)]">
      <div className="relative">
        <Link
          href={`/products/${product.id}`}
          className="relative block aspect-[4/3] overflow-hidden rounded-t-[22px]"
        >
          <ProductPhoto
            src={product.image_url}
            alt={product.title}
            sizes="(max-width: 640px) 50vw, 280px"
          />
        </Link>
        <Link
          href={favoriteHref}
          aria-label="Save for later after you sign in"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#397A45] shadow-sm ring-1 ring-[rgba(25,60,45,0.10)]"
        >
          <HeartIcon />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        {sellerName ? (
          <p className="text-xs font-medium text-[#5d7166]">{sellerName}</p>
        ) : null}
        <Link href={`/products/${product.id}`} className="mt-0.5">
          <p className="line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-snug text-[#173C2E]">
            {product.title}
          </p>
          <p className="mt-1 text-[15px] font-semibold text-[#173C2E]">
            {formatPrice(product.price_cents)}
          </p>
        </Link>
        <Link
          href={buyHref}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#397A45] px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <SmallCartIcon />
          Add to Cart
        </Link>
      </div>
    </li>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-9.2C5 8 6.8 6.4 9 6.4c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.6 4 4.4 0 4.8-7 9.2-7 9.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmallCartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.5L5 7Z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
