import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Tiny Shop Club, a parent-supervised educational marketplace for kids. Google and email sign-in are available, including Family Link accounts.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
