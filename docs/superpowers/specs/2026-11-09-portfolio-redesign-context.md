# Portfolio Redesign — Working Context & Handoff (2026-11-09)

Durable context so this work survives compaction or a fresh session. Read this +
`PRODUCT.md` first. The site is **kushalkrishnappa.com** (Next.js 15 / React 19 /
Tailwind v4 / TS, data-driven under `src/data/*`).

## Goal

Rebuild the portfolio into the **best advertisable site** positioning Kushal as a
**backend & platform engineer**. The site becomes the source of truth; the resume
(`~/Desktop/KushalKrishnappa.pdf`) will be updated to follow it afterward. User
will review/trim content later — build strong first.

## Workflow decisions (user-directed)

- Design driven by the **Impeccable** design skill (installed at
  `.agents/skills/impeccable/`, symlinked into `.claude/skills/`). Flow: `init`
  (done → `PRODUCT.md`) → `new-work` concept-seed → **browser decision page** the
  user approves → code-led build → finish review (spawn `impeccable-finish-reviewer`).
- Build executed with **subagent-driven-development** (fresh subagent per task +
  spec-review then quality-review). Needs a `writing-plans` plan first.
- **Impeccable setup note:** `/impeccable doctor` reports a missing design hook
  (`.codex/hooks.json`); optional. Run `impeccable detect --json <targets>` once at
  finish (hookless web build).

## Design-direction decision — STATE: LOCKED ✅ (Monumental Nameplate)

**Chosen (2026-11-09): "Monumental Nameplate"** — a dark, monumental typographic
wordmark where "KUSHAL KRISHNAPPA" fills the first viewport as a living signature
(split-text reveal on load). Code-led. **Binding constraints:** dark theme only
(no light); name-reveal intro; **the hero doubles as an embeddable iframe
signature — the name must dominate and stay legible at small sizes.**
Reference craft bar (do NOT clone): abhirao.in (dark, Go-cyan, split-text name).
Direction contract: `.impeccable/surfaces/src-app-page-tsx.md`. Chosen mock to
build to: `.impeccable/mocks/decision/model-pick.html` (near-black #0A0A0A, bone
#ECECEA, single cool accent ~#4DD4E0, heavy grotesk wordmark, mono labels, pill
chips). Next: writing-plans → subagent-driven-development build → impeccable
finish review (`impeccable-finish-reviewer`) + DESIGN.md (`impeccable-documenter`).

### (prior) Design-direction decision history

- concept-seed (mode **persuade**): seed key `48176e957ac132041d5236f04c3b285a`,
  **SEED REFERENCE `seed:300497bb2ab272a7`** (write this in the surface brief FORM
  line and `build-phase`/`--from`, never the raw key). Assigned index 4.
- Decision payload: `.impeccable/mocks/decision/payload.json`. Served via
  `impeccable serve-question --start --payload <file>`; collect with `--wait --key`.
