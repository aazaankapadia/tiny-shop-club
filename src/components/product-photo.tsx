import Image from "next/image";

type ProductPhotoProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
};

export function ProductPhoto({
  src,
  alt,
  className = "",
  sizes = "96px",
}: ProductPhotoProps) {
  if (!src) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-[#dceee4] font-display font-semibold text-accent ${className}`}
        aria-hidden
      >
        {alt.slice(0, 1).toUpperCase() || "•"}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes={sizes}
    />
  );
}
