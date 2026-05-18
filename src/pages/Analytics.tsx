import AppLayout from "../layouts/AppLayout";
import { BarChart, DonutChart, LineChart } from "../components/Charts";
import { Badge, Card } from "../components/ui";
import { completionTrend, departmentPerformance, managerPerformance } from "../services/mockData";
import { useAppStore } from "../stores/useAppStore";

export default function Analytics() {
  const { goals } = useAppStore();
  const completion = Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <Badge tone="emerald">Live demo data</Badge>
          <h2>Organization analytics</h2>
          <p>Clean signals for leaders: completion trends, department health, and manager follow-through.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <Card>
          <h3>Quarterly completion</h3>
          <LineChart data={completionTrend} />
        </Card>
        <Card>
          <h3>Goal completion</h3>
          <DonutChart value={completion} />
        </Card>
        <Card>
          <h3>Department performance</h3>
          <BarChart data={departmentPerformance} />
        </Card>
        <Card>
          <h3>Manager performance</h3>
          <div className="manager-list">
            {managerPerformance.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}%</strong>
                <small>{item.secondary} open reviews</small>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
