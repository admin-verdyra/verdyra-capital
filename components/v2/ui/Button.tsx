import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  href,
  variant = "primary",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300";

  const styles =
    variant === "primary"
      ? "bg-[#0F5A3A] text-white hover:bg-[#0A472F]"
      : "border border-[#0F5A3A]/15 bg-white text-[#0F5A3A] hover:bg-[#F3F7F4]";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
