import AppLayout from "../layouts/AppLayout";
import KpiCard from "../components/KpiCard";
import { AlertTriangle, CheckCircle2, Clock3, Target, Users } from "lucide-react";
import { BarChart, DonutChart, LineChart } from "../components/Charts";
import { Badge, Card, ProgressBar } from "../components/ui";
import { departmentPerformance, completionTrend } from "../services/mockData";
import { useAppStore } from "../stores/useAppStore";
import { escalationSeed } from "../stores/useAppStore";

export default function Dashboard() {
  const { currentUserId, users, goals, checkins } = useAppStore();
  const user = users.find((item) => item.id === currentUserId)!;
  const employeeGoals = user.role === "employee" ? goals.filter((goal) => goal.ownerId === user.id) : goals;
  const pending = goals.filter((goal) => goal.status === "submitted").length;
  const approved = goals.filter((goal) => goal.status === "approved").length;
  const avg = Math.round(employeeGoals.reduce((sum, goal) => sum + goal.progress, 0) / Math.max(employeeGoals.length, 1));
  const teamMembers = users.filter((item) => item.managerId === user.id);
  const headline =
    user.role === "employee"
      ? "Your Q2 priorities are mostly on track. One goal is waiting on manager approval."
      : user.role === "manager"
        ? "Your team has strong completion momentum with a small approval queue to clear."
        : "Organization alignment is healthy, with three escalations needing attention.";

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <Badge tone="indigo">{user.department}</Badge>
          <h2>{user.role === "admin" ? "Executive overview" : `Welcome back, ${user.name.split(" ")[0]}`}</h2>
          <p>{headline}</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard title="Active goals" value={`${employeeGoals.length}`} detail="Q2 tracking" icon={<Target size={20} />} />
        <KpiCard title="Average progress" value={`${avg}%`} detail="Across visible goals" icon={<CheckCircle2 size={20} />} />
        <KpiCard title="Pending reviews" value={`${pending}`} detail="Approval queue" icon={<Clock3 size={20} />} />
        <KpiCard
          title={user.role === "employee" ? "Check-ins" : "Escalations"}
          value={user.role === "employee" ? `${checkins.filter((item) => employeeGoals.some((goal) => goal.id === item.goalId)).length}` : `${escalationSeed.length}`}
          detail={user.role === "employee" ? "Submitted this cycle" : "Open items"}
          icon={user.role === "employee" ? <Users size={20} /> : <AlertTriangle size={20} />}
        />
      </div>

      <div className="dashboard-grid">
        <Card>
          <div className="section-head">
            <div>
              <h3>Completion trend</h3>
              <p>Goal completion across the active cycle.</p>
            </div>
          </div>
          <LineChart data={completionTrend} />
        </Card>
        <Card>
          <div className="section-head">
            <div>
              <h3>{user.role === "employee" ? "Personal completion" : "Department performance"}</h3>
              <p>{user.role === "employee" ? "Weighted goal progress." : "Completion by business unit."}</p>
            </div>
          </div>
          {user.role === "employee" ? <DonutChart value={avg} /> : <BarChart data={departmentPerformance} />}
        </Card>
      </div>

      <Card>
        <div className="section-head">
          <div>
            <h3>{user.role === "manager" ? "Team focus" : "Priority goals"}</h3>
            <p>{user.role === "manager" ? `${teamMembers.length} direct reports in this demo workspace.` : "High-signal items for the current cycle."}</p>
          </div>
        </div>
        <div className="table">
          {employeeGoals.slice(0, 5).map((goal) => {
            const owner = users.find((item) => item.id === goal.ownerId);
            return (
              <div className="table-row" key={goal.id}>
                <div>
                  <strong>{goal.title}</strong>
                  <small>{owner?.name} • {goal.metric}</small>
                </div>
                <ProgressBar value={goal.progress} />
                <Badge tone={goal.status === "approved" ? "emerald" : goal.status === "submitted" ? "amber" : "slate"}>
                  {goal.status}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </AppLayout>
  );
}
