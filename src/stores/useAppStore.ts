import { create } from "zustand";
import { auditLogs, checkins, escalations, goals, notifications, users } from "../services/mockData";
import type { AuditLog, Checkin, Goal, Notification, Role, User } from "../types";

interface AppState {
  currentUserId: string;
  users: User[];
  goals: Goal[];
  checkins: Checkin[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  activeCycle: string;
  drawerOpen: boolean;
  toast?: string;
  login: (email: string) => boolean;
  switchRole: (role: Role) => void;
  logout: () => void;
  setDrawerOpen: (open: boolean) => void;
  markNotificationsRead: () => void;
  addGoal: (goal: Omit<Goal, "id" | "ownerId" | "status" | "progress" | "updatedAt">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  submitGoal: (id: string) => void;
  approveGoal: (id: string, comment?: string) => void;
  rejectGoal: (id: string, comment: string) => void;
  unlockGoal: (id: string) => void;
  updateCheckin: (goalId: string, achievement: string, confidence: number) => void;
  reviewCheckin: (id: string, managerComment: string) => void;
  clearToast: () => void;
}

const roleToUserId: Record<Role, string> = {
  employee: "u-employee",
  manager: "u-manager",
  admin: "u-admin",
};

const now = () => new Date().toLocaleString("en-IN", { hour12: false });

export const useAppStore = create<AppState>((set, get) => ({
  currentUserId: localStorage.getItem("alignx-user") || "",
  users,
  goals,
  checkins,
  notifications,
  auditLogs,
  activeCycle: "Q2 2026",
  drawerOpen: false,
  login: (email) => {
    const user = get().users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) return false;
    localStorage.setItem("alignx-user", user.id);
    set({ currentUserId: user.id, toast: `Welcome back, ${user.name.split(" ")[0]}` });
    return true;
  },
  switchRole: (role) => {
    const id = roleToUserId[role];
    localStorage.setItem("alignx-user", id);
    set({ currentUserId: id, toast: `Demo mode switched to ${role}` });
  },
  logout: () => {
    localStorage.removeItem("alignx-user");
    set({ currentUserId: "", toast: "Signed out" });
  },
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  markNotificationsRead: () => {
    const { currentUserId } = get();
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.userId === currentUserId ? { ...item, unread: false } : item,
      ),
    }));
  },
  addGoal: (goal) => {
    const owner = get().currentUserId;
    const created: Goal = {
      ...goal,
      id: `g-${Date.now()}`,
      ownerId: owner,
      status: "draft",
      progress: 0,
      updatedAt: now(),
    };
    set((state) => ({
      goals: [created, ...state.goals],
      auditLogs: [
        {
          id: `a-${Date.now()}`,
          actorId: owner,
          action: "Created goal",
          target: goal.title,
          detail: `Draft weightage ${goal.weight}%.`,
          createdAt: now(),
        },
        ...state.auditLogs,
      ],
      toast: "Goal saved as draft",
    }));
  },
  updateGoal: (id, updates) => {
    const existing = get().goals.find((goal) => goal.id === id);
    set((state) => ({
      goals: state.goals.map((goal) => (goal.id === id ? { ...goal, ...updates, updatedAt: now() } : goal)),
      auditLogs: existing
        ? [
            {
              id: `a-${Date.now()}`,
              actorId: state.currentUserId,
              action: "Updated goal",
              target: existing.title,
              detail: "Goal fields were updated.",
              createdAt: now(),
            },
            ...state.auditLogs,
          ]
        : state.auditLogs,
      toast: "Goal updated",
    }));
  },
  submitGoal: (id) => {
    const existing = get().goals.find((goal) => goal.id === id);
    set((state) => ({
      goals: state.goals.map((goal) => (goal.id === id ? { ...goal, status: "submitted", updatedAt: now() } : goal)),
      auditLogs: existing
        ? [
            {
              id: `a-${Date.now()}`,
              actorId: state.currentUserId,
              action: "Submitted goal",
              target: existing.title,
              detail: "Goal moved to manager approval queue.",
              createdAt: now(),
            },
            ...state.auditLogs,
          ]
        : state.auditLogs,
      toast: "Goal submitted for approval",
    }));
  },
  approveGoal: (id, comment) => {
    const existing = get().goals.find((goal) => goal.id === id);
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, status: "approved", managerComment: comment, updatedAt: now() } : goal,
      ),
      auditLogs: existing
        ? [
            {
              id: `a-${Date.now()}`,
              actorId: state.currentUserId,
              action: "Approved goal",
              target: existing.title,
              detail: "Goal is locked for quarterly tracking.",
              createdAt: now(),
            },
            ...state.auditLogs,
          ]
        : state.auditLogs,
      toast: "Goal approved and locked",
    }));
  },
  rejectGoal: (id, comment) => {
    const existing = get().goals.find((goal) => goal.id === id);
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, status: "rejected", managerComment: comment, updatedAt: now() } : goal,
      ),
      auditLogs: existing
        ? [
            {
              id: `a-${Date.now()}`,
              actorId: state.currentUserId,
              action: "Rejected goal",
              target: existing.title,
              detail: comment || "Returned to employee for updates.",
              createdAt: now(),
            },
            ...state.auditLogs,
          ]
        : state.auditLogs,
      toast: "Goal returned with comments",
    }));
  },
  unlockGoal: (id) => {
    const existing = get().goals.find((goal) => goal.id === id);
    set((state) => ({
      goals: state.goals.map((goal) => (goal.id === id ? { ...goal, status: "draft", updatedAt: now() } : goal)),
      auditLogs: existing
        ? [
            {
              id: `a-${Date.now()}`,
              actorId: state.currentUserId,
              action: "Unlocked goal",
              target: existing.title,
              detail: "Admin reopened goal editing.",
              createdAt: now(),
            },
            ...state.auditLogs,
          ]
        : state.auditLogs,
      toast: "Goal unlocked",
    }));
  },
  updateCheckin: (goalId, achievement, confidence) => {
    const existing = get().checkins.find((item) => item.goalId === goalId);
    set((state) => ({
      checkins: existing
        ? state.checkins.map((item) =>
            item.goalId === goalId
              ? { ...item, achievement, confidence, status: "submitted", updatedAt: now() }
              : item,
          )
        : [
            {
              id: `c-${Date.now()}`,
              goalId,
              quarter: "Q2",
              achievement,
              confidence,
              status: "submitted",
              updatedAt: now(),
            },
            ...state.checkins,
          ],
      toast: "Check-in submitted",
    }));
  },
  reviewCheckin: (id, managerComment) =>
    set((state) => ({
      checkins: state.checkins.map((item) =>
        item.id === id ? { ...item, managerComment, status: "reviewed", updatedAt: now() } : item,
      ),
      toast: "Check-in reviewed",
    })),
  clearToast: () => set({ toast: undefined }),
}));

export const escalationSeed = escalations;
