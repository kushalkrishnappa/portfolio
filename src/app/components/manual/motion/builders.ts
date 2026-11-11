/**
 * Scrubbed timelines for the ship-2 sheets (04 Release gate, 05 Tenant
 * isolation's keyed-entry overlay, 06 Signal, 07 Critical path, 08 Assembly
 * line) and the general-data count-up. They use the same vocabulary as the
 * v3 timelines in useFieldManual.ts (draw / fade / pop / callout / stamp /
 * travel), handed in as a Kit so both files share one set of helpers.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fmtStat } from "../GeneralData";
import type { DataStat } from "@/data/manual";

export type TL = gsap.core.Timeline;
export interface RouteLike {
  getTotalLength(): number;
  getPointAtLength(l: number): { x: number; y: number };
}
type Els = Element | Element[] | null | undefined;

export interface Kit {
  $: <T extends Element = HTMLElement>(s: string, r?: ParentNode) => T | null;
  $$: <T extends Element = HTMLElement>(s: string, r?: ParentNode) => T[];
  sheetEl: (id: string) => HTMLElement | null;
  mkTL: (sec: HTMLElement) => TL;
  draw: (tl: TL, input: Els, pos: number, dur?: number, stagger?: number, ease?: string) => void;
  fade: (tl: TL, els: Els, pos: number, dur?: number) => void;
  pop: (tl: TL, els: Element[] | null | undefined, pos: number, dur?: number) => void;
  callout: (tl: TL, g: Element | null, pos: number) => void;
  stamp: (tl: TL, g: Element | null, pos: number, frame?: Element | null) => void;
  travel: (tl: TL, route: RouteLike, mover: Element, pos: number, dur: number, ease?: string, noTrail?: boolean, p0?: number, p1?: number) => void;
  routeOf: (sel: string, r?: ParentNode) => SVGPathElement;
  lens: Map<RouteLike, number>;
  place: (m: Element, route: RouteLike, p: number) => void;
  VH: () => number;
}

/** A sig line drawn by its dash (`.sdraw`, pathLength 1). */
function sdraw(tl: TL, els: Els, pos: number, dur = 0.4, stagger = 0) {
  const a = Array.isArray(els) ? els : els ? [els] : [];
  if (a.length) tl.to(a, { strokeDashoffset: 0, duration: dur, stagger, ease: "power1.inOut" }, pos);
}
/** The note lights at `pos` (opacity → 1; the colour runtime adds `.lit`). */
const note = (tl: TL, li: Element | undefined, pos: number) => li && tl.to(li, { opacity: 1, duration: 0.4 }, pos);
const ring = (tl: TL, els: Element[], pos: number) =>
  els.length &&
  tl.fromTo(els, { scale: 1, opacity: 0.9, transformOrigin: "50% 50%" }, { scale: 2.6, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power2.out", immediateRender: false }, pos);

/** Fraction along `route` nearest to the point (x, y), by sampling. */
function nearestP(route: SVGPathElement, x: number, y: number) {
  const L = route.getTotalLength();
  let best = 0, bd = Infinity;
  for (let i = 0; i <= 400; i++) {
    const p = route.getPointAtLength((L * i) / 400);
    const d = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d < bd) { bd = d; best = i / 400; }
  }
  return best;
}

/* ---------- general data · the count-up ---------- */
export function buildBand(k: Kit) {
  const band = k.$("#gd");
  if (!band) return;
  const cs = k.$$<HTMLElement>(".gd-c", band);
  const set = (el: HTMLElement, v: number) => {
    const t = fmtStat(v, el.dataset.fmt as DataStat["fmt"]);
    if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) el.firstChild.nodeValue = t;
    else el.textContent = t;
  };
  cs.forEach((el) => set(el, Number(el.dataset.from)));
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    band.classList.add("counted");
    cs.forEach((el, i) => {
      const from = Number(el.dataset.from), to = Number(el.dataset.to), log = el.dataset.fmt === "mttr";
      const o = { p: 0 };
      gsap.to(o, {
        p: 1,
        duration: log ? 2.2 : 1.7,
        delay: 0.35 + i * 0.11,
        ease: log ? "power2.inOut" : "power3.out",
        onUpdate: () => set(el, log ? Math.exp(Math.log(from) + o.p * (Math.log(to) - Math.log(from))) : from + o.p * (to - from)),
      });
    });
  };
  ScrollTrigger.create({ start: () => k.VH() * 0.45, end: "max", onEnter: run, onEnterBack: run });
  return () => cs.forEach((el) => set(el, Number(el.dataset.to)));
}

