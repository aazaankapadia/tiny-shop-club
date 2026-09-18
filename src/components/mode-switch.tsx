import Link from "next/link";

export function ModeSwitch({
  mode,
  sellHref,
  tone = "light",
}: {
  mode: "buy" | "sell";
  sellHref: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const rest = dark
    ? "text-white/70 hover:text-white"
    : "text-[#5d7166] hover:text-[#173C2E]";
  const wrap = dark
    ? "bg-white/10 ring-1 ring-white/15"
    : "bg-white/80 ring-1 ring-[rgba(25,60,45,0.08)]";

  return (
    <div
      className={`inline-flex rounded-full p-0.5 text-[11px] font-medium ${wrap}`}
      aria-label="Switch between shopping and selling"
    >
      <Link
        href="/"
        className={`rounded-full px-2.5 py-1 transition ${
          mode === "buy" ? "bg-[#397A45] text-white" : rest
        }`}
        aria-current={mode === "buy" ? "page" : undefined}
      >
        Shop
      </Link>
      <Link
        href={sellHref}
        className={`rounded-full px-2.5 py-1 transition ${
          mode === "sell" ? "bg-[#F47A2A] text-white" : rest
        }`}
        aria-current={mode === "sell" ? "page" : undefined}
      >
        Sell
      </Link>
    </div>
  );
}
