import type { Metadata } from "next";
import { Literata } from "next/font/google";
import "./notes.css";

const notes = Literata({
  variable: "--font-notes",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    absolute: "Class Notes",
  },
  description: "Shared class notes and study outlines for students.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotesLayout({ children }: LayoutProps<"/notes">) {
  return (
    <div className={`${notes.variable} notes-root flex min-h-full flex-1 flex-col`}>
      {children}
    </div>
  );
}
