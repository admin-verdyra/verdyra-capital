interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={
        align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-3xl"
      }
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F5A3A]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#111111] lg:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 text-lg leading-8 text-slate-600">{description}</p>
      )}
    </div>
  );
}
