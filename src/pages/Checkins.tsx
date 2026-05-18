import { useState } from "react";
import { Send } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import { Badge, Button, Card, Field, ProgressBar } from "../components/ui";
import { useAppStore } from "../stores/useAppStore";

export default function Checkins() {
  const { currentUserId, users, goals, checkins, updateCheckin } = useAppStore();
  const user = users.find((item) => item.id === currentUserId)!;
  const visibleGoals = user.role === "employee" ? goals.filter((goal) => goal.ownerId === user.id && goal.status === "approved") : goals.filter((goal) => goal.status === "approved");
  const [drafts, setDrafts] = useState<Record<string, { achievement: string; confidence: number }>>({});

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <Badge tone="indigo">Q2 check-ins</Badge>
          <h2>Quarterly check-ins</h2>
          <p>Capture achievements, confidence, and blockers against approved goals.</p>
        </div>
      </div>

      <div className="goal-grid">
        {visibleGoals.map((goal) => {
          const checkin = checkins.find((item) => item.goalId === goal.id);
          const current = drafts[goal.id] ?? {
            achievement: checkin?.achievement ?? "",
            confidence: checkin?.confidence ?? goal.progress,
          };
          return (
            <Card key={goal.id} compact>
              <div className="goal-card-head">
                <div>
                  <h3>{goal.title}</h3>
                  <p>{goal.metric}</p>
                </div>
                <Badge tone={checkin?.status === "reviewed" ? "emerald" : "amber"}>{checkin?.status ?? "not started"}</Badge>
              </div>
              <ProgressBar value={goal.progress} />
              <Field label="Achievement update">
                <textarea
                  value={current.achievement}
                  onChange={(event) => setDrafts((state) => ({ ...state, [goal.id]: { ...current, achievement: event.target.value } }))}
                />
              </Field>
              <Field label="Confidence">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={current.confidence}
                  onChange={(event) => setDrafts((state) => ({ ...state, [goal.id]: { ...current, confidence: Number(event.target.value) } }))}
                />
              </Field>
              <div className="checkin-confidence">{current.confidence}% confidence</div>
              {checkin?.managerComment ? <p className="manager-note">Manager: {checkin.managerComment}</p> : null}
              <div className="card-actions">
                <Button onClick={() => updateCheckin(goal.id, current.achievement, current.confidence)} disabled={current.achievement.trim().length < 10}>
                  <Send size={16} /> Submit check-in
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
