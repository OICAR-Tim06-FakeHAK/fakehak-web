import { Icon, StatusBadge } from "../ui/index.jsx";
import { formatRelative }    from "../../utils/index.js";

export function CaseCard({ c, selected, onClick }) {
  return (
    <article
      onClick={onClick}
      style={{
        background:    selected ? "var(--bg-hover)"    : "var(--bg-elevated)",
        border:        selected ? "1px solid var(--border-focus)" : "1px solid var(--border-subtle)",
        borderRadius:  "var(--radius-md)",
        padding:       "12px 14px",
        marginBottom:  6,
        cursor:        "pointer",
        transition:    "border-color var(--ease-fast), background var(--ease-fast)",
        animation:     "fadeIn 0.2s ease forwards",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>#{c.id}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatRelative(c.createdAt)}</span>
        </div>
        <StatusBadge status={c.status} size="sm" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Row icon="user"  text={c.userName} />
        <Row icon="car"   text={c.vehicleInfo} dim />
        <Row icon="pin"   text={`${c.latitude?.toFixed(4)}, ${c.longitude?.toFixed(4)}`} dim />
        {c.assignedEmployeeName && (
          <Row icon="users" text={c.assignedEmployeeName} accent />
        )}
      </div>
    </article>
  );
}

function Row({ icon, text, dim, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: accent ? "var(--status-resolved)" : dim ? "var(--text-muted)" : "var(--text-secondary)" }}>
      <Icon name={icon} size={11} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
}

import { useApp }    from "../../context/AppContext.jsx";
import { Spinner, EmptyState } from "../ui/index.jsx";

export function CaseListPanel() {
  const { filteredCases, casesLoading, casesError, selectedId, setSelectedId } = useApp();

  return (
    <div style={{
      width: 300, minWidth: 280, borderRight: "1px solid var(--border-subtle)",
      display: "flex", flexDirection: "column", overflow: "hidden",
      background: "var(--bg-surface)",
    }}>
      {}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Slučajevi
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          {filteredCases.length}
        </span>
      </div>

      {}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
        {casesLoading && filteredCases.length === 0 && (
          <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
            <Spinner />
          </div>
        )}

        {!casesLoading && filteredCases.length === 0 && (
          <EmptyState icon="briefcase" title="Nema slučajeva" subtitle="Pokušajte promijeniti filter" />
        )}

        {filteredCases.map(c => (
          <CaseCard
            key={c.id}
            c={c}
            selected={selectedId === c.id}
            onClick={() => setSelectedId(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
