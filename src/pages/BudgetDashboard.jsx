import { useState, useEffect } from "react";

const C = {
  bg: "#FFFFFF", surface: "#F7F7F7", surfaceHover: "#EFEFEF",
  border: "#E5E5E5", borderStrong: "#C8C8C8",
  text: "#0A0A0A", muted: "#6B6B6B", faint: "#ABABAB",
  sidebar: "#0A0A0A",
  green: "#16A34A", greenBg: "#F0FDF4", greenBorder: "#BBF7D0", greenRing: "#22C55E",
  red: "#DC2626", redBg: "#FEF2F2", redBorder: "#FECACA", redRing: "#EF4444",
  warn: "#B45309", warnBg: "#FFFBEB", warnBorder: "#FDE68A", warnRing: "#F59E0B",
};

function getStatus(pct) {
  if (pct > 100) return "over";
  if (pct >= 80) return "warn";
  return "good";
}

const budgetData = [
  { id: 1, label: "Food",          icon: "🥗", spent: 162,  total: 650  },
  { id: 2, label: "Restaurants",   icon: "🍽️", spent: 830,  total: 2100 },
  { id: 3, label: "Travel",        icon: "✈️", spent: 50,   total: 400  },
  { id: 4, label: "Health",        icon: "💊", spent: 264,  total: 500  },
  { id: 5, label: "Investments",   icon: "📈", spent: 600,  total: 800  },
  { id: 6, label: "Entertainment", icon: "🎬", spent: 1350, total: 1500 },
];

const navItems = [
  { label: "Dashboard",    sym: "⊞" },
  { label: "Transactions", sym: "↕" },
  { label: "Wallet",       sym: "▣" },
  { label: "Budget",       sym: "◎" },
  { label: "Analytics",   sym: "∿" },
];

function RingChart({ spent, total, size = 82, sw = 6, animated }) {
  const [prog, setProg] = useState(0);
  const pct = (spent / total) * 100;
  const status = getStatus(pct);
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const fill = Math.min(pct / 100, 1);
  const dash = circ * (animated ? prog : fill);
  const stroke = { over: C.redRing, warn: C.warnRing, good: C.greenRing }[status];

  useEffect(() => {
    if (!animated) return;
    const t = setTimeout(() => setProg(fill), 100);
    return () => clearTimeout(t);
  }, [fill, animated]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={stroke} strokeWidth={sw}
        strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
        style={{ transition: animated ? "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" : "none" }} />
    </svg>
  );
}

function Tag({ status }) {
  const cfg = {
    over: { bg: C.redBg,  border: C.redBorder,  color: C.red,  label: "Over budget" },
    warn: { bg: C.warnBg, border: C.warnBorder, color: C.warn, label: "Near limit"   },
    good: { bg: C.greenBg,border: C.greenBorder,color: C.green,label: "On track"     },
  }[status];
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
      letterSpacing: "0.05em", textTransform: "uppercase",
      fontFamily: "'IBM Plex Mono', monospace",
    }}>{cfg.label}</span>
  );
}

