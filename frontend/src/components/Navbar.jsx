import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../context/authContext";

const TITLES = {
  "/dashboard": { title: "Dashboard",    sub: "Welcome back! Here's your financial overview" },
  "/expenses":  { title: "Expenses",     sub: "Track and manage your spending"               },
  "/accounts":  { title: "Accounts",     sub: "Your connected bank accounts"                 },
  "/cards":     { title: "Credit Cards", sub: "Manage your credit cards"                     },
  "/budget":    { title: "Budget",       sub: "Set and track your monthly budgets"            },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const page = TITLES[pathname] || { title: "FinanceAI", sub: "" };

  return (
    <header style={{
      height: "64px",
      background: "#FFFFFF",
      borderBottom: "1px solid #E2E8F0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 30,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      flexShrink: 0,
    }}>
      {/* Left */}
      <div>
        <h1 style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "clamp(16px, 2vw, 20px)",
          fontWeight: "700",
          color: "#0F172A",
          lineHeight: 1.2,
        }}>
          {page.title}
        </h1>
        <p style={{
          fontSize: "12px",
          color: "#64748B",
          marginTop: "1px",
          fontWeight: "500",
        }}>
          {page.sub}
        </p>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          padding: "6px 12px",
          borderRadius: "8px",
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          fontSize: "12px",
          fontWeight: "600",
          color: "#475569",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
          })}
        </div>

        <button style={{
          width: "38px", height: "38px",
          borderRadius: "10px",
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
          color: "#64748B", transition: "all 0.15s ease",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#93C5FD";
            e.currentTarget.style.color = "#2563EB";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#E2E8F0";
            e.currentTarget.style.color = "#64748B";
          }}
        >
          <Bell size={16} />
          <span style={{
            position: "absolute", top: "9px", right: "9px",
            width: "7px", height: "7px",
            borderRadius: "50%",
            background: "#EF4444",
            border: "1.5px solid #fff",
          }} />
        </button>

        <div style={{
          width: "38px", height: "38px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: "700",
          color: "#fff", cursor: "pointer",
          boxShadow: "0 2px 8px rgba(37,99,235,0.30)",
          flexShrink: 0,
        }}>
          {(user?.name || user?.email || "U")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}