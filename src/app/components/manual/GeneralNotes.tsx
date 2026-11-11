import { rich } from "./rich";

/** Numbered general notes; `**phrase**` lights up as each note is reached. */
export default function GeneralNotes({ notes }: { notes: string[] }) {
  return (
    <div className="gnotes">
      <h3>General notes</h3>
      <ol>
        {notes.map((n, i) => (
          <li key={i}>{rich(n)}</li>
        ))}
      </ol>
    </div>
  );
}