/* ---------- sheet 04 · release gate ---------- */
export function buildGate(k: Kit) {
  const sec = k.sheetEl("s4");
  if (!sec) return;
  const svg = k.$(".dwg", sec)!, fr = k.$(".frame", sec), tl = k.mkTL(sec), q = (s: string) => k.$$(s, svg);
  const lis = k.$$(".gnotes li", sec), dot = k.$(".dot", svg)!;
  const ram = k.$(".ram", svg), b1 = k.$(".b1", svg), b2 = k.$(".b2", svg), crate = k.$(".crate-live", svg), ghost = k.$(".crate-ghost", svg);
  const pst = q(".pst"), lamps = q(".lamp"), rk = q(".rk2"), chks = q(".chk"), r4b = k.routeOf("#r4b", svg);
  k.fade(tl, q("svg > .lbl.fade, .from .fade"), 0, 0.4);
  k.draw(tl, q(".from .ink"), 0, 0.4);
  note(tl, lis[0], 0);
  k.draw(tl, q(".line .ink"), 0.1, 0.9, 0.06);
  k.draw(tl, q(".rollers .ink"), 0.4, 0.5, 0.015);
  k.fade(tl, q("svg > rect.fade"), 0.8, 0.5);
  k.draw(tl, q(".intake .ink"), 0.4, 0.8, 0.03);
  k.fade(tl, q(".intake .fade"), 0.9, 0.4);
  k.draw(tl, q(".crate-live .ink"), 0.7, 0.4);
  k.fade(tl, q(".crate-live .fade"), 0.9, 0.3);
  k.draw(tl, q(".press .ink, .ram .ink"), 1.0, 0.8, 0.05);
  k.fade(tl, q(".press .fade"), 1.4, 0.3);
  k.draw(tl, q(".gate .ink"), 1.2, 0.8, 0.03);
  k.fade(tl, q(".gate .fade"), 1.6, 0.3);
  k.draw(tl, q(".rack .ink"), 1.4, 0.8, 0.012);
  k.fade(tl, q(".rack .fade"), 1.8, 0.3);
  tl.to(k.$(".tagp", svg), { opacity: 1, duration: 0.3 }, 1.8);
  note(tl, lis[1], 1.5);
  chks.forEach((c, i) => tl.to(c, { opacity: 1, duration: 0.12 }, 1.9 + i * 0.2));
  // the old image comes off the line
  note(tl, lis[2], 2.8);
  tl.to(crate, { x: -18, y: 150, rotation: -10, opacity: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "power2.in" }, 2.8);
  tl.to(ghost, { opacity: 1, duration: 0.3 }, 3.3);
  k.callout(tl, k.$(".c-ret", svg), 3.4);
  // the dot reaches the press; three strokes: beta 1, beta 2, published
  k.travel(tl, k.routeOf("#r4a", svg), dot, 3.2, 1.0);
  const stroke = (t: number, st: number) => {
    tl.to(ram, { y: 100, duration: 0.22, ease: "power3.in" }, t);
    tl.to(ram, { y: 0, duration: 0.32, ease: "power2.out" }, t + 0.24);
    if (fr) {
      tl.to(fr, { y: 2, duration: 0.03 }, t + 0.2);
      tl.to(fr, { y: 0, duration: 0.14, ease: "power2.out" }, t + 0.23);
    }
    if (st > 0) {
      tl.set(pst[st - 1], { opacity: 0 }, t + 0.22);
      tl.set(pst[st], { opacity: 1 }, t + 0.22);
    }
  };
  stroke(4.2, 0);
  tl.to(b1, { opacity: 1, duration: 0.05 }, 4.42);
  k.draw(tl, q(".b1 .ink"), 4.42, 0.08);
  k.fade(tl, q(".b1 .fade"), 4.44, 0.1);
  k.callout(tl, k.$(".c-one", svg), 4.5);
  stroke(4.9, 1);
  stroke(5.6, 2);
  // through the gate: every lamp in the corpus lights
  note(tl, lis[3], 6.2);
  tl.to(b1, { x: 220, duration: 0.9, ease: "power1.inOut" }, 6.3);
  k.travel(tl, r4b, dot, 6.3, 0.9, "power1.inOut", false, 0, 220 / 390);
  lamps.forEach((l, i) => tl.to(l, { opacity: 1, duration: 0.08 }, 7.0 + i * 0.08));
  k.stamp(tl, k.$(".st-gate", svg), 7.8, fr);
  k.callout(tl, k.$(".c-gate", svg), 8.1);
  // into the fleet
  tl.to(b1, { x: 390, duration: 0.8, ease: "power1.inOut" }, 8.5);
  k.travel(tl, r4b, dot, 8.5, 0.8, "power1.inOut", false, 220 / 390, 1);
  tl.to(b1, { opacity: 0, duration: 0.25 }, 9.3);
  rk.forEach((r, i) => tl.to(r, { opacity: 1, duration: 0.1 }, 9.25 + i * 0.035));
  tl.fromTo(k.$(".dim4", svg), { opacity: 0, scaleY: 0, transformOrigin: "50% 50%" }, { opacity: 1, scaleY: 1, duration: 0.5, ease: "power2.out" }, 9.4);
  note(tl, lis[4], 9.6);
  // the next image: same gate, same lamps
  stroke(10.0, -1);
  tl.to(b2, { opacity: 1, duration: 0.05 }, 10.22);
  tl.to(lamps, { opacity: 0.2, duration: 0.1 }, 10.6);
  tl.to(b2, { x: 220, duration: 0.8, ease: "power1.inOut" }, 10.5);
  lamps.forEach((l, i) => tl.to(l, { opacity: 1, duration: 0.06 }, 11.2 + i * 0.06));
  k.stamp(tl, k.$(".st-vp", svg), 11.9, fr);
  k.draw(tl, q(".to .ink"), 12.1, 0.4);
  k.fade(tl, q(".to .fade"), 12.2);
  k.travel(tl, k.routeOf("#r4c", svg), dot, 12.3, 0.6);
  tl.to({}, { duration: 0.5 }, 12.9);
}

