import { useState, useEffect } from "react";
import {
  Plus, Search, X, Filter, Calendar,
  TrendingDown, Tag, IndianRupee, ChevronDown,
  ArrowUpDown, Receipt,
} from "lucide-react";
import api from "../api/axios";
import ExpenseForm from "../components/ExpenseForm";
import { useRole } from "../context/roleContext";
import { useTheme } from "../context/themeContext";
import { useAuth } from "../context/authContext";

const CATEGORY_COLORS = {
  Food:          { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D", dot: "#F59E0B" },
  Transport:     { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD", dot: "#3B82F6" },
  Entertainment: { bg: "#F3E8FF", text: "#6B21A8", border: "#D8B4FE", dot: "#A855F7" },
  Health:        { bg: "#DCFCE7", text: "#14532D", border: "#86EFAC", dot: "#22C55E" },
  Shopping:      { bg: "#FFE4E6", text: "#9F1239", border: "#FCA5A5", dot: "#F43F5E" },
  Utilities:     { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA", dot: "#F97316" },
  Education:     { bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7", dot: "#10B981" },
  Other:         { bg: "#F1F5F9", text: "#334155", border: "#CBD5E1", dot: "#64748B" },
};

const getCatStyle = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;

const fmt = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", minimumFractionDigits: 2,
}).format(n ?? 0);

const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", {
  month: "short", day: "numeric", year: "numeric",
});

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first"  },
  { value: "oldest", label: "Oldest first"  },
  { value: "highest", label: "Highest amount" },
  { value: "lowest",  label: "Lowest amount"  },
];

