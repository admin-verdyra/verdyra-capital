type Step = {
  title: string;
  status: "complete" | "active" | "pending";
};

type Props = {
  steps: Step[];
};

export default function Timeline({
  steps,
}: Props) {
  return (
    <div className="space-y-6">
      {steps.map((step) => (
        <div
          key={step.title}
          className="flex items-center gap-4"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
              step.status === "complete"
                ? "bg-emerald-500 text-white"
                : step.status === "active"
                ? "bg-amber-500 text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {step.status === "complete"
              ? "✓"
              : step.status === "active"
              ? "•"
              : ""}
          </div>

          <span className="font-medium">
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
}