/* ---------- sheet 05 · tenant isolation (keyed entry) ---------- */
export function buildTenant(k: Kit) {
  const sec = k.sheetEl("s5");
  if (!sec) return;
  const svg = k.$(".dwg", sec)!, fr = k.$(".frame", sec), vel = k.$(".vellum", sec)!, vs = k.$("svg", vel)!, tl = k.mkTL(sec);
  const q = (s: string) => k.$$(s, svg), v = (s: string) => k.$$(s, vs);
  const lis = k.$$(".gnotes li", sec), dot = k.$(".dot", svg)!;
  tl.fromTo(vel, { xPercent: 118, rotation: 4, transformOrigin: "0% 100%" }, { xPercent: 118, rotation: 4, duration: 0.01 }, 0);
  k.fade(tl, q("svg > .lbl.fade, .from .fade, .to .fade"), 0, 0.4);
  k.draw(tl, q(".from .ink, .to .ink, .regs .ink"), 0, 0.5, 0.03);
  note(tl, lis[0], 0);
  k.draw(tl, q("#walls .ink"), 0.1, 0.9, 0.05);
  k.fade(tl, q("#walls .fade"), 0.9, 0.6);
  k.draw(tl, q("#doors .ink"), 1.4, 0.6, 0.06);
  k.draw(tl, q("#dets .ink"), 1.7, 0.6, 0.04);
  k.draw(tl, q(".ink.bus"), 1.1, 0.9);
  k.fade(tl, q("#dets .fade"), 2.0, 0.5);
  // the vellum: keyed entry
  tl.to(vel, { xPercent: 0, rotation: 0, duration: 1.0, ease: "power2.out" }, 2.4);
  k.draw(tl, v(".regs .ink"), 3.3, 0.4);
  k.fade(tl, v("svg > .lbl.fade"), 3.3, 0.4);
  k.draw(tl, v(".kpath .ink"), 3.5, 0.9, 0.02);
  k.fade(tl, v(".kpath .fade"), 3.9, 0.5);
  note(tl, lis[1], 3.6);
  const kd = k.$(".kd", vs);
  if (kd) {
    tl.fromTo(kd, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 4.5);
    k.travel(tl, k.routeOf("#rk", vs), kd, 4.5, 1.4, "power1.inOut", true);
  }
  note(tl, lis[2], 4.6);
  note(tl, lis[3], 5.3);
  k.fade(tl, v(".url .fade"), 5.6, 0.4);
  tl.fromTo(k.$(".ustrike", vs), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.3 }, 5.9);
  k.callout(tl, k.$(".c-door", vs), 6.1);
  // the request enters only its own room
  k.travel(tl, k.routeOf("#r5a", svg), dot, 6.3, 1.4);
  ring(tl, q(".ring-o"), 7.7);
  note(tl, lis[4], 7.6);
  k.draw(tl, v(".locks .ink"), 7.9, 0.4, 0.04);
  // a forged URL tries another tenant's door
  const ghost = k.$(".ghost", vs)!;
  const ghostRoute: RouteLike = {
    getTotalLength: () => 466,
    getPointAtLength: (l: number) => (l < 412 ? { x: 18 + l, y: 270 } : { x: 430, y: 270 + (l - 412) }),
  };
  k.lens.set(ghostRoute, 466);
  tl.fromTo(ghost, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 8.3);
  k.travel(tl, ghostRoute, ghost, 8.3, 0.9, "power2.out", true);
  k.pop(tl, v(".skip"), 9.2);
  tl.to(ghost, { opacity: 0.25, duration: 0.3 }, 9.3);
  k.stamp(tl, k.$(".st5k", vs), 9.5, fr);
  k.draw(tl, v(".mcp .ink"), 9.8, 0.5);
  k.fade(tl, v(".mcp .fade"), 10.0, 0.3);
  k.pop(tl, v(".mcp .hand"), 10.1);
  note(tl, lis[5], 10.0);
  note(tl, lis[6], 10.4);
  k.travel(tl, k.routeOf("#r5b", svg), dot, 10.6, 0.9);
  tl.to({}, { duration: 0.4 }, 11.5);
  k.place(ghost, k.routeOf("#r5a", svg), 0);
  if (kd) k.place(kd, k.routeOf("#rk", vs), 0);
}

