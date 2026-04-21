import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => sessionStorage.getItem("fhk_token") ?? "");
  const [role,  setRole]    = useState(() => sessionStorage.getItem("fhk_role")  ?? "");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await authApi.login({ identifier, password });
      sessionStorage.setItem("fhk_token", data.token);
      sessionStorage.setItem("fhk_role",  data.role);
      setToken(data.token);
      setRole(data.role);
      return true;
    } catch (e) {
      setError(e.message ?? "Neispravni podaci");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setToken("");
    setRole("");
  }, []);

  const isAuthenticated = Boolean(token);
  const isAdmin      = role === "ADMIN";
  const isDispatcher = role === "DISPATCHER" || role === "ADMIN";

  return (
    <AuthContext.Provider value={{ token, role, error, loading, login, logout, isAuthenticated, isAdmin, isDispatcher }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
