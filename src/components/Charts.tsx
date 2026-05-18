import type { AnalyticsPoint } from "../types";
import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as ReLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function LineChart({ data }: { data: AnalyticsPoint[] }) {
  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height={220}>
        <ReLineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }} />
          <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({ data }: { data: AnalyticsPoint[] }) {
  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height={220}>
        <ReBarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 12 }}>
          <CartesianGrid stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={72} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }} />
          <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} barSize={14} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({ value }: { value: number }) {
  const data = [
    { name: "Complete", value },
    { name: "Remaining", value: 100 - value },
  ];

  return (
    <div className="donut-wrap" aria-label={`${value}% completion`}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={62} outerRadius={86} startAngle={90} endAngle={-270}>
            <Cell fill="#10b981" />
            <Cell fill="#e2e8f0" />
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }} />
        </PieChart>
      </ResponsiveContainer>
      <strong>{value}%</strong>
    </div>
  );
}
