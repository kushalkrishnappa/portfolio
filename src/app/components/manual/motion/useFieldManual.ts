"use client";

/**
 * useFieldManual — the Field Manual's motion, ported from the approved v3
 * reference (docs/superpowers/specs/assets/field-manual-v3.html).
 *
 *  - Lenis smooth scroll on the GSAP ticker, wired to ScrollTrigger.
 *  - The cover intro + lift, sheet-over-sheet entries, and one scrubbed
 *    timeline per sheet (draw / fade / pop / callout / stamp / travel).
 *  - The colour runtime: flow comets on drawn lines, lit notes, title sweeps.
 *  - The general-data band (an unpinned leaf under the cover, before 01) and
 *    the appendices (unpinned leaves between 09 and 10): they stack like
 *    sheets (slide over, stick at their end, get slid over), their rows
 *    draw in as they scroll into view, and they take part in the rail, the
 *    title sweep and the sheet-over-sheet entries.
 *  - prefers-reduced-motion: no Lenis, no timelines — every sheet is laid out
 *    statically, fully drawn (the `html:not(.motion)` CSS path).
 *
 * Everything runs inside one gsap.context (scoped to the manual root) and is
 * torn down on unmount, including the DOM the runtime adds (flow overlays)
 * and the attributes it moves (markers).
 */
import { useEffect, useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { botPoly, edgePts, rng, topPoly } from "./edges";
import { RS } from "../sheets/geometry";
import { buildAssembly, buildBand, buildCritical, buildGate, buildSignal, buildTenant, sdraw, type Kit } from "./builders";

declare global {
  interface Window {
    __fmStarted?: boolean;
    __fmGaveUp?: boolean;
  }
}

/** The story sheets, in order (the pinned, scrubbed sheets). Appendices are not part of it. */
const STORY = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"] as const;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

let registered = false;
function register() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

interface RouteLike {
  getTotalLength(): number;
  getPointAtLength(l: number): { x: number; y: number };
}
type TL = gsap.core.Timeline;

export function useFieldManual(rootRef: RefObject<HTMLElement | null>) {
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return mountFieldManual(root);
  }, [rootRef]);
}

