type Props = {
  status: "success" | "warning" | "pending" | "error";
  text: string;
};

export default function StatusBadge({
  status,
  text,
}: Props) {
  const styles = {
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    pending: "bg-blue-100 text-blue-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${styles[status]}`}
    >
      {text}
    </span>
  );
}