import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function Button({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`rounded-full bg-[#0F5A3A] px-6 py-3 font-semibold text-white transition hover:bg-[#0B472F] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}