function mountFieldManual(root: HTMLElement): () => void {
  const DOC = document.documentElement;
  const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => r.querySelector<T>(s);
  const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => Array.from(r.querySelectorAll<T>(s));
  const undo: (() => void)[] = [];
  const reduced = !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MOTION = !reduced && !window.__fmGaveUp;
  if (MOTION) {
    DOC.classList.add("motion");
    window.__fmStarted = true;
  } else {
    DOC.classList.remove("motion");
  }

  const sheetEl = (id: string) => document.getElementById(id) as HTMLElement;
  /** Every sheet after the cover in DOM order: the general-data band, story sheets and appendix leaves (GD, 01–09, A–C, 10). */
  const flow = $$<HTMLElement>(".band, .sheet, .appx");
  /** What the rail and nav address: the cover, then the flow. Ids match `data-go`. */
  const parts = [$("#cover") as HTMLElement, ...flow].filter(Boolean);
  const isLeaf = (el: Element) => el.classList.contains("appx") || el.classList.contains("band");

  /* ---------- torn / deckled edges ---------- */
  const clipped: HTMLElement[] = [];
  const clip = (el: HTMLElement | null, v: string) => {
    if (!el) return;
    el.style.clipPath = v;
    clipped.push(el);
  };
  $$<HTMLElement>(".band, .sheet, .appx, .rfi-sheet").forEach((sec, domIdx) => {
    const si = STORY.indexOf(sec.id as (typeof STORY)[number]);
    const i = si >= 0 ? si : sec.classList.contains("rfi-sheet") ? STORY.length : STORY.length + 1 + domIdx;
    const pts = edgePts(101 + i * 37, sec.dataset.edge || (sec.classList.contains("rfi-sheet") ? "deckle" : "torn"));
    clip($(".paper-bg", sec), topPoly(pts, 0));
    clip($(".paper-fringe", sec), topPoly(pts, -1.6, 2.6, 7 + i));
    clip($(".tear-shadow i", sec), topPoly(pts, 22, 0));
  });
  {
    const c = $("#cover");
    if (c) {
      const pts = edgePts(77, "torn");
      clip($(".paper-bg", c), botPoly(pts, 0));
      clip($(".paper-fringe", c), botPoly(pts, -1.6, 2.6, 5));
      clip($(".tear-shadow i", c), botPoly(pts, 30, 0));
    }
  }
  undo.push(() => clipped.forEach((el) => (el.style.clipPath = "")));

  /* ---------- name: measured guides ---------- */
  function nameMetrics() {
    const h1 = $(".name");
    if (!h1) return;
    const cs = getComputedStyle(h1);
    const fs = parseFloat(cs.fontSize);
    let lh = parseFloat(cs.lineHeight);
    if (!lh || isNaN(lh)) lh = fs * 0.8;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;
    ctx.font = "900 " + fs + "px " + cs.fontFamily;
    const m = ctx.measureText("KRISHNAPPA");
    const asc = m.fontBoundingBoxAscent || fs * 0.9, desc = m.fontBoundingBoxDescent || fs * 0.25, cap = m.actualBoundingBoxAscent || fs * 0.7;
    const base = (lh - (asc + desc)) / 2 + asc;
    h1.style.setProperty("--base", base.toFixed(1) + "px");
    h1.style.setProperty("--cap", (base - cap).toFixed(1) + "px");
    h1.style.setProperty("--caph", cap.toFixed(1) + "px");
  }

  /* ---------- ink prep, routes + trails ---------- */
  const markered: SVGElement[] = [];
  $$<SVGElement>(".dwg .ink, .vellum .ink").forEach((el) => {
    el.setAttribute("pathLength", "1");
    if (MOTION) {
      for (const a of ["marker-end", "marker-start"] as const) {
        const v = el.getAttribute(a);
        if (v) {
          el.dataset[a === "marker-end" ? "fmMe" : "fmMs"] = v;
          el.removeAttribute(a);
          markered.push(el);
        }
      }
    }
  });
  undo.push(() =>
    markered.forEach((el) => {
      if (el.dataset.fmMe) el.setAttribute("marker-end", el.dataset.fmMe);
      if (el.dataset.fmMs) el.setAttribute("marker-start", el.dataset.fmMs);
      delete el.dataset.fmMe;
      delete el.dataset.fmMs;
    }),
  );

  const trails = new Map<RouteLike, SVGPathElement>();
  const lens = new Map<RouteLike, number>();
  $$<SVGPathElement>(".route").forEach((r) => {
    lens.set(r, r.getTotalLength());
    if (r.dataset.notrail) return;
    const prev = r.previousElementSibling;
    if (prev && prev.classList.contains("trail")) trails.set(r, prev as SVGPathElement);
  });
  function place(m: Element, route: RouteLike, p: number) {
    let L = lens.get(route);
    if (L === undefined) {
      L = route.getTotalLength();
      lens.set(route, L);
    }
    const pt = route.getPointAtLength(L * Math.max(0, Math.min(1, p)));
    m.setAttribute("transform", "translate(" + pt.x.toFixed(2) + " " + pt.y.toFixed(2) + ")");
  }
  const routeOf = (sel: string, r: ParentNode = root) => $<SVGPathElement>(sel, r) as SVGPathElement;
  const dotOf = (id: string) => $<SVGGElement>(`#${id} .dwg .dot`) as SVGGElement;
  const DOTS: Record<string, string> = { s1: "#r1", s2: "#r2in", s3: "#rsa", s4: "#r4a", s5: "#r5a", s6: "#r6a", s7: "#r7a", s8: "#r8a", s9: "#r9a", s10: "#r10a" };
  Object.keys(DOTS).forEach((id) => {
    const d = dotOf(id), r = routeOf(DOTS[id]);
    if (d && r) place(d, r, 0);
  });

  /* ---------- MTTR helpers ---------- */
  const mttrAt = (p: number) => Math.exp(Math.log(300) + p * (Math.log(10) - Math.log(300)));
  const fmtM = (m: number) => {
    if (m >= 59.5) {
      let h = Math.floor(m / 60), mm = Math.round(m - h * 60);
      if (mm === 60) { h++; mm = 0; }
      return h + "h " + (mm < 10 ? "0" : "") + mm + "m";
    }
    return Math.round(m) + " min";
  };
  function setMTTR(p: number) {
    const m = mttrAt(p), x = 120 + 600 * (m / 300);
    $("#mt-line")?.setAttribute("d", "M120 604 L" + x.toFixed(1) + " 604");
    $("#mt-end")?.setAttribute("d", "M" + x.toFixed(1) + " 592 L" + x.toFixed(1) + " 616");
    const v = $("#mt-v");
    if (v) {
      v.setAttribute("x", (x + 14).toFixed(1));
      // keep React's text node; only change its value
      if (v.firstChild && v.firstChild.nodeType === Node.TEXT_NODE) v.firstChild.nodeValue = fmtM(m);
      else v.textContent = fmtM(m);
    }
  }

  /* ---------- sheet 03 (rollout) helpers ---------- */
  const VM_ST = ["idle", "req", "per", "den", "done"];
  function rsState(vm: Element, st: string) {
    VM_ST.forEach((k) => {
      const t = vm.querySelector<SVGElement>(".v-" + k);
      if (t) t.style.opacity = k === st ? "1" : "0";
    });
  }
  function rsStatic() {
    const vms = $$<SVGGElement>("#vms .vm");
    if (!vms.length) return;
    [7, 6, 5].forEach((id, k) => {
      vms[id].setAttribute("transform", "translate(" + RS.laneX(k) + " 300)");
      rsState(vms[id], "done");
      const img = vms[id].querySelector<SVGElement>(".img2");
      if (img) img.style.opacity = "1";
    });
    [3, 2].forEach((id) => rsState(vms[id], "per"));
    [4, 1, 0].forEach((id) => rsState(vms[id], "req"));
    $$<SVGElement>("#s3 .tok").forEach((t) => (t.style.opacity = "1"));
  }

  /* ---------- colour runtime (flows / lit / sweep) ---------- */
  const stopColour = colourRuntime(root, flow);
  undo.push(stopColour);

  /* ---------- static (reduced motion) final state ---------- */
  if (!MOTION) {
    nameMetrics();
    document.fonts?.ready.then(nameMetrics);
    const last: Record<string, string> = { s1: "#r1", s2: ".hop:last-of-type", s3: "#rsb", s4: "#r4c", s5: "#r5b", s6: "#r6c", s7: "#r7c", s8: "#r8b", s9: "#r9c", s10: "#r10a" };
    Object.keys(last).forEach((id) => {
      const svg = $(`#${id} .dwg`);
      if (!svg) return;
      let r = $<SVGPathElement>(last[id], svg);
      if (id === "s2") {
        const hops = $$<SVGPathElement>(".hop", svg);
        r = hops[hops.length - 1];
      }
      const d = $(".dot", svg);
      if (r && d) place(d, r, 1);
    });
    setMTTR(1);
    rsStatic();
    {
      const kd = $<SVGElement>("#s5 .vellum .kd"), rk = $<SVGPathElement>("#s5 .vellum #rk");
      if (kd && rk) place(kd, rk, 1);
    }
    $$<SVGPathElement>("#arcs .trail").forEach((t) => (t.style.stroke = "rgba(232,242,249,.3)"));
    $$(".fc").forEach((c) => c.classList.add("on"));
    const railA = $$(".rail a");
    const upd = () => {
      let idx = 0;
      parts.forEach((el, i) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.5) idx = i;
      });
      railA.forEach((a) => a.classList.toggle("on", a.dataset.go === parts[idx].id));
    };
    window.addEventListener("scroll", upd, { passive: true });
    upd();
    const onGo = (e: Event) => {
      e.preventDefault();
      document.getElementById((e.currentTarget as HTMLElement).dataset.go || "")?.scrollIntoView();
    };
    const gos = $$("[data-go]");
    gos.forEach((a) => a.addEventListener("click", onGo));
    undo.push(() => {
      window.removeEventListener("scroll", upd);
      gos.forEach((a) => a.removeEventListener("click", onGo));
    });
    return () => undo.reverse().forEach((f) => f());
  }

  /* ===================================================================== */
  /* ============================== MOTION =============================== */
  /* ===================================================================== */
  register();
  const prevRestoration = history.scrollRestoration;
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  undo.push(() => {
    history.scrollRestoration = prevRestoration;
  });

  let lenis: Lenis | null = null;
  const raf = (t: number) => lenis?.raf(t * 1000);
  try {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  } catch {
    lenis = null;
  }
  undo.push(() => {
    gsap.ticker.remove(raf);
    gsap.ticker.lagSmoothing(500, 33);
    lenis?.destroy();
    lenis = null;
  });

  const VH = () => window.innerHeight;

  /* ---------- leaves (appendices): stick at their end ---------- */
  // A leaf is as tall as its content. Its stage sticks with a negative top so
  // that it holds still once its END reaches the viewport bottom; the leaf's
  // 100vh tail is the overlap the next sheet slides over (like a pinned stage).
  const leafStages = $$<HTMLElement>(".appx .leaf-stage, .band .leaf-stage");
  function fitLeaves() {
    leafStages.forEach((st) => (st.style.top = Math.min(0, VH() - st.offsetHeight) + "px"));
  }
  undo.push(() => leafStages.forEach((st) => (st.style.top = "")));

  function draw(tl: TL, input: Element | Element[] | null | undefined, pos: number, dur = 1, stagger = 0, ease?: string) {
    const els = Array.isArray(input) ? input : input ? [input] : [];
    if (!els.length) return;
    tl.to(els, { strokeDashoffset: 0, duration: dur, stagger, ease: ease || "power1.inOut" }, pos);
    const solids = els.filter((e) => e.classList.contains("solid"));
    if (solids.length) tl.to(solids, { fillOpacity: 1, duration: dur * 0.5 }, pos + dur * 0.45);
    els.forEach((el, i) => {
      const at = pos + i * stagger + dur * 0.92;
      const ds = (el as SVGElement).dataset;
      if (ds.fmMe) tl.set(el, { attr: { "marker-end": ds.fmMe } }, at);
      if (ds.fmMs) tl.set(el, { attr: { "marker-start": ds.fmMs } }, at);
    });
  }
  function fade(tl: TL, els: Element | Element[] | null | undefined, pos: number, dur = 0.4) {
    if (!els) return;
    if (Array.isArray(els) && !els.length) return;
    tl.to(els, { opacity: 1, duration: dur, stagger: 0.03 }, pos);
  }
  function pop(tl: TL, els: Element[] | null | undefined, pos: number, dur = 0.35) {
    if (!els || !els.length) return;
    tl.fromTo(els, { opacity: 0, scale: 0.86, transformOrigin: "0% 100%" }, { opacity: 1, scale: 1, duration: dur, ease: "back.out(2.2)", stagger: 0.06 }, pos);
  }
  function callout(tl: TL, g: Element | null, pos: number) {
    if (!g) return;
    draw(tl, $$(".ink", g), pos, 0.35, 0, "power2.out");
    pop(tl, $$(".hand, .lbl, .lbl-b", g), pos + 0.28);
  }
  function stamp(tl: TL, g: Element | null, pos: number, frame?: Element | null) {
    if (!g) return;
    const inner = $(".st-in", g), ring = $(".st-ring", g);
    tl.fromTo(inner, { scale: 2.3, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.32, ease: "power4.in" }, pos);
    tl.fromTo(ring, { scale: 1, opacity: 0.75, transformOrigin: "50% 50%" }, { scale: 1.32, opacity: 0, duration: 0.4, ease: "power2.out", immediateRender: false }, pos + 0.32);
    if (frame) {
      tl.to(frame, { y: 3, duration: 0.03 }, pos + 0.3);
      tl.to(frame, { y: 0, duration: 0.16, ease: "power2.out" }, pos + 0.33);
    }
  }
  function travel(tl: TL, route: RouteLike, mover: Element, pos: number, dur: number, ease?: string, noTrail?: boolean, p0 = 0, p1 = 1) {
    const o = { p: p0 };
    const trail = noTrail ? null : trails.get(route) || null;
    tl.fromTo(
      o,
      { p: p0 },
      {
        p: p1,
        duration: dur,
        ease: ease || "power1.inOut",
        immediateRender: false,
        onUpdate: () => {
          place(mover, route, o.p);
          if (trail) trail.style.strokeDashoffset = (1.02 * (1 - o.p)).toFixed(4);
        },
      },
      pos,
    );
  }
  function mkTL(sec: HTMLElement) {
    const last = sec.id === "s10";
    return gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: () => "+=" + Math.max(10, sec.offsetHeight - VH() * (last ? 1 : 2)),
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });
  }

  /* ---------- intro (load) ---------- */
  function intro() {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.set(".cover .frame", { visibility: "visible" })
      .from(".cover .zones", { opacity: 0, duration: 0.8 }, 0)
      .from(".cover .guides i", { scaleX: 0, duration: 1.1, ease: "power3.inOut", stagger: 0.1 }, 0)
      .from(".cover .ch", { yPercent: 108, duration: 0.95, ease: "power4.out", stagger: 0.032 }, 0.22)
      .from(".cover .cap-dim", { scaleY: 0, duration: 0.7, ease: "power3.inOut" }, 0.55)
      .from(".cover-eyebrow, .cover .role, .cover .tagline", { opacity: 0, y: 12, duration: 0.7, stagger: 0.1, ease: "power2.out" }, 0.85)
      .from(".cover .titleblock, .cover .revs, .cover .scroll-cue", { opacity: 0, y: 14, duration: 0.8, stagger: 0.08, ease: "power2.out" }, 0.95)
      .from("#herodot", { scale: 0, duration: 0.55, ease: "back.out(3)" }, 1.35)
      .from(".dot-note", { opacity: 0, x: -10, duration: 0.55, ease: "power2.out" }, 1.55)
      .add(() => $$(".cover .word").forEach((w) => w.classList.add("free")));
  }

  /* ---------- cover lift + hero dot ---------- */
  const A = { x: 0, y: 0 }, T = { x: 0, y: 0 };
  function offsetIn(el: HTMLElement | null, rootEl: HTMLElement) {
    let x = 0, y = 0;
    while (el && el !== rootEl) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }
    return { x, y };
  }
  function measureDot() {
    const cover = $("#cover"), anc = $(".dot-anchor"), h1 = $(".name");
    // the dot lands on the general-data band's datum (the band holds still under the lifting cover)
    const datum = $("#gd .gd-datum"), st = $("#gd .leaf-stage");
    if (!cover || !anc || !h1 || !datum || !st) return;
    const o = offsetIn(anc, cover), fs = parseFloat(getComputedStyle(h1).fontSize);
    A.x = o.x + fs * 0.13 + 7;
    A.y = o.y - 9;
    const d = offsetIn(datum, st);
    T.x = d.x + datum.offsetWidth / 2;
    T.y = d.y + datum.offsetHeight / 2;
  }
  function buildCover() {
    const chars = $$(".cover .ch"), r = rng(42);
    const lift = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "#gd", start: "top top", end: "+=100%", scrub: 0.6, invalidateOnRefresh: true } });
    chars.forEach((c) => {
      const rx = (r() - 0.5) * 1.1, ry = -(0.3 + r() * 0.75), rot = (r() - 0.5) * 90, d = r() * 0.14;
      lift.to(c, { x: () => rx * innerWidth * 0.55, y: () => ry * innerHeight, rotation: rot, opacity: 0, ease: "power2.in", duration: 0.52 }, d);
    });
    lift.to(".cover .guides i, .cover .cap-dim, .cover .dot-note, .cover .scroll-cue", { opacity: 0, duration: 0.25 }, 0);
    lift.to(".cover .cover-sub", { y: -40, opacity: 0, duration: 0.4, ease: "power2.in" }, 0.08);
    lift.to("#cover", { yPercent: -114, rotation: -3.2, xPercent: -1.5, transformOrigin: "100% 0%", ease: "power2.in", duration: 0.74 }, 0.24);
    lift.fromTo("#gd .shade-cover", { opacity: 0.62 }, { opacity: 0, duration: 0.76 }, 0.24);
    const hd = $("#herodot"), o = { p: 0 };
    lift.fromTo(
      o,
      { p: 0 },
      {
        p: 1,
        duration: 0.8,
        ease: "power1.inOut",
        immediateRender: false,
        onUpdate: () => {
          const p = o.p, cx = (A.x + T.x) / 2, cy = Math.min(A.y, T.y) - 170;
          const x = (1 - p) * (1 - p) * A.x + 2 * (1 - p) * p * cx + p * p * T.x;
          const y = (1 - p) * (1 - p) * A.y + 2 * (1 - p) * p * cy + p * p * T.y;
          gsap.set(hd, { x, y });
        },
      },
      0.14,
    );
    lift.set(hd, { autoAlpha: 0 }, 0.95);
    lift.fromTo("#gd .gd-datum i", { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.94);
    lift.set("#cover", { autoAlpha: 0 }, 1);
  }

  /* ---------- sheet entries (sheet-over-sheet) ---------- */
  // Each sheet or leaf slides over the one before it in the flow, so 01's
  // predecessor is the general-data band, 10's is Appendix C and A's is 09. A stuck leaf is taller than the
  // viewport, so it recedes about the point at the viewport's top edge.
  const stageOf = (sec: Element) => $(isLeaf(sec) ? ".leaf-stage" : ".stage", sec) as HTMLElement;
  function buildEntries() {
    flow.forEach((sec, i) => {
      if (!i) return;
      const prev = flow[i - 1], st = stageOf(sec), pst = stageOf(prev), odd = i % 2;
      const recede = isLeaf(prev) ? () => "50% " + Math.max(0, pst.offsetHeight - VH()) + "px" : "50% 0%";
      gsap
        .timeline({ scrollTrigger: { trigger: sec, start: "top bottom", end: "top top", scrub: 0.5, invalidateOnRefresh: true } })
        .fromTo(st, { rotation: odd ? 1.5 : -1.3, x: odd ? 26 : -22, transformOrigin: odd ? "0% 0%" : "100% 0%" }, { rotation: 0, x: 0, ease: "power1.out" }, 0)
        .fromTo($(".shade", prev), { opacity: 0 }, { opacity: 0.62, ease: "none" }, 0)
        .fromTo(pst, { scale: 1, transformOrigin: recede }, { scale: 0.955, transformOrigin: recede, ease: "none" }, 0);
    });
  }

  /* ---------- appendices: rows draw in ---------- */
  // Not scrubbed: each row (and each general note) draws in once as it enters
  // the viewport. Its hairline rule draws, the cells rise in, its key phrase
  // lights (all CSS, keyed on `.in`; see field-manual.css "leaves").
  const rowsIn: Element[] = [];
  function buildAppendices() {
    $$(".appx [data-row], .appx [data-note]").forEach((row) => {
      const show = () => {
        if (row.classList.contains("in")) return;
        row.classList.add("in");
        rowsIn.push(row);
      };
      ScrollTrigger.create({ trigger: row, start: "top 94%", onEnter: show, onEnterBack: show, onLeave: show });
    });
  }
  undo.push(() => rowsIn.forEach((r) => r.classList.remove("in")));

  /* ---------- sheet 01 · ingestion ---------- */
  function buildS1() {
    const sec = sheetEl("s1"), svg = $(".dwg", sec)!, fr = $(".frame", sec), tl = mkTL(sec), q = (s: string) => $$(s, svg);
    const lis = $$(".gnotes li", sec), dot = $(".dot", svg)!;
    tl.to(lis[0], { opacity: 1, duration: 0.4 }, 0);
    draw(tl, q(".p1 .ink"), 0, 1.1, 0.045);
    fade(tl, q(".p1 .fade"), 0.8, 0.5);
    fade(tl, q("svg > .lbl.fade"), 0, 0.5);
    draw(tl, q(".p2 .ink"), 1.1, 1, 0.07);
    fade(tl, q(".p2 .fade"), 1.5);
    callout(tl, $(".c1", svg), 2.1);
    draw(tl, q(".p3 .ink"), 2.3, 0.8, 0.06);
    fade(tl, q(".p3 .fade"), 2.7);
    tl.to(lis[1], { opacity: 1, duration: 0.4 }, 2.5);
    callout(tl, $(".c2", svg), 2.9);
    draw(tl, q(".p4 .ink"), 3.1, 0.8, 0.05);
    fade(tl, q(".p4 .fade"), 3.5);
    draw(tl, q(".p5 .ink"), 3.8, 1.1, 0.05);
    fade(tl, q(".p5 .fade"), 4.4, 0.5);
    tl.to(lis[2], { opacity: 1, duration: 0.4 }, 4.2);
    tl.fromTo("#lvl", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1.4, ease: "power1.out" }, 7.0);
    travel(tl, routeOf("#r1"), dot, 5.1, 2.6);
    tl.fromTo(q(".dim1"), { scaleY: 0, opacity: 0, transformOrigin: "50% 50%" }, { scaleY: 1, opacity: 1, duration: 0.6, ease: "power2.out" }, 7.5);
    callout(tl, $(".c3", svg), 8.0);
    stamp(tl, $(".st1", svg), 8.6, fr);
    // Detail B · the hot path: N+1 fan-out → one call, p95 halves
    draw(tl, q(".hotp .ink"), 9.0, 0.6, 0.04);
    fade(tl, q(".hotp .fade"), 9.1, 0.4);
    sdraw(tl, q(".p95b"), 9.6, 0.4);
    pop(tl, q(".hotp .pop"), 9.9);
    tl.to(lis[3], { opacity: 1, duration: 0.4 }, 9.3);
    tl.to({}, { duration: 0.5 }, 10.3);
  }

  /* ---------- sheet 02 · fleet ---------- */
  function buildS2() {
    const sec = sheetEl("s2"), svg = $(".dwg", sec)!, fr = $(".frame", sec), tl = mkTL(sec), q = (s: string) => $$(s, svg);
    const dot = $(".dot", svg)!, cards = $$(".fc", sec), track = $(".fc-track", sec);
    const cardH = () => cards[0].offsetHeight;
    fade(tl, q("svg > .lbl.fade, .from .fade"), 0, 0.4);
    draw(tl, q(".from .ink"), 0, 0.4);
    draw(tl, q("#fleet > path:first-child"), 0, 0.6);
    draw(tl, q("#fleet .nt, #fleet .ns"), 0.25, 0.45, 0.02);
    callout(tl, $(".c-fleet", svg), 2.3);
    // card 2
    tl.to(track, { y: () => -cardH(), duration: 0.6, ease: "power2.inOut" }, 3.3);
    tl.to(cards[0], { opacity: 0.32, duration: 0.4 }, 3.3);
    tl.set(cards[1], { className: "fc on" }, 3.5);
    tl.set(cards[0], { className: "fc" }, 3.5);
    draw(tl, q("#plate .ink"), 3.5, 0.8, 0.08);
    draw(tl, q(".recon .ink"), 3.9, 0.6, 0.1);
    fade(tl, q("#asm .fade"), 4.2, 0.5);
    callout(tl, $(".c-recon", svg), 4.4);
    tl.fromTo(q(".bk"), { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.06, ease: "back.out(3)" }, 4.9);
    travel(tl, routeOf("#r2in"), dot, 5.5, 0.7);
    // card 3 + MTTR
    tl.to(track, { y: () => -2 * cardH(), duration: 0.6, ease: "power2.inOut" }, 6.3);
    tl.to(cards[1], { opacity: 0.32, duration: 0.4 }, 6.3);
    tl.set(cards[2], { className: "fc on" }, 6.5);
    tl.set(cards[1], { className: "fc" }, 6.5);
    tl.fromTo(q(".mttr"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 6.3);
    const hops = q(".hop") as unknown as SVGPathElement[], bks = q(".bk"), fxs = q(".fx"), t0 = 6.8, step = 0.45;
    hops.forEach((h, i) => {
      const t = t0 + i * step;
      travel(tl, h, dot, t, 0.3, "power2.inOut");
      if (i < bks.length) {
        tl.to(bks[i], { opacity: 0, duration: 0.12 }, t + 0.28);
        draw(tl, $$(".ink", fxs[i]), t + 0.28, 0.16, 0.04);
        const tr = trails.get(h);
        if (tr) tl.to(tr, { stroke: "rgba(232,242,249,.28)", duration: 0.25 }, t + 0.4);
      }
    });
    const mt = { p: 0 };
    tl.fromTo(mt, { p: 0 }, { p: 1, duration: step * bks.length, immediateRender: false, ease: "none", onUpdate: () => setMTTR(mt.p) }, t0 + 0.2);
    stamp(tl, $(".st2", svg), t0 + step * bks.length + 0.1, fr);
    fade(tl, q(".to .fade"), t0 + step * bks.length + 0.3);
    draw(tl, q(".to .ink"), t0 + step * bks.length - 0.2, 0.4);
    // card 4: snapshot-restore takes a further 85%; card 5: availability
    const t4 = t0 + step * hops.length + 0.3;
    const card = (n: number, at: number) => {
      tl.to(track, { y: () => -n * cardH(), duration: 0.6, ease: "power2.inOut" }, at);
      tl.to(cards[n - 1], { opacity: 0.32, duration: 0.4 }, at);
      tl.set(cards[n], { className: "fc on" }, at + 0.2);
      tl.set(cards[n - 1], { className: "fc" }, at + 0.2);
    };
    card(3, t4);
    callout(tl, $(".mt2", svg), t4 + 0.4);
    card(4, t4 + 1.2);
    tl.to({}, { duration: 0.6 }, t4 + 1.8);
    setMTTR(0);
  }

  /* ---------- sheet 09 · durable workflows (v3 "buildS4") ---------- */
  function buildWorkflows() {
    const sec = sheetEl("s9"), svg = $(".dwg", sec)!, fr = $(".frame", sec), tl = mkTL(sec), q = (s: string) => $$(s, svg);
    const lis = $$(".gnotes li", sec), dot = $(".dot", svg)!, fail = $(".fail", svg), atts = q(".att"), rows = q(".row");
    fade(tl, q("svg > .lbl.fade, .from .fade"), 0, 0.4);
    draw(tl, q(".from .ink"), 0, 0.4);
    tl.to(lis[0], { opacity: 1, duration: 0.4 }, 0);
    draw(tl, q(".states .ink"), 0.1, 0.9, 0.1);
    fade(tl, q(".states .fade"), 0.7, 0.5);
    draw(tl, q(".arrows .ink"), 1.0, 0.5, 0.12);
    draw(tl, q(".loop .ink"), 1.6, 0.6);
    fade(tl, q(".loop .fade"), 1.9);
    draw(tl, q(".log .ink"), 2.0, 0.5);
    fade(tl, q(".log .fade"), 2.2);
    travel(tl, routeOf("#r9a"), dot, 2.7, 1.3);
    let t = 4.0;
    const loop = routeOf("#r9l");
    for (let i = 0; i < 3; i++) {
      tl.set(atts[i], { opacity: 1 }, t);
      if (i) tl.set(atts[i - 1], { opacity: 0 }, t);
      pop(tl, [rows[i]], t);
      if (i < 2) {
        tl.fromTo(fail, { opacity: 0, scale: 0.6, transformOrigin: "0% 50%" }, { opacity: 1, scale: 1, duration: 0.14, ease: "back.out(3)", immediateRender: i === 0 }, t + 0.05);
        tl.to(fail, { opacity: 0.2, duration: 0.2 }, t + 0.4);
        travel(tl, loop, dot, t + 0.5, 0.75);
        t += 1.35;
      }
    }
    tl.to(lis[1], { opacity: 1, duration: 0.4 }, 5.0);
    stamp(tl, $(".st4", svg), t - 0.55, fr);
    travel(tl, routeOf("#r9b"), dot, t + 0.3, 1.0);
    pop(tl, [rows[3]], t + 1.2);
    tl.to(lis[2], { opacity: 1, duration: 0.4 }, t + 1.0);
    stamp(tl, $(".st4b", svg), t + 1.25, fr);
    const d0 = t + 1.8;
    draw(tl, q(".dmark .ink"), d0, 0.5, 0.1);
    fade(tl, q(".dmark .fade"), d0 + 0.1);
    draw(tl, q(".detail .ink"), d0 + 0.4, 1.0, 0.05);
    fade(tl, q(".detail .fade"), d0 + 1.0, 0.5);
    fade(tl, q("svg > .lbl.fade"), d0 + 1.0, 0.5);
    pop(tl, q(".detail .hand"), d0 + 1.3);
    tl.to(lis[3], { opacity: 1, duration: 0.4 }, d0 + 0.8);
    // Detail C · codeflow, and the eBPF scan
    draw(tl, q(".detc9 .ink"), d0 + 1.6, 0.8, 0.05);
    fade(tl, q(".detc9 .fade"), d0 + 1.9, 0.4);
    callout(tl, $(".c-cf", svg), d0 + 2.3);
    tl.to(lis[4], { opacity: 1, duration: 0.4 }, d0 + 1.8);
    tl.to(lis[5], { opacity: 1, duration: 0.4 }, d0 + 2.4);
    draw(tl, q(".to .ink"), d0 + 2.6, 0.4);
    fade(tl, q(".to .fade"), d0 + 2.7);
    travel(tl, routeOf("#r9c"), dot, d0 + 2.8, 0.5);
    tl.to({}, { duration: 0.5 }, d0 + 3.3);
  }

  /* ---------- sheet 03 · rollout safety (v3 "buildRS") ---------- */
  function buildRollout() {
    const sec = sheetEl("s3"), svg = $(".dwg", sec)!, fr = $(".frame", sec), tl = mkTL(sec), q = (s: string) => $$(s, svg);
    const lis = $$(".gnotes li", sec), dot = $(".dot", svg)!, vms = q(".vm"), toks = q(".tok"), arms = $(".arms", svg), hold = $(".hold", svg)!;
    const st = (i: number, s: string, at: number) => {
      VM_ST.forEach((k) => tl.set($(".v-" + k, vms[i]), { opacity: k === s ? 1 : 0 }, at));
    };
    fade(tl, q("svg > .lbl.fade, .from .fade"), 0, 0.4);
    draw(tl, q(".from .ink"), 0, 0.4);
    tl.to(lis[0], { opacity: 1, duration: 0.4 }, 0);
    draw(tl, q(".infra .ink"), 0.1, 1.1, 0.05);
    fade(tl, q(".infra .fade"), 0.7, 0.5);
    draw(tl, q(".gauge .ink"), 0.9, 0.6, 0.1);
    fade(tl, q(".gauge .fade"), 1.2);
    draw(tl, q(".gate .ink"), 1.1, 0.5, 0.1);
    draw(tl, q(".ground"), 1.1, 0.6);
    fade(tl, q(".groundf, .lanelbl"), 1.4);
    draw(tl, q(".vm .ink"), 1.3, 0.45, 0.025);
    draw(tl, q(".arms .ink"), 1.6, 0.4);
    tl.to(lis[1], { opacity: 1, duration: 0.4 }, 1.7);
    callout(tl, $(".c-n", svg), 2.0);
    travel(tl, routeOf("#rsa"), dot, 2.3, 1.1);
    // the update arrives: every machine asks
    fade(tl, q(".legend .fade"), 3.2, 0.4);
    draw(tl, q(".legend .ink"), 3.2, 0.3, 0.05);
    for (let i = 0; i < 8; i++) st(i, "req", 3.4 + (7 - i) * 0.04);
    tl.to(lis[2], { opacity: 1, duration: 0.4 }, 3.4);
    pop(tl, [hold], 3.7);
    let turn = 0, lane = 0;
    const pass = (ids: number[], t: number) => {
      ids.forEach((id, k) => {
        st(id, "per", t + k * 0.05);
        tl.to(toks[k], { opacity: 1, duration: 0.08 }, t + k * 0.05);
      });
      turn += 1;
      tl.to(arms, { rotation: 120 * turn, svgOrigin: "420 326", duration: 0.55, ease: "power2.inOut" }, t + 0.2);
      ids.forEach((id, k) => {
        const x = RS.laneX(lane++);
        tl.to(vms[id], { x, duration: 0.75, ease: "power2.inOut" }, t + 0.2 + k * 0.12);
        tl.to($(".img2", vms[id]), { opacity: 1, duration: 0.15 }, t + 0.95 + k * 0.12);
        st(id, "done", t + 1.0 + k * 0.12);
        tl.to(toks[k], { opacity: 0, duration: 0.08 }, t + 1.0 + k * 0.12);
      });
    };
    pass([7], 4.0); // canary first
    tl.to(lis[3], { opacity: 1, duration: 0.4 }, 4.0);
    callout(tl, $(".c-rev", svg), 5.0); // fast revert path back
    pass([6, 5], 5.6);
    pass([3, 2], 6.9); // #4 holds for its tests; #3 and #2 go first
    st(1, "den", 7.15);
    st(1, "req", 7.75); // budget full -> denied, asks again
    tl.to($$(".h1, .h2", hold), { opacity: 0, duration: 0.15 }, 8.2);
    tl.to($(".h3", hold), { opacity: 1, duration: 0.15 }, 8.25);
    tl.to(hold, { opacity: 0, duration: 0.25 }, 8.65);
    pass([4, 1], 8.8);
    pass([0], 10.1);
    stamp(tl, $(".st-rs", svg), 11.2, fr);
    tl.to(lis[4], { opacity: 1, duration: 0.4 }, 11.4);
    fade(tl, q(".detc .fade"), 11.4, 0.5);
    draw(tl, q(".detc .ink"), 11.4, 0.5);
    callout(tl, $(".c-plug", svg), 11.8);
    callout(tl, $(".metric", svg), 12.2);
    fade(tl, q(".after .fade"), 12.4, 0.5);
    // the incident report: a film overlay slides up over the lane
    const film = $(".incident", svg);
    tl.fromTo(film, { y: 340, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", immediateRender: false }, 12.9);
    fade(tl, q(".incident .fade"), 13.7, 0.4);
    draw(tl, q(".incident .ink"), 13.7, 1.3, 0.06);
    sdraw(tl, q(".incident .storm"), 14.4, 0.4, 0.25);
    tl.to(lis[5], { opacity: 1, duration: 0.4 }, 14.4);
    pop(tl, q(".incident .lesson"), 15.4);
    callout(tl, $(".metric2", svg), 15.9);
    callout(tl, $(".c-inc", svg), 16.2);
    stamp(tl, $(".st-inc", svg), 16.5, fr);
    draw(tl, q(".to .ink"), 16.8, 0.4);
    fade(tl, q(".to .fade"), 16.9);
    travel(tl, routeOf("#rsb"), dot, 17.0, 0.8);
    tl.to({}, { duration: 0.5 }, 17.8);
  }

  /* ---------- sheet 10 · issued for hire ---------- */
  function buildClose() {
    const sec = sheetEl("s10"), svg = $(".dwg", sec)!, fr = $(".frame", sec), tl = mkTL(sec), q = (s: string) => $$(s, svg);
    const dot = $(".dot", svg)!;
    fade(tl, q("svg > .lbl.fade, .from .fade"), 0, 0.4);
    draw(tl, q(".from .ink"), 0, 0.4);
    draw(tl, q("#set .ink"), 0.1, 0.9, 0.04);
    fade(tl, q("#set .fade"), 0.7, 0.4);
    draw(tl, q(".tx .ink"), 0.6, 0.5, 0.1);
    fade(tl, q(".tx .fade"), 0.8, 0.4);
    pop(tl, q(".tx .row"), 1.0);
    travel(tl, routeOf("#r10a"), dot, 1.6, 1.4);
    callout(tl, $(".c6", svg), 2.4);
    draw(tl, q(".to .ink"), 2.6, 0.4);
    fade(tl, q(".to .fade"), 2.8);
    tl.to(dot, { opacity: 0, duration: 0.15 }, 3.0);
    tl.fromTo($(".btn-mail .hole", sec), { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)" }, 3.05);
    tl.fromTo($(".btn-mail", sec), { y: 0 }, { y: -6, duration: 0.12, ease: "power2.out" }, 3.05);
    tl.to($(".btn-mail", sec), { y: 0, duration: 0.3, ease: "bounce.out" }, 3.17);
    stamp(tl, $(".st5", sec), 3.8, fr);
    tl.to({}, { duration: 1.4 }, 4.4);
  }

  /* ---------- rail + nav ---------- */
  const railLinks = $$(".rail a"), prog = $(".rail-prog");
  let curIdx = -1;
  function setActive(i: number) {
    if (i === curIdx) return;
    curIdx = i;
    railLinks.forEach((a) => a.classList.toggle("on", a.dataset.go === parts[i]?.id));
  }
  function updateActive() {
    let idx = 0;
    if (window.scrollY > VH() * 0.55) {
      idx = 1;
      flow.forEach((s, i) => {
        if (i > 0 && s.getBoundingClientRect().top < VH() * 0.5) idx = i + 1;
      });
    }
    setActive(idx);
  }
  function targetY(el: HTMLElement) {
    const i = parts.indexOf(el);
    if (i <= 0) return 0;
    if (i === 1) return VH() * 1.04;
    if (isLeaf(el)) return el.offsetTop;
    return el.offsetTop + (el.offsetHeight - 2 * VH()) * 0.02;
  }
  function go(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = targetY(el);
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }
  const onGo = (e: Event) => {
    e.preventDefault();
    go((e.currentTarget as HTMLElement).dataset.go || "");
  };
  const gos = $$("[data-go]");
  gos.forEach((a) => a.addEventListener("click", onGo));
  undo.push(() => gos.forEach((a) => a.removeEventListener("click", onGo)));

  /* ---------- start (after fonts) ---------- */
  let ctx: gsap.Context | null = null;
  let cancelled = false;
  const onRefreshInit = () => {
    nameMetrics();
    fitLeaves();
  };
  // A leaf that changes height (a late font or image) re-fits and re-measures.
  let roTimer = 0;
  const ro =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          window.clearTimeout(roTimer);
          roTimer = window.setTimeout(() => ctx && ScrollTrigger.refresh(), 150);
        })
      : null;
  const onRefresh = () => {
    measureDot();
    if (window.scrollY < 2) gsap.set("#herodot", { x: A.x, y: A.y });
  };
  function start() {
    if (cancelled || ctx) return;
    try {
      ctx = gsap.context(() => {
        DOC.classList.add("fm-live");
        fitLeaves();
        nameMetrics();
        measureDot();
        gsap.set("#herodot", { x: A.x, y: A.y });
        intro();
        buildCover();
        buildEntries();
        const kit: Kit = { $, $$, sheetEl, mkTL, draw, fade, pop, callout, stamp, travel, routeOf, lens, place, VH };
        buildBand(kit);
        buildS1();
        buildS2();
        buildRollout();
        buildGate(kit);
        buildTenant(kit);
        buildSignal(kit);
        buildCritical(kit);
        buildAssembly(kit);
        buildWorkflows();
        buildClose();
        buildAppendices();
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            if (prog) prog.style.transform = "scaleY(" + self.progress.toFixed(4) + ")";
            updateActive();
          },
        });
        gsap.to(".ms-ring", { rotation: 360, svgOrigin: "50 50", ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.6 } });
      }, root);
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
      ScrollTrigger.addEventListener("refresh", onRefresh);
      ScrollTrigger.refresh();
      updateActive();
      leafStages.forEach((st) => ro?.observe(st));
    } catch (e) {
      console.error(e);
      DOC.classList.remove("motion");
    }
  }
  const fallback = window.setTimeout(start, 2500);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  else start();

  undo.push(() => {
    cancelled = true;
    window.clearTimeout(fallback);
    window.clearTimeout(roTimer);
    ro?.disconnect();
    ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    ctx?.revert();
    ctx = null;
    if (prog) prog.style.transform = "";
    DOC.classList.remove("fm-live");
    DOC.classList.remove("motion");
  });

  return () => undo.reverse().forEach((f) => f());
}

