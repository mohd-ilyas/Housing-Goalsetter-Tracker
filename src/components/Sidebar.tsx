import { NavLink } from "react-router-dom";
import { Activity, BarChart3, CheckSquare, ClipboardList, Gauge, History, ShieldCheck, Siren } from "lucide-react";
import { useAppStore } from "../stores/useAppStore";

export default function Sidebar() {
  const user = useAppStore((state) => state.users.find((item) => item.id === state.currentUserId));
  const role = user?.role ?? "employee";
  const nav = [
    { to: "/dashboard", label: "Dashboard", icon: Gauge, roles: ["employee", "manager", "admin"] },
    { to: "/goals", label: "Goals", icon: ClipboardList, roles: ["employee", "manager", "admin"] },
    { to: "/checkins", label: "Check-ins", icon: CheckSquare, roles: ["employee", "manager"] },
    { to: "/approvals", label: "Approvals", icon: ShieldCheck, roles: ["manager", "admin"] },
    { to: "/analytics", label: "Analytics", icon: BarChart3, roles: ["manager", "admin"] },
    { to: "/admin", label: "Admin", icon: Activity, roles: ["admin"] },
    { to: "/escalations", label: "Escalations", icon: Siren, roles: ["manager", "admin"] },
    { to: "/audit", label: "Audit Trail", icon: History, roles: ["admin"] },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">AX</div>
        <div>
          <h1>AlignX</h1>
          <span>Quarterly alignment</span>
        </div>
      </div>

      <nav>
        {nav
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`} to={item.to} key={item.to}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>
    </aside>
  );
}
