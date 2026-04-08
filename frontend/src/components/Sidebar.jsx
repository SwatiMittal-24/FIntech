import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Receipt, Building2,
  CreditCard, PiggyBank, LogOut,
  ChevronLeft, ChevronRight, Zap,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard"    },
  { to: "/expenses",  icon: Receipt,         label: "Expenses"     },
  { to: "/accounts",  icon: Building2,        label: "Accounts"     },
  { to: "/cards",     icon: CreditCard,       label: "Credit Cards" },
  { to: "/budget",    icon: PiggyBank,        label: "Budget"       },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside style={{
      width: collapsed ? "68px" : "240px",
      minWidth: collapsed ? "68px" : "240px",
      height: "100vh",
      background: "#0F172A",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)",
      position: "relative",
      zIndex: 40,
      overflow: "visible",
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{
        padding: "18px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: "10px",
        overflow: "hidden",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          flexShrink: 0,
          background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(59,130,246,0.45)",
        }}>
          <Zap size={16} color="#fff" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div>
            <div style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "17px", fontWeight: "700",
              color: "#F8FAFC", whiteSpace: "nowrap",
            }}>
              Finance<span style={{ color: "#60A5FA" }}>AI</span>
            </div>
            <div style={{
              fontSize: "10px", fontWeight: "600", color: "var(--text-500)",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              Smart Finance
            </div>
          </div>
        )}
      </div>

      {/* ── TOGGLE BUTTON — fixed on sidebar edge ── */}
      <button
        onClick={onToggle}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          position: "absolute",
          top: "72px",
          right: "-16px",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "#1E40AF",
          border: "2px solid #FFFFFF",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          transition: "all 0.2s ease",
          outline: "none",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "#2563EB";
          e.currentTarget.style.transform = "scale(1.12)";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.5)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "#1E40AF";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";
        }}
      >
        {collapsed
          ? <ChevronRight size={15} strokeWidth={2.5} />
          : <ChevronLeft  size={15} strokeWidth={2.5} />
        }
      </button>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: "14px 8px",
        overflowY: "auto", overflowX: "hidden",
      }}>
        {!collapsed && (
          <div style={{
            fontSize: "10px", fontWeight: "700", color: "#334155",
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "0 8px", marginBottom: "8px",
          }}>
            Menu
          </div>
        )}
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            title={collapsed ? label : undefined}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center",
              gap: "10px", padding: "10px 10px",
              borderRadius: "10px", marginBottom: "3px",
              textDecoration: "none", position: "relative",
              transition: "all 0.15s ease",
              background: isActive ? "rgba(59,130,246,0.18)" : "transparent",
              color: isActive ? "#93C5FD" : "#94A3B8",
            })}
            onMouseEnter={e => {
              const isActive = e.currentTarget.getAttribute("aria-current") === "page";
              if (!isActive) {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "#E2E8F0";
              }
            }}
            onMouseLeave={e => {
              const isActive = e.currentTarget.getAttribute("aria-current") === "page";
              e.currentTarget.style.background = isActive ? "rgba(59,130,246,0.18)" : "transparent";
              e.currentTarget.style.color = isActive ? "#93C5FD" : "#94A3B8";
            }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span style={{
                    position: "absolute", left: 0, top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px", height: "22px",
                    background: "#3B82F6", borderRadius: "0 3px 3px 0",
                  }} />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{
                    fontSize: "14px",
                    fontWeight: isActive ? "600" : "500",
                    whiteSpace: "nowrap",
                  }}>
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "10px 8px" }}>
        {!collapsed && user && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px", marginBottom: "4px",
          }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "700", color: "#fff",
            }}>
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{
                fontSize: "13px", fontWeight: "600", color: "#E2E8F0",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {user.name || "User"}
              </div>
              <div style={{
                fontSize: "11px", color: "var(--text-500)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {user.email}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowLogoutModal(true)}
          title={collapsed ? "Logout" : undefined}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            width: "100%", padding: "10px", borderRadius: "10px",
            background: "transparent", border: "none",
            color: "var(--text-400)", cursor: "pointer",
            transition: "all 0.15s ease",
            fontSize: "14px", fontWeight: "500",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.12)";
            e.currentTarget.style.color = "#FCA5A5";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748B";
          }}
        >
          <LogOut size={17} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ whiteSpace: "nowrap" }}>Logout</span>}
        </button>
      </div>
      
      <ConfirmationModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account? Any unsaved changes may be lost."
        confirmText="Logout"
        type="danger"
      />
    </aside>
  );
}