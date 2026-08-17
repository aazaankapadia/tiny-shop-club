export type Profile = {
  id: string;
  delivery_address: string;
  updated_at: string;
};

export type Order = {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  delivery_address: string;
  status: "pending_payment" | "paid" | "delivered" | "cancelled";
  created_at: string;
  stripe_session_id?: string | null;
  quantity: number;
  archived_at?: string | null;
};

export function orderStatusLabel(status: string) {
  switch (status) {
    case "pending_payment":
      return "Incomplete — payment not finished";
    case "paid":
      return "Payment received — not delivered yet";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}
