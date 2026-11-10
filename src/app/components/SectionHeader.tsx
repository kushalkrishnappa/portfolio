// Shared monumental-world section header: a mono eyebrow (accent index + label)
// over a hairline rule. Quiet and consistent, so section content leads.
export default function SectionHeader({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="mono flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]">
        <span style={{ color: "var(--accent)" }}>{index}</span>
        <span aria-hidden="true" style={{ color: "var(--faint)" }}>
          —
        </span>
        <span style={{ color: "var(--dim)" }}>{title}</span>
      </div>
      <div
        className="mt-4 h-px w-full"
        style={{ background: "var(--line)" }}
        aria-hidden="true"
      />
    </div>
  );
}
