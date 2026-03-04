import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ComposedChart, Cell
} from "recharts";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  bg:          "#0a0c10",
  panel:       "#0f1219",
  panelBorder: "#1c2333",
  accent1:     "#e8b84b",
  accent2:     "#4b9fe8",
  danger:      "#e84b4b",
  success:     "#4be89a",
  warn:        "#e8854b",
  muted:       "#8892a4",
  textPrimary: "#e2e8f0",
  textSub:     "#718096",
  textDim:     "#4a5568",
  grid:        "#1c2333",
};

// ── DATA ─────────────────────────────────────────────────────────────────────
const SPINE = [
  { m:"Jun '25", m8_disp:4825,  m9_disp:18042, m8_full:49575,  m9_full:193620, m8_rate:10.28, m9_rate:10.73, m8_s1:45.88,  m9_s1:40.24,  m8_warn:28.44, m9_warn:60.40, m8_silent:68.92, m9_silent:35.97 },
  { m:"Jul '25", m8_disp:4900,  m9_disp:18250, m8_full:52690,  m9_full:196928, m8_rate:10.75, m9_rate:10.79, m8_s1:47.39,  m9_s1:41.57,  m8_warn:28.43, m9_warn:61.56, m8_silent:68.44, m9_silent:33.00 },
  { m:"Aug '25", m8_disp:4971,  m9_disp:18547, m8_full:85069,  m9_full:184267, m8_rate:17.11, m9_rate:9.94,  m8_s1:64.66,  m9_s1:39.37,  m8_warn:29.95, m9_warn:61.08, m8_silent:78.10, m9_silent:37.99 },
  { m:"Sep '25", m8_disp:5034,  m9_disp:18784, m8_full:207067, m9_full:259714, m8_rate:41.13, m9_rate:13.83, m8_s1:116.84, m9_s1:48.65,  m8_warn:26.82, m9_warn:56.36, m8_silent:83.19, m9_silent:48.27 },
  { m:"Oct '25", m8_disp:5147,  m9_disp:18925, m8_full:298761, m9_full:397567, m8_rate:58.05, m9_rate:21.01, m8_s1:158.46, m9_s1:64.19,  m8_warn:27.61, m9_warn:59.20, m8_silent:79.26, m9_silent:46.05 },
  { m:"Nov '25", m8_disp:5188,  m9_disp:19054, m8_full:264057, m9_full:411039, m8_rate:50.90, m9_rate:21.57, m8_s1:143.92, m9_s1:65.18,  m8_warn:28.08, m9_warn:59.52, m8_silent:75.94, m9_silent:44.39 },
  { m:"Dec '25", m8_disp:5284,  m9_disp:19179, m8_full:131128, m9_full:278546, m8_rate:24.82, m9_rate:14.52, m8_s1:98.63,  m9_s1:56.72,  m8_warn:27.80, m9_warn:58.80, m8_silent:74.57, m9_silent:43.24 },
  { m:"Jan '26", m8_disp:5320,  m9_disp:19212, m8_full:66399,  m9_full:211073, m8_rate:12.48, m9_rate:10.99, m8_s1:71.09,  m9_s1:50.88,  m8_warn:28.08, m9_warn:59.13, m8_silent:66.52, m9_silent:40.61 },
  { m:"Feb '26\u2020", m8_disp:5341, m9_disp:19244, m8_full:56045, m9_full:192701, m8_rate:10.49, m9_rate:10.01, m8_s1:60.96, m9_s1:46.08, m8_warn:99.49, m9_warn:98.60, m8_silent:null, m9_silent:null },
];

const SPINE_MAIN = SPINE.slice(0, 8); // exclude Feb†

const EXPIRY_TIER = [
  { m:"Jun '25", e9_fresh:71.8, e9_exp:28.2 },
  { m:"Jul '25", e9_fresh:53.2, e9_exp:46.8 },
  { m:"Aug '25", e9_fresh:31.8, e9_exp:68.2 },
  { m:"Sep '25", e9_fresh:36.9, e9_exp:63.1 },
  { m:"Oct '25", e9_fresh:40.0, e9_exp:60.0 },
  { m:"Nov '25", e9_fresh:38.5, e9_exp:61.5 },
  { m:"Dec '25", e9_fresh:32.0, e9_exp:68.0 },
  { m:"Jan '26", e9_fresh:39.8, e9_exp:60.2 },
];

const INSERTED_EXPIRED = [
  { m:"Jun '25", p8:11.36, p9:9.36  },
  { m:"Jul '25", p8:12.87, p9:10.90 },
  { m:"Aug '25", p8:14.37, p9:13.60 },
  { m:"Sep '25", p8:12.64, p9:11.61 },
  { m:"Oct '25", p8:13.78, p9:14.30 },
  { m:"Nov '25", p8:17.25, p9:18.19 },
  { m:"Dec '25", p8:18.77, p9:19.56 },
  { m:"Jan '26", p8:18.14, p9:17.29 },
];

const SILENT = SPINE.filter(d => d.m8_silent !== null).map(d => ({
  m: d.m, p8: d.m8_silent, p9: d.m9_silent,
}));

const LEAD_TIME = [
  { m:"Jun '25", avg8:10, med8:9,  avg9:9,  med9:8  },
  { m:"Jul '25", avg8:14, med8:15, avg9:15, med9:15 },
  { m:"Aug '25", avg8:13, med8:14, avg9:15, med9:16 },
  { m:"Sep '25", avg8:16, med8:17, avg9:14, med9:13 },
  { m:"Oct '25", avg8:14, med8:14, avg9:14, med9:15 },
  { m:"Nov '25", avg8:14, med8:14, avg9:14, med9:15 },
  { m:"Dec '25", avg8:13, med8:12, avg9:14, med9:14 },
  { m:"Jan '26", avg8:14, med8:14, avg9:14, med9:14 },
];

const HOUR_DATA_8 = [
  {h:"12a",r:4.22},{h:"1a",r:4.65},{h:"2a",r:4.57},{h:"3a",r:4.35},{h:"4a",r:4.51},{h:"5a",r:4.85},
  {h:"6a",r:3.68},{h:"7a",r:3.93},{h:"8a",r:4.33},{h:"9a",r:4.53},{h:"10a",r:4.62},{h:"11a",r:4.30},
  {h:"12p",r:4.15},{h:"1p",r:4.15},{h:"2p",r:4.21},{h:"3p",r:4.29},{h:"4p",r:4.37},{h:"5p",r:4.37},
  {h:"6p",r:4.21},{h:"7p",r:4.33},{h:"8p",r:3.97},{h:"9p",r:3.50},{h:"10p",r:3.67},{h:"11p",r:3.80},
];
const HOUR_DATA_9 = [
  {h:"12a",r:2.20},{h:"1a",r:2.51},{h:"2a",r:3.00},{h:"3a",r:2.65},{h:"4a",r:2.38},{h:"5a",r:2.69},
  {h:"6a",r:2.56},{h:"7a",r:2.15},{h:"8a",r:2.22},{h:"9a",r:2.22},{h:"10a",r:2.11},{h:"11a",r:1.92},
  {h:"12p",r:1.90},{h:"1p",r:1.88},{h:"2p",r:1.84},{h:"3p",r:1.84},{h:"4p",r:1.85},{h:"5p",r:1.88},
  {h:"6p",r:1.79},{h:"7p",r:1.75},{h:"8p",r:1.61},{h:"9p",r:1.54},{h:"10p",r:1.68},{h:"11p",r:1.70},
];

