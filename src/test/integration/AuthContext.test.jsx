import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../context/AuthContext.jsx";
import * as authApi from "../../api/auth.js";

function AuthConsumer() {
  const { isAuthenticated, role, login, logout, loading, error } = useAuth();
  return (
    <div>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="role">{role}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="error">{error}</span>
      <button onClick={() => login("admin", "admin123")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("is not authenticated initially", () => {
    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(screen.getByTestId("role").textContent).toBe("");
  });

  it("sets token and role on successful login", async () => {
    vi.spyOn(authApi.authApi, "login").mockResolvedValue({
      token: "test-token-123",
      role: "ADMIN",
    });

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("authenticated").textContent).toBe("true");
      expect(screen.getByTestId("role").textContent).toBe("ADMIN");
    });

    expect(sessionStorage.getItem("fhk_token")).toBe("test-token-123");
    expect(sessionStorage.getItem("fhk_role")).toBe("ADMIN");
  });

  it("sets error message on failed login", async () => {
    vi.spyOn(authApi.authApi, "login").mockRejectedValue(new Error("Invalid credentials"));

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("Invalid credentials");
      expect(screen.getByTestId("authenticated").textContent).toBe("false");
    });
  });

  it("clears state and sessionStorage on logout", async () => {
    vi.spyOn(authApi.authApi, "login").mockResolvedValue({
      token: "test-token-123",
      role: "DISPATCHER",
    });

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    fireEvent.click(screen.getByText("Login"));
    await waitFor(() => expect(screen.getByTestId("authenticated").textContent).toBe("true"));

    fireEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(screen.getByTestId("role").textContent).toBe("");
    expect(sessionStorage.getItem("fhk_token")).toBeNull();
  });

  it("restores session from sessionStorage on mount", () => {
    sessionStorage.setItem("fhk_token", "existing-token");
    sessionStorage.setItem("fhk_role", "ADMIN");

    render(<AuthProvider><AuthConsumer /></AuthProvider>);

    expect(screen.getByTestId("authenticated").textContent).toBe("true");
    expect(screen.getByTestId("role").textContent).toBe("ADMIN");
  });
});