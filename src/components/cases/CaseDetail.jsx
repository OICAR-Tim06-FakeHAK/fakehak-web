import { useState } from "react";
import { useApp }   from "../../context/AppContext.jsx";
import { useCaseDetail } from "../../hooks/index.js";
import { NotesPanel } from "../notes/index.jsx";
import { Icon, StatusBadge, Button, Select, Spinner, EmptyState, ErrorBanner, SectionLabel } from "../ui/index.jsx";
import { formatDate, formatCoords, getStatusMeta } from "../../utils/index.js";

function Section({ children, last = false }) {
  return (
    <div style={{
      padding: "16px 0",
      borderBottom: last ? "none" : "1px solid var(--border-subtle)",
    }}>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "4px 0" }}>
      <div style={{ color: "var(--text-muted)", marginTop: 2, flexShrink: 0 }}><Icon name={icon} size={13} /></div>
      <div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{value}</div>
      </div>
    </div>
  );
}

function StatusActions({ currentStatus, onUpdate }) {
  const [busy, setBusy] = useState(false);
  const { next } = getStatusMeta(currentStatus);

  if (!next?.length) return (
    <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Slučaj je zatvoren</div>
  );

  async function handle(status) {
    setBusy(true);
    try { await onUpdate(status); } finally { setBusy(false); }
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {next.map(s => {
        const m = getStatusMeta(s);
        return (
          <Button key={s} variant="status" statusColor={m.color} onClick={() => handle(s)} disabled={busy}>
            {busy ? <Spinner size={12} color={m.color} /> : <Icon name="check" size={12} />}
            → {m.label}
          </Button>
        );
      })}
    </div>
  );
}

export function CaseDetailPanel() {
  const { selectedId, employees, refresh } = useApp();
  const { detail, loading, error, reload, updateStatus, assign } = useCaseDetail(selectedId);
  const [assignEmpId, setAssignEmpId] = useState("");
  const [assignBusy, setAssignBusy]   = useState(false);

  if (!selectedId) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
      <EmptyState icon="briefcase" title="Odaberite slučaj" subtitle="Kliknite na slučaj s lijeve strane" />
    </div>
  );

  if (loading && !detail) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
      <Spinner size={32} />
    </div>
  );

  if (error) return (
    <div style={{ flex: 1, padding: 24 }}><ErrorBanner message={error} /></div>
  );

  if (!detail) return null;

  async function handleAssign() {
    if (!assignEmpId) return;
    setAssignBusy(true);
    try { await assign(parseInt(assignEmpId)); refresh(); } finally { setAssignBusy(false); }
  }

  async function handleStatusChange(status) {
    await updateStatus(status);
    refresh();
  }

  const empOptions = employees.map(e => ({ value: String(e.id), label: `${e.firstName} ${e.lastName} · ${e.role}` }));

  return (
    <div style={{
      flex: 1, display: "flex", overflow: "hidden",
      background: "var(--bg-base)",
    }}>
      {}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", animation: "slideInRight 0.25s ease forwards" }}>

        {}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text-primary)", fontStyle: "italic", lineHeight: 1 }}>
                Slučaj #{detail.id}
              </h1>
              <StatusBadge status={detail.status} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 5 }}>
              Kreiran {formatDate(detail.createdAt)}
              {detail.updatedAt !== detail.createdAt && ` · Ažuriran ${formatDate(detail.updatedAt)}`}
            </div>
          </div>
        </div>

        {}
        <Section>
          <SectionLabel>Korisnik</SectionLabel>
          <InfoRow icon="user"  label="Ime i prezime" value={`${detail.user.firstName} ${detail.user.lastName}`} />
          <InfoRow icon="hash"  label="Email"         value={detail.user.email} />
          <InfoRow icon="phone" label="Telefon"       value={detail.user.phoneNumber} />
          <InfoRow icon="eye"   label="Status računa" value={detail.user.accountStatus} />
        </Section>

        {}
        <Section>
          <SectionLabel>Vozilo</SectionLabel>
          <InfoRow icon="car"  label="Marka i model"    value={`${detail.vehicle.brand} ${detail.vehicle.model}`} />
          <InfoRow icon="hash" label="Registracija"     value={detail.vehicle.registrationPlate} />
          <InfoRow icon="hash" label="VIN"              value={detail.vehicle.vin} />
          <InfoRow icon="clock" label="Datum registracije" value={detail.vehicle.firstRegistrationDate} />
        </Section>

        {}
        <Section>
          <SectionLabel>Lokacija</SectionLabel>
          <InfoRow icon="pin" label="Koordinate" value={formatCoords(detail.latitude, detail.longitude)} />
          <a
            href={`https://maps.google.com/?q=${detail.latitude},${detail.longitude}`}
            target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--accent)", fontSize: 12 }}
          >
            <Icon name="map" size={12} /> Otvori u Google Maps ↗
          </a>
        </Section>

        {}
        {detail.description && (
          <Section>
            <SectionLabel>Opis</SectionLabel>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{detail.description}</p>
          </Section>
        )}

        {}
        <Section>
          <SectionLabel>Dodjela zaposlenika</SectionLabel>
          {detail.assignedEmployee ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: 10 }}>
              <Icon name="users" size={14} />
              <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
                {detail.assignedEmployee.firstName} {detail.assignedEmployee.lastName}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>{detail.assignedEmployee.role}</span>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, fontStyle: "italic" }}>Nije dodijeljeno</div>
          )}
          {employees.length > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <Select
                  placeholder="— Odaberi zaposlenika —"
                  value={assignEmpId}
                  onChange={e => setAssignEmpId(e.target.value)}
                  options={empOptions}
                />
              </div>
              <Button variant="secondary" onClick={handleAssign} disabled={!assignEmpId || assignBusy}>
                {assignBusy ? <Spinner size={13} /> : <Icon name="users" size={13} />}
                Dodijeli
              </Button>
            </div>
          )}
        </Section>

        {}
        <Section last>
          <SectionLabel>Promjena statusa</SectionLabel>
          <StatusActions currentStatus={detail.status} onUpdate={handleStatusChange} />
        </Section>
      </div>

      {}
      <NotesPanel caseId={detail.id} employees={employees} />
    </div>
  );
}
