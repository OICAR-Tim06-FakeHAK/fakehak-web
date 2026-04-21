import { useState } from "react";
import { useAuth }  from "../context/AuthContext.jsx";
import { Icon, Button, ErrorBanner } from "../components/ui/index.jsx";

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const [identifier, setIdentifier] = useState("admin");
  const [password,   setPassword]   = useState("admin123");

  async function handleSubmit(e) {
    e.preventDefault();
    await login(identifier, password);
  }

  return (
    <div style={{
      height: "100vh", width: "100vw",
      background: "var(--bg-base)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      {}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 300,
        background: "radial-gradient(ellipse, rgba(232,93,38,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: 380,
        background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)", padding: "36px 32px",
        boxShadow: "var(--shadow-lg)",
        animation: "fadeIn 0.3s ease forwards",
      }}>
        {}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: "var(--accent)", borderRadius: "var(--radius-lg)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            flexShrink: 0,
          }}>
            <Icon name="car" size={24} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text-primary)", fontStyle: "italic", lineHeight: 1 }}>FakeHAK</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, letterSpacing: "0.1em", textTransform: "uppercase" }}>Dispečerski portal</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 600 }}>
              Korisničko ime ili Email
            </label>
            <input
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="admin"
              autoFocus
              style={{
                width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text-primary)",
                fontSize: 14, outline: "none", fontFamily: "var(--font-ui)", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 600 }}>
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text-primary)",
                fontSize: 14, outline: "none", fontFamily: "var(--font-ui)", boxSizing: "border-box",
              }}
            />
          </div>

          <ErrorBanner message={error} />

          <Button variant="primary" type="submit" disabled={loading} fullWidth style={{ marginTop: 4, padding: "11px 14px", fontSize: 14 }}>
            {loading ? "Prijava u tijeku..." : "Prijavi se →"}
          </Button>
        </form>

        <div style={{ marginTop: 20, padding: "12px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Demo pristup</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>admin / admin123</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>dispatcher / dispatcher123</div>
        </div>
      </div>
    </div>
  );
}
