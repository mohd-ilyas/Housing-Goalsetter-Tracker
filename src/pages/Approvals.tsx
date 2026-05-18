import { useState } from "react";
import { Check, Edit3, X } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import { useAppStore } from "../stores/useAppStore";
import { Badge, Button, Card, EmptyState, Field, ProgressBar } from "../components/ui";

export default function Approvals() {
  const { users, goals, checkins, approveGoal, rejectGoal, updateGoal, reviewCheckin } = useAppStore();
  const queue = goals.filter((goal) => goal.status === "submitted");
  const submittedCheckins = checkins.filter((item) => item.status === "submitted");
  const [comments, setComments] = useState<Record<string, string>>({});

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <Badge tone="amber">{queue.length} pending</Badge>
          <h2>Approval queue</h2>
          <p>Review submitted goals, adjust weightage where needed, and add clear manager comments.</p>
        </div>
      </div>

      <div className="approval-grid">
        <Card>
          <h3>Goal approvals</h3>
          {queue.length === 0 ? <EmptyState title="Queue clear" body="No goals are waiting for approval." /> : null}
          {queue.map((goal) => {
            const owner = users.find((item) => item.id === goal.ownerId);
            return (
              <article className="approval-item" key={goal.id}>
                <div className="approval-title">
                  <div>
                    <strong>{goal.title}</strong>
                    <small>{owner?.name} • {owner?.department}</small>
                  </div>
                  <Badge tone="amber">Pending approval</Badge>
                </div>
                <p>{goal.description}</p>
                <div className="approval-edit">
                  <Field label="Weight">
                    <input type="number" min={10} max={100} value={goal.weight} onChange={(event) => updateGoal(goal.id, { weight: Number(event.target.value) })} />
                  </Field>
                  <Field label="Progress">
                    <input type="number" min={0} max={100} value={goal.progress} onChange={(event) => updateGoal(goal.id, { progress: Number(event.target.value) })} />
                  </Field>
                </div>
                <Field label="Manager comment">
                  <textarea value={comments[goal.id] ?? ""} onChange={(event) => setComments((state) => ({ ...state, [goal.id]: event.target.value }))} />
                </Field>
                <div className="card-actions">
                  <Button variant="secondary" onClick={() => updateGoal(goal.id, { title: goal.title })}>
                    <Edit3 size={16} /> Save edit
                  </Button>
                  <Button variant="danger" onClick={() => rejectGoal(goal.id, comments[goal.id] || "Please refine the metric and resubmit.")}>
                    <X size={16} /> Reject
                  </Button>
                  <Button onClick={() => approveGoal(goal.id, comments[goal.id])}>
                    <Check size={16} /> Approve
                  </Button>
                </div>
              </article>
            );
          })}
        </Card>

        <Card>
          <h3>Check-in review</h3>
          {submittedCheckins.map((checkin) => {
            const goal = goals.find((item) => item.id === checkin.goalId);
            const owner = users.find((item) => item.id === goal?.ownerId);
            return (
              <article className="approval-item" key={checkin.id}>
                <div className="approval-title">
                  <div>
                    <strong>{goal?.title}</strong>
                    <small>{owner?.name} • {checkin.quarter}</small>
                  </div>
                  <Badge tone="indigo">{checkin.confidence}% confidence</Badge>
                </div>
                <p>{checkin.achievement}</p>
                <ProgressBar value={checkin.confidence} />
                <Field label="Review comment">
                  <textarea value={comments[checkin.id] ?? ""} onChange={(event) => setComments((state) => ({ ...state, [checkin.id]: event.target.value }))} />
                </Field>
                <div className="card-actions">
                  <Button onClick={() => reviewCheckin(checkin.id, comments[checkin.id] || "Reviewed. Keep the update current for the next checkpoint.")}>
                    <Check size={16} /> Mark reviewed
                  </Button>
                </div>
              </article>
            );
          })}
        </Card>
      </div>
    </AppLayout>
  );
}
