import { Fragment } from "react";
import { fleetFacts } from "@/data/manual";

/** Sheet 02's fact cards: a masked track scrolled one card at a time. */
export default function FactPanel() {
  return (
    <div className="fcards">
      <div className="fc-track">
        {fleetFacts.map((f, i) => (
          <article key={f.n} className={i === 0 ? "fc on" : "fc"}>
            <span className="fc-n">{f.n}</span>
            <h4>
              {f.title.map((line, j) => (
                <Fragment key={j}>
                  {j > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h4>
            <p>{f.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
