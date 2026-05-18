export type Role = "employee" | "manager" | "admin";

export type GoalStatus = "draft" | "submitted" | "approved" | "rejected" | "locked";
export type CheckinStatus = "not_started" | "in_progress" | "submitted" | "reviewed";
export type Priority = "low" | "medium" | "high";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  department: string;
  managerId?: string;
  avatar: string;
}

export interface Goal {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  metric: string;
  weight: number;
  progress: number;
  status: GoalStatus;
  dueDate: string;
  managerComment?: string;
  updatedAt: string;
}

export interface Checkin {
  id: string;
  goalId: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  achievement: string;
  confidence: number;
  status: CheckinStatus;
  managerComment?: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "approval" | "reminder" | "comment" | "system";
  unread: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  target: string;
  detail: string;
  createdAt: string;
}

export interface Escalation {
  id: string;
  ownerId: string;
  managerId: string;
  reason: "overdue_approval" | "overdue_checkin";
  severity: Priority;
  daysOpen: number;
  status: "open" | "monitoring" | "resolved";
}

export interface AnalyticsPoint {
  label: string;
  value: number;
  secondary?: number;
}
