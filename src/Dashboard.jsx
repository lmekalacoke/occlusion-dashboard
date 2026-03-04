import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell, ComposedChart, Area
} from "recharts";

const monthlySpine = [
  { month:"Jun '25", full8100:10.27,  full9100:10.73,  s1_8100:45.88, s1_9100:40.24, raw8100:49575,  raw9100:193620  },
  { month:"Jul '25", full8100:10.75,  full9100:10.79,  s1_8100:47.39, s1_9100:41.57, raw8100:52690,  raw9100:196928  },
  { month:"Aug '25", full8100:17.11,  full9100:9.94,   s1_8100:64.66, s1_9100:39.37, raw8100:85069,  raw9100:184267  },
  { month:"Sep '25", full8100:41.13,  full9100:13.83,  s1_8100:116.84,s1_9100:48.65, raw8100:207067, raw9100:259714  },
  { month:"Oct '25", full8100:58.05,  full9100:21.01,  s1_8100:158.46,s1_9100:64.19, raw8100:298761, raw9100:397567  },
  { month:"Nov '25", full8100:50.90,  full9100:21.57,  s1_8100:143.92,s1_9100:65.18, raw8100:264057, raw9100:411039  },
  { month:"Dec '25", full8100:24.82,  full9100:14.52,  s1_8100:98.63, s1_9100:56.72, raw8100:131128, raw9100:278546  },
  { month:"Jan '26", full8100:12.48,  full9100:10.99,  s1_8100:71.09, s1_9100:50.88, raw8100:66399,  raw9100:211073  },
  { month:"Feb '26", full8100:10.49,  full9100:10.01,  s1_8100:60.96, s1_9100:46.08, raw8100:56045,  raw9100:192701  },
  { month:"Mar '26", full8100:1.06,   full9100:0.95,   s1_8100:6.08,  s1_9100:4.77,  raw8100:5655,   raw9100:18017   },
];
const expiryOverlay = [
  { month:"Jun '25", occ8100:10.27, occ9100:10.73, warn8100:28.44, warn9100:60.40 },
  { month:"Jul '25", occ8100:10.75, occ9100:10.79, warn8100:28.43, warn9100:61.56 },
  { month:"Aug '25", occ8100:17.11, occ9100:9.94,  warn8100:29.95, warn9100:61.08 },
  { month:"Sep '25", occ8100:41.13, occ9100:13.83, warn8100:26.82, warn9100:56.36 },
  { month:"Oct '25", occ8100:58.05, occ9100:21.01, warn8100:27.61, warn9100:59.20 },
  { month:"Nov '25", occ8100:50.90, occ9100:21.57, warn8100:28.08, warn9100:59.52 },
  { month:"Dec '25", occ8100:24.82, occ9100:14.52, warn8100:27.80, warn9100:58.80 },
  { month:"Jan '26", occ8100:12.48, occ9100:10.99, warn8100:28.08, warn9100:59.13 },
  { month:"Feb '26", occ8100:10.49, occ9100:10.01, warn8100:99.49, warn9100:98.60 },
  { month:"Mar '26", occ8100:1.06,  occ9100:0.95,  warn8100:64.41, warn9100:64.39 },
];
const bibExpiry = [
  { month:"Jun '25", pct8100:13.57, pct9100:16.76 },
  { month:"Jul '25", pct8100:31.54, pct9100:31.88 },
  { month:"Aug '25", pct8100:41.44, pct9100:46.07 },
  { month:"Sep '25", pct8100:43.39, pct9100:49.21 },
  { month:"Oct '25", pct8100:52.48, pct9100:48.39 },
  { month:"Nov '25", pct8100:55.38, pct9100:52.44 },
  { month:"Dec '25", pct8100:62.17, pct9100:56.05 },
  { month:"Jan '26", pct8100:62.15, pct9100:58.01 },
  { month:"Feb '26", pct8100:32.96, pct9100:51.59 },
  { month:"Mar '26", pct8100:11.71, pct9100:21.85 },
];
const chronicData = [
  { month:"Jun '25", c8100:128, c9100:309, pct8100:9.30,  pct9100:3.24 },
  { month:"Jul '25", c8100:137, c9100:366, pct8100:9.99,  pct9100:4.04 },
  { month:"Aug '25", c8100:198, c9100:266, pct8100:8.47,  pct9100:2.70 },
  { month:"Sep '25", c8100:617, c9100:310, pct8100:17.26, pct9100:2.65 },
  { month:"Oct '25", c8100:981, c9100:572, pct8100:24.08, pct9100:4.33 },
  { month:"Nov '25", c8100:777, c9100:535, pct8100:18.35, pct9100:3.77 },
  { month:"Dec '25", c8100:268, c9100:293, pct8100:7.14,  pct9100:2.08 },
  { month:"Jan '26", c8100:166, c9100:195, pct8100:7.87,  pct9100:1.56 },
  { month:"Feb '26", c8100:133, c9100:166, pct8100:6.91,  pct9100:1.36 },
  { month:"Mar '26", c8100:0,   c9100:0,   pct8100:0,     pct9100:0    },
];
const chainData = [
  { chain:"Wendy's (8100)",      avg:210.0 },
  { chain:"Universal Studios",   avg:144.6 },
  { chain:"Universal City Dev",  avg:121.7 },
  { chain:"White Castle (8100)", avg:110.0 },
  { chain:"Compass Group",       avg:101.6 },
  { chain:"Wendy's (9100)",      avg:94.4  },
  { chain:"Wawa",                avg:82.8  },
  { chain:"Burger King (8100)",  avg:76.2  },
  { chain:"Sodexo",              avg:73.6  },
  { chain:"Wingstop",            avg:60.2  },
  { chain:"AMC Theatres",        avg:50.0  },
  { chain:"Burger King (9100)",  avg:44.0  },
];
const idleData = [
  { bucket:"0-8 hrs",   avg8100:213.6, avg9100:114.8 },
  { bucket:"8-12 hrs",  avg8100:178.8, avg9100:91.3  },
  { bucket:"12-16 hrs", avg8100:90.3,  avg9100:64.9  },
  { bucket:"16-20 hrs", avg8100:52.2,  avg9100:44.5  },
  { bucket:"20+ hrs",   avg8100:8.5,   avg9100:20.3  },
];
const ageData = [
  { cohort:"0-1 yr",  avg8100:182.3, avg9100:72.2 },
  { cohort:"1-2 yrs", avg8100:161.5, avg9100:71.0 },
  { cohort:"2-4 yrs", avg8100:249.3, avg9100:58.3 },
  { cohort:"4+ yrs",  avg8100:null,  avg9100:59.6 },
];

