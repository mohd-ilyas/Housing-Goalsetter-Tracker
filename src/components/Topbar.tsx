import { Bell, ChevronRight, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore";
import type { Role } from "../types";
import { roleLabel } from "../utils/format";

export default function Topbar() {
  const location = useLocation();
  const { currentUserId, users, notifications, switchRole, logout, setDrawerOpen, activeCycle } = useAppStore();
  const user = users.find((item) => item.id === currentUserId) ?? users[0];
  const unread = notifications.filter((item) => item.userId === currentUserId && item.unread).length;
  const title = location.pathname.split("/").filter(Boolean)[0] || "dashboard";

  return (
    <div className="topbar">
      <div>
        <div className="breadcrumbs">
          <span>AlignX</span>
          <ChevronRight size={14} />
          <strong>{title.charAt(0).toUpperCase() + title.slice(1)}</strong>
        </div>
        <p>{activeCycle} performance cycle</p>
      </div>

      <div className="topbar-actions">
        <select value={user.role} onChange={(event) => switchRole(event.target.value as Role)} aria-label="Demo role switcher">
          <option value="employee">Employee demo</option>
          <option value="manager">Manager demo</option>
          <option value="admin">Admin demo</option>
        </select>
        <button className="icon-button" onClick={() => setDrawerOpen(true)} aria-label="Open notifications">
          <Bell size={18} />
          {unread > 0 ? <span>{unread}</span> : null}
        </button>
        <div className="profile-chip">
          <span>{user.avatar}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{roleLabel[user.role]}</small>
          </div>
        </div>
        <button className="icon-button" onClick={logout} aria-label="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
