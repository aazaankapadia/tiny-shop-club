export function ShopMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="16" width="28" height="18" rx="3" fill="#397A45" />
      <rect x="16" y="24" width="8" height="10" rx="1.5" fill="#f6efe2" />
      <rect x="9" y="20" width="6" height="5" rx="1" fill="#f4d27a" />
      <rect x="25" y="20" width="6" height="5" rx="1" fill="#f4d27a" />
      <path d="M5 17 20 7l15 10H5Z" fill="#F47A2A" />
      <path
        d="M8 16.2h4l1.2-4H9.2zm6 0h4l1.2-4h-4zm6 0h4l1.2-4h-4zm6 0h4l1.2-4h-4z"
        fill="#fff7e8"
      />
    </svg>
  );
}
