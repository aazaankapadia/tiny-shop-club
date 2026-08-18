# Little Store Club

Neighborhood marketplace — phase 1 is Google authentication only.

Production domain: [tinyshopclub.com](https://tinyshopclub.com) (connect later in Vercel).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase Auth (Google login)

## Local setup

1. Copy environment variables:

```bash
cp .env.local.example .env.local
```

2. Fill in your Supabase URL and publishable (anon) key in `.env.local`.

3. Install dependencies and run the app:

```bash
npm install
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Useful routes

- `/` — homepage + latest listings
- `/login` — Continue with Google
- `/auth/callback` — OAuth callback (handled automatically)
- `/dashboard` — account + your listings
- `/products` — browse all items
- `/products/new` — list an item (signed in)
- `/products/[id]` — item detail

## Phase 2 database setup

In Supabase → **SQL Editor**, run the contents of `supabase/products.sql`.

## Auth redirect URLs to configure

Use these when setting up Google + Supabase (local now, production later):

- Local: `http://localhost:3000/auth/callback`
- Production: `https://tinyshopclub.com/auth/callback`
- Optional www: `https://www.tinyshopclub.com/auth/callback`

## Put the site online (Vercel)

The site only works on your computer until you deploy it. Keep Stripe **test** keys for the first launch so nobody is charged real money.

### 1. Put the code on GitHub

1. Create a free account at [github.com](https://github.com) if you don’t have one.
2. Click **New repository**, name it `tiny-shop-club`, leave it **Private** if you want.
3. Do **not** add a README (this project already has one).
4. In Terminal, from this folder:

```bash
cd /Users/aazaankapadia/Work/tiny-shop-club
git init
git add .
git status
```

Confirm `.env.local` is **not** listed (secrets stay on your computer). Then commit and push — GitHub will show the exact commands after you create the repo.

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New → Project** and import `tiny-shop-club`.
3. Before clicking Deploy, add these **Environment Variables** (copy the values from your `.env.local` file — except the last one):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | same as `.env.local` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | same as `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | same as `.env.local` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | same as `.env.local` (test key is OK) |
| `STRIPE_SECRET_KEY` | same as `.env.local` (test key is OK) |
| `NEXT_PUBLIC_SITE_URL` | `https://tinyshopclub.com` |

4. Click **Deploy**. Wait until it says Ready.

### 3. Connect tinyshopclub.com

1. In Vercel: Project → **Settings → Domains**.
2. Add `tinyshopclub.com` and `www.tinyshopclub.com`.
3. Vercel will show DNS records (usually an **A** record and a **CNAME**).
4. Open the site where you bought the domain (GoDaddy, Namecheap, Google Domains, etc.) and paste those records.
5. Wait a few minutes, then visit `https://tinyshopclub.com`.

### 4. Allow production login (Supabase + Google)

**Supabase → Authentication → URL Configuration**

- Site URL: `https://tinyshopclub.com`
- Redirect URLs (keep localhost too):
  - `http://localhost:3000/auth/callback`
  - `https://tinyshopclub.com/auth/callback`
  - `https://www.tinyshopclub.com/auth/callback`

**Google Cloud → your OAuth client**

- Authorized JavaScript origins: add `https://tinyshopclub.com`
- Authorized redirect URIs: keep the existing Supabase callback  
  (`https://YOUR-PROJECT.supabase.co/auth/v1/callback`)

After DNS is live, try signing in on the real domain. Stripe can stay in test mode until you’re ready for real payments.

