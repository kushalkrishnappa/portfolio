interface SpecTableProps {
  caption: string;
  rows: [string, string][];
}

/** A "Schedule" table: th label / td value rows under a mono caption. */
export default function SpecTable({ caption, rows }: SpecTableProps) {
  return (
    <table className="spec">
      <caption>{caption}</caption>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row">{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
