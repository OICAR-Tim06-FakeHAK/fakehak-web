export function Icon({ name, size = 16, className = "" }) {
  const paths = {
    car:       <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 10c-.4-1.1-1.4-2-2.7-2H8.3C7 8 6 8.9 5.6 10L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2m14 0H7m12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    file:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    filter:    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    refresh:   <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    map:       <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    alert:     <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    send:      <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    pin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    check:     <polyline points="20 6 9 17 4 12"/>,
    chevronD:  <polyline points="6 9 12 15 18 9"/>,
    chevronR:  <polyline points="9 18 15 12 9 6"/>,
    hash:      <><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></>,
    phone:     <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18C1.46 2.09 2.2 1 3.29 1H6.3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.41 8.18A16 16 0 0 0 13 13.59l1.24-1.24a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  };

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? null}
    </svg>
  );
}

import { getStatusMeta } from "../../utils/index.js";

export function StatusBadge({ status, size = "md" }) {
  const meta = getStatusMeta(status);
  const fontSize = size === "sm" ? 11 : 12;
  const padding  = size === "sm" ? "2px 8px" : "4px 10px";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: meta.bg, color: meta.color,
      border: `1px solid ${meta.color}30`,
      borderRadius: "var(--radius-sm)", fontSize, fontWeight: 700,
      letterSpacing: "0.04em", padding, fontFamily: "var(--font-ui)",
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
      {meta.label}
    </span>
  );
}

const VARIANTS = {
  primary:   { background: "var(--accent)",     color: "#fff",                border: "1px solid transparent" },
  secondary: { background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" },
  ghost:     { background: "transparent",        color: "var(--text-secondary)", border: "1px solid transparent" },
  danger:    { background: "rgba(220,50,50,0.15)", color: "#f87171",           border: "1px solid rgba(220,50,50,0.3)" },
  status:    (color, bg) => ({ background: bg, color: color, border: `1px solid ${color}30` }),
};

export function Button({ children, variant = "secondary", onClick, disabled, type = "button", fullWidth, style: extraStyle = {}, statusColor }) {
  const v = variant === "status" && statusColor
    ? VARIANTS.status(statusColor, statusColor + "20")
    : (VARIANTS[variant] ?? VARIANTS.secondary);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "8px 14px", borderRadius: "var(--radius-sm)",
        fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1, transition: "opacity var(--ease-fast), background var(--ease-fast)",
        width: fullWidth ? "100%" : "auto", fontFamily: "var(--font-ui)",
        ...v, ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, value, onChange, placeholder, type = "text", required, autoFocus, disabled, multiline, rows = 3 }) {
  const sharedStyle = {
    width: "100%", background: "var(--bg-elevated)",
    border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)",
    padding: "9px 12px", color: "var(--text-primary)", fontSize: 13,
    outline: "none", fontFamily: "var(--font-ui)", transition: "border-color var(--ease-fast)",
  };

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</span>}
      {multiline
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} disabled={disabled}
            style={{ ...sharedStyle, resize: "vertical" }} />
        : <input value={value} onChange={onChange} placeholder={placeholder} type={type} required={required}
            autoFocus={autoFocus} disabled={disabled} style={sharedStyle} />
      }
    </label>
  );
}

export function Select({ label, value, onChange, options, disabled, placeholder }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</span>}
      <select
        value={value} onChange={onChange} disabled={disabled}
        style={{
          width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-sm)", padding: "9px 12px", color: value ? "var(--text-primary)" : "var(--text-muted)",
          fontSize: 13, outline: "none", fontFamily: "var(--font-ui)", cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </label>
  );
}

export function Spinner({ size = 20, color = "var(--accent)" }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid ${color}30`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }} />
  );
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "48px 24px", color: "var(--text-muted)" }}>
      <Icon name={icon} size={36} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.25)",
      borderRadius: "var(--radius-sm)", padding: "10px 14px",
      color: "#f87171", fontSize: 13,
    }}>
      <Icon name="alert" size={14} /> {message}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 8 }}>
      {children}
    </div>
  );
}
