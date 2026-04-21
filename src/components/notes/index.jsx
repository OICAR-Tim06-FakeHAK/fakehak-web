import { useState, useRef, useEffect } from "react";
import { useNotes }  from "../../hooks/index.js";
import { Icon, Button, Input, Select, Spinner, SectionLabel } from "../ui/index.jsx";
import { formatDate } from "../../utils/index.js";

function NoteItem({ note }) {
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)", padding: "12px 14px",
      animation: "fadeIn 0.2s ease forwards",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 26, height: 26, background: "var(--accent-dim)", border: "1px solid var(--accent)30", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
            <Icon name="user" size={12} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{note.employeeName}</span>
        </div>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {formatDate(note.createdAt)}
        </span>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{note.content}</p>
    </div>
  );
}

export function NotesPanel({ caseId, employees }) {
  const { notes, loading, addNote } = useNotes(caseId);
  const [content,   setContent]   = useState("");
  const [empId,     setEmpId]     = useState("");
  const [busy,      setBusy]      = useState(false);
  const [err,       setErr]       = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes.length]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) { setErr("Unesite tekst bilješke"); return; }
    if (!empId)           { setErr("Odaberite zaposlenika"); return; }
    setBusy(true); setErr("");
    try {
      await addNote(content.trim(), parseInt(empId));
      setContent("");
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  }

  const empOptions = employees.map(e => ({ value: String(e.id), label: `${e.firstName} ${e.lastName}` }));

  return (
    <div style={{
      width: 320, minWidth: 280, borderLeft: "1px solid var(--border-subtle)",
      display: "flex", flexDirection: "column", background: "var(--bg-surface)",
    }}>
      {}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="file" size={14} style={{ color: "var(--text-muted)" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Bilješke
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{notes.length}</span>
      </div>

      {}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {loading && notes.length === 0 && (
          <div style={{ display: "flex", justifyContent: "center", padding: 20 }}><Spinner /></div>
        )}
        {!loading && notes.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)", fontSize: 12 }}>
            <Icon name="file" size={28} /><br /><br />Nema bilješki za ovaj slučaj
          </div>
        )}
        {notes.map(n => <NoteItem key={n.id} note={n} />)}
        <div ref={bottomRef} />
      </div>

      {}
      <div style={{ borderTop: "1px solid var(--border-subtle)", padding: "12px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {empOptions.length > 0 && (
            <Select
              placeholder="— Zaposlenik —"
              value={empId}
              onChange={e => setEmpId(e.target.value)}
              options={empOptions}
            />
          )}
          <Input
            multiline rows={3}
            placeholder="Napiši internu bilješku..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          {err && <div style={{ fontSize: 11, color: "#f87171" }}>{err}</div>}
          <Button variant="primary" type="submit" disabled={busy || !content.trim()} fullWidth>
            {busy ? <Spinner size={13} color="#fff" /> : <Icon name="send" size={13} />}
            Dodaj bilješku
          </Button>
        </form>
      </div>
    </div>
  );
}
