import AppLayout from "../layouts/AppLayout";
import { Badge, Card } from "../components/ui";
import { useAppStore } from "../stores/useAppStore";

export default function Audit() {
  const { auditLogs, users } = useAppStore();

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <Badge tone="slate">Immutable history</Badge>
          <h2>Audit trail</h2>
          <p>Action history for approvals, check-ins, cycle changes, and administrative overrides.</p>
        </div>
      </div>

      <Card>
        <div className="timeline">
          {auditLogs.map((log) => {
            const actor = users.find((item) => item.id === log.actorId);
            return (
              <article key={log.id}>
                <span />
                <div>
                  <strong>{log.action}</strong>
                  <p>{log.target} • {log.detail}</p>
                  <small>{actor?.name} at {log.createdAt}</small>
                </div>
              </article>
            );
          })}
        </div>
      </Card>
    </AppLayout>
  );
}
