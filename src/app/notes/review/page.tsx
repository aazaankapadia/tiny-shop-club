import type { Metadata } from "next";
import { PracticeBrowser } from "@/components/notes/practice-browser";

export const metadata: Metadata = {
  title: {
    absolute: "Practice Tools — Class Notes",
  },
  description: "Optional practice drills and review activities.",
};

export default function PracticePage() {
  return <PracticeBrowser />;
}
