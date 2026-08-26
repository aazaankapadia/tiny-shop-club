export function safeNextPath(
  value: string | null | undefined,
  fallback = "/dashboard",
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("://")
  ) {
    return fallback;
  }
  return value;
}

export function loginHref(next?: string) {
  if (!next) return "/login";
  return `/login?next=${encodeURIComponent(safeNextPath(next))}`;
}

export const PRODUCT_ID_PATH =
  /^\/products\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPublicPath(path: string) {
  if (
    path === "/" ||
    path === "/login" ||
    path === "/privacy" ||
    path === "/terms" ||
    path === "/safety" ||
    path === "/contact" ||
    path === "/robots.txt" ||
    path === "/sitemap.xml" ||
    path === "/products" ||
    path.startsWith("/auth/")
  ) {
    return true;
  }

  return PRODUCT_ID_PATH.test(path);
}
