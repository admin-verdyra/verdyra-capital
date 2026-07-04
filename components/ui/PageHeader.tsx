import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="rounded-[32px] bg-gradient-to-r from-[#0F5A3A] to-[#1D7C55] p-8 text-white shadow-xl">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-white/80">
            {subtitle}
          </p>
        </div>

        {children}

      </div>
    </div>
  );
}