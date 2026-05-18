import { Lock, Pencil, Send } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "./ui";
import type { Goal } from "../types";
import { statusLabel } from "../utils/format";

const toneByStatus = {
  draft: "slate",
  submitted: "amber",
  approved: "emerald",
  rejected: "rose",
  locked: "indigo",
} as const;

export function GoalCard({
  goal,
  onEdit,
  onSubmit,
}: {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onSubmit?: (goal: Goal) => void;
}) {
  const editable = goal.status === "draft" || goal.status === "rejected";

  return (
    <Card compact>
      <div className="goal-card-head">
        <div>
          <h3>{goal.title}</h3>
          <p>{goal.description}</p>
        </div>
        <Badge tone={toneByStatus[goal.status]}>{statusLabel[goal.status]}</Badge>
      </div>
      <div className="goal-meta">
        <span>{goal.metric}</span>
        <span>{goal.weight}% weight</span>
        <span>Due {goal.dueDate}</span>
      </div>
      <ProgressBar value={goal.progress} />
      {goal.managerComment ? <p className="manager-note">Manager: {goal.managerComment}</p> : null}
      {onEdit || onSubmit ? (
        <div className="card-actions">
          <Button variant="secondary" onClick={() => onEdit?.(goal)} disabled={!editable}>
            {editable ? <Pencil size={16} /> : <Lock size={16} />} Edit
          </Button>
          <Button onClick={() => onSubmit?.(goal)} disabled={!editable}>
            <Send size={16} /> Submit
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
