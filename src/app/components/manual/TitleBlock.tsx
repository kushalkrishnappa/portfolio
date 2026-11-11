import CompanyMark from "./CompanyMark";
import { MANUAL_PROJECT, SHEET_TOTAL, type CompanyName, type TitleCell } from "@/data/manual";

interface TitleBlockProps {
  no: string;
  title: string;
  rev: string;
  cells: [TitleCell, TitleCell, TitleCell];
  client?: CompanyName;
  /** Label of the number cell ("Sheet"; "Appendix" on the appendices). */
  noLabel?: string;
  /** The "of" total after the number (sheets: /06; appendices: /C). */
  of?: string;
  className?: string;
}

/** The sheet's title block: project, sheet no., title, rev, drawn/date/scale. */
export default function TitleBlock({ no, title, rev, cells, client, noLabel = "Sheet", of = SHEET_TOTAL, className }: TitleBlockProps) {
  return (
    <div className={className ? `titleblock ${className}` : "titleblock"}>
      <div className="c proj">
        {client ? (
          <span className="has-client">
            Project
            <i className="tb-client">
              Client
              <CompanyMark name={client} size="tb" />
            </i>
          </span>
        ) : (
          <span>Project</span>
        )}
        <b>{MANUAL_PROJECT}</b>
      </div>
      <div className="c sh">
        <span>{noLabel}</span>
        <b>
          {no}
          <small>/{of}</small>
        </b>
      </div>
      <div className="c ttl">
        <span>Title</span>
        <b>{title}</b>
      </div>
      <div className="c rev">
        <span>Rev</span>
        <b>{rev}</b>
      </div>
      {cells.map((c) => (
        <div className="c" key={c.label}>
          <span>{c.label}</span>
          <b style={c.tight ? { letterSpacing: 0 } : undefined}>{c.value}</b>
        </div>
      ))}
    </div>
  );
}
