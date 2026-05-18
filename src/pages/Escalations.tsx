import { AlertTriangle } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import { Badge, Card } from "../components/ui";
import { escalationSeed } from "../stores/useAppStore";
import { useAppStore } from "../stores/useAppStore";
import { priorityLabel } from "../utils/format";

export default function Escalations() {
  const { users } = useAppStore();

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <Badge tone="amber">Lightweight escalation</Badge>
          <h2>Escalation overview</h2>
          <p>Overdue approvals and check-ins surfaced for managers and administrators.</p>
        </div>
      </div>

      <Card>
        <div className="table">
          {escalationSeed.map((item) => {
            const owner = users.find((user) => user.id === item.ownerId);
            const manager = users.find((user) => user.id === item.managerId);
            return (
              <div className="table-row escalation-row" key={item.id}>
                <AlertTriangle size={18} />
                <div>
                  <strong>{item.reason === "overdue_approval" ? "Overdue approval" : "Overdue check-in"}</strong>
                  <small>{owner?.name} • Manager {manager?.name} • {item.daysOpen} days open</small>
                </div>
                <Badge tone={item.severity === "high" ? "rose" : item.severity === "medium" ? "amber" : "slate"}>
                  {priorityLabel[item.severity]}
                </Badge>
                <Badge tone={item.status === "open" ? "amber" : "indigo"}>{item.status}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </AppLayout>
  );
}
