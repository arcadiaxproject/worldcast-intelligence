export default function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-300 backdrop-blur ${className}`}
    >
      {children}
    </span>
  );
}
