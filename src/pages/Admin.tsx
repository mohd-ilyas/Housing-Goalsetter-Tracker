import { CalendarDays, LockOpen, Power } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import KpiCard from "../components/KpiCard";
import { Badge, Button, Card } from "../components/ui";
import { useAppStore } from "../stores/useAppStore";
import { escalationSeed } from "../stores/useAppStore";

export default function Admin() {
  const { users, goals, unlockGoal } = useAppStore();
  const approved = goals.filter((goal) => goal.status === "approved");

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <Badge tone="indigo">Admin console</Badge>
          <h2>Cycle management</h2>
          <p>Manage the active performance cycle, unlock exceptions, and monitor organizational risk.</p>
        </div>
        <Button>
          <Power size={16} /> Open Q3 planning
        </Button>
      </div>

      <div className="kpi-grid">
        <KpiCard title="Employees" value={`${users.length}`} detail="Seeded workspace" icon={<CalendarDays size={20} />} />
        <KpiCard title="Locked goals" value={`${approved.length}`} detail="Approved this cycle" icon={<LockOpen size={20} />} />
        <KpiCard title="Escalations" value={`${escalationSeed.length}`} detail="Open or monitoring" />
        <KpiCard title="Cycle health" value="84%" detail="On-track weighted progress" />
      </div>

      <Card>
        <h3>Unlock goals</h3>
        <div className="table">
          {approved.map((goal) => {
            const owner = users.find((item) => item.id === goal.ownerId);
            return (
              <div className="table-row" key={goal.id}>
                <div>
                  <strong>{goal.title}</strong>
                  <small>{owner?.name} • {goal.weight}% weight</small>
                </div>
                <Badge tone="emerald">locked</Badge>
                <Button variant="secondary" onClick={() => unlockGoal(goal.id)}>
                  <LockOpen size={16} /> Unlock
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </AppLayout>
  );
}
