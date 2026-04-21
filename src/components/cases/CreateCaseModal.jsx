import { useState, useEffect } from "react";
import { casesApi }     from "../../api/cases.js";
import { usersApi, vehiclesApi } from "../../api/index.js";
import { Icon, Button, Input, Select, Spinner, ErrorBanner, SectionLabel } from "../ui/index.jsx";

export function CreateCaseModal({ onClose, onCreated }) {
  const [users,    setUsers]    = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [userId,   setUserId]   = useState("");
  const [vehicleId,setVehicleId]= useState("");
  const [lat,      setLat]      = useState("");
  const [lng,      setLng]      = useState("");
  const [desc,     setDesc]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [geoLoad,  setGeoLoad]  = useState(false);
  const [err,      setErr]      = useState("");

  useEffect(() => {
    usersApi.getAll().then(setUsers).catch(() => {});
  }, []);

  useEffect(() => {
    if (!userId) { setVehicles([]); setVehicleId(""); return; }
    vehiclesApi.getByUser(userId).then(setVehicles).catch(() => {});
  }, [userId]);

  function getGps() {
    if (!navigator.geolocation) { setErr("GPS nije dostupan u ovom pregledniku"); return; }
    setGeoLoad(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setGeoLoad(false);
      },
      () => { setErr("Nije moguće dohvatiti GPS lokaciju"); setGeoLoad(false); }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userId || !vehicleId) { setErr("Odaberite korisnika i vozilo"); return; }
    if (!lat || !lng)          { setErr("Unesite ili dohvatite GPS koordinate"); return; }
    setLoading(true); setErr("");
    try {
      const c = await casesApi.create({
        userId:    parseInt(userId),
        vehicleId: parseInt(vehicleId),
        latitude:  parseFloat(lat),
        longitude: parseFloat(lng),
        description: desc || null,
      });
      onCreated(c);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  }

  const userOptions    = users.map(u => ({ value: String(u.id), label: `${u.firstName} ${u.lastName} · ${u.email}` }));
  const vehicleOptions = vehicles.map(v => ({ value: String(v.id), label: `${v.brand} ${v.model} – ${v.registrationPlate}` }));

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)", padding: "28px 28px",
          width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto",
          animation: "fadeIn 0.2s ease forwards",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-primary)", fontStyle: "italic", margin: 0 }}>
            Novi slučaj
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 4 }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {}
          <div>
            <SectionLabel>Korisnik & Vozilo</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Select
                label="Korisnik"
                placeholder="— Odaberi korisnika —"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                options={userOptions}
              />
              <Select
                label="Vozilo"
                placeholder={userId ? "— Odaberi vozilo —" : "Prvo odaberi korisnika"}
                value={vehicleId}
                onChange={e => setVehicleId(e.target.value)}
                options={vehicleOptions}
                disabled={!userId || vehicles.length === 0}
              />
            </div>
          </div>

          {}
          <div>
            <SectionLabel>GPS Lokacija</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
              <Input label="Latitude"  value={lat} onChange={e => setLat(e.target.value)}  placeholder="45.8150" />
              <Input label="Longitude" value={lng} onChange={e => setLng(e.target.value)}  placeholder="15.9819" />
            </div>
            <Button variant="secondary" onClick={getGps} disabled={geoLoad}>
              {geoLoad ? <Spinner size={13} /> : <Icon name="pin" size={13} />}
              {geoLoad ? "Dohvaćam lokaciju..." : "Koristi trenutnu lokaciju"}
            </Button>
          </div>

          {}
          <Input
            label="Opis (opcijsko)"
            multiline rows={3}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Kratki opis kvara ili situacije..."
          />

          <ErrorBanner message={err} />

          {}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <Button variant="ghost" onClick={onClose}>Odustani</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size={13} color="#fff" /> : <Icon name="plus" size={13} />}
              {loading ? "Kreiranje..." : "Kreiraj slučaj"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
