import {
  TrendingUp, Wallet, CreditCard, Activity,
} from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
}).format(n ?? 0);
const pct = (n) => `${(Number(n) || 0).toFixed(1)}%`;

function SkeletonCard() {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      border: "1px solid #E2E8F0", padding: "24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div className="shimmer" style={{ height: "11px", width: "100px", borderRadius: "6px", marginBottom: "8px" }} />
          <div className="shimmer" style={{ height: "32px", width: "120px", borderRadius: "8px" }} />
        </div>
        <div className="shimmer" style={{ width: "48px", height: "48px", borderRadius: "14px" }} />
      </div>
      <div className="shimmer" style={{ height: "4px", borderRadius: "99px", marginBottom: "14px" }} />
      <div className="shimmer" style={{ height: "24px", width: "110px", borderRadius: "8px" }} />
    </div>
  );
}

const getCards = (d) => {
  const util = Number(d.creditUtilization) || 0;
  const utilColor  = util > 70 ? "#DC2626" : util > 40 ? "#D97706" : "#16A34A";
  const utilBg     = util > 70 ? "#FEF2F2" : util > 40 ? "#FFFBEB" : "#F0FDF4";
  const utilBorder = util > 70 ? "#FECACA" : util > 40 ? "#FDE68A" : "#BBF7D0";
  const utilLabel  = util > 70 ? "High Risk" : util > 40 ? "Moderate" : "Healthy";

  return [
    {
      label: "Net Worth",
      value: fmt(d.netWorth),
      icon: TrendingUp,
      accent: "#2563EB",
      iconBg: "#EFF6FF",
      iconBorder: "#BFDBFE",
      barColor: "#3B82F6",
      barPct: 72,
      badgeText: (d.netWorth ?? 0) >= 0 ? "↑ Positive" : "↓ Negative",
      badgeBg: (d.netWorth ?? 0) >= 0 ? "#F0FDF4" : "#FEF2F2",
      badgeColor: (d.netWorth ?? 0) >= 0 ? "#15803D" : "#DC2626",
      badgeBorder: (d.netWorth ?? 0) >= 0 ? "#86EFAC" : "#FECACA",
      sub: "Assets minus liabilities",
    },
    {
      label: "Bank Balance",
      value: fmt(d.bankBalance),
      icon: Wallet,
      accent: "#16A34A",
      iconBg: "#F0FDF4",
      iconBorder: "#86EFAC",
      barColor: "#22C55E",
      barPct: 60,
      badgeText: "↑ Available",
      badgeBg: "#F0FDF4",
      badgeColor: "#15803D",
      badgeBorder: "#86EFAC",
      sub: "Across all accounts",
    },
    {
      label: "Credit Outstanding",
      value: fmt(d.creditOutstanding),
      icon: CreditCard,
      accent: "#D97706",
      iconBg: "#FFFBEB",
      iconBorder: "#FCD34D",
      barColor: "#F59E0B",
      barPct: 45,
      badgeText: "→ Total Owed",
      badgeBg: "#FFFBEB",
      badgeColor: "#92400E",
      badgeBorder: "#FCD34D",
      sub: "Credit card balance",
    },
    {
      label: "Credit Utilization",
      value: pct(d.creditUtilization),
      icon: Activity,
      accent: utilColor,
      iconBg: utilBg,
      iconBorder: utilBorder,
      barColor: utilColor,
      barPct: util,
      badgeText: utilLabel,
      badgeBg: utilBg,
      badgeColor: utilColor,
      badgeBorder: utilBorder,
      sub: "Recommended under 30%",
      isUtil: true,
    },
  ];
};

export default function SummaryCards({ data, loading }) {
  if (loading) return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px" }}>
      {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px" }}>
      {getCards(data || {}).map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: `1px solid #E2E8F0`,
              padding: "22px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              cursor: "default",
              transition: "all 0.22s ease",
              animation: `slideUp 0.4s ease ${i * 0.08}s forwards`,
              opacity: 0,
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 28px rgba(0,0,0,0.11)`;
              e.currentTarget.style.borderColor = card.iconBorder;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
              e.currentTarget.style.borderColor = "#E2E8F0";
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "3px", background: card.accent,
              borderRadius: "16px 16px 0 0",
            }} />

            {/* Header: label + icon */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: "16px",
            }}>
              <span style={{
                fontSize: "11px", fontWeight: "700",
                color: "#64748B", letterSpacing: "0.07em",
                textTransform: "uppercase", marginTop: "2px",
              }}>
                {card.label}
              </span>
              <div style={{
                width: "46px", height: "46px", borderRadius: "13px",
                background: card.iconBg,
                border: `1.5px solid ${card.iconBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 2px 8px ${card.iconBorder}80`,
              }}>
                <Icon size={20} color={card.accent} strokeWidth={2} />
              </div>
            </div>

            {/* Value */}
            <div style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "clamp(22px, 2.5vw, 28px)",
              fontWeight: "700",
              color: "#0F172A",
              letterSpacing: "-0.02em",
              marginBottom: "14px",
              lineHeight: 1.1,
            }}>
              {card.value}
            </div>

            {/* Progress bar */}
            <div style={{
              height: "5px", borderRadius: "99px",
              background: "#F1F5F9",
              marginBottom: "14px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: "99px",
                width: `${Math.min(card.barPct, 100)}%`,
                background: card.barColor,
                transition: "width 1s ease",
              }} />
            </div>

            {/* Badge + sub text */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{
                padding: "4px 10px", borderRadius: "8px",
                fontSize: "12px", fontWeight: "700",
                background: card.badgeBg,
                color: card.badgeColor,
                border: `1px solid ${card.badgeBorder}`,
                letterSpacing: "0.01em",
              }}>
                {card.badgeText}
              </span>
              <span style={{
                fontSize: "12px", color: "#94A3B8", fontWeight: "400",
              }}>
                {card.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}