import type { ReactNode } from "react";

export default function KpiCard({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="kpi-card">
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        {detail ? <span>{detail}</span> : null}
      </div>
      {icon ? <div className="kpi-icon">{icon}</div> : null}
    </div>
  );
}
