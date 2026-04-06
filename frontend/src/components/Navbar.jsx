import { useLocation } from "react-router-dom";
import { Bell, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useRole } from "../context/roleContext";
import { useTheme } from "../context/themeContext";

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
  const { role, setRole } = useRole();
  const { isDark, toggleDarkMode } = useTheme();
  const page = TITLES[pathname] || { title: "FinanceAI", sub: "" };

  const handleRoleChange = (e) => {
    const nextRole = e.target.value;
    setRole(nextRole);
  };

  return (
    <header style={{
      height: "64px",
      background: "var(--bg-card)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 30,
      boxShadow: "var(--shadow-sm)",
      flexShrink: 0,
    }}>
      {/* Left */}
      <div>
        <h1 style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "clamp(16px, 2vw, 20px)",
          fontWeight: "700",
          color: "var(--text-900)",
          lineHeight: 1.2,
        }}>
          {page.title}
        </h1>
        <p style={{
          fontSize: "12px",
          color: "var(--text-400)",
          marginTop: "1px",
          fontWeight: "500",
        }}>
          {page.sub}
        </p>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ position: "relative" }}>
          <select
            value={role}
            onChange={handleRoleChange}
            aria-label="Select role"
            style={{
              height: "38px",
              padding: "0 28px 0 12px",
              borderRadius: "8px",
              background: "var(--bg-muted)",
              border: "1px solid var(--border)",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--text-500)",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#93C5FD";
              e.currentTarget.style.color = "#2563EB";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-500)";
            }}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <span style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            fontSize: "10px",
            color: "var(--text-300)",
          }}>
            ▾
          </span>
        </div>

        <div style={{
          padding: "6px 12px",
          borderRadius: "8px",
          background: "var(--bg-muted)",
          border: "1px solid var(--border)",
          fontSize: "12px",
          fontWeight: "600",
          color: "var(--text-500)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
          })}
        </div>

        <button 
          onClick={toggleDarkMode}
          style={{
            width: "38px", height: "38px",
            borderRadius: "10px",
            background: "var(--bg-muted)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-400)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#93C5FD";
            e.currentTarget.style.color = "#2563EB";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-400)";
          }}
          title="Toggle dark mode"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button style={{
          width: "38px", height: "38px",
          borderRadius: "10px",
          background: "var(--bg-muted)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
          color: "var(--text-400)",
          transition: "all 0.15s ease",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#93C5FD";
            e.currentTarget.style.color = "#2563EB";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-400)";
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