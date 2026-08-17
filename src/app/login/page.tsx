"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    setLoadingGoogle(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setLoadingGoogle(false);
    }
  }

  async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingEmail(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      setError(otpError.message);
      setLoadingEmail(false);
      return;
    }

    setMessage("Check your email for a sign-in link. You can close this page.");
    setLoadingEmail(false);
  }

  const busy = loadingGoogle || loadingEmail;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <Link
          href="/"
          className="font-display text-3xl tracking-tight text-foreground"
        >
          Little Store Club
        </Link>
        <p className="mt-2 text-muted">Sign in with your email to continue</p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={busy}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-md border border-foreground/15 bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          {loadingGoogle ? "Redirecting…" : "Continue with Google"}
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted">
          <div className="h-px flex-1 bg-foreground/10" />
          or
          <div className="h-px flex-1 bg-foreground/10" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
          <div>
            <label htmlFor="email" className="block text-sm text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-foreground/15 bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-accent px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingEmail ? "Sending link…" : "Email me a sign-in link"}
          </button>
        </form>

        <p className="mt-3 text-xs text-muted">
          Works with any email. We’ll create your account the first time.
        </p>

        {message ? (
          <p className="mt-4 text-sm text-accent" role="status">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}