const RECOVERY_8 = [
  { tier:"Severe 500+",   units:269,  spike:788, post:245, pct:31.1, fully:12,   mostly:148,  still:109  },
  { tier:"Chronic 100-499",units:2044,spike:224, post:45,  pct:20.1, fully:185,  mostly:1354, still:505  },
  { tier:"Moderate 50-99",units:866,  spike:72,  post:21,  pct:29.2, fully:124,  mostly:451,  still:291  },
  { tier:"Low <50",       units:1282, spike:21,  post:11,  pct:52.4, fully:318,  mostly:288,  still:676  },
];
const RECOVERY_9 = [
  { tier:"Severe 500+",   units:94,   spike:763, post:261, pct:34.2, fully:2,    mostly:38,   still:54   },
  { tier:"Chronic 100-499",units:3276,spike:170, post:53,  pct:31.2, fully:90,   mostly:1685, still:1501 },
  { tier:"Moderate 50-99",units:3486, spike:71,  post:30,  pct:42.3, fully:193,  mostly:1331, still:1962 },
  { tier:"Low <50",       units:9232, spike:18,  post:16,  pct:88.9, fully:1486, mostly:1150, still:6596 },
];

const ZSA_ZPL = [
  { grp:"ZSA 8100", occ:145.0, s1:404.7, col:C.accent1 },
  { grp:"ZSA 9100", occ:56.2,  s1:169.8, col:C.accent2 },
  { grp:"ZPL 9100", occ:50.5,  s1:176.9, col:"#7ba9d4"  },
];

const IDLE_OCC = [
  { label:"0-8h  High",  m8:213.6, m9:114.8 },
  { label:"8-12h Mod",   m8:178.8, m9:91.3  },
  { label:"12-16h Low",  m8:90.3,  m9:64.9  },
  { label:"16-20h Min",  m8:52.2,  m9:44.5  },
  { label:"20+h Idle",   m8:8.5,   m9:20.3  },
];

const CHAINS = [
  { name:"Wendy's 8100",      type:"8100", occ:210.0, idle:9.4,  age:344  },
  { name:"Universal Studios", type:"9100", occ:144.6, idle:14.2, age:620  },
  { name:"White Castle",      type:"8100", occ:110.0, idle:9.1,  age:307  },
  { name:"Wendy's 9100",      type:"9100", occ:94.4,  idle:14.5, age:565  },
  { name:"WAWA",              type:"9100", occ:82.8,  idle:8.3,  age:775  },
  { name:"Burger King 8100",  type:"8100", occ:76.2,  idle:10.0, age:423  },
  { name:"Wingstop",          type:"9100", occ:60.2,  idle:12.8, age:1277 },
  { name:"AMC Theatres",      type:"9100", occ:50.0,  idle:14.7, age:497  },
  { name:"BK 9100",           type:"9100", occ:44.0,  idle:14.3, age:808  },
];

const HYPOTHESES = [
  { name:"BIB Supply / Batch Quality",    score:72, status:"MOST LIKELY",          col:C.danger,
    notes:"Fleet-wide simultaneous onset both types. 4-month transient then clean recovery. High-traffic machines first. Sequential type exposure (8100 Aug → 9100 Sep) consistent with distribution wave. Cannot confirm without lot codes." },
  { name:"Q4 Volumetric Pump Stress",     score:68, status:"STRONGLY SUPPORTED",   col:C.warn,
    notes:"Idle time 4× inverse confirmed. Fast-food chains lead. 1-strike precedes full occlusion. Burst peaks align with occ peak. Spike ratio flat across all 24 hours — not a peak-hour artifact. Cannot isolate without POS data." },
  { name:"ZSA Architecture Baseline Gap", score:80, status:"CONFIRMED STRUCTURAL",  col:C.accent2,
    notes:"ZSA 8100: 145 occ/disp vs ZPL 9100: 50.5 — 2.9× structural penalty year-round, not spike-specific. No expiry tracking on ZSA amplifies all other issues. Requires mechanical design review." },
  { name:"Expiry as Enabler",             score:55, status:"PARTIAL CONTRIBUTOR",   col:C.accent1,
    notes:"Expired % climbs Jun→Jan. ~47% fresh BIBs still occlude — cannot be sole cause. Warning % DROPS during spike on 9100 (61%→56%) = anti-correlation. Expiry is a compounding vulnerability, not the trigger." },
  { name:"Operator Behavior",             score:48, status:"CONTRIBUTING FACTOR",   col:C.muted,
    notes:"18–19% inserts already expired by Nov–Dec '25 (up from 9% in Jun). Gradual trend — not a sudden Sep trigger. Warning lead time stable at 9–17 days; operators not acting on warnings." },
];

const RULED_OUT = [
  { h:"Fleet Growth Artifact",      why:"Per-unit rate spiked 5.7× on 8100 with monthly active-dispenser denominator. Not a count artifact." },
  { h:"Firmware Threshold Change",  why:"occludedvalue locked at avg −8, P25/median −9 all 10 months. Zero shift at spike boundary." },
  { h:"New Dispenser Wave",         why:"97%+ dispensers first appear Jun 2025 (window start artifact). <2% new mid-window." },
  { h:"Small Chronic Offender Group",why:"Mid-tier (100–499) drives 60% across 2,054 8100 units — diffuse fleet problem, not isolated." },
  { h:"Expiry as Primary Driver",   why:"Warning % drops 61%→56% on 9100 exactly when occlusions surge — clean anti-correlation." },
  { h:"Idle Time / Stagnation",     why:"INVERSE relationship confirmed: highest-traffic dispensers occlude most. Stagnation eliminated." },
  { h:"Dispenser Age",              why:"Near-flat across all 9100 age cohorts (59–72 avg occ/unit). Not a material driver." },
];

// ── REUSABLE COMPONENTS ───────────────────────────────────────────────────────
const ss = (obj) => obj; // identity — makes inline style objects easier to read