/* ===================================================================== */
/* Colour runtime — flow comets on drawn structural lines, lit notes,    */
/* the one-shot title sweep on arrival. Ported from v3's second script.  */
/* ===================================================================== */
function colourRuntime(root: HTMLElement, sheets: HTMLElement[]): () => void {
  let idx = -1;
  const SEL =
    ".dwg path.ink.b, .dwg line.ink.b, .dwg polyline.ink.b, .dwg rect.ink.b, .dwg path.ink:not(.t), .dwg line.ink:not(.t), .dwg polyline.ink:not(.t), .dwg .sig-ln, .dwg .dimln, .plate rect.pf";
  const pairs: [SVGGeometryElement, SVGElement, Element | null, boolean][] = [];
  root.querySelectorAll<SVGGeometryElement>(SEL).forEach((el, n) => {
    // .nf: lines that are scaled or swapped in by a timeline (strikes, needles), not drawn
    if (el.closest(".stamp") || el.closest("defs") || el.closest("pattern") || el.closest(".nf")) return;
    try {
      if (el.getTotalLength && el.getTotalLength() < 60) return;
    } catch {
      return;
    }
    const isPlate = el.classList.contains("pf");
    const c = el.cloneNode(false) as SVGElement;
    c.removeAttribute("id");
    c.removeAttribute("style");
    c.removeAttribute("marker-end");
    c.removeAttribute("marker-start");
    c.setAttribute("class", "flow" + (!isPlate && n % 3 === 1 ? " alt" : ""));
    c.setAttribute("pathLength", "100");
    c.setAttribute("aria-hidden", "true");
    c.style.setProperty("--fd", isPlate ? "9s" : (2.2 + (n % 5) * 0.45).toFixed(2) + "s");
    c.style.setProperty("--fdl", isPlate ? "0s" : (-(n * 0.37) % 3).toFixed(2) + "s");
    el.parentNode?.insertBefore(c, el.nextSibling);
    pairs.push([el, c, el.closest(".sheet, .appx, .cover"), isPlate]);
  });

  function drawn(el: Element) {
    const cs = getComputedStyle(el), op = parseFloat(cs.opacity);
    if (op < 0.5) return false;
    let p = el.parentNode as Element | null;
    while (p && p.nodeType === 1 && p.tagName !== "svg") {
      if (parseFloat(getComputedStyle(p).opacity) < 0.5) return false;
      p = p.parentNode as Element | null;
    }
    const off = parseFloat((el as SVGElement).style.strokeDashoffset || cs.strokeDashoffset || "0");
    // every drawn line carries pathLength=1, so "drawn" means a dash offset of ~0
    return !(Math.abs(off) > 0.02);
  }
  function activeIndex() {
    const vh = innerHeight;
    let a = 0;
    if (scrollY > vh * 0.55) {
      a = 1;
      sheets.forEach((s, i) => {
        if (i > 0 && s.getBoundingClientRect().top < vh * 0.5) a = i + 1;
      });
    }
    return a;
  }
  function tick() {
    const a = activeIndex();
    if (a !== idx) {
      idx = a;
      sheets.forEach((s, i) => {
        const on = i + 1 === a;
        s.classList.toggle("is-on", on);
        if (on) {
          s.classList.remove("sweep");
          void s.offsetWidth;
          s.classList.add("sweep");
        }
      });
    }
    const host = a === 0 ? root.querySelector(".cover") : sheets[a - 1];
    pairs.forEach((p) => p[1].classList.toggle("live", p[2] === host && drawn(p[0])));
    if (host)
      host.querySelectorAll<HTMLElement>(".gnotes li").forEach((li) => {
        li.classList.toggle("lit", parseFloat(getComputedStyle(li).opacity) > 0.8);
      });
  }
  let rafId = 0;
  const onScroll = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  };
  const iv = window.setInterval(tick, 200);
  window.addEventListener("scroll", onScroll, { passive: true });
  tick();
  return () => {
    window.clearInterval(iv);
    window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(rafId);
    pairs.forEach((p) => p[1].remove());
    sheets.forEach((s) => s.classList.remove("is-on", "sweep"));
    root.querySelectorAll(".gnotes li.lit").forEach((li) => li.classList.remove("lit"));
  };
}