export default function Expenses() {
  const { role } = useRole();
  const { isDark } = useTheme();
  const [expenses, setExpenses]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [search, setSearch]         = useState("");
  const [sortBy, setSortBy]         = useState("newest");
  const [activeCat, setActiveCat]   = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [showSort, setShowSort]     = useState(false);

  useEffect(() => {
    if (role === "viewer") {
      setShowForm(false);
    }
  }, [role]);

  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (user?.email === "demo@example.com") {
      const demoData = [
        { id: "d1", title: "Apple Store", amount: 85000, category: "Shopping", type: "expense", date: new Date().toISOString() },
        { id: "d2", title: "Monthly Rent", amount: 22000, category: "Other", type: "expense", date: new Date().toISOString() },
        { id: "d3", title: "Starbucks Coffee", amount: 450, category: "Food", type: "expense", date: new Date().toISOString() },
        { id: "d4", title: "Uber Ride", amount: 850, category: "Transport", type: "expense", date: new Date().toISOString() },
        { id: "d5", title: "Freelance Payment", amount: 45000, category: "Other", type: "income", date: new Date().toISOString() },
        { id: "d6", title: "Netflix Subscription", amount: 649, category: "Entertainment", type: "expense", date: new Date().toISOString() },
        { id: "d7", title: "Electric Bill", amount: 3200, category: "Utilities", type: "expense", date: new Date().toISOString() },
      ];
      setExpenses(demoData);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/api/expenses");
      const list = data?.data?.expenses || data?.data || data?.expenses || (Array.isArray(data) ? data : []);
      setExpenses(list);
    } catch (e) {
      console.error(e);
      const defaultMock = [
        { id: "mock1", title: "Groceries", amount: 1500, category: "Food", type: "expense", date: new Date().toISOString() },
        { id: "mock2", title: "Salary", amount: 50000, category: "Other", type: "income", date: new Date().toISOString() }
      ];
      const savedMock = JSON.parse(localStorage.getItem("mockExpenses") || "null");
      setExpenses(savedMock ? [...savedMock, ...defaultMock] : defaultMock);
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const normalizedExpenses = expenses.map((expense) => ({
    ...expense,
    type: String(expense.type || "expense").toLowerCase(),
  }));

  const categories = ["All", ...new Set(normalizedExpenses.map(e => e.category).filter(Boolean))];

  const filtered = normalizedExpenses
    .filter(e => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.title?.toLowerCase().includes(q);
      const matchCat = activeCat === "All" || e.category === activeCat;
      const matchType = activeType === "All" || e.type === activeType.toLowerCase();
      return matchSearch && matchCat && matchType;
    })
    .sort((a, b) => {
      if (sortBy === "newest")  return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest")  return new Date(a.date) - new Date(b.date);
      if (sortBy === "highest") return b.amount - a.amount;
      if (sortBy === "lowest")  return a.amount - b.amount;
      return 0;
    });

  const totalSpend = normalizedExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const avgPerTx   = normalizedExpenses.length ? totalSpend / normalizedExpenses.length : 0;
  const topCat     = Object.entries(
    normalizedExpenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  const filteredTotal = filtered.reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "32px", background: "var(--bg-app)" }}>

      {/* ── PAGE HEADER ── */}
      <div className="anim-1" style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "clamp(20px, 3vw, 26px)",
            fontWeight: "700", color: "var(--text-900)", lineHeight: 1.2,
          }}>
            Expenses
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-400)", marginTop: "4px", fontWeight: "500" }}>
            {expenses.length} transaction{expenses.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <button
          onClick={() => {
            if (role === "viewer") return;
            setShowForm(p => !p);
          }}
          className="btn-primary"
          style={{
            gap: "8px",
            opacity: role === "viewer" ? 0.6 : 1,
            cursor: role === "viewer" ? "not-allowed" : "pointer",
          }}
          disabled={role === "viewer"}
          title={role === "viewer" ? "Viewer cannot add transactions" : "Add Expense"}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Expense
        </button>
      </div>

      {/* ── ADD FORM ── */}
      {showForm && role === "admin" && (
        <div className="anim-1" style={{
          background: "var(--bg-card)", borderRadius: "16px",
          border: "1px solid #BFDBFE",
          boxShadow: "0 4px 20px rgba(37,99,235,0.10)",
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            background: "#F8FAFF",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "9px",
                background: "#EFF6FF", border: "1px solid #BFDBFE",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus size={15} color="#2563EB" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-900)" }}>
                New Expense
              </span>
            </div>
            <button onClick={() => setShowForm(false)} style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "var(--bg-muted)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-400)",
              transition: "all 0.15s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#64748B"; }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ padding: "20px" }}>
            <ExpenseForm
              onSuccess={() => { setShowForm(false); fetchExpenses(); }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* ── STAT CARDS ── */}
      <div className="anim-2" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px",
      }}>
        {[
          {
            icon: IndianRupee,
            iconBg: "#EFF6FF", iconBorder: "#BFDBFE", iconColor: "#2563EB",
            label: "Total Spend",
            value: fmt(totalSpend),
            sub: `${expenses.length} transactions`,
          },
          {
            icon: TrendingDown,
            iconBg: "#F0FDF4", iconBorder: "#86EFAC", iconColor: "#16A34A",
            label: "Avg per Transaction",
            value: fmt(avgPerTx),
            sub: "Average spending",
          },
          {
            icon: Tag,
            iconBg: "#FFF7ED", iconBorder: "#FED7AA", iconColor: "#EA580C",
            label: "Top Category",
            value: topCat,
            sub: "Most frequent",
            mono: false,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              background: "var(--bg-card)", borderRadius: "14px",
              border: "1px solid var(--border)", padding: "18px 20px",
              boxShadow: "var(--shadow-sm)",
              display: "flex", alignItems: "center", gap: "14px",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)";
                e.currentTarget.style.borderColor = stat.iconBorder;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{
                width: "46px", height: "46px", borderRadius: "13px",
                background: stat.iconBg, border: `1.5px solid ${stat.iconBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={20} color={stat.iconColor} strokeWidth={2} />
              </div>
              <div>
                <p style={{
                  fontSize: "11px", fontWeight: "700", color: "var(--text-400)",
                  textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px",
                }}>
                  {stat.label}
                </p>
                <p style={{
                  fontSize: stat.mono === false ? "18px" : "20px",
                  fontFamily: stat.mono === false ? "Plus Jakarta Sans" : "JetBrains Mono, monospace",
                  fontWeight: "700", color: "var(--text-900)", lineHeight: 1.1,
                }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-300)", marginTop: "2px" }}>
                  {stat.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MAIN TABLE CARD ── */}
      <div className="anim-3" style={{
        background: "var(--bg-card)", borderRadius: "16px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}>

        {/* Toolbar */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center",
          gap: "10px", flexWrap: "wrap",
          background: "var(--bg-app)",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: "180px" }}>
            <Search size={15} color={isDark ? "#64748B" : "#94A3B8"} style={{
              position: "absolute", left: "12px",
              top: "50%", transform: "translateY(-50%)",
              pointerEvents: "none",
            }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search expenses..."
              style={{
                width: "100%", padding: "9px 12px 9px 36px",
                borderRadius: "9px", fontSize: "14px", fontWeight: "500",
                color: "var(--text-900)", background: "var(--bg-card)",
                border: "1.5px solid var(--border)", outline: "none",
                transition: "all 0.15s ease",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
              onFocus={e => { e.target.style.borderColor = "#3B82F6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.10)"; }}
              onBlur={e => { e.target.style.borderColor = isDark ? "#334155" : "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{
                position: "absolute", right: "10px", top: "50%",
                transform: "translateY(-50%)",
                width: "18px", height: "18px", borderRadius: "50%",
                background: "#CBD5E1", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff",
              }}>
                <X size={10} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", flex: "2 1 auto" }}>
            {categories.map(cat => {
              const isActive = activeCat === cat;
              const cs = getCatStyle(cat);
              return (
                <button key={cat} onClick={() => setActiveCat(cat)} style={{
                  padding: "6px 14px", borderRadius: "8px",
                  fontSize: "12px", fontWeight: "600",
                  cursor: "pointer", transition: "all 0.15s ease",
                  border: isActive
                    ? (cat === "All" ? "1.5px solid #3B82F6" : `1.5px solid ${cs.border}`)
                    : "1.5px solid #E2E8F0",
                  background: isActive
                    ? (cat === "All" ? "#EFF6FF" : cs.bg)
                    : "#fff",
                  color: isActive
                    ? (cat === "All" ? "#1D4ED8" : cs.text)
                    : "#64748B",
                }}>
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Type pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { value: "All", label: "All" },
              { value: "income", label: "Income" },
              { value: "expense", label: "Expense" },
            ].map(type => {
              const isActive = activeType === type.value;
              return (
                <button key={type.value} onClick={() => setActiveType(type.value)} style={{
                  padding: "6px 14px", borderRadius: "8px",
                  fontSize: "12px", fontWeight: "600",
                  cursor: "pointer", transition: "all 0.15s ease",
                  border: isActive ? "1.5px solid #3B82F6" : "1.5px solid #E2E8F0",
                  background: isActive ? "#EFF6FF" : "#fff",
                  color: isActive ? "#1D4ED8" : "#64748B",
                }}>
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={() => setShowSort(p => !p)} style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "9px 14px", borderRadius: "9px",
              background: "var(--bg-card)", border: "1.5px solid var(--border)",
              fontSize: "13px", fontWeight: "600", color: "var(--text-500)",
              cursor: "pointer", transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#93C5FD"; e.currentTarget.style.color = "#2563EB"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-500)"; }}
            >
              <ArrowUpDown size={13} />
              {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
              <ChevronDown size={13} />
            </button>
            {showSort && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0,
                background: "var(--bg-card)", borderRadius: "12px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 50, minWidth: "160px", overflow: "hidden",
              }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                    style={{
                      display: "block", width: "100%",
                      padding: "10px 16px", textAlign: "left",
                      fontSize: "13px", fontWeight: sortBy === opt.value ? "700" : "500",
                      color: sortBy === opt.value ? "#2563EB" : "#334155",
                      background: sortBy === opt.value ? "#EFF6FF" : "transparent",
                      border: "none", cursor: "pointer",
                      transition: "all 0.12s ease",
                    }}
                    onMouseEnter={e => { if (sortBy !== opt.value) e.currentTarget.style.background = "var(--bg-muted)"; }}
                    onMouseLeave={e => { if (sortBy !== opt.value) e.currentTarget.style.background = "transparent"; }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table header */}
        {!loading && filtered.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto auto",
            gap: "0 16px",
            padding: "10px 20px",
            background: "var(--bg-muted)",
            borderBottom: "1px solid var(--border)",
          }}>
            {["Expense", "Category", "Type", "Amount", "Date"].map(h => (
              <span key={h} style={{
                fontSize: "11px", fontWeight: "700",
                color: "var(--text-300)", letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>{h}</span>
            ))}
          </div>
        )}

        {/* Rows */}
        {loading ? (
          <div style={{ padding: "20px" }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                display: "flex", alignItems: "center",
                gap: "14px", padding: "14px 0",
                borderBottom: "1px solid var(--border)",
              }}>
                <div className="shimmer" style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="shimmer" style={{ height: "13px", width: "140px", borderRadius: "6px", marginBottom: "7px" }} />
                  <div className="shimmer" style={{ height: "11px", width: "90px", borderRadius: "6px" }} />
                </div>
                <div className="shimmer" style={{ width: "70px", height: "24px", borderRadius: "8px" }} />
                <div className="shimmer" style={{ width: "80px", height: "13px", borderRadius: "6px" }} />
                <div className="shimmer" style={{ width: "80px", height: "13px", borderRadius: "6px" }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "60px 20px", gap: "14px",
          }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              background: "var(--bg-muted)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Receipt size={26} color="#94A3B8" />
            </div>
            <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-900)" }}>
              {search || activeCat !== "All" ? "No matching expenses" : "No expenses yet"}
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-400)", textAlign: "center" }}>
              {search || activeCat !== "All"
                ? "Try adjusting your search or filters"
                : "Add your first expense to get started"}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((expense, i) => {
              const cs = getCatStyle(expense.category);
              return (
                <div key={expense.id || i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto auto auto",
                    gap: "0 16px",
                    alignItems: "center",
                    padding: "14px 20px",
                    borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none",
                    transition: "background 0.15s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-muted)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Expense name */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "11px",
                      background: cs.bg, border: `1.5px solid ${cs.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "15px", fontWeight: "700", color: cs.text,
                      flexShrink: 0,
                    }}>
                      {expense.title?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: "14px", fontWeight: "600",
                          color: "var(--text-900)", whiteSpace: "nowrap",
                        overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {expense.title || "Untitled"}
                      </p>
                      {expense.description && (
                        <p style={{
                          fontSize: "12px", color: "var(--text-300)",
                          marginTop: "2px", whiteSpace: "nowrap",
                          overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {expense.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    padding: "4px 12px", borderRadius: "8px",
                    fontSize: "12px", fontWeight: "600",
                    background: cs.bg, color: cs.text,
                    border: `1px solid ${cs.border}`,
                    whiteSpace: "nowrap",
                  }}>
                    <span style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: cs.dot, flexShrink: 0,
                    }} />
                    {expense.category || "Other"}
                  </span>

                  {/* Type */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "4px 12px", borderRadius: "8px",
                    fontSize: "12px", fontWeight: "600",
                    whiteSpace: "nowrap",
                    background: expense.type === "income" ? "#F0FDF4" : "#FEF2F2",
                    color: expense.type === "income" ? "#15803D" : "#DC2626",
                    border: `1px solid ${expense.type === "income" ? "#86EFAC" : "#FECACA"}`,
                  }}>
                    {expense.type === "income" ? "Income" : "Expense"}
                  </span>

                  {/* Amount */}
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "14px", fontWeight: "700",
                     color: "var(--text-300)", letterSpacing: "0.08em",
                  }}>
                    {expense.type === "income" ? "+" : "-"}{fmt(expense.amount)}
                  </span>

                  {/* Date */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    whiteSpace: "nowrap",
                  }}>
                    <Calendar size={13} color="#94A3B8" />
                    <span style={{ fontSize: "13px", color: "var(--text-400)", fontWeight: "500" }}>
                      {fmtDate(expense.date || expense.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap",
            gap: "8px",
            padding: "14px 20px",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-muted)",
          }}>
            <span style={{ fontSize: "13px", color: "var(--text-400)", fontWeight: "500" }}>
              Showing <strong style={{ color: "var(--text-900)" }}>{filtered.length}</strong> of{" "}
              <strong style={{ color: "var(--text-900)" }}>{expenses.length}</strong> expenses
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-400)", fontWeight: "500" }}>Total:</span>
              <span style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "15px", fontWeight: "700", color: "#2563EB",
              }}>
                {fmt(filteredTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}