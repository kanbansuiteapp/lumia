import Link from "next/link";

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="lumia-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b9bff" />
          <stop offset="1" stopColor="#6a4cff" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#lumia-g)" />
      <path d="M32 11c1.6 11.2 6.8 16.4 18 18-11.2 1.6-16.4 6.8-18 18-1.6-11.2-6.8-16.4-18-18 11.2-1.6 16.4-6.8 18-18z" fill="#fff" />
      <circle cx="48" cy="16" r="3.2" fill="#fff" opacity=".85" />
    </svg>
  );
}

export default function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="logo">
      <LogoMark />
      <span>Lumia</span>
    </Link>
  );
}
