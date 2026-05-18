import { FormEvent, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { GoalCard } from "../components/GoalCard";
import { Badge, Button, Card, Field } from "../components/ui";
import AppLayout from "../layouts/AppLayout";
import { useAppStore } from "../stores/useAppStore";
import type { Goal } from "../types";

const blankGoal = {
  title: "",
  description: "",
  metric: "",
  weight: 10,
  dueDate: "2026-06-30",
};

export default function Goals() {
  const { currentUserId, users, goals, addGoal, updateGoal, submitGoal } = useAppStore();
  const user = users.find((item) => item.id === currentUserId)!;
  const visibleGoals = user.role === "employee" ? goals.filter((goal) => goal.ownerId === user.id) : goals;
  const ownGoals = goals.filter((goal) => goal.ownerId === user.id);
  const [draft, setDraft] = useState(blankGoal);
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalWeight = useMemo(() => ownGoals.reduce((sum, goal) => sum + goal.weight, 0), [ownGoals]);
  const editingGoal = editingId ? goals.find((goal) => goal.id === editingId) : undefined;
  const formValue = editingGoal
    ? {
        title: editingGoal.title,
        description: editingGoal.description,
        metric: editingGoal.metric,
        weight: editingGoal.weight,
        dueDate: editingGoal.dueDate,
      }
    : draft;
  const nextTotal = totalWeight - (editingGoal?.weight ?? 0) + Number(formValue.weight || 0);
  const errors = {
    title: formValue.title.trim().length < 6 ? "Use a clear goal title." : "",
    description: formValue.description.trim().length < 12 ? "Add a short outcome-oriented description." : "",
    metric: formValue.metric.trim().length < 8 ? "Add a measurable success metric." : "",
    weight: formValue.weight < 10 ? "Each goal must carry at least 10% weight." : "",
    count: !editingGoal && ownGoals.length >= 8 ? "Maximum 8 goals per cycle." : "",
    total: nextTotal > 100 ? "Total weightage cannot exceed 100%." : "",
  };
  const canSave = Object.values(errors).every(Boolean) === false && Object.values(errors).filter(Boolean).length === 0;
  const canSubmitAll = ownGoals.length > 0 && totalWeight === 100 && ownGoals.every((goal) => goal.weight >= 10);

  const setForm = (updates: Partial<typeof blankGoal>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, updates as Partial<Goal>);
      return;
    }
    setDraft((current) => ({ ...current, ...updates }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    if (editingGoal) {
      setEditingId(null);
      return;
    }
    addGoal(formValue);
    setDraft(blankGoal);
  };

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <Badge tone={canSubmitAll ? "emerald" : "amber"}>{totalWeight}% allocated</Badge>
          <h2>Goal management</h2>
          <p>Create weighted quarterly goals, submit for manager approval, and track status from draft to locked.</p>
        </div>
        {user.role === "employee" ? (
          <Button onClick={() => ownGoals.filter((goal) => goal.status === "draft" || goal.status === "rejected").forEach((goal) => submitGoal(goal.id))} disabled={!canSubmitAll}>
            <Save size={16} /> Submit ready goals
          </Button>
        ) : null}
      </div>

      {user.role === "employee" ? (
        <Card>
          <div className="section-head">
            <div>
              <h3>{editingGoal ? "Edit goal" : "Create goal"}</h3>
              <p>Validation is live: maximum 8 goals, minimum 10% each, and exactly 100% before final submission.</p>
            </div>
          </div>
          <form className="goal-form" onSubmit={onSubmit}>
            <Field label="Goal title" error={errors.title}>
              <input value={formValue.title} onChange={(event) => setForm({ title: event.target.value })} />
            </Field>
            <Field label="Success metric" error={errors.metric}>
              <input value={formValue.metric} onChange={(event) => setForm({ metric: event.target.value })} />
            </Field>
            <Field label="Description" error={errors.description}>
              <textarea value={formValue.description} onChange={(event) => setForm({ description: event.target.value })} />
            </Field>
            <div className="form-row">
              <Field label="Weightage" error={errors.weight || errors.total || errors.count} hint="Minimum 10%">
                <input type="number" min={10} max={100} value={formValue.weight} onChange={(event) => setForm({ weight: Number(event.target.value) })} />
              </Field>
              <Field label="Due date">
                <input type="date" value={formValue.dueDate} onChange={(event) => setForm({ dueDate: event.target.value })} />
              </Field>
            </div>
            <div className="card-actions">
              {editingGoal ? <Button variant="secondary" onClick={() => setEditingId(null)}>Done editing</Button> : null}
              <Button type="submit" disabled={!canSave}>
                <Plus size={16} /> {editingGoal ? "Save changes" : "Add goal"}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="goal-grid">
        {visibleGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onEdit={user.role === "employee" ? setEditingId : undefined} onSubmit={user.role === "employee" ? (item) => submitGoal(item.id) : undefined} />
        ))}
      </div>
    </AppLayout>
  );
}
