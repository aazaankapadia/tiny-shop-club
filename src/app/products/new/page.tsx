"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createProduct, type CreateProductState } from "../actions";

const initialState: CreateProductState = { error: null };

export default function NewProductPage() {
  const [state, formAction, pending] = useActionState(createProduct, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
      <Link href="/products" className="text-sm text-muted hover:text-foreground">
        ← Back to items
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
        List an item
      </h1>
      <p className="mt-2 text-muted">Add something for neighbors to browse.</p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <label htmlFor="photo" className="block text-sm text-muted">
            Photo
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setPreviewUrl(file ? URL.createObjectURL(file) : null);
            }}
            className="mt-1 w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
          />
          <p className="mt-1 text-xs text-muted">
            Optional. JPG, PNG, WEBP, or GIF · under 5 MB.
          </p>
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 h-40 w-full rounded-xl object-cover ring-1 ring-foreground/10"
            />
          ) : null}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm text-muted">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={80}
            className="mt-1 w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
            placeholder="Homemade cookies"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm text-muted">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={500}
            className="mt-1 w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
            placeholder="Freshly baked this morning."
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm text-muted">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
            placeholder="8.00"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm text-muted">
            Quantity available
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            required
            min="1"
            step="1"
            defaultValue={1}
            className="mt-1 w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
            placeholder="1"
          />
          <p className="mt-1 text-xs text-muted">
            How many you have. When it hits 0, the listing leaves the shop.
          </p>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm text-muted">
            Your address (where we pick it up)
          </label>
          <input
            id="location"
            name="location"
            required
            maxLength={120}
            className="mt-1 w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
            placeholder="123 Maple Ave"
          />
          <p className="mt-1 text-xs text-muted">
            Last step: we pick up from you, then deliver to the buyer&apos;s door.
          </p>
        </div>

        {state.error ? (
          <p className="text-sm text-red-700" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : "List item"}
        </button>
      </form>
    </main>
  );
}