/* ---------- sheet 06 · signal, not noise ---------- */
export function buildSignal(k: Kit) {
  const sec = k.sheetEl("s6");
  if (!sec) return;
  const svg = k.$(".dwg", sec)!, fr = k.$(".frame", sec), tl = k.mkTL(sec), q = (s: string) => k.$$(s, svg);
  const lis = k.$$(".gnotes li", sec), dot = k.$(".dot", svg)!;
  k.fade(tl, q("svg > .lbl.fade, .from .fade"), 0, 0.4);
  k.draw(tl, q(".from .ink"), 0, 0.4);
  note(tl, lis[0], 0);
  k.draw(tl, q(".dets .ink"), 0.1, 0.8, 0.04);
  k.fade(tl, q(".dets .fade"), 0.5, 0.5);
  k.draw(tl, q(".pipes .ink"), 0.7, 0.6, 0.08);
  k.draw(tl, q(".worker .ink"), 1.0, 0.6, 0.05);
  k.fade(tl, q(".worker .fade"), 1.3, 0.4);
  k.draw(tl, q(".main .ink, .gauge6 .ink"), 1.3, 0.7, 0.05);
  k.fade(tl, q(".main .fade, .gauge6 .fade"), 1.6, 0.4);
  k.draw(tl, q(".bell .ink"), 1.6, 0.5, 0.05);
  k.fade(tl, q(".bell .fade"), 1.9, 0.3);
  k.travel(tl, k.routeOf("#r6a", svg), dot, 1.9, 1.0);
  note(tl, lis[1], 2.4);
  // DETAIL A · cold start: a flood hits the baseline and becomes one row
  k.fade(tl, q(".detA .fade"), 2.9, 0.4);
  k.draw(tl, q(".detA .ink"), 2.9, 0.6, 0.05);
  const fl = q(".fl");
  tl.fromTo(fl, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.025, ease: "power2.out" }, 3.1);
  tl.to(fl, { opacity: 0, x: 26, duration: 0.3, stagger: 0.01, ease: "power2.in" }, 3.8);
  k.callout(tl, k.$(".c-flood", svg), 4.0);
  note(tl, lis[2], 3.9);
  // a tick: the watermark rises atomically, the cap defers the overflow
  const lvl = k.$("#wm-lvl", svg), qs = q(".q"), defer = k.$(".defer", svg);
  gsap.set(lvl, { scaleY: 0, transformOrigin: "50% 100%" });
  k.travel(tl, k.routeOf("#r6b", svg), dot, 4.3, 1.9);
  k.pop(tl, qs, 4.4, 0.25);
  [0.34, 0.67, 1].forEach((s, i) => tl.to(lvl, { scaleY: s, duration: 0.12, ease: "power2.out" }, 4.8 + i * 0.6));
  tl.to(qs.slice(0, 2), { x: 260, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power1.in" }, 4.9);
  if (defer) tl.to(defer, { opacity: 1, duration: 0.2 }, 5.1);
  tl.to(qs[2], { x: 260, opacity: 0, duration: 0.5, ease: "power1.in" }, 5.9);
  if (defer) tl.to(defer, { opacity: 0.35, duration: 0.3 }, 6.3);
  // the bell rings once
  ring(tl, q(".ring-o"), 6.2);
  k.pop(tl, q(".badge"), 6.25);
  k.stamp(tl, k.$(".st-once", svg), 6.5, fr);
  // DETAIL B · tracker ≠ feed: retention prunes the feed, the tracker keeps dedup
  note(tl, lis[3], 6.9);
  k.fade(tl, q(".detB .fade"), 6.9, 0.4);
  k.draw(tl, q(".detB .ink"), 6.9, 0.6, 0.04);
  k.pop(tl, q(".fi"), 7.2, 0.25);
  tl.to(q(".fi.pr"), { opacity: 0.16, x: 10, duration: 0.3, stagger: 0.08 }, 7.8);
  k.callout(tl, k.$(".c-dedup", svg), 8.0);
  // DETAIL C · an escalation re-surfaces past a dismissal
  k.fade(tl, q(".detC .fade"), 8.4, 0.4);
  k.draw(tl, q(".detC .ink"), 8.4, 0.5);
  tl.fromTo(k.$(".strike", svg), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.3 }, 8.8);
  k.pop(tl, q(".crit"), 9.1);
  k.callout(tl, k.$(".c-merge", svg), 9.3);
  note(tl, lis[4], 9.4);
  k.callout(tl, k.$(".m-a", svg), 9.7);
  k.callout(tl, k.$(".m-b", svg), 9.9);
  note(tl, lis[5], 10.1);
  k.stamp(tl, k.$(".st-demo", svg), 10.3, fr);
  k.draw(tl, q(".to .ink"), 10.6, 0.4);
  k.fade(tl, q(".to .fade"), 10.7);
  k.travel(tl, k.routeOf("#r6c", svg), dot, 10.8, 0.6);
  tl.to({}, { duration: 0.4 }, 11.4);
}

