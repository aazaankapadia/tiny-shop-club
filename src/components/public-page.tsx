import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export function PublicPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="px-6 py-6">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-foreground"
          >
            Tiny Shop Club
          </Link>
          <Link href="/login" className="text-sm text-accent hover:underline">
            Sign in
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <div className="mt-6 space-y-4 text-muted">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
