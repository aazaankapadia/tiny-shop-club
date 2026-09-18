import Link from "next/link";
import { notFound } from "next/navigation";
import { CLASS_NOTES, getClassNote } from "@/lib/class-notes-data";

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return CLASS_NOTES.map((note) => ({ id: note.id }));
}

export async function generateMetadata({ params }: NotePageProps) {
  const { id } = await params;
  const note = getClassNote(id);
  return {
    title: {
      absolute: note ? `${note.title} — Class Notes` : "Class Notes",
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const note = getClassNote(id);
  if (!note) notFound();

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-8 pb-20">
      <Link
        href="/notes"
        className="text-sm font-semibold text-[var(--notes-muted)] no-underline hover:text-[var(--notes-ink)]"
      >
        ← Class Notes
      </Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--notes-accent)]">
        {note.subject} · {note.week}
      </p>
      <h1 className="notes-serif mt-2 text-4xl font-bold tracking-tight">
        {note.title}
      </h1>
      <p className="mt-3 text-[var(--notes-muted)]">{note.summary}</p>
      <div className="mt-8 space-y-4 text-[17px] leading-7">
        {note.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <a
        href="https://games6741.netlify.app/review.html"
        className="mt-10 inline-flex text-sm font-semibold text-[var(--notes-accent)] hover:underline"
      >
        Practice
      </a>
    </div>
  );
}
