export type Product = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  location: string;
  price_cents: number;
  quantity: number;
  image_url: string | null;
  created_at: string;
};

export const PRODUCT_COLUMNS =
  "id, seller_id, title, description, location, price_cents, quantity, image_url, created_at";

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceCents / 100);
}

export function formatQuantity(quantity: number) {
  if (quantity <= 0) return "Sold out";
  if (quantity === 1) return "1 left";
  return `${quantity} left`;
}
