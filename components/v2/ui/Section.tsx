import { ReactNode } from "react";
import Container from "../layout/Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`py-24 lg:py-32 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
