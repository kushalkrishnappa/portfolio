import { sheets } from "@/data/manual";

/** Right-edge sheet index (the chapter rail) with a scroll-progress line. */
export default function SheetIndex() {
  const items = [{ go: 0, label: "Cover", no: "00", href: "#top" }].concat(
    sheets.map((s, i) => ({ go: i + 1, label: s.railLabel, no: s.no, href: `#${s.id}` })),
  );
  return (
    <nav className="rail" aria-label="Sheet index">
      <div className="rail-head">Sheet index</div>
      <div className="rail-line" />
      <div className="rail-prog" />
      {items.map((it) => (
        <a key={it.no} href={it.href} data-go={it.go} className={it.go === 0 ? "on" : undefined}>
          <span className="lab">{it.label}</span>
          <span className="n">{it.no}</span>
          <span className="sq" />
        </a>
      ))}
    </nav>
  );
}
