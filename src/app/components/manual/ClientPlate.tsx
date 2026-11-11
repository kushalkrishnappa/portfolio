import CompanyMark from "./CompanyMark";
import type { MarkName } from "@/data/manual";

/**
 * Caption set beside the chip (text, not a wordmark) where the mark alone is a
 * glyph. Given as explicit lines so it never breaks at a hyphen; each line is
 * set nowrap and the block is centred on the chip.
 */
const CAPTIONS: Partial<Record<MarkName, string[]>> = {
  mercedes: ["Mercedes-Benz", "R&D India"],
};

interface ClientPlateProps {
  client: MarkName;
  plate: string;
  /** Plate label role; "Client" on the story sheets, "School" in Appendix B. */
  role?: string;
}

/**
 * CLIENT PLATE — a drafting nameplate in the sheet header. The official logo
 * sits on its own native-colour chip (CompanyMark); the Field Manual furniture
 * stays OUTSIDE the chip: the hairline frame (it draws itself on arrival and
 * carries a slow Heat comet via the shared `.flow` runtime), the --sig corner
 * registration ticks, the mono plate label on the frame line, and any caption.
 * Nothing orange or yellow ever touches the chip.
 */
export default function ClientPlate({ client, plate, role = "Client" }: ClientPlateProps) {
  const caption = CAPTIONS[client];
  return (
    <div className={`plate p-${client}`}>
      <svg className="plate-svg" aria-hidden="true" focusable="false">
        <rect className="ink pf" x="0" y="0" width="100%" height="100%" pathLength={1} />
      </svg>
      <i className="tick tl" aria-hidden="true" />
      <i className="tick tr" aria-hidden="true" />
      <i className="tick bl" aria-hidden="true" />
      <i className="tick br" aria-hidden="true" />
      <span className="plate-lbl">{`${role} · Plate ${plate}`}</span>
      <span className="plate-body">
        <CompanyMark name={client} size="plate" />
        {caption && (
          <span className="plate-cap">
            {caption.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        )}
      </span>
    </div>
  );
}