/* ---------- sheet 07 · critical path ---------- */
export function buildCritical(k: Kit) {
  const sec = k.sheetEl("s7");
  if (!sec) return;
  const svg = k.$(".dwg", sec)!, fr = k.$(".frame", sec), tl = k.mkTL(sec), q = (s: string) => k.$$(s, svg);
  const lis = k.$$(".gnotes li", sec), dot = k.$(".dot", svg)!;
  k.fade(tl, q("svg > .lbl.fade, .from .fade"), 0, 0.4);
  k.draw(tl, q(".from .ink"), 0, 0.4);
  note(tl, lis[0], 0);
  k.draw(tl, q(".axis .ink"), 0.1, 0.7, 0.1);
  k.fade(tl, q(".axis .fade"), 0.5, 0.5);
  k.fade(tl, q(".lanes .fade"), 0.6, 0.4);
  k.draw(tl, q(".lanes .ink"), 0.6, 0.5, 0.04);
  k.draw(tl, q(".cpath .ink"), 1.0, 0.6, 0.1);
  k.fade(tl, q(".cpath .fade"), 1.3, 0.4);
  k.travel(tl, k.routeOf("#r7a", svg), dot, 1.4, 1.0);
  // the days run; each PR lands as the dot passes its start
  const T0 = 2.5, D = 6.0;
  k.travel(tl, k.routeOf("#r7b", svg), dot, T0, D, "none");
  q(".bar").forEach((b) => {
    const d = Number((b as HTMLElement).dataset.d || 0);
    const at = T0 + (D * d) / 21;
    const o = k.$(".bar-o", b), f = k.$(".bar-f", b);
    const w = Number(o?.getAttribute("width") || 20);
    tl.fromTo(o, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: Math.max(0.15, (D * w) / 560), ease: "none" }, at);
    tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: 0.12 }, at + Math.max(0.15, (D * w) / 560));
  });
  note(tl, lis[1], 3.6);
  note(tl, lis[2], 5.4);
  note(tl, lis[3], 6.6);
  // launch day
  tl.fromTo(k.$(".launch", svg), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, T0 + D);
  k.stamp(tl, k.$(".st-sched", svg), T0 + D + 0.3, fr);
  note(tl, lis[4], T0 + D + 0.3);
  k.callout(tl, k.$(".m7", svg), T0 + D + 0.5);
  k.callout(tl, k.$(".c-thanks", svg), T0 + D + 0.8);
  tl.fromTo(q(".pl"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.3, stagger: 0.12 }, T0 + D + 1.0);
  k.fade(tl, q(".post .fade"), T0 + D + 1.0, 0.3);
  k.draw(tl, q(".detG .ink"), T0 + D + 1.2, 0.8, 0.05);
  k.fade(tl, q(".detG .fade"), T0 + D + 1.5, 0.4);
  k.draw(tl, q(".to .ink"), T0 + D + 2.0, 0.4);
  k.fade(tl, q(".to .fade"), T0 + D + 2.1);
  k.travel(tl, k.routeOf("#r7c", svg), dot, T0 + D + 2.2, 0.5);
  tl.to({}, { duration: 0.4 }, T0 + D + 2.7);
}

