import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import NotificationDrawer from "../components/NotificationDrawer";
import { Toast } from "../components/ui";
import { useAppStore } from "../stores/useAppStore";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { toast, clearToast } = useAppStore();

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Topbar />
        <div className="container">{children}</div>
      </div>
      <NotificationDrawer />
      <Toast message={toast} onClose={clearToast} />
    </div>
  );
}
