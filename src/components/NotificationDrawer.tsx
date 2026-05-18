import { Bell, CheckCheck, X } from "lucide-react";
import { useAppStore } from "../stores/useAppStore";
import { Badge, Button } from "./ui";

export default function NotificationDrawer() {
  const { currentUserId, drawerOpen, notifications, setDrawerOpen, markNotificationsRead } = useAppStore();
  const items = notifications.filter((item) => item.userId === currentUserId);

  return (
    <aside className={`notification-drawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
      <div className="drawer-head">
        <div>
          <Bell size={18} />
          <strong>Notifications</strong>
        </div>
        <button onClick={() => setDrawerOpen(false)} aria-label="Close notifications">
          <X size={18} />
        </button>
      </div>
      <div className="drawer-actions">
        <Button variant="secondary" onClick={markNotificationsRead}>
          <CheckCheck size={16} /> Mark all read
        </Button>
      </div>
      <div className="notification-list">
        {items.map((item) => (
          <article className={`notification-item ${item.unread ? "unread" : ""}`} key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <Badge tone={item.type === "approval" ? "indigo" : "amber"}>{item.type}</Badge>
            </div>
            <p>{item.body}</p>
            <small>{item.createdAt}</small>
          </article>
        ))}
      </div>
    </aside>
  );
}