- The hand (code-led, no image gen → HTML sketches / wireframes):
  - **assigned (THE ROLL) — "Technical Spec / RFC"**: career as an authoritative
    spec/standard. Paper ground, two committed inks (ink-black + cobalt #17346B,
    amber normative markers), status block, big *Abstract* landing the pitch in one
    line, numbered sections, Figure-1 topology sketch. Raised by: Risograph (two-ink
    courage) + Broadcast (one bold focal moment). HTML mock: `assigned.html`.
  - **pick (IMPECCABLE'S PICK) — "System Architecture Diagram"**: the page IS a live
    service-topology diagram you navigate. Teal active-path accent #0EA5A4 on a
    dotted engineering canvas. Risk: expected move, scannability. HTML mock:
    `model-pick.html`.
  - **competitive challengers (full cards):** VU-Meter Bridge
    (`signals-instruments-vu-meter-bridge`), Provenance Ribbon
    (`exhibition-museum-curation-provenance-ribbon` — great fit for the honesty
    principle: marks measured/estimated/collaborative), Brick Build-Instructions
    (`games-toys-physics-play-brick-build-instructions`).
  - **declined (demoted):** Risograph (`risograph-web-system`), Broadcast
    (`digital-design-canon-emergency-signal-degradation`).
  - **canon (standing exit):** clean conventional dev portfolio.
  - **waiting in "bolder" re-roll pool:** Fletcher Wit-Poster
    (`brand-identity-canon-fletcher-wit-poster`) — hand caps at 3 full challengers.
- **TELEMETRY after the round resolves:** rerun
  `impeccable concept-seed --from 48176e957ac132041d5236f04c3b285a --scope direction
  --mode persuade --kind <assigned|pick|challenger|grounded|canon|reroll>`
  (add `--chosen <SOURCE ID>` if a challenger won; `--register <safer|bolder>` if steered).
- **Next after pick:** write the surface brief (`## Direction contract`, 6 blocks +
  `seed:300497bb2ab272a7`) via `impeccable surface-brief write src/app/page.tsx`,
  then `writing-plans`, then `subagent-driven-development`.

## Content plan — goldmine → defensible site content

Source: `~/Playground/jobs/career/goldmine/`. Use **most-defensible** framings; the
goldmine's per-role "defensible wording" notes are authoritative over the resume.

### Hero / Whoami
- Name: Kushal Krishnappa. Tagline: "building invisible infrastructure for visible
  impact." Positioning: backend & platform engineer; distributed systems,
  multi-tenancy, reliability at scale. Grad **May 2027** (4.0 GPA, Northeastern MSCS).
- Through-lines to surface: **multi-tenancy, Temporal, reliability, AI-SDLC**.
- Quick info: Boston, MA · MSCS @ Northeastern · 2.5+ yrs SWE.

### Impact metrics (replace current — fix undefensible ones)
- Keep: **5h → 10min MTTR** (Pure Auto Sim Rehab), **9,000+ VMs** (Pure fleet).
- DROP **"90%+ automation rate"** (no source). Replace 3rd metric with a defensible
  one, e.g. **66 PRs / 61 Jira tickets in ~4 months** (RoonCyber cnapp-dashboard) or
  **2,000-testbed fleet**.

### Experience (chronological; defensible wording)
- **RoonCyber — Software Engineer (Co-op), Jan–Aug 2026, Boston.** VC-backed
  AI-security startup (ex-ThreatX team; design partners only — NOT paying customers).
  Bullets:
  - **Alert-bell AI-security notification platform** (his largest system — ADD, not
    on site): 3 detectors (new High/Critical, AI-identity risk escalation, Shadow-AI
    first-observation) + API + bell UI + per-user settings. Idempotent per-tenant
    watermark raised atomically; emission caps that defer, never drop; cold-start
    baseline; dedup/escalation state in a tracker (not the feed); panic recovery so a
    detector can't kill SQS ingestion; **mutation-tested**, real-role RLS tests,
    `-race`. The **most-requested feature** in platform demos.
  - **AI Identity ownership story**: took over the AI-Identity (NHI) pipeline when
    the owner left **2 weeks before a board-requested launch**; shipped **16 PRs in
    3 weeks**; launched on schedule (Jul 21); CEO + Director of Product thanked him.
  - **Multi-tenant M2M API auth** (external-api): SHA-256-hashed keys, ristretto
    cache with TTL capped to token expiry, opaque 401s, token-derived tenant, RLS
    SELECT/write split, strong-consistency primary-pool reads. SOFTEN: not "unblocking
    enterprise deals" (deal didn't close) → "design later reused as the auth layer
    for the platform's MCP server". "10+ endpoints" → "the auth layer + first 4 data
    endpoints".
  - **Azure posture detection**: Go Lambda collector normalizing Azure Policy findings
    into the shared findings schema so existing cross-cloud risk/blast-radius views
    covered Azure with no new endpoints (~96 policies in dev).
  - **eBPF pipeline**: extended the runtime (eBPF) analyzer to emit a value-stripped,
    shape-preserving request/response that pinpoints the offending field, surfaced in
    the incident UI. DROP the "90%"/"30%" numbers (estimated). He did NOT write the
    eBPF kernel programs.
  - **puca agentic dev harness**: co-designed the staged PRD→merged-PR pipeline with
    human gates + drift/spec-fidelity validators with the tech lead; used daily by
    9+ of 12 engineers; "25+ features over **4 months**" (not 3).
- **Pure Storage / Everpure — Member of Technical Staff 2, Jan 2023–Dec 2024, Bengaluru.**
  - **Auto Sim Rehab** event-driven reconciliation service (Python, Temporal): drove
    failed testbeds back to known-good state, MTTR 5h→10min across a 2,000-testbed /
    9,000+-VM OpenStack fleet; distributed Temporal semaphore live-tunable via Consul;
    scoped to service-account events so operator offlines were never clobbered. Plus
    snapshot-restore workflows (Go, Temporal), further 85%.
  - **Disruption-manager** rollout-safety service: per-group concurrency budgets in
    Consul, test-aware gating via assetsdb, pluggable check/request/cancel interface,
    canary + fast revert. SOFTEN: not "ported to Go and open-sourced" (he did NOT port
    it) → "a generic Go version was later open-sourced by the Dominator maintainer
    (Richard Gooch)". ~7× fewer DB reads via 100s-TTL Redis + negotiated backoff.
  - **Ubuntu 14→22 dev-VM migration** as a permanent release gate: Packer golden
    image, reconciled team workflows, `unext` pytest suite; VP recognition. KubeVirt
    VM-lifecycle fleets (1,500+ env).
- **Mercedes-Benz R&D India — SWE Intern (Mar–Aug 2022) then SWE (Aug–Dec 2022), Bengaluru.**
  - Pitched a central data warehouse as an intern, then built it: multi-source
    ingestion (Java/Spring Boot) → Azure Event Hubs behind a generic interface;
    PySpark/Delta Lake ETL over 90TB+ OTA telemetry. p95 latency −50% on hottest
    endpoints (N+1 fix) during on-call. Intern: OTA analytics dashboard
    (Spring Boot/Vue/MongoDB), OAuth2, Azure DevOps CI/CD + k8s.

### Projects (fix authorship — verified against git)
- **Beacon** (`kap-theorem/beacon`, NOT the stale fork) — Go + Temporal notification
  service, **sole author**; hashed `bk_` API keys, token-bucket rate limit + quota,
  idempotency via workflow-ID reject-duplicate, DLQ replay, hot-reload fail-closed
  config, 90% coverage gate. SOFTEN resume: it's an SMTP *client* (SendGrid/Mailgun/
  SES), not "own SMTP server"; "2 services" / production use not evidenced.