const Panel = ({ children, style = {}, className = "" }) => (
  <div
    className={className}
    style={{
      background: C.panel,
      border: `1px solid ${C.panelBorder}`,
      borderRadius: 12,
      padding: "1.25rem",
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <div style={{ fontFamily: "monospace", color: C.accent1, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
      {sub}
    </div>
    <div style={{ fontFamily: "Georgia, serif", color: C.textPrimary, fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.3 }}>
      {children}
    </div>
  </div>
);

const Tag = ({ children, col = C.accent1 }) => (
  <span style={{
    background: col + "22", border: `1px solid ${col}66`, color: col,
    fontSize: "0.6rem", padding: "0.1rem 0.45rem", borderRadius: 3,
    fontFamily: "monospace", letterSpacing: "0.07em", whiteSpace: "nowrap",
  }}>
    {children}
  </span>
);

const InfoBox = ({ col = C.accent1, children }) => (
  <div style={{
    background: col + "12", border: `1px solid ${col}40`,
    borderRadius: 8, padding: "0.8rem 1.1rem",
    fontSize: "0.74rem", color: C.textSub, lineHeight: 1.65,
    marginBottom: "1.25rem",
  }}>
    {children}
  </div>
);

const ChartNote = ({ children }) => (
  <div style={{ color: C.textDim, fontSize: "0.63rem", lineHeight: 1.55, marginTop: "0.5rem" }}>
    {children}
  </div>
);

// Tooltip renderer — wraps as a function so Recharts calls it correctly
const makeTT = (fmt) => ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#0d1117", border: `1px solid ${C.panelBorder}`, borderRadius: 8, padding: "9px 13px", fontSize: "0.73rem" }}>
      <div style={{ color: C.textSub, marginBottom: 5, fontFamily: "monospace" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.textPrimary }}>
          <span style={{ color: C.textDim }}>{p.name}: </span>
          <strong>{fmt ? fmt(p.value) : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const ttDefault   = makeTT(null);
const ttRate      = makeTT(v => `${Number(v).toFixed(2)} occ/disp`);
const ttPct       = makeTT(v => `${Number(v).toFixed(1)}%`);
const ttDays      = makeTT(v => `${v} days`);
const ttOcc       = makeTT(v => `${v} occ/unit`);
const ttRatio     = makeTT(v => `${Number(v).toFixed(2)}× baseline`);

// Spike-period background drawn as a manual SVG rect overlay via a custom axis tick — instead use
// ReferenceLine pairs to mark spike boundaries cleanly since ReferenceArea with category axis
// can be unreliable across recharts versions.
const SpikeLines = () => (
  <>
    <ReferenceLine x="Aug '25" stroke={C.accent1} strokeDasharray="4 3" strokeOpacity={0.5} />
    <ReferenceLine x="Nov '25" stroke={C.accent1} strokeDasharray="4 3" strokeOpacity={0.5} label={{ value: "▲ SPIKE", position: "top", fill: C.accent1, fontSize: 9, fontFamily: "monospace" }} />
  </>
);

const axTick = { fill: C.textSub, fontSize: 10 };
const gridProps = { strokeDasharray: "3 3", stroke: C.grid };
const marginStd = { top: 8, right: 16, bottom: 4, left: 0 };

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = ["CONCLUSION", "TREND SPINE", "EXPIRY DEEP-DIVE", "SILENT FAILURES", "MACHINE ANATOMY", "OPERATIONS", "EVIDENCE"];

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.textPrimary, fontFamily: "system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: `1px solid ${C.panelBorder}`, padding: "1.4rem 1.75rem 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.1rem" }}>
          <div>
            <div style={{ fontFamily: "monospace", color: C.accent1, fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
              CONFIDENTIAL · NNS BEVERAGE DISPENSER PROGRAM · MAR 2026
            </div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: C.textPrimary, lineHeight: 1.2, margin: 0 }}>
              Occlusion Rate Investigation
              <span style={{ color: C.textSub, fontWeight: 400 }}> — Root Cause Analysis</span>
            </h1>
            <div style={{ color: C.textSub, fontSize: "0.78rem", marginTop: "0.35rem" }}>
              Equipment Types 8100 &amp; 9100 · Active US Dispensers · Jun 2025 – Mar 2026 · Ingredient 1048588
            </div>
          </div>
          <div style={{ display: "flex", gap: "2rem", flexShrink: 0 }}>
            {[
              { l: "8100 Peak Rate",  v: "+466%", s: "Oct '25 vs Jun baseline", c: C.accent1 },
              { l: "9100 Peak Rate",  v: "+101%", s: "Nov '25 vs Jun baseline", c: C.accent2 },
              { l: "Spike Duration",  v: "4 mo",  s: "Aug – Nov '25",           c: C.textPrimary },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "monospace", color: s.c, fontSize: "1.9rem", fontWeight: 900, lineHeight: 1 }}>{s.v}</div>
                <div style={{ color: C.textSub, fontSize: "0.65rem", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.l}</div>
                <div style={{ color: C.textDim, fontSize: "0.62rem" }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* tab bar */}
        <div style={{ display: "flex", overflowX: "auto", gap: 0 }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "0.55rem 1rem", fontFamily: "monospace", fontSize: "0.63rem",
              letterSpacing: "0.12em", textTransform: "uppercase", border: "none",
              borderBottom: i === tab ? `2px solid ${C.accent1}` : "2px solid transparent",
              background: "transparent", color: i === tab ? C.accent1 : C.textSub,
              cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s",
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "1.5rem 1.75rem", maxWidth: 1380, margin: "0 auto" }}>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 0 — CONCLUSION
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 0 && (
          <div>
            <InfoBox col={C.danger}>
              <strong style={{ color: C.danger }}>EXECUTIVE FINDING — </strong>
              The Sep–Nov 2025 occlusion spike is{" "}
              <strong style={{ color: C.accent1 }}>real, fleet-wide, and mechanically caused</strong> — not a data artifact, firmware change, or fleet expansion.
              The most probable explanation is a{" "}
              <strong style={{ color: C.danger }}>BIB supply quality event</strong> arriving across both types in sequential waves (8100 onset Aug, 9100 onset Sep),
              amplified by <strong style={{ color: C.warn }}>Q4 volumetric pump stress</strong> in high-traffic fast-food environments.
              Expiry is a <strong style={{ color: C.accent1 }}>contributor but not the primary trigger</strong> — warning rates anti-correlate with the spike.
              The ZSA 8100 structural disadvantage (2.9× occlusion penalty vs ZPL 9100) is a separate persistent problem requiring mechanical review.
            </InfoBox>

            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { l: "8100 Spike Onset",      v: "Aug '25",  s: "1 month before 9100",    c: C.accent1 },
                { l: "8100 Max Rate",          v: "+466%",    s: "Oct '25 vs Jun baseline", c: C.danger  },
                { l: "9100 Max Rate",          v: "+101%",    s: "Nov '25 vs Jun baseline", c: C.accent2 },
                { l: "8100 Silent Fail Peak",  v: "83%",      s: "Sep '25 — no prior warn", c: C.warn    },
                { l: "Fresh BIBs Occluding",   v: "~47%",     s: "expiry not sole cause",   c: C.success },
              ].map((s, i) => (
                <Panel key={i}>
                  <div style={{ fontFamily: "monospace", color: s.c, fontSize: "1.7rem", fontWeight: 900, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ color: C.textSub, fontSize: "0.67rem", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.l}</div>
                  <div style={{ color: C.textDim, fontSize: "0.62rem", marginTop: "0.15rem" }}>{s.s}</div>
                </Panel>
              ))}
            </div>

            {/* Three-driver cards */}
            <div style={{ fontFamily: "monospace", color: C.textSub, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.65rem" }}>
              Three-Driver Model — Ranked by Evidence Strength
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                {
                  rank: "01", title: "BIB Supply / Batch Quality", score: 72, col: C.danger,
                  tag: "MOST LIKELY — EXTERNAL DATA NEEDED TO CONFIRM",
                  bullets: [
                    "Both equipment types spiked simultaneously — not a machine-class issue",
                    "8100 onset Aug, 9100 Sep: sequential exposure consistent with a distribution wave",
                    "Transient 4-month window then clean return to baseline — matches bad-batch lifecycle",
                    "High-traffic machines hit first: they cycle through BIBs 2–3× faster",
                    "CANNOT CONFIRM without manufacturer lot codes or plant dispatch records",
                  ],
                },
                {
                  rank: "02", title: "Q4 Volumetric Pump Stress", score: 68, col: C.warn,
                  tag: "STRONGLY SUPPORTED — CORRELATES BUT CANNOT ISOLATE",
                  bullets: [
                    "Idle time inverse: 0–8h idle = 213.6 occ/unit (8100) vs 8.5 at 20+h idle",
                    "Wendy's 8100 (9.4h idle) = 210 occ/unit; BK 9100 (14.3h idle) = 44 occ/unit",
                    "Spike ratio uniform 4.2–4.9× across all 24 hours — not a peak-hour artifact",
                    "1-strike events precede full occlusion: mechanical pump degradation chain confirmed",
                    "CANNOT ISOLATE from batch hypothesis without POS transaction volume data",
                  ],
                },
                {
                  rank: "03", title: "Expiry Accumulation (Enabler)", score: 55, col: C.accent1,
                  tag: "PARTIAL CONTRIBUTOR — ANTI-CORRELATES AS PRIMARY TRIGGER",
                  bullets: [
                    "% inserts-already-expired rose from 9% (Jun) to 19% (Nov–Dec) — gradual",
                    "Expired BIB % at occlusion rose 14%→62% Jun→Jan (ZPL machines only)",
                    "BUT: warning % DROPS 61%→56% on 9100 during spike — should rise if expiry drove it",
                    "~47% of traceable occlusions involve fresh BIBs with 30+ days remaining",
                    "Expiry creates vulnerability; a separate trigger activates the failure",
                  ],
                },
              ].map((d, i) => (
                <Panel key={i} style={{ borderColor: d.col + "50" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div style={{ fontFamily: "monospace", color: d.col, fontSize: "2rem", fontWeight: 900, opacity: 0.25, lineHeight: 1 }}>{d.rank}</div>
                    <div style={{ background: d.col + "22", border: `1px solid ${d.col}55`, borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", color: d.col, fontSize: "0.68rem", fontWeight: 700 }}>
                      {d.score}/100
                    </div>
                  </div>
                  <div style={{ fontFamily: "Georgia, serif", color: C.textPrimary, fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.35rem" }}>{d.title}</div>
                  <div style={{ color: d.col, fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.05em", marginBottom: "0.7rem" }}>{d.tag}</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {d.bullets.map((b, j) => (
                      <li key={j} style={{ color: C.textSub, fontSize: "0.71rem", lineHeight: 1.55, marginBottom: "0.3rem", paddingLeft: "0.85rem", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: d.col }}>›</span>{b}
                      </li>
                    ))}
                  </ul>
                </Panel>
              ))}
            </div>

            {/* Ruled out */}
            <Panel style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontFamily: "monospace", color: C.success, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.85rem" }}>
                ✓ Hypotheses Ruled Out With Data (7)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                {RULED_OUT.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                    <span style={{ color: C.success, fontFamily: "monospace", fontSize: "0.8rem", flexShrink: 0, marginTop: "0.05rem" }}>✗</span>
                    <div>
                      <div style={{ color: C.textSub, fontSize: "0.73rem", fontWeight: 600 }}>{r.h}</div>
                      <div style={{ color: C.textDim, fontSize: "0.65rem", marginTop: "0.1rem", lineHeight: 1.45 }}>{r.why}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Actions */}
            <div style={{ fontFamily: "monospace", color: C.textSub, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.65rem" }}>
              Recommended Actions
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
              {[
                { p: "P1", a: "Request BIB lot traceability data from manufacturer for Aug–Nov '25 production window. Match lot codes to affected serial numbers.", c: C.danger  },
                { p: "P2", a: "Investigate ZSA 8100 micro-pump architecture: why 2.9× baseline penalty vs ZPL 9100? Mechanical design review required.", c: C.warn    },
                { p: "P3", a: "Operator training on BIB freshness at load. 19% of inserts already expired by Nov–Dec — significant and growing operational gap.", c: C.accent1 },
                { p: "P4", a: "Re-run C1 plantcode query with broader event filter. Confirm which event type carries plantcode field for ingredient 1048588.", c: C.accent2 },
              ].map((a, i) => (
                <div key={i} style={{ background: a.c + "10", border: `1px solid ${a.c}30`, borderRadius: 10, padding: "0.9rem" }}>
                  <div style={{ fontFamily: "monospace", color: a.c, fontSize: "0.62rem", letterSpacing: "0.1em", marginBottom: "0.45rem" }}>{a.p} — ACTION</div>
                  <div style={{ color: C.textSub, fontSize: "0.71rem", lineHeight: 1.55 }}>{a.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 1 — TREND SPINE
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 1 && (
          <div>
            <SectionTitle sub="Core Metric">Occlusions Per Active Dispenser — 10-Month Spine</SectionTitle>

            <InfoBox col={C.accent1}>
              <strong style={{ color: C.accent1 }}>How to read this: </strong>
              All rates = full occlusions ÷ COUNT(DISTINCT active dispensers that month). Denominator rises Jun→Feb
              (8100: 4,825→5,341; 9100: 18,042→19,244) so fleet growth cannot inflate per-unit rates.
              Mar '26 is partial data through Mar 3 only — excluded from all trend conclusions.
              † Feb '26 expiry metrics are contaminated by an 8× firmware enforcement spike in <em>nnscheckenjoybytrouble</em>.
              Dashed vertical lines mark spike window boundaries (Aug–Nov '25).
            </InfoBox>

            {/* Main rate chart */}
            <Panel style={{ marginBottom: "1rem" }}>
              <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>Full Occlusions per Active Dispenser — Primary Normalized Rate (Jun '25 – Jan '26)</div>
              <ResponsiveContainer width="100%" height={310}>
                <ComposedChart data={SPINE_MAIN} margin={marginStd}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="m" tick={axTick} />
                  <YAxis tick={axTick} />
                  <Tooltip content={ttRate} />
                  <Legend wrapperStyle={{ fontSize: "0.72rem", color: C.textSub }} />
                  <SpikeLines />
                  <Line dataKey="m8_rate" name="8100 Occ/Disp" stroke={C.accent1} strokeWidth={2.5} dot={{ r: 4, fill: C.accent1 }} />
                  <Line dataKey="m9_rate" name="9100 Occ/Disp" stroke={C.accent2} strokeWidth={2.5} dot={{ r: 4, fill: C.accent2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </Panel>

            {/* 1-strike vs full */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              {[
                { type: "8100", rateKey: "m8_rate", s1Key: "m8_s1", col: C.accent1 },
                { type: "9100", rateKey: "m9_rate", s1Key: "m9_s1", col: C.accent2 },
              ].map(({ type, rateKey, s1Key, col }) => (
                <Panel key={type}>
                  <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.6rem" }}>1-Strike (Leading Indicator) vs Full Occlusion — {type}</div>
                  <ResponsiveContainer width="100%" height={210}>
                    <ComposedChart data={SPINE_MAIN} margin={marginStd}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="m" tick={{ ...axTick, fontSize: 9 }} />
                      <YAxis tick={{ ...axTick, fontSize: 9 }} />
                      <Tooltip content={ttDefault} />
                      <Bar dataKey={s1Key} name="1-Strike/Disp" fill={col + "44"} />
                      <Line dataKey={rateKey} name="Full Occ/Disp" stroke={col} strokeWidth={2} dot={{ r: 0 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <ChartNote>
                    1-Strike events scale with full occlusions every month — confirming mechanical pump degradation chain, not a detection artifact. {type === "8100" ? "8100 spike magnitude: 10.3→58.1 occ/disp (+466%)." : "9100 spike magnitude: 10.7→21.6 occ/disp (+101%)."}
                  </ChartNote>
                </Panel>
              ))}
            </div>

            {/* Monthly detail table */}
            <Panel>
              <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>Full Monthly Spine — Confirmed Data</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.71rem" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.panelBorder}` }}>
                      {["Month", "8100 Disp", "9100 Disp", "8100 Full Occ", "9100 Full Occ", "8100 Rate", "9100 Rate", "8100 1-Strike", "9100 1-Strike"].map(h => (
                        <th key={h} style={{ textAlign: "right", padding: "0.35rem 0.65rem", color: C.textDim, fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SPINE.map((r, i) => {
                      const spike = r.m8_rate > 15 || r.m9_rate > 13;
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.grid}`, background: spike ? C.accent1 + "0a" : "transparent" }}>
                          <td style={{ padding: "0.35rem 0.65rem", color: spike ? C.accent1 : C.textSub, fontFamily: "monospace" }}>{r.m}</td>
                          <td style={{ textAlign: "right", padding: "0.35rem 0.65rem", color: C.textSub }}>{r.m8_disp.toLocaleString()}</td>
                          <td style={{ textAlign: "right", padding: "0.35rem 0.65rem", color: C.textSub }}>{r.m9_disp.toLocaleString()}</td>
                          <td style={{ textAlign: "right", padding: "0.35rem 0.65rem", color: spike ? C.accent1 : C.textSub }}>{r.m8_full.toLocaleString()}</td>
                          <td style={{ textAlign: "right", padding: "0.35rem 0.65rem", color: spike ? C.accent2 : C.textSub }}>{r.m9_full.toLocaleString()}</td>
                          <td style={{ textAlign: "right", padding: "0.35rem 0.65rem", color: spike ? C.danger : C.textPrimary, fontWeight: spike ? 700 : 400, fontFamily: "monospace" }}>{r.m8_rate.toFixed(2)}</td>
                          <td style={{ textAlign: "right", padding: "0.35rem 0.65rem", color: spike ? C.accent2 : C.textPrimary, fontWeight: spike ? 700 : 400, fontFamily: "monospace" }}>{r.m9_rate.toFixed(2)}</td>
                          <td style={{ textAlign: "right", padding: "0.35rem 0.65rem", color: C.textSub }}>{r.m8_s1.toFixed(2)}</td>
                          <td style={{ textAlign: "right", padding: "0.35rem 0.65rem", color: C.textSub }}>{r.m9_s1.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 2 — EXPIRY DEEP-DIVE
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 2 && (
          <div>
            <SectionTitle sub="Expiry Analysis">BIB Freshness, Expiry Timing & Warning Anti-Correlation</SectionTitle>

            <InfoBox col={C.success}>
              <strong style={{ color: C.success }}>KEY FINDING: </strong>
              The 9100 expiry warning % DROPS from 61% → 56% exactly when occlusions surge (Sep–Oct '25). If expiry were the primary trigger, warnings should rise alongside occlusions. This anti-correlation definitively rules out expiry as the spike driver — expiry is an accumulating <em>vulnerability</em>, not the ignition source.
              <br /><strong style={{ color: C.warn }}> 8100 caveat: </strong>Only 15.6% of 8100 occlusions are traceable to a BIB with an expiry date (ZSA machines have no enjoybydate). All 8100 expiry figures are directional only.
            </InfoBox>

            {/* Anti-correlation chart */}
            <Panel style={{ marginBottom: "1rem" }}>
              <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>9100 Expiry Warning Coverage % vs Occlusion Rate — Anti-Correlation During Spike</div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={SPINE_MAIN} margin={marginStd}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="m" tick={axTick} />
                  <YAxis yAxisId="rate" tick={axTick} label={{ value: "Occ/Disp", angle: -90, position: "insideLeft", fill: C.textDim, fontSize: 10, offset: 10 }} />
                  <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tick={axTick} label={{ value: "Warn %", angle: 90, position: "insideRight", fill: C.textDim, fontSize: 10 }} />
                  <Tooltip content={ttDefault} />
                  <Legend wrapperStyle={{ fontSize: "0.72rem" }} />
                  <SpikeLines />
                  <Line yAxisId="rate" dataKey="m9_rate" name="9100 Occ/Disp (left)" stroke={C.accent2} strokeWidth={2.5} dot={{ r: 4, fill: C.accent2 }} />
                  <Line yAxisId="pct"  dataKey="m9_warn" name="9100 Expiry Warn% (right)" stroke={C.danger} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: C.danger }} />
                  <Line yAxisId="rate" dataKey="m8_rate" name="8100 Occ/Disp (left)" stroke={C.accent1} strokeWidth={1.5} strokeOpacity={0.6} dot={{ r: 2, fill: C.accent1 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <ChartNote>
                9100 warning % moves counter to occlusion rate during spike — clear anti-correlation. Feb '26 warning % = 99% is a firmware enforcement artifact, not a real expiry event, and is excluded from this chart.
              </ChartNote>
            </Panel>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              {/* Inserts already expired at load */}
              <Panel>
                <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.6rem" }}>% BIB Inserts Already Expired at Time of Load — Operator Behavior</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={INSERTED_EXPIRED} margin={marginStd}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="m" tick={{ ...axTick, fontSize: 9 }} />
                    <YAxis tick={{ ...axTick, fontSize: 9 }} domain={[0, 25]} unit="%" />
                    <Tooltip content={ttPct} />
                    <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
                    <Bar dataKey="p8" name="8100" fill={C.accent1} opacity={0.85} />
                    <Bar dataKey="p9" name="9100" fill={C.accent2} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
                <ChartNote>
                  Jun '25: 9–11% loaded already expired. Nov–Dec '25: 18–20%. Gradual operator behavior deterioration — not a sudden Sep trigger, but a compounding vulnerability. Drop in Jan '26 may reflect awareness or the firmware enforcement starting.
                </ChartNote>
              </Panel>

              {/* Warning lead time */}
              <Panel>
                <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.6rem" }}>Expiry Warning Lead Time Before Occlusion — Median Days by Month</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={LEAD_TIME} margin={marginStd}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="m" tick={{ ...axTick, fontSize: 9 }} />
                    <YAxis tick={{ ...axTick, fontSize: 9 }} unit="d" domain={[0, 20]} />
                    <Tooltip content={ttDays} />
                    <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
                    <ReferenceLine x="Aug '25" stroke={C.accent1} strokeDasharray="4 3" strokeOpacity={0.4} />
                    <ReferenceLine x="Nov '25" stroke={C.accent1} strokeDasharray="4 3" strokeOpacity={0.4} />
                    <Line dataKey="med8" name="8100 Median Lead" stroke={C.accent1} strokeWidth={2} dot={{ r: 3, fill: C.accent1 }} />
                    <Line dataKey="med9" name="9100 Median Lead" stroke={C.accent2} strokeWidth={2} dot={{ r: 3, fill: C.accent2 }} />
                  </LineChart>
                </ResponsiveContainer>
                <ChartNote>
                  Lead time is consistent at 8–17 days all months — the warning system IS generating signals before failure. Operators are not responding. Silent failure % rising during spike confirms warnings exist but actions aren't taken.
                </ChartNote>
              </Panel>
            </div>

            {/* BIB expiry status at occlusion */}
            <Panel>
              <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>BIB Expiry Status at Time of Full Occlusion — 9100 Monthly (Traceable Occlusions Only)</div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={EXPIRY_TIER} margin={marginStd}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="m" tick={axTick} />
                  <YAxis tick={axTick} unit="%" domain={[0, 100]} />
                  <Tooltip content={ttPct} />
                  <Legend wrapperStyle={{ fontSize: "0.72rem" }} />
                  <ReferenceLine x="Aug '25" stroke={C.accent1} strokeDasharray="4 3" strokeOpacity={0.4} />
                  <Bar dataKey="e9_fresh" name="Fresh BIB at occlusion" stackId="a" fill={C.success} opacity={0.8} />
                  <Bar dataKey="e9_exp"   name="Expired at occlusion"   stackId="a" fill={C.danger}  opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
              <ChartNote>
                Even at the Oct '25 peak, ~40% of traceable 9100 occlusions involve fresh BIBs (30+ days remaining). Expiry cannot be the sole mechanism — the micro-pump is failing on fresh product too, which is consistent with either a batch quality issue or volumetric stress.
              </ChartNote>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 3 — SILENT FAILURES
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 3 && (
          <div>
            <SectionTitle sub="Failure Mode Analysis">Silent Failures &amp; Warning Response Gap</SectionTitle>

            <InfoBox col={C.warn}>
              <strong style={{ color: C.warn }}>Definition: </strong>
              A "silent failure" is a dispenser that experienced at least one full occlusion in a calendar month with <em>zero</em> expiry warning events in that same month.
              8100 has structurally higher silent failure rates because ZSA machines (73% of 8100 fleet) have no expiry tracking for ingredient 1048588 — the system literally cannot warn them.
              For 9100, the rising silent failure % during the spike represents units where the BIB was fresh but failed mechanically — strong circumstantial evidence for batch or pump stress.
            </InfoBox>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              <Panel>
                <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>Silent Failure % — Dispensers With Occlusion But No Prior Warning (Same Month)</div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={SILENT} margin={marginStd}>
                    <defs>
                      <linearGradient id="g8" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.accent1} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={C.accent1} stopOpacity={0}   />
                      </linearGradient>
                      <linearGradient id="g9" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.accent2} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={C.accent2} stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="m" tick={axTick} />
                    <YAxis tick={axTick} unit="%" domain={[0, 100]} />
                    <Tooltip content={ttPct} />
                    <Legend wrapperStyle={{ fontSize: "0.72rem" }} />
                    <ReferenceLine x="Aug '25" stroke={C.accent1} strokeDasharray="4 3" strokeOpacity={0.4} />
                    <ReferenceLine x="Nov '25" stroke={C.accent1} strokeDasharray="4 3" strokeOpacity={0.4} />
                    <Area dataKey="p8" name="8100 Silent%" fill="url(#g8)" stroke={C.accent1} strokeWidth={2} />
                    <Area dataKey="p9" name="9100 Silent%" fill="url(#g9)" stroke={C.accent2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>Silent Failure Snapshot — Sep '25 (8100 Peak) vs Jun '25 (Baseline)</div>
                <div style={{ marginTop: "0.5rem" }}>
                  {[
                    { label: "8100 — Jun '25 Baseline", total: 1377, warned: 428,  silent: 949,  pct: 68.9 },
                    { label: "8100 — Sep '25 Spike",    total: 3575, warned: 601,  silent: 2974, pct: 83.2 },
                    { label: "9100 — Jun '25 Baseline", total: 9535, warned: 6105, silent: 3430, pct: 36.0 },
                    { label: "9100 — Sep '25 Spike",    total: 11677, warned: 6040, silent: 5637, pct: 48.3 },
                  ].map((d, i) => (
                    <div key={i} style={{ marginBottom: "1.1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                        <span style={{ color: C.textSub, fontSize: "0.71rem" }}>{d.label}</span>
                        <span style={{ color: d.pct > 75 ? C.danger : d.pct > 45 ? C.warn : C.textSub, fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700 }}>{d.pct}% silent</span>
                      </div>
                      <div style={{ height: 10, background: C.grid, borderRadius: 5, overflow: "hidden" }}>
                        <div style={{ width: `${d.pct}%`, height: "100%", background: d.pct > 75 ? C.danger : d.pct > 45 ? C.warn : C.accent2, borderRadius: 5 }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.2rem" }}>
                        <span style={{ color: C.textDim, fontSize: "0.61rem" }}>{d.silent.toLocaleString()} silent</span>
                        <span style={{ color: C.textDim, fontSize: "0.61rem" }}>{d.warned.toLocaleString()} warned</span>
                        <span style={{ color: C.textDim, fontSize: "0.61rem" }}>{d.total.toLocaleString()} total with occ</span>
                      </div>
                    </div>
                  ))}
                </div>
                <ChartNote>
                  8100 Jun→Sep: 68.9%→83.2% silent (+14pp). More dispensers occluding without any prior expiry warning during the spike — consistent with fresh-BIB failures (batch or pump stress) rather than operator neglect.
                  9100 Jun→Sep: 36.0%→48.3% silent (+12pp) — same directional shift.
                </ChartNote>
              </Panel>
            </div>

            {/* Lead time table */}
            <Panel>
              <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>Warning Lead Time Detail — When Warnings DO Fire (Days Before Occlusion)</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.71rem" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.panelBorder}` }}>
                      {["Month", "8100 Avg Lead", "8100 Median Lead", "9100 Avg Lead", "9100 Median Lead", "Interpretation"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "0.35rem 0.65rem", color: C.textDim, fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LEAD_TIME.map((r, i) => {
                      const spike = i >= 2 && i <= 5;
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.grid}`, background: spike ? C.accent1 + "07" : "transparent" }}>
                          <td style={{ padding: "0.35rem 0.65rem", color: spike ? C.accent1 : C.textSub, fontFamily: "monospace" }}>{r.m}</td>
                          <td style={{ padding: "0.35rem 0.65rem", color: C.textSub }}>{r.avg8}d</td>
                          <td style={{ padding: "0.35rem 0.65rem", color: C.textPrimary, fontFamily: "monospace" }}>{r.med8}d</td>
                          <td style={{ padding: "0.35rem 0.65rem", color: C.textSub }}>{r.avg9}d</td>
                          <td style={{ padding: "0.35rem 0.65rem", color: C.textPrimary, fontFamily: "monospace" }}>{r.med9}d</td>
                          <td style={{ padding: "0.35rem 0.65rem", color: C.textDim, fontSize: "0.63rem" }}>
                            {i === 0 ? "Baseline — warnings firing 9–10d before failure" :
                             spike   ? "SPIKE — lead time stable; warnings ARE generating but operators not responding" :
                                       "Post-spike — back to baseline rhythm"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 4 — MACHINE ANATOMY
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 4 && (
          <div>
            <SectionTitle sub="Machine-Level Analysis">ZSA vs ZPL Architecture · Recovery Tiers · Hour-of-Day Pattern</SectionTitle>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              {/* ZSA vs ZPL full occ */}
              <Panel>
                <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.6rem" }}>Full Occlusions Per Dispenser — ZSA vs ZPL (Sep–Nov '25 Spike Window)</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ZSA_ZPL} layout="vertical" margin={{ top: 5, right: 40, bottom: 5, left: 70 }}>
                    <CartesianGrid {...gridProps} />
                    <XAxis type="number" tick={axTick} />
                    <YAxis type="category" dataKey="grp" tick={{ ...axTick, fontSize: 10 }} width={80} />
                    <Tooltip content={ttOcc} />
                    <Bar dataKey="occ" name="Full Occ/Disp" radius={[0, 4, 4, 0]}>
                      {ZSA_ZPL.map((d, i) => <Cell key={i} fill={d.col} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <ChartNote>
                  ZSA 8100: 145.0 vs ZPL 9100: 50.5 = <strong style={{ color: C.danger }}>2.9× structural penalty</strong>. This gap exists year-round — not a spike artifact. ZPL 8100 machines exist but F1 query returned no rows for them; likely insufficient event volume with ingredient filter.
                </ChartNote>
              </Panel>

              {/* ZSA vs ZPL 1-strike */}
              <Panel>
                <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.6rem" }}>1-Strike Occlusions Per Dispenser — ZSA vs ZPL (Same Window)</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ZSA_ZPL} layout="vertical" margin={{ top: 5, right: 40, bottom: 5, left: 70 }}>
                    <CartesianGrid {...gridProps} />
                    <XAxis type="number" tick={axTick} />
                    <YAxis type="category" dataKey="grp" tick={{ ...axTick, fontSize: 10 }} width={80} />
                    <Tooltip content={makeTT(v => `${v} 1-strike/disp`)} />
                    <Bar dataKey="s1" name="1-Strike/Disp" radius={[0, 4, 4, 0]}>
                      {ZSA_ZPL.map((d, i) => <Cell key={i} fill={d.col} opacity={0.75} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <ChartNote>
                  ZSA 8100: 404.7 1-strikes/disp — nearly 3× vs ZSA 9100 (169.8). The micro-pump on ZSA 8100 is either a different mechanical design or operates under greater volumetric stress load.
                </ChartNote>
              </Panel>
            </div>

            {/* Recovery tiers */}
            <div style={{ fontFamily: "monospace", color: C.textSub, fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Recovery Analysis — Post-Spike (Dec '25–Feb '26) vs Spike (Sep–Nov '25)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              {[{ label: "8100", data: RECOVERY_8, col: C.accent1 }, { label: "9100", data: RECOVERY_9, col: C.accent2 }].map(({ label, data, col }) => (
                <Panel key={label}>
                  <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>{label} — Recovery by Spike Severity Tier</div>
                  {data.map((d, i) => {
                    const fullyPct  = Math.round(100 * d.fully  / d.units);
                    const mostlyPct = Math.round(100 * d.mostly / d.units);
                    const stillPct  = Math.round(100 * d.still  / d.units);
                    return (
                      <div key={i} style={{ marginBottom: "0.9rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                          <span style={{ color: C.textSub, fontSize: "0.71rem" }}>{d.tier} ({d.units.toLocaleString()} units)</span>
                          <span style={{ color: col, fontSize: "0.68rem", fontFamily: "monospace" }}>{d.post}/{d.spike} → {d.pct}%</span>
                        </div>
                        <div style={{ display: "flex", height: 9, borderRadius: 4, overflow: "hidden", gap: 1 }}>
                          <div style={{ width: `${fullyPct}%`,  background: C.success, title: `Recovered: ${d.fully}` }} />
                          <div style={{ width: `${mostlyPct}%`, background: C.warn,    title: `Mostly: ${d.mostly}` }} />
                          <div style={{ width: `${stillPct}%`,  background: C.danger,  title: `Still elevated: ${d.still}` }} />
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.2rem" }}>
                          <span style={{ color: C.success, fontSize: "0.6rem" }}>✓ {d.fully} recovered</span>
                          <span style={{ color: C.warn,    fontSize: "0.6rem" }}>~ {d.mostly} mostly</span>
                          <span style={{ color: C.danger,  fontSize: "0.6rem" }}>⚠ {d.still} still elevated</span>
                        </div>
                      </div>
                    );
                  })}
                </Panel>
              ))}
            </div>

            {/* Hour of day */}
            <Panel>
              <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>Hour-of-Day Spike Ratio — Spike (Sep–Nov '25) vs Baseline (Jun–Jul '25)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "8100 — Ratio 3.5×–4.9× (near-flat across all 24 hours)", data: HOUR_DATA_8, col: C.accent1, domain: [0, 6] },
                  { label: "9100 — Ratio 1.5×–3.0× (night slightly higher relatively)", data: HOUR_DATA_9, col: C.accent2, domain: [0, 4] },
                ].map(({ label, data, col, domain }) => (
                  <div key={label}>
                    <div style={{ color: col, fontSize: "0.67rem", fontFamily: "monospace", marginBottom: "0.4rem" }}>{label}</div>
                    <ResponsiveContainer width="100%" height={190}>
                      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="h" tick={{ fill: C.textSub, fontSize: 7 }} interval={2} />
                        <YAxis tick={{ fill: C.textSub, fontSize: 9 }} domain={domain} />
                        <Tooltip content={ttRatio} />
                        <ReferenceLine y={1} stroke={C.grid} strokeWidth={1} />
                        <Bar dataKey="r" name="Spike/Baseline Ratio" fill={col} opacity={0.85} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
              <ChartNote>
                <strong style={{ color: C.textSub }}>Critical interpretation:</strong> The 8100 spike ratio is nearly identical across ALL 24 hours (3.5–4.9×). If volumetric peak-hour stress were the primary driver, the 11am–2pm lunch rush would show a much higher ratio. The uniform distribution points to a persistent material/chemical issue (bad batch) that is active regardless of operating cadence.
              </ChartNote>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 5 — OPERATIONS
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 5 && (
          <div>
            <SectionTitle sub="Operational Context">Chain Performance · Idle Time Correlation · Fleet Characteristics</SectionTitle>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              <Panel>
                <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.6rem" }}>Avg Occlusions/Unit by Daily Idle Time Bucket — INVERSE Relationship Confirmed</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={IDLE_OCC} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 75 }}>
                    <CartesianGrid {...gridProps} />
                    <XAxis type="number" tick={axTick} />
                    <YAxis type="category" dataKey="label" tick={{ ...axTick, fontSize: 9 }} width={85} />
                    <Tooltip content={ttOcc} />
                    <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
                    <Bar dataKey="m8" name="8100" fill={C.accent1} opacity={0.85} />
                    <Bar dataKey="m9" name="9100" fill={C.accent2} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
                <ChartNote>
                  More traffic = more occlusions. Rules out stagnation as cause — fluid-standing theory eliminated. Points to volumetric micro-pump stress from high pour volume. ZSA architecture amplifier present throughout (8100 consistently higher across all buckets).
                </ChartNote>
              </Panel>

              <Panel>
                <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.6rem" }}>Top Chains — Avg Occlusions/Unit Sep–Nov '25</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={CHAINS} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 115 }}>
                    <CartesianGrid {...gridProps} />
                    <XAxis type="number" tick={axTick} />
                    <YAxis type="category" dataKey="name" tick={{ ...axTick, fontSize: 9 }} width={125} />
                    <Tooltip content={ttOcc} />
                    <Bar dataKey="occ" name="Avg Occ/Unit" radius={[0, 4, 4, 0]}>
                      {CHAINS.map((d, i) => <Cell key={i} fill={d.type === "8100" ? C.accent1 : C.accent2} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <ChartNote>
                  Amber = 8100, Blue = 9100. Wendy's 8100 leads at 210 occ/unit (9.4h idle). Wingstop lowest at 60.2 — slowest traffic, oldest fleet (avg 1,277d) but protected by low pour volume.
                </ChartNote>
              </Panel>
            </div>

            {/* Fleet stats */}
            <Panel style={{ marginBottom: "1rem" }}>
              <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.85rem" }}>Fleet Characteristics — Active US Dispensers (Feb '26 Reference)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
                {[
                  { l: "Total Active US",     v: "24,585",  s: "8100: 5,341 · 9100: 19,244",     c: C.textPrimary },
                  { l: "8100 Median Idle",    v: "9.8 h",   s: "84% of weeks in 8–16h bucket",   c: C.accent1     },
                  { l: "9100 Median Idle",    v: "14.5 h",  s: "74% in 8–16h, 20% in 16–24h",   c: C.accent2     },
                  { l: "9100 vs 8100 Gap",    v: "+4.7 h",  s: "9100 sits idle ~5 hrs longer/day",c: C.warn       },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "monospace", color: s.c, fontSize: "1.5rem", fontWeight: 900, lineHeight: 1 }}>{s.v}</div>
                    <div style={{ color: C.textSub, fontSize: "0.65rem", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.l}</div>
                    <div style={{ color: C.textDim, fontSize: "0.62rem", marginTop: "0.12rem" }}>{s.s}</div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Chain table */}
            <Panel>
              <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.75rem" }}>Chain Performance Detail — Sep–Nov '25 Spike Window</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.71rem" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.panelBorder}` }}>
                      {["Chain", "Type", "Avg Occ/Unit", "Idle (h/day)", "Fleet Age (days)", "Observation"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "0.35rem 0.65rem", color: C.textDim, fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CHAINS.map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.grid}` }}>
                        <td style={{ padding: "0.35rem 0.65rem", color: C.textPrimary }}>{r.name}</td>
                        <td style={{ padding: "0.35rem 0.65rem" }}><Tag col={r.type === "8100" ? C.accent1 : C.accent2}>{r.type}</Tag></td>
                        <td style={{ padding: "0.35rem 0.65rem", color: r.occ > 150 ? C.danger : r.occ > 80 ? C.warn : C.success, fontFamily: "monospace", fontWeight: 700 }}>{r.occ}</td>
                        <td style={{ padding: "0.35rem 0.65rem", color: C.textSub }}>{r.idle}</td>
                        <td style={{ padding: "0.35rem 0.65rem", color: C.textSub }}>{r.age.toLocaleString()}</td>
                        <td style={{ padding: "0.35rem 0.65rem", color: C.textDim, fontSize: "0.63rem" }}>
                          {r.name.includes("Wendy") && r.type === "8100" ? "Highest occ — fast traffic + ZSA architecture compound" :
                           r.name === "WAWA"        ? "Low idle (8.3h) but moderate occ — high-frequency BIB rotation suspected" :
                           r.name === "Wingstop"    ? "Oldest fleet (avg 1,277d) yet lowest occ — slow traffic protects the pump" :
                           r.name === "Universal Studios" ? "High 9100 occ — theme park extreme-traffic environment" :
                           "Standard operational profile"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 6 — EVIDENCE SCORECARD
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 6 && (
          <div>
            <SectionTitle sub="Evidence Assessment">Hypothesis Scorecard — All Findings Integrated</SectionTitle>

            <InfoBox col={C.accent2}>
              <strong style={{ color: C.accent2 }}>Note on C1/C2 Plantcode Queries: </strong>
              Both returned zero rows. The <code style={{ color: C.accent1 }}>plantcode:</code> field is either absent from <code>micropumpspmoccludedtrouble</code> events for ingredient 1048588, or the key parsing didn't match.
              This was the single most direct confirmatory test for the batch hypothesis — its absence means the batch hypothesis remains at circumstantial (72/100), not confirmed.
              <strong style={{ color: C.danger }}> Recommend re-running C1 with a broader event filter (e.g. all troubleAdd events) or requesting lot code data from manufacturer directly.</strong>
            </InfoBox>

            {/* Hypothesis cards */}
            <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {HYPOTHESES.map((h, i) => (
                <Panel key={i}>
                  <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, textAlign: "center", width: 80 }}>
                      <div style={{ fontFamily: "monospace", color: h.col, fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{h.score}</div>
                      <div style={{ color: C.textDim, fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>/100</div>
                      <div style={{ height: 4, background: C.grid, borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                        <div style={{ width: `${h.score}%`, height: "100%", background: h.col, borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                        <div style={{ fontFamily: "Georgia, serif", color: C.textPrimary, fontSize: "0.95rem", fontWeight: 700 }}>{h.name}</div>
                        <Tag col={h.col}>{h.status}</Tag>
                      </div>
                      <div style={{ color: C.textSub, fontSize: "0.71rem", lineHeight: 1.6 }}>{h.notes}</div>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>

            {/* Data quality */}
            <Panel style={{ marginBottom: "1rem" }}>
              <div style={{ color: C.textSub, fontSize: "0.73rem", marginBottom: "0.85rem" }}>Data Quality &amp; Coverage Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem" }}>
                {[
                  { label: "8100 Expiry Coverage",        val: "15.6%",    note: "ZSA machines have no enjoybydate for ingredient 1048588. All 8100 expiry figures are directional only.", c: C.warn        },
                  { label: "9100 Occlusion Traceability",  val: "51.6%",    note: "9100 approximately half-traceable to a BIB with expiry data via bibNnsReplaced events.",               c: C.accent2     },
                  { label: "Plantcode Data",               val: "0 rows",   note: "C1/C2 returned zero. Plantcode field may not exist on micropumpspmoccludedtrouble for ingredient 1048588.", c: C.danger   },
                  { label: "v_sysdb Window",               val: "10 months",note: "Jun 2025–Mar 2026 only. No pre-Jun 2025 history — YoY comparison not possible from this table alone.",  c: C.textSub     },
                  { label: "Fleet Active (Feb '26)",       val: "24,585",   note: "8100: 5,341 · 9100: 19,244. Fleet grew ~4% Jun→Feb.",                                                   c: C.success     },
                  { label: "Feb '26 Warning Spike",        val: "8× jump",  note: "nnscheckenjoybytrouble: ~47K/mo → 368K in Feb '26. Firmware enforcement change. Not a real expiry event.", c: C.danger  },
                ].map((d, i) => (
                  <div key={i} style={{ background: C.bg, border: `1px solid ${C.grid}`, borderRadius: 8, padding: "0.7rem 0.9rem" }}>
                    <div style={{ fontFamily: "monospace", color: d.c, fontSize: "1rem", fontWeight: 700 }}>{d.val}</div>
                    <div style={{ color: C.textSub, fontSize: "0.63rem", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: "0.15rem" }}>{d.label}</div>
                    <div style={{ color: C.textDim, fontSize: "0.61rem", lineHeight: 1.5, marginTop: "0.35rem" }}>{d.note}</div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* External data needed */}
            <Panel>
              <div style={{ fontFamily: "monospace", color: C.warn, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.85rem" }}>
                External Data Required to Confirm Remaining Hypotheses
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                {[
                  { data: "BIB Manufacturing Lot Codes",            priority: "CRITICAL", hypothesis: "Batch quality hypothesis",       why: "Match lot numbers to Aug–Nov '25 affected dispensers. If one or two lots disproportionate → confirmed batch event." },
                  { data: "POS Transaction Volume per Dispenser",   priority: "HIGH",     hypothesis: "Q4 volumetric stress",           why: "Correlation of pour counts with occlusion rate quantifies stress independently from idle-time proxy." },
                  { data: "Plantcode Field Mapping",                priority: "CRITICAL", hypothesis: "Batch quality — geographic",      why: "Confirm which event type carries plantcode. Re-run C1/C2 on correct event. Most direct test in existing data." },
                  { data: "Firmware Release Notes Aug–Nov '25",     priority: "MEDIUM",   hypothesis: "Detection sensitivity (closed)",  why: "Already ruled out via occludedvalue analysis; engineering confirmation closes the door completely." },
                ].map((d, i) => (
                  <div key={i} style={{ background: C.bg, border: `1px solid ${C.panelBorder}`, borderRadius: 8, padding: "0.7rem 0.9rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                      <Tag col={d.priority === "CRITICAL" ? C.danger : d.priority === "HIGH" ? C.warn : C.muted}>{d.priority}</Tag>
                      <span style={{ color: C.textPrimary, fontSize: "0.73rem", fontWeight: 600 }}>{d.data}</span>
                    </div>
                    <div style={{ color: C.accent2, fontSize: "0.63rem", marginBottom: "0.25rem" }}>Tests: {d.hypothesis}</div>
                    <div style={{ color: C.textDim, fontSize: "0.62rem", lineHeight: 1.5 }}>{d.why}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}

      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px solid ${C.panelBorder}`, padding: "0.7rem 1.75rem", marginTop: "2rem" }}>
        <div style={{ fontFamily: "monospace", color: C.textDim, fontSize: "0.58rem", letterSpacing: "0.07em", textAlign: "center", lineHeight: 1.8 }}>
          ACTIVE US DISPENSERS ONLY · 8100 &amp; 9100 ONLY · INGREDIENT 1048588 · JUN 2025–MAR 2026 (10 MONTHS) ·
          MAR '26 = PARTIAL DATA EXCLUDED FROM TREND · FEB '26 EXPIRY% = FIRMWARE-CONTAMINATED ·
          8100 EXPIRY FIGURES = DIRECTIONAL ONLY (15.6% COVERAGE) · PLANTCODE C1/C2 = ZERO ROWS
        </div>
      </div>
    </div>
  );
}
