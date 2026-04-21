import { useState, useEffect, useCallback } from "react";
import { casesApi }                          from "../api/cases.js";
import { notesApi, usersApi, vehiclesApi }   from "../api/index.js";

export function useCaseDetail(caseId) {
  const [detail,  setDetail]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const load = useCallback(async () => {
    if (!caseId) { setDetail(null); return; }
    setLoading(true);
    setError("");
    try {
      const data = await casesApi.getById(caseId);
      setDetail(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = useCallback(async (status) => {
    await casesApi.updateStatus(caseId, status);
    await load();
  }, [caseId, load]);

  const assign = useCallback(async (employeeId) => {
    await casesApi.assign(caseId, employeeId);
    await load();
  }, [caseId, load]);

  return { detail, loading, error, reload: load, updateStatus, assign };
}

export function useNotes(caseId) {
  const [notes,   setNotes]   = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try {
      const data = await notesApi.getByCase(caseId);
      setNotes(data);
    } catch (_) {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => { load(); }, [load]);

  const addNote = useCallback(async (content, employeeId) => {
    await notesApi.add(caseId, content, employeeId);
    await load();
  }, [caseId, load]);

  return { notes, loading, addNote };
}

export function useUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    usersApi.getAll()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
}

export function useUserVehicles(userId) {
  const [vehicles, setVehicles] = useState([]);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!userId) { setVehicles([]); return; }
    setLoading(true);
    vehiclesApi.getByUser(userId)
      .then(setVehicles)
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { vehicles, loading };
}