- **temporal-onprem-stack** (+ blog "Deploying Temporal with mTLS") — self-hosted
  Temporal, nginx mTLS, Infisical private CA, Tailscale, Cloudflare Tunnel. Strong
  infra/SRE signal, sole author. (This is the real "Cloudflare DNS" evidence.)
- **ebpf-http-scan** — Go + cilium/ebpf CO-RE; `tcp_recvmsg` capture. Sole author,
  early (M1 only). "A small version of what I worked on at RoonCyber."
- **dsapanicle.com** — frame as **contributor** (content + tooling), NOT his platform.
  DROP "10-20 active users" (no evidence).
- **REMOVE / do not claim authorship:** **Auth Server** (`kap-theorem/auth`, 0 commits
  by him) and **kvstore** (0 commits by him; "multi-node replication" doesn't exist).
  These are on the current resume/LinkedIn and are the most serious contradictions.
- Keep academic/older as a lighter tier if useful: CS5600 multithreaded KV server +
  consistency stress test, Calendar (AVL augmented interval tree — drop the
  "O(k+log n)" claim), CS6983 agentic-AI coursework (no results yet — don't claim).

### Education & research (ADD research role)
- Northeastern MSCS, Jan 2025 – May 2027, GPA 4.0. PES B.Tech CSE 2018–2022.
- **Research Assistant, Khoury (Aug 2026–present)** with **Prof. Xiang Ren**, Systems
  Research Group — relational debugging (Perspect, OSDI '23) vs Kubernetes
  control-plane perf bugs. NOT currently on site — add.

### Publications / certs (keep)
- IEEE 2022, 5G multi-objective genetic algorithm (PES C-ISFCR capstone).
- Certs: Terraform Associate (004), AWS Fundamentals, OWASP ZAP, Java OOP,
  Foundations of Responsible AI.

## PRIVATE — never publish (from goldmine)
Internal Jira keys (PENG-*), PR numbers, internal table/route/tenant names,
colleague names, anything from internal PRDs. May inform wording; never verbatim.
Also: rotate the Aiven MySQL password committed in public `cs5200-dbms`; check
`dada2-agentic-ai` / `C-INTAL-Library` visibility (user's separate action items).

## Build approach (after direction is locked)
1. `impeccable surface-brief write src/app/page.tsx` with the `## Direction contract`.
2. `writing-plans` → tasks: (a) update `src/data/*` + `src/types` with defensible
   content above (+ new fields for new sections like research, case studies);
   (b) rebuild section components + global tokens in the locked world; (c) new
   sections (alert-bell/AI-Identity case study, research); (d) a11y/SEO/OG/metadata;
   (e) finish review.
3. `subagent-driven-development` to execute; fresh subagent per task, spec then
   quality review. Keep `npm run build`, `npm run lint`, `npm test` green.
4. Impeccable finish: `impeccable detect --json` on changed targets, spawn
   `impeccable-finish-reviewer`, write `DESIGN.md` via `impeccable-documenter`.
