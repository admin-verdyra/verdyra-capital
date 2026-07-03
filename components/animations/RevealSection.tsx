'use client';

import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
}

export default function RevealSection({
  children,
  className = '',
}: RevealSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set(sectionRef.current, {
      opacity: 0,
      y: 60,
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(sectionRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
          });

          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}