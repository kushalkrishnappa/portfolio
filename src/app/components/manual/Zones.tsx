/** Drafting-frame zone markers: 1–8 across, A–F down, with ticks. */
const COLS = 8;
const ROWS = 6;
const LETTERS = "ABCDEF";

export default function Zones() {
  const items = [];
  for (let i = 0; i < COLS; i++) {
    const x = (((i + 0.5) / COLS) * 100).toFixed(3) + "%";
    items.push(
      <span key={`zt${i}`} className="zt" style={{ left: x }}>{i + 1}</span>,
      <span key={`zb${i}`} className="zb" style={{ left: x }}>{i + 1}</span>,
    );
    if (i) {
      const xx = ((i / COLS) * 100).toFixed(3) + "%";
      items.push(<i key={`it${i}`} className="t" style={{ left: xx }} />, <i key={`ib${i}`} className="b" style={{ left: xx }} />);
    }
  }
  for (let j = 0; j < ROWS; j++) {
    const y = (((j + 0.5) / ROWS) * 100).toFixed(3) + "%";
    items.push(
      <span key={`zl${j}`} className="zl" style={{ top: y }}>{LETTERS[j]}</span>,
      <span key={`zr${j}`} className="zr" style={{ top: y }}>{LETTERS[j]}</span>,
    );
    if (j) {
      const yy = ((j / ROWS) * 100).toFixed(3) + "%";
      items.push(<i key={`il${j}`} className="l" style={{ top: yy }} />, <i key={`ir${j}`} className="r" style={{ top: yy }} />);
    }
  }
  return (
    <div className="zones" aria-hidden="true">
      {items}
    </div>
  );
}
