"use client";

import { ReactNode } from "react";

interface StickySectionProps {
  children: ReactNode;
  background?: string;
  className?: string;
}

export default function StickySection({
  children,
  background = "#ffffff",
  className = "",
}: StickySectionProps) {
  return (
    <section
      className={`relative sticky top-0 min-h-screen overflow-hidden rounded-t-[32px] ${className}`}
      style={{
        background,
        zIndex: 1,
      }}
    >
      {children}
    </section>
  );
}
