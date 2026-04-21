import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { casesApi }     from "../api/cases.js";
import { employeesApi } from "../api/index.js";
import { useAuth }      from "./AuthContext.jsx";

const AppContext = createContext(null);

const AUTO_REFRESH_MS = 30_000;

export function AppProvider({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  const [cases,        setCases]        = useState([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [casesError,   setCasesError]   = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedId,   setSelectedId]   = useState(null);

  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");

  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick(t => t + 1), []);

  const loadCases = useCallback(async () => {
    if (!isAuthenticated) return;
    setCasesLoading(true);
    setCasesError("");
    try {
      let data;
      if      (statusFilter === "ALL")         data = await casesApi.getAll();
      else if (statusFilter === "ACTIVE_ONLY") data = await casesApi.getActive();
      else                                     data = await casesApi.getByStatus(statusFilter);
      setCases(data);
    } catch (e) {
      setCasesError(e.message);
    } finally {
      setCasesLoading(false);
    }
  }, [isAuthenticated, statusFilter]);

  const loadEmployees = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    try {
      const data = await employeesApi.getAll();
      setEmployees(data);
    } catch (_) {}
  }, [isAuthenticated, isAdmin]);

  useEffect(() => { loadCases(); },    [loadCases, tick]);
  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(refresh, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [isAuthenticated, refresh]);

  const filteredCases = cases.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      String(c.id).includes(q) ||
      c.userName?.toLowerCase().includes(q) ||
      c.vehicleInfo?.toLowerCase().includes(q) ||
      c.assignedEmployeeName?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total:      cases.length,
    active:     cases.filter(c => c.status === "ACTIVE").length,
    inProgress: cases.filter(c => c.status === "IN_PROGRESS").length,
    resolved:   cases.filter(c => c.status === "RESOLVED").length,
    closed:     cases.filter(c => c.status === "CLOSED").length,
  };

  return (
    <AppContext.Provider value={{
      cases, filteredCases, casesLoading, casesError,
      statusFilter, setStatusFilter,
      selectedId, setSelectedId,
      employees,
      search, setSearch,
      stats, refresh,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
