'use client';

import { ReactNode } from 'react';

interface HomepageLayoutProps {
  children: ReactNode;
}

export default function HomepageLayout({
  children,
}: HomepageLayoutProps) {
  return (
    <main className="bg-[#F8FAF9] text-[#111111] overflow-x-hidden">
      {children}
    </main>
  );
}