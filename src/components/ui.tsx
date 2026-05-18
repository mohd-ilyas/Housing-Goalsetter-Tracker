import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleAlert, Info, XCircle } from "lucide-react";

type BadgeTone = "slate" | "indigo" | "emerald" | "amber" | "rose";

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button className={`btn btn-${variant}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <motion.section
      className={`card ${compact ? "card-compact" : ""} ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error ? <small className="field-error">{error}</small> : hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress" aria-label={`${value}% complete`}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <Info size={22} />
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}

export function Toast({ message, onClose }: { message?: string; onClose: () => void }) {
  if (!message) return null;
  const icon = message.includes("returned") || message.includes("out") ? <CircleAlert size={18} /> : <CheckCircle2 size={18} />;
  return (
    <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {icon}
      <span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss notification">
        <XCircle size={16} />
      </button>
    </motion.div>
  );
}
