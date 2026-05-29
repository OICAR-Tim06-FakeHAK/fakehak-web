import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginPage } from "../../pages/LoginPage.jsx";
import { AuthProvider } from "../../context/AuthContext.jsx";
import * as authApi from "../../api/auth.js";

function renderLoginPage() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders the login form", () => {
    renderLoginPage();
    expect(screen.getByText("FakeHAK")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("admin")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByText("Prijavi se →")).toBeInTheDocument();
  });

  it("displays demo credentials", () => {
    renderLoginPage();
    expect(screen.getByText("admin / admin123")).toBeInTheDocument();
    expect(screen.getByText("dispatcher / dispatcher123")).toBeInTheDocument();
  });

  it("displays error on failed login", async () => {
    vi.spyOn(authApi.authApi, "login").mockRejectedValue(new Error("Invalid credentials"));

    renderLoginPage();
    fireEvent.click(screen.getByText("Prijavi se →"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("calls login API with entered credentials", async () => {
    const mockLogin = vi.spyOn(authApi.authApi, "login").mockResolvedValue({
      token: "tok",
      role: "ADMIN",
    });

    renderLoginPage();

    fireEvent.change(screen.getByPlaceholderText("admin"), {
      target: { value: "myuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "mypass" },
    });
    fireEvent.click(screen.getByText("Prijavi se →"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        identifier: "myuser",
        password: "mypass",
      });
    });
  });

  it("disables submit button while loading", async () => {
    vi.spyOn(authApi.authApi, "login").mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 500))
    );

    renderLoginPage();
    fireEvent.click(screen.getByText("Prijavi se →"));

    await waitFor(() => {
      expect(screen.getByText("Prijava u tijeku...")).toBeDisabled();
    });
  });
});