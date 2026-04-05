import { useState, useEffect } from "react";
import {
  RefreshCw, Sparkles, ShieldCheck,
  AlertTriangle, Zap, TrendingUp,
} from "lucide-react";
import api from "../api/axios";
import SummaryCards from "../components/SummaryCards";
import RiskBadge from "../components/RiskBadge";
import ExpenseChart from "../components/ExpenseChart";
import AIInsights from "../components/AIInsights";
import { useAuth } from "../context/authContext";

const fmt = (n) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
}).format(n ?? 0);

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const fetchSummary = async () => {
    try {
      const { data } = await api.get("/api/finance/summary");
      setSummary(data?.data || data);
    } catch (e) { console.error(e); }
    finally { setLoadingSummary(false); }
  };

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get("/api/expenses");
      const list = data?.data?.expenses || data?.data || data?.expenses || (Array.isArray(data) ? data : []);
      setExpenses(list);
    } catch (e) { console.error(e); }
    finally { setLoadingExpenses(false); }
  };

  useEffect(() => { fetchSummary(); fetchExpenses(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoadingSummary(true);
    setLoadingExpenses(true);
    await Promise.all([fetchSummary(), fetchExpenses()]);
    setRefreshing(false);
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  };

  const riskLevel = summary?.riskLevel || "Low";
  const riskStyle = {
    Low:      { text: "#15803D", bg: "#DCFCE7", border: "#86EFAC", dot: "#22C55E", label: "Low Risk"      },
    Moderate: { text: "#92400E", bg: "#FEF3C7", border: "#FCD34D", dot: "#F59E0B", label: "Moderate Risk" },
    High:     { text: "#991B1B", bg: "#FEE2E2", border: "#FCA5A5", dot: "#EF4444", label: "High Risk"     },
  }[riskLevel];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "32px" }}>

      {/* ── HERO BANNER ── */}
      <div className="anim-1" style={{
        borderRadius: "20px",
        background: "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 60%, #2563EB 100%)",
        padding: "clamp(20px, 3vw, 28px)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(29,78,216,0.25)",
      }}>
        {/* Subtle decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, right: 200, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        {/* Top row: greeting + buttons */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "14px",
          position: "relative",
        }}>
          <div>
            <p style={{ color: "#BAE6FD", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
              {greeting()}, {user?.name?.split(" ")[0] || "there"} 👋
            </p>
            <h2 style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(18px, 3vw, 24px)",
              fontWeight: "700", color: "#FFFFFF", lineHeight: 1.25,
            }}>
              Your Financial Dashboard
            </h2>
            <p style={{ color: "#BAE6FD", fontSize: "13px", marginTop: "3px", fontWeight: "400" }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => setShowAI(p => !p)} style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "9px 18px", borderRadius: "10px",
              background: showAI ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.30)",
              color: "#fff", fontSize: "13px", fontWeight: "600",
              cursor: "pointer", transition: "all 0.15s ease",
              backdropFilter: "blur(4px)",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background = showAI ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)"}
            >
              <Sparkles size={14} />
              AI Insights
            </button>
            <button onClick={handleRefresh} disabled={refreshing} style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "#fff", display: "flex",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.15s ease",
            }}>
              <RefreshCw size={15} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        {!loadingSummary && summary && (
          <div style={{
            marginTop: "20px",
            paddingTop: "18px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            display: "flex", gap: "10px", flexWrap: "wrap",
            position: "relative",
          }}>
            {[
              { label: "Net Worth",    value: fmt(summary.netWorth)          },
              { label: "Bank Balance", value: fmt(summary.bankBalance)        },
              { label: "Credit Used",  value: fmt(summary.creditOutstanding)  },
            ].map(({ label, value }) => (
              <div key={label} style={{
                flex: "1 1 120px",
                background: "rgba(255,255,255,0.10)",
                borderRadius: "12px",
                padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
              }}>
                <p style={{
                  color: "#BAE6FD", fontSize: "10px", fontWeight: "700",
                  letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "5px",
                }}>
                  {label}
                </p>
                <p style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(16px, 2.2vw, 21px)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: "600",
                  letterSpacing: "-0.01em",
                }}>
                  {value}
                </p>
              </div>
            ))}

            {/* Risk pill — HIGH CONTRAST, clearly readable */}
            <div style={{
              flex: "0 0 auto",
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 18px", borderRadius: "12px",
              background: riskStyle.bg,
              border: `1.5px solid ${riskStyle.border}`,
            }}>
              <span style={{
                width: "9px", height: "9px", borderRadius: "50%",
                background: riskStyle.dot, flexShrink: 0,
                boxShadow: `0 0 6px ${riskStyle.dot}`,
              }} />
              <span style={{
                color: riskStyle.text,
                fontSize: "13px", fontWeight: "700",
                whiteSpace: "nowrap",
              }}>
                {riskStyle.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="anim-2">
        <SummaryCards data={summary} loading={loadingSummary} />
      </div>

      {/* ── RISK + CHART ── */}
      <div className="anim-3" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        alignItems: "stretch",
      }}>
        <RiskBadge data={summary} loading={loadingSummary} />
        <ExpenseChart expenses={expenses} loading={loadingExpenses} />
      </div>

      {/* ── AI INSIGHTS ── */}
      {showAI && (
        <div style={{ animation: "slideUp 0.35s ease forwards", opacity: 0 }}>
          <AIInsights summary={summary} />
        </div>
      )}

      {/* ── BOTTOM: ALERTS + HEALTH ── */}
      {!loadingSummary && summary && (
        <div className="anim-4" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}>

          {/* Alerts Panel */}
          <div style={{
            background: "#fff", borderRadius: "16px",
            border: "1px solid #E2E8F0", padding: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: "18px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "#FEF2F2", border: "1px solid #FECACA",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <AlertTriangle size={17} color="#DC2626" />
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A" }}>Active Alerts</p>
                  <p style={{ fontSize: "12px", color: "#64748B", marginTop: "1px" }}>Financial warnings</p>
                </div>
              </div>
              <span style={{
                padding: "4px 12px", borderRadius: "99px",
                fontSize: "12px", fontWeight: "700",
                background: (summary.alerts || []).length > 0 ? "#FEF2F2" : "#F0FDF4",
                color: (summary.alerts || []).length > 0 ? "#DC2626" : "#15803D",
                border: `1px solid ${(summary.alerts || []).length > 0 ? "#FECACA" : "#86EFAC"}`,
              }}>
                {(summary.alerts || []).length} {(summary.alerts || []).length === 1 ? "alert" : "alerts"}
              </span>
            </div>

            {(summary.alerts || []).length === 0 ? (
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", padding: "24px 0", gap: "10px",
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  background: "#F0FDF4", border: "1px solid #86EFAC",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ShieldCheck size={24} color="#16A34A" />
                </div>
                <p style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A" }}>All clear!</p>
                <p style={{ fontSize: "13px", color: "#64748B", textAlign: "center" }}>
                  No financial alerts at this time
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(summary.alerts || []).map((alert, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: "10px",
                    padding: "12px 14px", borderRadius: "10px",
                    background: "#FFF7ED", border: "1px solid #FED7AA",
                  }}>
                    <AlertTriangle size={14} color="#EA580C" style={{ flexShrink: 0, marginTop: "1px" }} />
                    <p style={{ fontSize: "13px", color: "#1E293B", lineHeight: 1.55, fontWeight: "500" }}>
                      {alert}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financial Health */}
          <div style={{
            background: "#fff", borderRadius: "16px",
            border: "1px solid #E2E8F0", padding: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "#EFF6FF", border: "1px solid #BFDBFE",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <TrendingUp size={17} color="#2563EB" />
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A" }}>Financial Health</p>
                <p style={{ fontSize: "12px", color: "#64748B", marginTop: "1px" }}>Key performance metrics</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                {
                  label: "Savings Rate",
                  pct: Math.min(summary.bankBalance > 0
                    ? Math.round((summary.bankBalance / (summary.bankBalance + (summary.creditOutstanding || 0) + 1)) * 100) : 0, 100),
                  color: "#2563EB", track: "#DBEAFE",
                },
                {
                  label: "Debt Control",
                  pct: Math.min(100 - Math.round(Number(summary.creditUtilization) || 0), 100),
                  color: "#16A34A", track: "#DCFCE7",
                },
                {
                  label: "Risk Management",
                  pct: Math.max(100 - (summary.riskScore || 0), 0),
                  color: riskLevel === "Low" ? "#16A34A" : riskLevel === "Moderate" ? "#D97706" : "#DC2626",
                  track: riskLevel === "Low" ? "#DCFCE7" : riskLevel === "Moderate" ? "#FEF3C7" : "#FEE2E2",
                },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>{item.label}</span>
                    <span style={{ fontSize: "13px", fontFamily: "JetBrains Mono", fontWeight: "700", color: item.color }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div style={{ height: "8px", borderRadius: "99px", background: item.track, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "99px",
                      width: `${item.pct}%`, background: item.color,
                      transition: "width 0.9s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Score dots */}
            <div style={{
              marginTop: "20px", paddingTop: "16px",
              borderTop: "1px solid #F1F5F9",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Overall Score</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  {[1,2,3,4,5].map(i => {
                    const score = Math.max(100 - (summary.riskScore || 0), 0);
                    const filled = i <= Math.round((score / 100) * 5);
                    return (
                      <div key={i} style={{
                        width: "22px", height: "7px", borderRadius: "99px",
                        background: filled ? "#2563EB" : "#E2E8F0",
                        transition: "background 0.3s ease",
                      }} />
                    );
                  })}
                </div>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>
                  {riskLevel === "Low" ? "Excellent" : riskLevel === "Moderate" ? "Fair" : "Needs Work"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}