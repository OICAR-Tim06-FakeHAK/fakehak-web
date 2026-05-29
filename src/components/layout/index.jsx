import { useAuth }  from "../../context/AuthContext.jsx";
import { useApp }   from "../../context/AppContext.jsx";
import { Icon, Button, StatusBadge } from "../ui/index.jsx";
import { FILTER_OPTIONS, STATUS_META } from "../../utils/index.js";

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)", padding: "10px 12px",
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1, fontFamily: "var(--font-mono)" }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  );
}

export function Sidebar() {
  const { role, logout, isAuthenticated } = useAuth();
  const { stats, statusFilter, setStatusFilter, allCases } = useApp();

  if (!isAuthenticated) return null;

function countFor(val) {
  if (val === "ALL") return allCases.length;
  if (val === "ACTIVE_ONLY") return (stats.active ?? 0) + (stats.inProgress ?? 0);
  return allCases.filter(c => c.status === val).length;
}

  return (
    <aside style={{
      width: 220, minWidth: 220, flexShrink: 0,
      background: "var(--bg-surface)", borderRight: "1px solid var(--border-subtle)",
      display: "flex", flexDirection: "column", padding: "18px 14px", gap: 20,
      overflowY: "auto",
    }}>
      {}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 4 }}>
        <div style={{
          width: 38, height: 38, background: "var(--accent)", borderRadius: "var(--radius-md)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0,
        }}>
          <Icon name="car" size={20} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)", lineHeight: 1.1, fontStyle: "italic" }}>FakeHAK</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{role}</div>
        </div>
      </div>

      {}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <StatCard label="Ukupno"   value={stats.total}      color="var(--text-primary)" />
        <StatCard label="Aktivnih" value={stats.active}     color="var(--status-active)" />
        <StatCard label="U tijeku" value={stats.inProgress} color="var(--status-progress)" />
        <StatCard label="Riješeno" value={stats.resolved}   color="var(--status-resolved)" />
      </div>

      {}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="filter" size={11} /> Filtriranje
        </div>
        {FILTER_OPTIONS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "7px 10px", borderRadius: "var(--radius-sm)", border: "none",
              background: statusFilter === f.value ? "var(--bg-hover)" : "transparent",
              color: statusFilter === f.value ? "var(--text-primary)" : "var(--text-muted)",
              cursor: "pointer", fontSize: 13, fontFamily: "var(--font-ui)",
              transition: "background var(--ease-fast), color var(--ease-fast)",
              outline: statusFilter === f.value ? "1px solid var(--border-default)" : "1px solid transparent",
            }}
          >
            <span>{f.label}</span>
            <span style={{
              background: "var(--bg-overlay)", borderRadius: 10,
              padding: "1px 7px", fontSize: 11, color: "var(--text-muted)",
            }}>{countFor(f.value)}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {}
      <Button variant="ghost" onClick={logout} fullWidth>
        <Icon name="logout" size={14} /> Odjava
      </Button>
    </aside>
  );
}

export function TopBar({ onNewCase }) {
  const { search, setSearch, refresh, casesLoading } = useApp();
  const { isDispatcher } = useAuth();

  return (
    <header style={{
      height: 56, minHeight: 56, background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex", alignItems: "center", gap: 12, padding: "0 16px",
    }}>
      {}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", gap: 8,
        background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)", padding: "7px 12px",
        color: "var(--text-muted)",
      }}>
        <Icon name="search" size={14} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pretraži po imenu, vozilu, ID-u..."
          style={{
            background: "transparent", border: "none", outline: "none",
            color: "var(--text-primary)", fontSize: 13, flex: 1,
            fontFamily: "var(--font-ui)",
          }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
            <Icon name="x" size={13} />
          </button>
        )}
      </div>

      <Button variant="ghost" onClick={refresh} disabled={casesLoading}>
        <Icon name="refresh" size={14} style={{ animation: casesLoading ? "spin 0.7s linear infinite" : "none" }} />
        Osvježi
      </Button>

      {isDispatcher && (
        <Button variant="primary" onClick={onNewCase}>
          <Icon name="plus" size={14} /> Novi slučaj
        </Button>
      )}
    </header>
  );
}

export function AppShell({ children, onNewCase }) {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "var(--bg-base)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar onNewCase={onNewCase} />
        <div style={{ flex: 1, overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