const C8 = "#f97316";
const C9 = "#38bdf8";
const CBG = "#0a0f1a";
const CPL = "#0f172a";
const CBR = "#1e293b";

const INSIGHTS = [
  {
    title:"Trend Overview",
    how:[
      ["Primary Metric","Full occlusions divided by active dispensers that same month. The denominator changes monthly so fleet growth cannot inflate the rate artificially."],
      ["Secondary Metric","1-strike occlusions (micropumpspmoccludedtrouble) per dispenser — a leading indicator that precedes full occlusion events."],
      ["Why Not Per-Insert","84% of 8100 inserts are untrackable. ZSA machines use fuelGaugeInsert with no ingredient ID. Insert-denominated rates are unreliable for 8100."],
      ["Population Filter","Active US dispensers only. equipment_type IN ('8100','9100'). Joined v_sysdb to v_dispenser with equipment_active_inactive='A' AND country='US'."],
    ],
    findings:[
      ["bad","8100 peak: 58.1 occ/dispenser in Oct '25 — a 5.7x increase over the Jun baseline of 10.3."],
      ["bad","9100 peak: 21.6 occ/dispenser in Nov '25 — a 2.0x increase over baseline. Spike is real on both types."],
      ["warn","8100 spike onset is Aug '25 (17.1), one full month earlier than 9100 (Sep '25 at 13.8)."],
      ["good","Recovery is clean. Both types return to baseline by Jan-Feb '26 — the spike was transient, not a permanent degradation."],
      ["info","Raw 9100 counts dwarf 8100 (411K vs 264K in Nov) because the 9100 fleet is 3.7x larger. Always use per-dispenser for comparisons."],
    ],
    caveats:["Mar '26 data is partial (through Mar 3 only). All Mar figures excluded from trend conclusions.","Feb '26 expiry warning % jumps to 99% due to a firmware enforcement change — not a real expiry surge."]
  },
  {
    title:"Expiry Warning Analysis",
    how:[
      ["Events Used","Three system trouble events filtered to ingredient 1048588: nnsenjoybynotificationtrouble, nnscheckenjoybytrouble, enjoybytrouble."],
      ["Filter Logic","msg_code='troubleAdd' AND POSITION('ingredientid:1048588' IN event_data) > 0. Covers both ZSA and ZPL machine types."],
      ["Metric","% of active dispensers per month with at least one expiry warning event. Plotted against occ/dispenser on a dual-axis chart."],
      ["Why System Flags","More reliable than parsing enjoybydate strings. System-generated, covers all machine types, higher dispenser coverage (25K-38K vs ~15K from string parsing)."],
    ],
    findings:[
      ["bad","CRITICAL: 9100 expiry warning % drops from 61% to 56% exactly as occlusions spike Sep-Oct. If expiry caused the spike, warnings should rise. They don't."],
      ["bad","8100 expiry warning stays flat at ~28% throughout the entire spike, despite occlusion rate increasing 5.7x. Zero correlation."],
      ["warn","Feb '26 anomaly: nnscheckenjoybytrouble jumped 8x (47K to 368K events). This is a firmware enforcement change, not a real expiry surge. Pre/post-Feb not comparable."],
      ["info","Conclusion: Expiry warnings are NOT the primary driver. The causal direction may be reversed — occlusions degrade BIBs faster, generating more warnings afterward."],
    ],
    caveats:["8100 expiry warning coverage is structurally low (~28%) because ZSA machines have no enjoy-by data for ingredient 1048588.","9100 shows 60% warning coverage — a structural difference in how ZPL machines track expiry."]
  },
  {
    title:"BIB Freshness at Occlusion",
    how:[
      ["Insert Event","bibNnsReplaced (ZPL machines only). Each occlusion was linked to the most recent insert on the same serial_number within 90 days prior."],
      ["Date Parsing","Extracted enjoybydate:YYYY-MM-DD from event_data using safe guards: length check, year range 2024-2027, NULL on invalid strings. Prevents Redshift crash on bad dates."],
      ["Buckets","Already expired / Critical 0-7 days / Near 8-30 days / Fresh 30+ days. Assigned by comparing enjoy_by_date to the occlusion event date."],
      ["Coverage","ZSA machines (dominant 8100 subtype) use fuelGaugeInsert — no enjoy-by data for ingredient 1048588. 8100 covers only 15.6% of occlusions."],
    ],
    findings:[
      ["warn","Expired BIB % climbs steadily: 8100 from 14% (Jun) to 62% (Jan '26). 9100 from 17% to 58%. A continuous accumulating trend, not a sudden event."],
      ["bad","Both types cross 50% expired during the spike window (Oct-Nov '25) — majority of traceable occlusions involved expired BIBs at peak."],
      ["warn","~47% of traceable occlusions involved fresh BIBs (30+ days remaining). Expiry alone cannot explain all events."],
      ["info","The rising expired % pre-dates the spike. Likely acts as an enabler — expired BIBs degrade faster under high pump stress when Q4 traffic surges."],
    ],
    caveats:["8100 expiry linkage = 15.6% of occlusions only. All 8100 BIB freshness figures are directional — treat with caution.","The insert-to-occlusion link assumes the most recent bibNnsReplaced within 90 days is the active BIB. Missed inserts cause wrong attribution."]
  },
  {
    title:"Chronic & Repeat Offenders",
    how:[
      ["Definition","Chronic unit = dispenser with 100+ full occlusions in a single calendar month. Severe = 500+. Threshold chosen based on fleet median behavior."],
      ["Calculation","Grouped full occlusion events by serial_number + month. Counted units crossing each threshold. Expressed as % of all dispensers with any occlusion that month."],
      ["Pareto (Q12D)","Sep-Nov 2025 window. Per-dispenser occlusion totals bucketed: <100, 100-499, 500-999, 1000+. Each bucket's share of type-total spike occlusions calculated."],
      ["Purpose","Test whether the spike was caused by a small group of catastrophically failing units (fix by targeted pull) or is fleet-wide (requires systemic intervention)."],
    ],
    findings:[
      ["bad","8100 chronic units explode 7.6x in 2 months: 128 (Jun) to 981 (Oct). % chronic jumps 9% to 24% — a structural shift, not noise."],
      ["info","9100 chronic units grow moderately (309 to 572) but % chronic stays low at 3-4%. 9100 spike is driven by breadth across the fleet, not unit depth."],
      ["warn","Pareto: 8100 mid-tier (100-499 occ) drives 60% of spike total across 2,054 units. No classic 80/20. Cannot fix by pulling 50 bad machines."],
      ["good","Recovery: chronic units return to near-baseline by Feb '26 on both types, confirming the spike was transient."],
    ],
    caveats:["Chronic unit count is a monthly snapshot — the same unit appearing in multiple months is counted multiple times. Cross-month longitudinal tracking was not run.","ZSA 8100 machines occlude at 2x the rate of ZPL 9100 structurally. Some 8100 chronic concentration may reflect ZSA architecture, not spike-specific failure."]
  },
  {
    title:"Chain & Operational Factors",
    how:[
      ["Data Source","agg_continuous_silver.csv — 2.9M rows, weekly grain, 2023-2026. Joined to Redshift occlusion counts on serial_number as join key."],
      ["Chain Join","CSV aggregated to per-dispenser summary (median idle hrs, avg age, chain). Joined to Sep-Nov '25 occlusion totals from S5 query output."],
      ["Idle Buckets","median_week_delay from CSV = hours per day the dispenser sits idle. Bucketed into 0-8, 8-12, 12-16, 16-20, 20+ hrs and compared to avg occ/unit."],
      ["Age Cohorts","days_old from CSV. Excluded negatives (data entry errors). Buckets: 0-1yr, 1-2yrs, 2-4yrs, 4+yrs. Compared to avg occ/unit in spike window."],
    ],
    findings:[
      ["bad","Wendy's 8100: 210 avg occ/unit during spike — highest of any major chain. 3,153 dispensers x 210 = ~662K occlusions in 3 months from one chain alone."],
      ["bad","Idle time is INVERSELY correlated with occlusions. 0-8hr idle (high traffic): 214 avg vs 16-20hr idle: 52 avg. A 4x difference driven purely by traffic volume."],
      ["info","This rules out fluid stagnation as a mechanism. High-traffic dispensers occlude more because they pump more, not because fluid sits still. Volumetric pump stress."],
      ["info","Theater chains (AMC, Cinemark) average 46-54 — lower traffic, fewer pump cycles, lower occlusion rate despite similar machine ages."],
      ["good","Dispenser age is not a meaningful factor. 9100 cohorts span 59-72 across all ages. 8100 2-4yr bucket (249 avg) has only 18 units — statistically meaningless."],
    ],
    caveats:["Chain join covers only dispensers present in both Redshift and the CSV. Units missing from CSV are excluded.","Idle time is a weekly median from the CSV — it smooths out day-level variation and may not capture burst traffic patterns."]
  },
  {
    title:"All Tests & Final Conclusions",
    how:[
      ["Q12A Fleet Growth","Per-dispenser normalization. If per-unit rate stays flat while raw count spikes, the fleet just grew. Result: 5.7x per-unit increase confirmed. Ruled out."],
      ["Q12B Firmware","Parsed occludedvalue from 1-strike event_data. Compared P25/P50/P75 across pre-spike, spike, post-spike. Result: locked at -8 to -9 all 10 months. Ruled out."],
      ["Q12C New Units","First-ever event timestamp per dispenser. Counted new units by month. Result: <2% new units mid-window. Ruled out."],
      ["Q12D Pareto","Sep-Nov totals per dispenser bucketed into tiers. Result: 8100 mid-tier (100-499) drives 60%. Diffuse fleet-wide pattern confirmed."],
    ],
    findings:[
      ["bad","BIB supply/quality batch remains the primary unresolved hypothesis. Fleet-wide onset, transient 4-month duration, high-traffic machines hit hardest — all consistent with a bad production batch."],
      ["warn","Most likely combined explanation: Q4 seasonal traffic surge amplified stress on BIBs already approaching expiry. Expiry sets the stage; traffic provides the trigger."],
      ["warn","Next highest-priority query: group occlusions by plantcode (values 0, 1, 2 in event_data). If one plant drives the Sep-Nov spike, the manufacturing batch hypothesis is confirmed."],
      ["info","ZSA vs ZPL machine architecture is an unresolved structural difference. ZSA 8100 occludes at 2x ZPL 9100 rate at baseline — a design question outside this dataset."],
    ],
    caveats:["No manufacturing lot, shipping route, or temperature data exists in Redshift. BIB quality hypotheses cannot be confirmed without external supply chain data.","v_sysdb covers only Jun 2025-Mar 2026 (10 months). Year-over-year comparison is not possible from this table."]
  },
];

const DarkTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:8, padding:"9px 13px", fontSize:11 }}>
      <p style={{ color:"#94a3b8", marginBottom:4, fontWeight:700 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color:p.color, margin:"2px 0" }}>
          {p.name}: <strong>{typeof p.value==="number" ? p.value.toLocaleString(undefined,{maximumFractionDigits:1}) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const KPI = ({ label, value, sub, color, delta }) => (
  <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:8, padding:"11px 15px", borderTop:`3px solid ${color}` }}>
    <p style={{ color:"#64748b", fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", margin:"0 0 4px" }}>{label}</p>
    <p style={{ color:"#f1f5f9", fontSize:20, fontWeight:800, margin:"0 0 2px", fontFamily:"monospace" }}>{value}</p>
    {sub && <p style={{ color:"#64748b", fontSize:10, margin:0 }}>{sub}</p>}
    {delta && <p style={{ color:delta.startsWith("+")?"#4ade80":"#f87171", fontSize:10, margin:"3px 0 0", fontWeight:700 }}>{delta}</p>}
  </div>
);

const Hdr = ({ title, sub }) => (
  <div style={{ marginBottom:10 }}>
    <p style={{ color:"#f1f5f9", fontSize:11.5, fontWeight:800, margin:"0 0 2px" }}>{title}</p>
    {sub && <p style={{ color:"#475569", fontSize:10, margin:0 }}>{sub}</p>}
  </div>
);

const FindingRow = ({ type, text }) => {
  const m = { bad:["#f87171","▲"], warn:["#fbbf24","●"], good:["#4ade80","✓"], info:["#38bdf8","→"] };
  const [col, icon] = m[type] || m.info;
  return (
    <div style={{ display:"flex", gap:7, marginBottom:7, alignItems:"flex-start" }}>
      <span style={{ color:col, fontSize:11, flexShrink:0, marginTop:1 }}>{icon}</span>
      <p style={{ color:"#cbd5e1", fontSize:11, margin:0, lineHeight:1.55 }}>{text}</p>
    </div>
  );
};

const RightPanel = ({ tab }) => {
  const d = INSIGHTS[tab];
  return (
    <div style={{ width:310, flexShrink:0, background:"#090e18", borderLeft:`1px solid ${CBR}`, display:"flex", flexDirection:"column", overflowY:"auto", maxHeight:"calc(100vh - 106px)" }}>
      <div style={{ padding:"13px 16px 10px", borderBottom:`1px solid ${CBR}`, position:"sticky", top:0, background:"#090e18", zIndex:10 }}>
        <p style={{ color:"#38bdf8", fontSize:9, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 3px" }}>Analysis Panel</p>
        <p style={{ color:"#f1f5f9", fontSize:12.5, fontWeight:800, margin:0 }}>{d.title}</p>
      </div>

      <div style={{ padding:"12px 16px", flex:1 }}>

        <div style={{ marginBottom:16 }}>
          <p style={{ color:"#334155", fontSize:9, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 8px", display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ background:"#1e3a8a", color:"#93c5fd", padding:"2px 6px", borderRadius:3, fontSize:8, fontWeight:900 }}>HOW</span>
            Methodology
          </p>
          {d.how.map((m,i) => (
            <div key={i} style={{ marginBottom:9, paddingLeft:9, borderLeft:"2px solid #1e3a5f" }}>
              <p style={{ color:"#7dd3fc", fontSize:10.5, fontWeight:700, margin:"0 0 2px" }}>{m[0]}</p>
              <p style={{ color:"#475569", fontSize:10.5, margin:0, lineHeight:1.5 }}>{m[1]}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:16 }}>
          <p style={{ color:"#334155", fontSize:9, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 8px", display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ background:"#7f1d1d", color:"#fca5a5", padding:"2px 6px", borderRadius:3, fontSize:8, fontWeight:900 }}>WHAT</span>
            Key Findings
          </p>
          {d.findings.map((f,i) => <FindingRow key={i} type={f[0]} text={f[1]} />)}
        </div>

        <div style={{ background:"#0a0f1a", border:`1px solid #1e293b`, borderRadius:7, padding:"11px 13px", marginBottom:14 }}>
          <p style={{ color:"#f59e0b", fontSize:9, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 7px" }}>Data Caveats</p>
          {d.caveats.map((c,i) => (
            <p key={i} style={{ color:"#475569", fontSize:10.5, margin:"0 0 5px", lineHeight:1.5 }}>⚑ {c}</p>
          ))}
        </div>

        <div style={{ background:CBR, borderRadius:7, padding:"10px 12px" }}>
          <p style={{ color:"#475569", fontSize:9, fontWeight:700, textTransform:"uppercase", margin:"0 0 7px", letterSpacing:"0.08em" }}>Legend</p>
          {[["#f87171","▲","Critical finding"],["#fbbf24","●","Warning / nuance"],["#38bdf8","→","Informational"],["#4ade80","✓","Positive / ruled out"]].map(([col,icon,lbl])=>(
            <div key={lbl} style={{ display:"flex", gap:7, alignItems:"center", marginBottom:4 }}>
              <span style={{ color:col, fontSize:11 }}>{icon}</span>
              <span style={{ color:"#475569", fontSize:10.5 }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TABS = ["Trend Overview","Expiry Analysis","BIB Freshness","Chronic Units","Chain & Ops","Key Findings"];

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{ background:CBG, minHeight:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", color:"#f1f5f9", display:"flex", flexDirection:"column" }}>

      <div style={{ borderBottom:`1px solid ${CBR}`, padding:"12px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <h1 style={{ margin:0, fontSize:16, fontWeight:900, letterSpacing:"-0.02em" }}>NNS Occlusion Intelligence</h1>
          <p style={{ margin:"2px 0 0", color:"#475569", fontSize:10.5 }}>Jun 2025 – Mar 2026 · Active US Dispensers · 8100 vs 9100</p>
        </div>
        <div style={{ display:"flex", gap:7 }}>
          <span style={{ background:C8+"22", color:C8, padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700 }}>■ 8100</span>
          <span style={{ background:C9+"22", color:C9, padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700 }}>■ 9100</span>
        </div>
      </div>

      <div style={{ display:"flex", gap:3, padding:"9px 22px", borderBottom:`1px solid ${CBR}`, flexShrink:0, overflowX:"auto" }}>
        {TABS.map((t,i) => (
          <button key={i} onClick={()=>setTab(i)}
            style={{ background:tab===i?"#1e40af":"transparent", color:tab===i?"#fff":"#64748b",
              border:tab===i?"1px solid #3b82f6":"1px solid transparent",
              borderRadius:5, padding:"5px 12px", fontSize:10.5, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* LEFT CHARTS */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 22px" }}>

          {tab === 0 && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
                <KPI label="Peak 8100 Rate" value="58.1" sub="Occ/disp · Oct '25" color={C8} delta="+466% vs Jun" />
                <KPI label="Peak 9100 Rate" value="21.6" sub="Occ/disp · Nov '25" color={C9} delta="+101% vs Jun" />
                <KPI label="Spike Duration"  value="4 mo" sub="Aug to Nov 2025" color="#a78bfa" />
                <KPI label="Fleet Mar '26"   value="24,256" sub="8100: 5,347 · 9100: 18,909" color="#4ade80" />
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14, marginBottom:12 }}>
                <Hdr title="Full Occlusions Per Dispenser Per Month" sub="Primary normalized rate — monthly active dispenser count as denominator" />
                <ResponsiveContainer width="100%" height={230}>
                  <ComposedChart data={monthlySpine} margin={{top:4,right:14,left:0,bottom:4}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CBR} />
                    <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:10}} />
                    <YAxis tick={{fill:"#64748b",fontSize:10}} />
                    <Tooltip content={<DarkTip />} />
                    <Legend wrapperStyle={{color:"#94a3b8",fontSize:10}} />
                    <ReferenceLine x="Sep '25" stroke="#f59e0b" strokeDasharray="4 4" label={{value:"Spike",fill:"#f59e0b",fontSize:9,position:"insideTopLeft"}} />
                    <ReferenceLine x="Feb '26" stroke="#a78bfa" strokeDasharray="4 4" label={{value:"Sys Change",fill:"#a78bfa",fontSize:9}} />
                    <Area type="monotone" dataKey="full8100" fill={C8+"22"} stroke={C8} strokeWidth={2.5} name="8100 Full Occ/Disp" dot={{r:3,fill:C8}} />
                    <Area type="monotone" dataKey="full9100" fill={C9+"22"} stroke={C9} strokeWidth={2.5} name="9100 Full Occ/Disp" dot={{r:3,fill:C9}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14, marginBottom:12 }}>
                <Hdr title="1-Strike Occlusions Per Dispenser" sub="Leading indicator — micropumpspmoccludedtrouble events normalized to active dispensers" />
                <ResponsiveContainer width="100%" height={185}>
                  <LineChart data={monthlySpine} margin={{top:4,right:14,left:0,bottom:4}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CBR} />
                    <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:10}} />
                    <YAxis tick={{fill:"#64748b",fontSize:10}} />
                    <Tooltip content={<DarkTip />} />
                    <Legend wrapperStyle={{color:"#94a3b8",fontSize:10}} />
                    <ReferenceLine x="Sep '25" stroke="#f59e0b" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="s1_8100" stroke={C8} strokeWidth={2} strokeDasharray="6 3" name="8100 1-Strike/Disp" dot={{r:3}} />
                    <Line type="monotone" dataKey="s1_9100" stroke={C9} strokeWidth={2} strokeDasharray="6 3" name="9100 1-Strike/Disp" dot={{r:3}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14 }}>
                <Hdr title="Raw Full Occlusion Event Count" sub="Absolute volume — 9100 dominates due to 4x larger fleet. Use per-dispenser for comparisons." />
                <ResponsiveContainer width="100%" height={175}>
                  <BarChart data={monthlySpine} margin={{top:4,right:14,left:0,bottom:4}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CBR} />
                    <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:10}} />
                    <YAxis tick={{fill:"#64748b",fontSize:10}} tickFormatter={v=>(v/1000).toFixed(0)+"K"} />
                    <Tooltip content={<DarkTip />} formatter={v=>v.toLocaleString()} />
                    <Legend wrapperStyle={{color:"#94a3b8",fontSize:10}} />
                    <Bar dataKey="raw8100" name="8100 Raw" fill={C8} opacity={0.75} radius={[2,2,0,0]} />
                    <Bar dataKey="raw9100" name="9100 Raw" fill={C9} opacity={0.75} radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {tab === 1 && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
                <KPI label="8100 Warning %" value="~28%" sub="Flat throughout spike" color={C8} />
                <KPI label="9100 Warning %" value="~60%" sub="Drops during spike" color={C9} />
                <KPI label="Feb '26 Spike" value="99.5%" sub="Firmware enforcement change" color="#a78bfa" delta="Not a real expiry surge" />
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14, marginBottom:12 }}>
                <Hdr title="Occlusion Rate vs Expiry Warning Coverage" sub="If expiry drives occlusions, warning % should rise as occ/disp rises. It does not." />
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={expiryOverlay} margin={{top:4,right:38,left:0,bottom:4}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CBR} />
                    <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:10}} />
                    <YAxis yAxisId="l" tick={{fill:"#64748b",fontSize:10}} label={{value:"Occ/Disp",angle:-90,position:"insideLeft",fill:"#64748b",fontSize:9}} />
                    <YAxis yAxisId="r" orientation="right" domain={[0,110]} tick={{fill:"#64748b",fontSize:10}} label={{value:"Warning %",angle:90,position:"insideRight",fill:"#64748b",fontSize:9}} />
                    <Tooltip content={<DarkTip />} />
                    <Legend wrapperStyle={{color:"#94a3b8",fontSize:10}} />
                    <ReferenceLine yAxisId="l" x="Sep '25" stroke="#f59e0b" strokeDasharray="4 4" label={{value:"Spike",fill:"#f59e0b",fontSize:9}} />
                    <ReferenceLine yAxisId="l" x="Feb '26" stroke="#a78bfa" strokeDasharray="4 4" label={{value:"SysChange",fill:"#a78bfa",fontSize:9}} />
                    <Bar yAxisId="l" dataKey="occ8100" name="8100 Occ/Disp" fill={C8} opacity={0.4} />
                    <Bar yAxisId="l" dataKey="occ9100" name="9100 Occ/Disp" fill={C9} opacity={0.4} />
                    <Line yAxisId="r" type="monotone" dataKey="warn8100" stroke={C8} strokeWidth={2} strokeDasharray="5 3" name="8100 Warn%" dot={{r:3}} />
                    <Line yAxisId="r" type="monotone" dataKey="warn9100" stroke={C9} strokeWidth={2} strokeDasharray="5 3" name="9100 Warn%" dot={{r:3}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14 }}>
                <Hdr title="Monthly Detail — Spike months highlighted" />
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10.5 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${CBR}` }}>
                      {["Month","8100 Occ/D","9100 Occ/D","8100 Warn%","9100 Warn%"].map(h=>(
                        <th key={h} style={{ color:"#475569", textAlign:"right", padding:"4px 8px", fontWeight:700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expiryOverlay.map((r,i)=>{
                      const s=["Sep '25","Oct '25","Nov '25"].includes(r.month);
                      return(
                        <tr key={i} style={{ background:s?"#f59e0b0d":"transparent", borderBottom:`1px solid ${CBR}22` }}>
                          <td style={{ color:s?"#fbbf24":"#94a3b8", padding:"4px 8px", fontWeight:s?700:400 }}>{r.month}</td>
                          <td style={{ color:C8, textAlign:"right", padding:"4px 8px", fontWeight:r.occ8100>30?700:400 }}>{r.occ8100}</td>
                          <td style={{ color:C9, textAlign:"right", padding:"4px 8px", fontWeight:r.occ9100>15?700:400 }}>{r.occ9100}</td>
                          <td style={{ color:C8, textAlign:"right", padding:"4px 8px" }}>{r.warn8100}%</td>
                          <td style={{ color:C9, textAlign:"right", padding:"4px 8px" }}>{r.warn9100}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 2 && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
                <KPI label="Peak Expired % 8100" value="62%" sub="Dec '25 - Jan '26" color={C8} delta="Up from 14% in Jun '25" />
                <KPI label="Peak Expired % 9100" value="58%" sub="Jan '26" color={C9} delta="Up from 17% in Jun '25" />
                <KPI label="Fresh BIB Occlusions" value="~47%" sub="Expiry is not the sole cause" color="#4ade80" />
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14, marginBottom:12 }}>
                <Hdr title="% Occlusions Where BIB Was Already Expired at Event Time" sub="ZPL / bibNnsReplaced machines only · 8100 covers 15.6% of occlusions · 9100 covers 51.6%" />
                <ResponsiveContainer width="100%" height={230}>
                  <ComposedChart data={bibExpiry} margin={{top:4,right:14,left:0,bottom:4}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CBR} />
                    <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:10}} />
                    <YAxis tick={{fill:"#64748b",fontSize:10}} domain={[0,75]} tickFormatter={v=>v+"%"} />
                    <Tooltip content={<DarkTip />} formatter={v=>v+"%"} />
                    <Legend wrapperStyle={{color:"#94a3b8",fontSize:10}} />
                    <ReferenceLine x="Sep '25" stroke="#f59e0b" strokeDasharray="4 4" label={{value:"Spike",fill:"#f59e0b",fontSize:9}} />
                    <ReferenceLine y={50} stroke="#f87171" strokeDasharray="3 3" label={{value:"50%",fill:"#f87171",fontSize:9,position:"right"}} />
                    <Area type="monotone" dataKey="pct8100" fill={C8+"33"} stroke={C8} strokeWidth={2.5} name="8100 % Expired" dot={{r:3}} />
                    <Area type="monotone" dataKey="pct9100" fill={C9+"33"} stroke={C9} strokeWidth={2.5} name="9100 % Expired" dot={{r:3}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14 }}>
                <Hdr title="BIB Freshness Breakdown at Oct '25 Peak" sub="Remaining days on enjoy-by date at the exact time of occlusion event" />
                {[
                  ["Already Expired","52.5%","48.4%","#f87171"],
                  ["Critical (0-7 days)","9.1%","9.6%","#fb923c"],
                  ["Near (8-30 days)","21.8%","29.1%","#fbbf24"],
                  ["Fresh (30+ days)","16.6%","12.9%","#4ade80"],
                ].map((r,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${CBR}44` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:7,height:7,borderRadius:2,background:r[3] }} />
                      <span style={{ color:"#94a3b8", fontSize:11 }}>{r[0]}</span>
                    </div>
                    <div style={{ display:"flex", gap:28 }}>
                      <span style={{ color:C8, fontSize:11, fontWeight:700, width:38, textAlign:"right" }}>{r[1]}</span>
                      <span style={{ color:C9, fontSize:11, fontWeight:700, width:38, textAlign:"right" }}>{r[2]}</span>
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"flex-end", gap:28, marginTop:5 }}>
                  <span style={{ color:C8, fontSize:9, fontWeight:800 }}>8100</span>
                  <span style={{ color:C9, fontSize:9, fontWeight:800 }}>9100</span>
                </div>
              </div>
            </div>
          )}

          {tab === 3 && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
                <KPI label="Peak Chronic 8100" value="981" sub="Oct '25 · 100+ occ/month" color={C8} delta="24.1% of occluding 8100s" />
                <KPI label="Peak Chronic 9100" value="572" sub="Oct '25 · 100+ occ/month" color={C9} delta="4.3% of occluding 9100s" />
                <KPI label="Spike Pattern" value="Diffuse" sub="No 80/20 concentration" color="#a78bfa" />
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14, marginBottom:12 }}>
                <Hdr title="Chronic Units Per Month (100+ Full Occlusions That Month)" sub="Left: unit count · Right: % of all occluding dispensers that month" />
                <ResponsiveContainer width="100%" height={235}>
                  <ComposedChart data={chronicData} margin={{top:4,right:38,left:0,bottom:4}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CBR} />
                    <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:10}} />
                    <YAxis yAxisId="l" tick={{fill:"#64748b",fontSize:10}} />
                    <YAxis yAxisId="r" orientation="right" domain={[0,30]} tick={{fill:"#64748b",fontSize:10}} tickFormatter={v=>v+"%"} />
                    <Tooltip content={<DarkTip />} />
                    <Legend wrapperStyle={{color:"#94a3b8",fontSize:10}} />
                    <ReferenceLine yAxisId="l" x="Sep '25" stroke="#f59e0b" strokeDasharray="4 4" />
                    <Bar yAxisId="l" dataKey="c8100" name="8100 Chronic" fill={C8} opacity={0.7} radius={[2,2,0,0]} />
                    <Bar yAxisId="l" dataKey="c9100" name="9100 Chronic" fill={C9} opacity={0.7} radius={[2,2,0,0]} />
                    <Line yAxisId="r" type="monotone" dataKey="pct8100" stroke={C8} strokeWidth={2} strokeDasharray="5 3" name="8100 % Chronic" dot={{r:3}} />
                    <Line yAxisId="r" type="monotone" dataKey="pct9100" stroke={C9} strokeWidth={2} strokeDasharray="5 3" name="9100 % Chronic" dot={{r:3}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14 }}>
                <Hdr title="Pareto Distribution — Sep-Nov 2025 Spike Window" sub="% of each type's total spike occlusions from each bucket" />
                {[
                  ["1000+ occ",   43,   15,    "7.9%","1.9%"],
                  ["500-999 occ", 231,  80,    "20.2%","4.9%"],
                  ["100-499 occ", 2054, 3344,  "60.1%","53.5%"],
                  ["<100 occ",    2140, 12694, "11.8%","39.7%"],
                ].map((r,i)=>(
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"110px 1fr 1fr", gap:8, padding:"7px 0", borderBottom:`1px solid ${CBR}44`, fontSize:10.5 }}>
                    <span style={{ color:"#64748b" }}>{r[0]}</span>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ color:C8 }}>{r[1].toLocaleString()} units</span>
                      <span style={{ color:C8, fontWeight:700 }}>{r[3]}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ color:C9 }}>{r[2].toLocaleString()} units</span>
                      <span style={{ color:C9, fontWeight:700 }}>{r[4]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 4 && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14 }}>
                  <Hdr title="Avg Occ/Dispenser by Chain" sub="Sep-Nov 2025 · min 50 dispensers" />
                  <ResponsiveContainer width="100%" height={290}>
                    <BarChart data={chainData} layout="vertical" margin={{top:0,right:28,left:105,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CBR} horizontal={false} />
                      <XAxis type="number" tick={{fill:"#64748b",fontSize:10}} />
                      <YAxis type="category" dataKey="chain" tick={{fill:"#94a3b8",fontSize:9}} width={100} />
                      <Tooltip content={<DarkTip />} />
                      <Bar dataKey="avg" name="Avg Occ/Unit" radius={[0,4,4,0]}>
                        {chainData.map((e,i)=>(
                          <Cell key={i} fill={["Wendy's (8100)","White Castle (8100)","Burger King (8100)"].includes(e.chain)?C8:C9} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14, marginBottom:12 }}>
                    <Hdr title="Idle Time vs Avg Occ/Dispenser" sub="Inverse: low idle = more occlusions = high traffic" />
                    <ResponsiveContainer width="100%" height={155}>
                      <BarChart data={idleData} margin={{top:4,right:8,left:0,bottom:4}}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CBR} />
                        <XAxis dataKey="bucket" tick={{fill:"#64748b",fontSize:9}} />
                        <YAxis tick={{fill:"#64748b",fontSize:9}} />
                        <Tooltip content={<DarkTip />} />
                        <Bar dataKey="avg8100" name="8100" fill={C8} opacity={0.8} radius={[2,2,0,0]} />
                        <Bar dataKey="avg9100" name="9100" fill={C9} opacity={0.8} radius={[2,2,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:14 }}>
                    <Hdr title="Dispenser Age vs Avg Occ/Dispenser" sub="Weak effect — age is not a primary driver" />
                    <ResponsiveContainer width="100%" height={135}>
                      <BarChart data={ageData} margin={{top:4,right:8,left:0,bottom:4}}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CBR} />
                        <XAxis dataKey="cohort" tick={{fill:"#64748b",fontSize:9}} />
                        <YAxis tick={{fill:"#64748b",fontSize:9}} />
                        <Tooltip content={<DarkTip />} />
                        <Bar dataKey="avg8100" name="8100" fill={C8} opacity={0.8} radius={[2,2,0,0]} />
                        <Bar dataKey="avg9100" name="9100" fill={C9} opacity={0.8} radius={[2,2,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 5 && (
            <div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:18, marginBottom:12 }}>
                <p style={{ color:"#f1f5f9", fontSize:12, fontWeight:800, margin:"0 0 12px" }}>All Hypotheses Tested — Ruled Out</p>
                {[
                  ["Fleet growth artifact","Per-dispenser rate spiked 5.7x. The monthly active denominator accounts for growth — this is a real intensity increase per unit."],
                  ["Firmware threshold change","occludedvalue locked at avg -8, P25/median -9 across all 10 months. Pre/during/post spike are identical. Signal did not shift."],
                  ["New dispenser activation wave","<2% new units per month mid-window. Far too small to drive the observed spike across 24K dispensers."],
                  ["Small chronic offender group","8100 mid-tier (100-499 occ) drives 60% of spike across 2,054 units. Cannot be fixed by pulling 50 bad machines."],
                  ["Expiry warning as primary driver","9100 warning % drops 61 to 56% during spike. Causal direction goes the wrong way. Not the trigger."],
                  ["Idle time / fluid stagnation","Inverse confirmed: 0-8hr idle = 214 avg vs 16-20hr = 52 avg. More usage = more occlusions. Stagnation ruled out."],
                  ["Dispenser age","9100 spans 59-72 avg across all age cohorts. Near-flat line. Not a meaningful factor."],
                ].map(([t,d],i)=>(
                  <div key={i} style={{ display:"flex", gap:9, marginBottom:9, paddingBottom:9, borderBottom:`1px solid ${CBR}44` }}>
                    <span style={{ color:"#4ade80", fontSize:12, flexShrink:0 }}>✓</span>
                    <div>
                      <p style={{ color:"#94a3b8", fontSize:11, fontWeight:700, margin:"0 0 2px" }}>{t}</p>
                      <p style={{ color:"#475569", fontSize:10.5, margin:0, lineHeight:1.5 }}>{d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:CPL, border:`1px solid ${CBR}`, borderRadius:9, padding:18 }}>
                <p style={{ color:"#f1f5f9", fontSize:12, fontWeight:800, margin:"0 0 12px" }}>Remaining Open Hypotheses</p>
                {[
                  ["bad","BIB supply / quality batch","A bad production batch shipped Sep-Oct 2025 could cause fleet-wide physical occlusions. Consistent with simultaneous onset across all chains and both types, transient 4-month duration, and high-traffic machines hit hardest first (they cycle through BIBs faster). Requires manufacturing lot data not in Redshift."],
                  ["warn","Q4 volumetric stress","Seasonal traffic surge amplifies pump stress. High-traffic dispensers occlude 2-4x more than low-traffic. If October traffic spikes, stress on marginal BIBs increases disproportionately."],
                  ["warn","Expiry as enabler, not driver","Expired BIB % climbs steadily Jun to Jan (14% to 62%). Expired BIBs degrade faster under pump stress — making them susceptible when volume surges. Expiry sets the stage; traffic provides the trigger."],
                  ["info","Next query: plantcode analysis","event_data contains plantcode:0, 1, 2. If one plant's BIBs drive the Sep-Nov spike disproportionately, the manufacturing batch hypothesis is confirmed. Highest priority next query."],
                ].map(([type,t,d],i)=>(
                  <div key={i} style={{ display:"flex", gap:9, marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${CBR}44` }}>
                    <FindingRow type={type} text={`${t}: ${d}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <RightPanel tab={tab} />
      </div>
    </div>
  );
}
