import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Building2, CheckCircle2 } from "lucide-react";
import { Button, Field } from "../components/ui";
import { useAppStore } from "../stores/useAppStore";

const demoEmails = ["employee@alignx.com", "manager@alignx.com", "admin@alignx.com"];

export default function Login() {
  const navigate = useNavigate();
  const { currentUserId, login } = useAppStore();
  const [email, setEmail] = useState("employee@alignx.com");
  const [error, setError] = useState("");

  if (currentUserId) return <Navigate to="/dashboard" replace />;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const ok = login(email);
    if (!ok) {
      setError("Use one of the AlignX demo accounts.");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <div className="brand-mark">AX</div>
          <div>
            <h1>AlignX</h1>
            <p>Enterprise goals, approvals, check-ins, and performance visibility in one calm workspace.</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="login-form">
          <Field label="Work email" error={error}>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Button type="submit">
            <Building2 size={16} /> Continue to workspace
          </Button>
        </form>
        <div className="demo-list">
          {demoEmails.map((item) => (
            <button key={item} onClick={() => setEmail(item)}>
              <CheckCircle2 size={15} />
              {item}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