function BudgetCard({ item, animated }) {
  const pct = (item.spent / item.total) * 100;
  const status = getStatus(pct);
  const remaining = item.total - item.spent;
  const [hover, setHover] = useState(false);
  const accent = { over: C.red, warn: C.warn, good: C.green }[status];
  const barBg  = { over: C.redBg, warn: C.warnBg, good: C.greenBg }[status];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? C.surfaceHover : C.surface,
        border: `1px solid ${hover ? C.borderStrong : C.border}`,
        borderRadius: 12, padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: 13,
        transition: "background 0.15s, border-color 0.15s",
        position: "relative", overflow: "hidden", cursor: "default",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent, opacity: status === "good" ? 0.45 : 1 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 14 }}>{item.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: "-0.01em" }}>{item.label}</span>
        </div>
        <Tag status={status} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative" }}>
          <RingChart spent={item.spent} total={item.total} animated={animated} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: accent, fontFamily: "'IBM Plex Mono', monospace" }}>
              {Math.round(pct)}%
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 23, fontWeight: 700, color: C.text, letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "'IBM Plex Mono', monospace" }}>
            ${item.spent.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: C.faint, marginTop: 3, fontFamily: "'IBM Plex Mono', monospace" }}>
            of ${item.total.toLocaleString()}
          </div>
          <div style={{ marginTop: 7, fontSize: 12, fontWeight: 600, color: accent }}>
            {status === "over"
              ? `↑ $${Math.abs(remaining).toLocaleString()} over limit`
              : `↓ $${remaining.toLocaleString()} remaining`}
          </div>
        </div>
      </div>

      <div style={{ height: 4, background: barBg, borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${Math.min(pct, 100)}%`, background: accent, borderRadius: 2,
          transition: animated ? "width 1s cubic-bezier(0.4,0,0.2,1) 0.1s" : "none",
        }} />
      </div>
    </div>
  );
}

export default function BudgetDashboard() {
  const [activeNav, setActiveNav] = useState("Budget");
  const [animated, setAnimated] = useState(false);

  useEffect(() => { const t = setTimeout(() => setAnimated(true), 120); return () => clearTimeout(t); }, []);

  const totalSpent  = budgetData.reduce((s, i) => s + i.spent, 0);
  const totalBudget = budgetData.reduce((s, i) => s + i.total,  0);
  const remaining   = totalBudget - totalSpent;
  const overCount   = budgetData.filter(i => i.spent > i.total).length;
  const warnCount   = budgetData.filter(i => { const p = (i.spent/i.total)*100; return p >= 80 && p <= 100; }).length;

  const summary = [
    { label: "Total Budget", val: `$${totalBudget.toLocaleString()}`, sub: `${budgetData.length} categories`, color: C.text, bg: C.surface, border: C.border },
    { label: "Total Spent",  val: `$${totalSpent.toLocaleString()}`,  sub: `${Math.round((totalSpent/totalBudget)*100)}% utilized`, color: C.text, bg: C.surface, border: C.border },
    { label: "Remaining",    val: `$${remaining.toLocaleString()}`,   sub: remaining >= 0 ? "available to spend" : "over total", color: remaining >= 0 ? C.green : C.red, bg: remaining >= 0 ? C.greenBg : C.redBg, border: remaining >= 0 ? C.greenBorder : C.redBorder },
    { label: "Alerts",       val: `${overCount + warnCount}`,          sub: `${overCount} over · ${warnCount} near limit`, color: overCount > 0 ? C.red : C.warn, bg: overCount > 0 ? C.redBg : C.warnBg, border: overCount > 0 ? C.redBorder : C.warnBorder },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'IBM Plex Sans', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
      `}</style>

      {/* ── Sidebar ── */}
      <div style={{ width: 210, flexShrink: 0, background: C.sidebar, padding: "24px 16px", display: "flex", flexDirection: "column", gap: 28 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 6px" }}>
          <div style={{ width: 26, height: 26, background: "#fff", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="#0A0A0A" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#0A0A0A" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="#0A0A0A" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="#0A0A0A" />
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#fff", letterSpacing: "-0.01em", fontFamily: "'IBM Plex Mono', monospace" }}>FinSet</span>
        </div>

        <div style={{ padding: "0 6px" }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>Menu</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: -20 }}>
          {navItems.map(({ label, sym }) => {
            const active = label === activeNav;
            return (
              <button key={label} onClick={() => setActiveNav(label)} style={{
                all: "unset", display: "flex", alignItems: "center", gap: 9,
                padding: "9px 10px", borderRadius: 7, fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? "#fff" : "rgba(255,255,255,0.45)",
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                cursor: "pointer", transition: "all 0.12s",
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
              >
                <span style={{ fontSize: 11, width: 14, color: active ? "#fff" : "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{sym}</span>
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto" }}>
          <div style={{ padding: "14px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>April 2026</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#fff", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "-0.03em" }}>
              ${totalSpent.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>spent this month</div>
            <div style={{ marginTop: 10, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${Math.min((totalSpent/totalBudget)*100, 100)}%`, background: "#fff", borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 5, fontFamily: "'IBM Plex Mono', monospace" }}>
              {Math.round((totalSpent/totalBudget)*100)}% of ${totalBudget.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 26 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em", fontFamily: "'IBM Plex Mono', monospace" }}>Budget</h1>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>April 2026 · {budgetData.length} categories tracked</p>
          </div>
          <button style={{
            background: C.text, border: "none", borderRadius: 8,
            padding: "10px 18px", fontSize: 13, fontWeight: 500, color: "#fff",
            cursor: "pointer", transition: "opacity 0.12s", fontFamily: "'IBM Plex Sans', sans-serif",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            + Add budget
          </button>
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 22 }}>
          {summary.map((s, i) => (
            <div key={s.label} style={{
              padding: "14px 16px", background: s.bg,
              border: `1px solid ${s.border}`, borderRadius: 10,
              animation: `fadeUp 0.35s ease forwards`, animationDelay: `${i * 0.06}s`, opacity: 0,
            }}>
              <div style={{ fontSize: 9, color: C.faint, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 7 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "-0.04em" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: C.faint, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 10, color: C.faint, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>Legend</span>
          {[
            { color: C.green, label: "On track  < 80%" },
            { color: C.warn,  label: "Near limit  80–100%" },
            { color: C.red,   label: "Over budget" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 11, color: C.muted }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {budgetData.map((item, i) => (
            <div key={item.id} style={{ animation: `fadeUp 0.4s ease forwards`, animationDelay: `${0.18 + i * 0.07}s`, opacity: 0 }}>
              <BudgetCard item={item} animated={animated} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
