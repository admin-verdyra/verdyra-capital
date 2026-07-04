import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <div className="inline-flex rounded-full border border-[#0F5A3A]/15 bg-[#F3F7F4] px-4 py-2 text-sm font-semibold text-[#0F5A3A]">
      {children}
    </div>
  );
}
