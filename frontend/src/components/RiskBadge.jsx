import { ShieldCheck, ShieldAlert, ShieldX, AlertTriangle } from "lucide-react";

const CFG = {
  Low:      { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", Icon: ShieldCheck, label: "Low Risk"      },
  Moderate: { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", Icon: ShieldAlert, label: "Moderate Risk" },
  High:     { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", Icon: ShieldX,     label: "High Risk"     },
};

function Arc({ score }) {
  const r = 48, cx = 60, cy = 60;
  const startA = -210, totalA = 240;
  const endA = startA + (score / 100) * totalA;
  const toRad = d => (d * Math.PI) / 180;
  const pt = (deg) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
  });
  const arc = (a, b) => {
    const s = pt(a), e = pt(b);
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${b - a > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
  };
  const c = score <= 33 ? "#16A34A" : score <= 66 ? "#F59E0B" : "#EF4444";
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <path d={arc(startA, startA + totalA)} fill="none" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" />
      <path d={arc(startA, endA)} fill="none" stroke={c} strokeWidth="8" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${c}60)` }} />
      <text x="60" y="57" textAnchor="middle" fill="#0F172A"
        fontSize="22" fontWeight="700" fontFamily="JetBrains Mono">{score}</text>
      <text x="60" y="72" textAnchor="middle" fill="#94A3B8"
        fontSize="9" fontFamily="Plus Jakarta Sans" letterSpacing="1.5">RISK SCORE</text>
    </svg>
  );
}

export default function RiskBadge({ data, loading }) {
  if (loading) return (
    <div style={{
      background: "var(--bg-card)", borderRadius: "16px",
      border: "1px solid var(--border)", padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div className="shimmer" style={{ height: "12px", width: "130px", borderRadius: "6px", marginBottom: "20px" }} />
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <div className="shimmer" style={{ width: "120px", height: "120px", borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="shimmer" style={{ height: "14px", width: "90px", borderRadius: "6px" }} />
          <div className="shimmer" style={{ height: "8px", width: "100%", borderRadius: "99px" }} />
          <div className="shimmer" style={{ height: "12px", width: "120px", borderRadius: "6px" }} />
        </div>
      </div>
    </div>
  );

  const level = data?.riskLevel || "Low";
  const score = data?.riskScore ?? 0;
  const alerts = data?.alerts || [];
  const cfg = CFG[level] || CFG.Low;
  const { Icon } = cfg;

  return (
    <div style={{
      background: "var(--bg-card)", borderRadius: "16px",
      border: "1px solid var(--border)", padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)", height: "100%",
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: "16px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: "700",
          color: "var(--text-400)", letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          Risk Assessment
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "4px 12px", borderRadius: "99px",
          fontSize: "12px", fontWeight: "600",
          background: cfg.bg, color: cfg.color,
          border: `1px solid ${cfg.border}`,
        }}>
          <Icon size={11} />
          {cfg.label}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ flexShrink: 0 }}>
          <Arc score={score} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              display: "flex", justifyContent: "space-between", marginBottom: "7px",
            }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-500)" }}>Score</span>
              <span style={{
                fontSize: "13px", fontFamily: "JetBrains Mono",
                fontWeight: "700", color: cfg.color,
              }}>
                {score}/100
              </span>
            </div>
            <div style={{
              height: "8px", borderRadius: "99px",
              background: "var(--bg-muted)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: "99px",
                width: `${score}%`, background: cfg.color,
                transition: "width 0.8s ease",
              }} />
            </div>
          </div>

          {alerts.length > 0 ? (
            <div>
              <div style={{
                fontSize: "10px", fontWeight: "700",
                color: "var(--text-300)", letterSpacing: "0.08em",
                textTransform: "uppercase", marginBottom: "7px",
              }}>
                Alerts
              </div>
              {alerts.slice(0, 2).map((a, i) => (
                <div key={i} style={{
                  display: "flex", gap: "7px", marginBottom: "5px",
                }}>
                  <AlertTriangle size={12} color={cfg.color}
                    style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{
                    fontSize: "12px", color: "var(--text-500)",
                    lineHeight: 1.5, fontWeight: "500",
                  }}>
                    {a}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "9px 12px", borderRadius: "9px",
              background: "#F0FDF4", border: "1px solid #BBF7D0",
            }}>
              <ShieldCheck size={14} color="#16A34A" />
              <span style={{
                fontSize: "13px", fontWeight: "600", color: "#16A34A",
              }}>
                No active alerts
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}