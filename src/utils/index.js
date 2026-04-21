export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("hr-HR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function formatRelative(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1)  return "upravo";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24)  return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

export function formatCoords(lat, lng) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}


export const STATUS_META = {
  ACTIVE:      { label: "Aktivan",   color: "var(--status-active)",    bg: "var(--status-active-bg)",    next: ["IN_PROGRESS"] },
  IN_PROGRESS: { label: "U tijeku",  color: "var(--status-progress)",  bg: "var(--status-progress-bg)",  next: ["RESOLVED", "ACTIVE"] },
  RESOLVED:    { label: "Riješen",   color: "var(--status-resolved)",  bg: "var(--status-resolved-bg)",  next: ["CLOSED"] },
  CLOSED:      { label: "Zatvoren",  color: "var(--status-closed)",    bg: "var(--status-closed-bg)",    next: [] },
};

export function getStatusMeta(status) {
  return STATUS_META[status] ?? { label: status, color: "#888", bg: "rgba(136,136,136,0.1)", next: [] };
}

export const ALL_STATUSES = Object.keys(STATUS_META);

export const FILTER_OPTIONS = [
  { value: "ALL",         label: "Svi slučajevi" },
  { value: "ACTIVE_ONLY", label: "Aktivni & U tijeku" },
  { value: "ACTIVE",      label: "Aktivni" },
  { value: "IN_PROGRESS", label: "U tijeku" },
  { value: "RESOLVED",    label: "Riješeni" },
  { value: "CLOSED",      label: "Zatvoreni" },
];