/* ---------- sheet 08 · assembly line ---------- */
export function buildAssembly(k: Kit) {
  const sec = k.sheetEl("s8");
  if (!sec) return;
  const svg = k.$(".dwg", sec)!, fr = k.$(".frame", sec), tl = k.mkTL(sec), q = (s: string) => k.$$(s, svg);
  const lis = k.$$(".gnotes li", sec), dot = k.$(".dot", svg)!, track = k.routeOf("#r8a", svg);
  k.fade(tl, q("svg > .lbl.fade, .from .fade"), 0, 0.4);
  k.draw(tl, q(".from .ink"), 0, 0.4);
  note(tl, lis[0], 0);
  k.draw(tl, q(".rails .ink"), 0.1, 1.0, 0.15);
  k.fade(tl, q(".rails .fade"), 0.6, 0.4);
  k.draw(tl, q(".stations .ink"), 0.5, 0.7, 0.06);
  k.fade(tl, q(".stations .fade"), 0.9, 0.5);
  k.draw(tl, q(".gates .ink"), 1.1, 0.5, 0.03);
  k.fade(tl, q(".gates .fade"), 1.3, 0.3);
  k.draw(tl, q(".dock .ink"), 1.3, 0.4);
  k.fade(tl, q(".dock .fade"), 1.5, 0.3);
  // one feature rides the line; each gate lamp lights as a human approves
  const T0 = 1.8, D = 7.4;
  k.travel(tl, track, dot, T0, D, "none");
  q(".gl").forEach((l) => {
    const cx = Number(l.getAttribute("cx")), cy = Number(l.getAttribute("cy"));
    tl.to(l, { opacity: 1, duration: 0.1 }, T0 + D * nearestP(track, cx, cy + (cy < 200 ? 25 : cy > 320 ? 0 : 25)));
  });
  note(tl, lis[1], 2.4);
  // the floor: drift validator, descope rule
  k.draw(tl, q(".floor .ink"), 2.8, 0.6, 0.03);
  k.fade(tl, q(".floor .fade"), 3.0, 0.4);
  const needle = k.$(".needle", svg), dial = k.$(".dial", svg);
  gsap.set(needle, { rotation: -40, svgOrigin: "226 222" });
  gsap.set(dial, { rotation: -150, svgOrigin: "500 204" });
  tl.to(needle, { opacity: 1, duration: 0.1 }, 3.1);
  tl.to(needle, { rotation: 66, svgOrigin: "226 222", duration: 0.5, ease: "power2.inOut" }, 3.3);
  tl.to(needle, { rotation: 0, svgOrigin: "226 222", duration: 0.6, ease: "back.out(2)" }, 3.9);
  note(tl, lis[2], 3.4);
  k.callout(tl, k.$(".c-cost", svg), 4.4);
  note(tl, lis[3], 4.5);
  // the autonomy dial turns as the feature reaches IMPLEMENT: an autonomous loop → an interactive arbiter
  tl.to(dial, { opacity: 1, duration: 0.1 }, 6.6);
  tl.fromTo(k.$(".strike8", svg), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.3 }, 6.9);
  tl.to(dial, { rotation: 0, svgOrigin: "500 204", duration: 0.6, ease: "back.out(1.6)" }, 7.0);
  k.callout(tl, k.$(".c-auto", svg), 7.3);
  note(tl, lis[4], 7.1);
  // the incident: a part for a machine that was off → reject → a probe on research
  k.draw(tl, q(".reject .ink"), 7.5, 0.4);
  k.fade(tl, q(".reject .fade"), 7.7, 0.3);
  const part = k.$(".part", svg);
  gsap.set(part, { y: -70, opacity: 0 });
  tl.to(part, { opacity: 1, duration: 0.05 }, 7.8);
  tl.to(part, { y: 0, duration: 0.35, ease: "power2.in" }, 7.8);
  k.draw(tl, q(".probe .ink"), 8.3, 0.4);
  k.fade(tl, q(".probe .fade"), 8.5, 0.3);
  note(tl, lis[5], 8.4);
  // the dock
  k.callout(tl, k.$(".m8", svg), T0 + D);
  k.stamp(tl, k.$(".st-gated", svg), T0 + D + 0.3, fr);
  k.draw(tl, q(".to .ink"), T0 + D + 0.4, 0.4);
  k.fade(tl, q(".to .fade"), T0 + D + 0.5);
  k.travel(tl, k.routeOf("#r8b", svg), dot, T0 + D + 0.6, 0.5);
  tl.to({}, { duration: 0.4 }, T0 + D + 1.1);
}

export { sdraw };
