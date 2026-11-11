import { appendices, GENERAL_DATA_ID, sheets } from "@/data/manual";

interface Item {
  id: string;
  label: string;
  no: string;
}

function RailLink({ it, on }: { it: Item; on?: boolean }) {
  return (
    <a href={`#${it.id}`} data-go={it.id} className={on ? "on" : undefined}>
      <span className="lab">{it.label}</span>
      <span className="n">{it.no}</span>
      <span className="sq" />
    </a>
  );
}

/**
 * Right-edge sheet index (the chapter rail) with a scroll-progress line.
 * Order follows the manual: cover and its general-data band (grouped), sheets
 * 01–09, appendices A–C (grouped, set smaller under the numbered sheets),
 * sheet 10. `data-go` = target id.
 */
export default function SheetIndex() {
  const story = sheets.map((s) => ({ id: s.id, label: s.railLabel, no: s.no }));
  const close = story.pop()!;
  return (
    <nav className="rail" aria-label="Sheet index">
      <div className="rail-head">Sheet index</div>
      <div className="rail-line" />
      <div className="rail-prog" />
      <RailLink it={{ id: "cover", label: "Cover", no: "00" }} on />
      <div className="rail-grp rail-gd" role="group" aria-label="Cover data">
        <RailLink it={{ id: GENERAL_DATA_ID, label: "Data", no: "GD" }} />
      </div>
      {story.map((it) => (
        <RailLink key={it.id} it={it} />
      ))}
      <div className="rail-grp" role="group" aria-label="Appendices">
        {appendices.map((a) => (
          <RailLink key={a.id} it={{ id: a.id, label: a.railLabel, no: a.letter }} />
        ))}
      </div>
      <RailLink it={close} />
    </nav>
  );
}
