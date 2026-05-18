import type { GoalStatus, Priority, Role } from "../types";

export const roleLabel: Record<Role, string> = {
  employee: "Employee",
  manager: "Manager",
  admin: "Admin",
};

export const statusLabel: Record<GoalStatus, string> = {
  draft: "Draft",
  submitted: "Pending approval",
  approved: "Approved",
  rejected: "Needs revision",
  locked: "Locked",
};

export const priorityLabel: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
