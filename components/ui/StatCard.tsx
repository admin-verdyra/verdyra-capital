import Card from "./Card";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <Card className="h-full">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-[#111111]">
        {value}
      </h2>

      {subtitle && (
        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </Card>
  );
}