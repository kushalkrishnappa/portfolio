import { Fragment, type ReactNode } from "react";

/** Render `**phrase**` as <b>phrase</b> (the key phrases that light up). */
export function rich(text: string): ReactNode {
  return text.split("**").map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>));
}
