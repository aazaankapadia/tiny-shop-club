"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { placeOrder, type PlaceOrderState } from "../../buy-actions";
import { formatPrice } from "@/lib/products";

type BuyFormProps = {
  productId: string;
  productTitle: string;
  priceCents: number;
  availableQuantity: number;
  imageUrl: string | null;
  savedAddress: string;
};

const initialState: PlaceOrderState = { error: null };

export function BuyForm({
  productId,
  productTitle,
  priceCents,
  availableQuantity,
  imageUrl,
  savedAddress,
}: BuyFormProps) {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const [editingAddress, setEditingAddress] = useState(!savedAddress);
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
      <Link
        href={`/products/${productId}`}
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to item
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
        Checkout
      </h1>
      <p className="mt-2 text-muted">
        Ordering <span className="text-foreground">{productTitle}</span> for{" "}
        {formatPrice(priceCents)} each.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="productId" value={productId} />

        <div className="flex gap-4 rounded-xl bg-surface p-4 ring-1 ring-foreground/10">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={productTitle}
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
          ) : null}
          <div>
            <p className="text-sm text-muted">Item</p>
            <p className="mt-1 font-medium text-foreground">{productTitle}</p>
            <p className="mt-1 text-muted">
              {formatPrice(priceCents)} · {availableQuantity} left
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm text-muted">
            Quantity to buy
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            required
            min={1}
            max={availableQuantity}
            value={quantity}
            onChange={(event) =>
              setQuantity(Number.parseInt(event.target.value || "1", 10))
            }
            className="mt-1 w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
          <p className="mt-1 text-xs text-muted">
            Total: {formatPrice(priceCents * Math.max(1, quantity || 1))}
          </p>
        </div>

        {savedAddress && !editingAddress ? (
          <div className="rounded-xl bg-surface p-4 ring-1 ring-foreground/10">
            <p className="text-sm text-muted">Last step · delivery address</p>
            <p className="mt-1 whitespace-pre-wrap text-foreground">
              {savedAddress}
            </p>
            <input type="hidden" name="deliveryAddress" value={savedAddress} />
            <input type="hidden" name="saveAddress" value="on" />
            <button
              type="button"
              onClick={() => setEditingAddress(true)}
              className="mt-3 text-sm text-accent hover:underline"
            >
              Use a different address
            </button>
          </div>
        ) : (
          <div>
            <label htmlFor="deliveryAddress" className="block text-sm text-muted">
              Last step · your delivery address
            </label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              required
              rows={3}
              maxLength={240}
              defaultValue={savedAddress}
              className="mt-1 w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
              placeholder={"123 Maple Ave\nApartment 2B\nYour City, ST 12345"}
            />
            <label className="mt-3 flex items-start gap-2 text-sm text-muted">
              <input
                type="checkbox"
                name="saveAddress"
                defaultChecked
                className="mt-1"
              />
              <span>Save this address for next time</span>
            </label>
            {savedAddress ? (
              <button
                type="button"
                onClick={() => setEditingAddress(false)}
                className="mt-2 text-sm text-accent hover:underline"
              >
                Cancel and keep saved address
              </button>
            ) : null}
          </div>
        )}

        {state.error ? (
          <p className="text-sm text-red-700" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || availableQuantity < 1}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Redirecting to Stripe…" : "Pay with Stripe"}
        </button>
      </form>
    </main>
  );
}
