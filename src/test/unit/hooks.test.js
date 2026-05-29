import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import * as casesApi from "../../api/cases.js";
import * as notesApi from "../../api/index.js";

const { useCaseDetail, useNotes, useUsers, useUserVehicles } = await import("../../hooks/index.js");

describe("useCaseDetail", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with null detail and loading false", () => {
    const { result } = renderHook(() => useCaseDetail(null));
    expect(result.current.detail).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("loads case detail on mount", async () => {
    const mockCase = { id: 1, status: "ACTIVE", user: {}, vehicle: {} };
    vi.spyOn(casesApi.casesApi, "getById").mockResolvedValue(mockCase);

    const { result } = renderHook(() => useCaseDetail(1));

    await waitFor(() => {
      expect(result.current.detail).toEqual(mockCase);
      expect(result.current.loading).toBe(false);
    });
  });

  it("sets error on failed fetch", async () => {
    vi.spyOn(casesApi.casesApi, "getById").mockRejectedValue(new Error("Not found"));

    const { result } = renderHook(() => useCaseDetail(1));

    await waitFor(() => {
      expect(result.current.error).toBe("Not found");
      expect(result.current.detail).toBeNull();
    });
  });

  it("does not fetch when caseId is null", async () => {
    const spy = vi.spyOn(casesApi.casesApi, "getById");

    renderHook(() => useCaseDetail(null));

    await waitFor(() => {
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it("updates detail on updateStatus", async () => {
    const mockCase = { id: 1, status: "ACTIVE", user: {}, vehicle: {} };
    const updatedCase = { ...mockCase, status: "IN_PROGRESS" };

    vi.spyOn(casesApi.casesApi, "getById")
      .mockResolvedValueOnce(mockCase)
      .mockResolvedValueOnce(updatedCase);
    vi.spyOn(casesApi.casesApi, "updateStatus").mockResolvedValue(null);

    const { result } = renderHook(() => useCaseDetail(1));
    await waitFor(() => expect(result.current.detail).toEqual(mockCase));

    await act(async () => {
      await result.current.updateStatus("IN_PROGRESS");
    });

    expect(result.current.detail).toEqual(updatedCase);
  });

  it("updates detail on assign", async () => {
    const mockCase = { id: 1, status: "ACTIVE", assignedEmployee: null };
    const assignedCase = { ...mockCase, assignedEmployee: { id: 5, firstName: "Ana" } };

    vi.spyOn(casesApi.casesApi, "getById")
      .mockResolvedValueOnce(mockCase)
      .mockResolvedValueOnce(assignedCase);
    vi.spyOn(casesApi.casesApi, "assign").mockResolvedValue(null);

    const { result } = renderHook(() => useCaseDetail(1));
    await waitFor(() => expect(result.current.detail).toEqual(mockCase));

    await act(async () => {
      await result.current.assign(5);
    });

    expect(result.current.detail).toEqual(assignedCase);
  });
});

describe("useNotes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with empty notes array", () => {
    const { result } = renderHook(() => useNotes(null));
    expect(result.current.notes).toEqual([]);
  });

  it("loads notes on mount", async () => {
    const mockNotes = [
      { id: 1, content: "First note", employeeName: "Ivan" },
      { id: 2, content: "Second note", employeeName: "Ana" },
    ];
    vi.spyOn(notesApi.notesApi, "getByCase").mockResolvedValue(mockNotes);

    const { result } = renderHook(() => useNotes(1));

    await waitFor(() => {
      expect(result.current.notes).toEqual(mockNotes);
      expect(result.current.loading).toBe(false);
    });
  });

  it("does not fetch when caseId is null", async () => {
    const spy = vi.spyOn(notesApi.notesApi, "getByCase");

    renderHook(() => useNotes(null));

    await waitFor(() => {
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it("returns empty array on fetch error", async () => {
    vi.spyOn(notesApi.notesApi, "getByCase").mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useNotes(1));

    await waitFor(() => {
      expect(result.current.notes).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  it("adds note and reloads notes", async () => {
    const initialNotes = [{ id: 1, content: "First note", employeeName: "Ivan" }];
    const updatedNotes = [
      { id: 1, content: "First note", employeeName: "Ivan" },
      { id: 2, content: "New note", employeeName: "Ana" },
    ];

    vi.spyOn(notesApi.notesApi, "getByCase")
      .mockResolvedValueOnce(initialNotes)
      .mockResolvedValueOnce(updatedNotes);
    vi.spyOn(notesApi.notesApi, "add").mockResolvedValue(null);

    const { result } = renderHook(() => useNotes(1));
    await waitFor(() => expect(result.current.notes).toEqual(initialNotes));

    await act(async () => {
      await result.current.addNote("New note", 2);
    });

    expect(result.current.notes).toEqual(updatedNotes);
  });
});

describe("useUsers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with empty users array", async () => {
    vi.spyOn(notesApi.usersApi, "getAll").mockResolvedValue([]);
    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.users).toEqual([]);
    });
  });

  it("loads users on mount", async () => {
    const mockUsers = [
      { id: 1, firstName: "Ivan", lastName: "Horvat", email: "ivan@email.com" },
      { id: 2, firstName: "Ana", lastName: "Novak", email: "ana@email.com" },
    ];
    vi.spyOn(notesApi.usersApi, "getAll").mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.users).toEqual(mockUsers);
      expect(result.current.loading).toBe(false);
    });
  });

  it("returns empty array on fetch error", async () => {
    vi.spyOn(notesApi.usersApi, "getAll").mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.users).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  it("sets loading to true while fetching", async () => {
    vi.spyOn(notesApi.usersApi, "getAll").mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 200))
    );

    const { result } = renderHook(() => useUsers());
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

describe("useUserVehicles", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with empty vehicles array", () => {
    const { result } = renderHook(() => useUserVehicles(null));
    expect(result.current.vehicles).toEqual([]);
  });

  it("does not fetch when userId is null", async () => {
    const spy = vi.spyOn(notesApi.vehiclesApi, "getByUser");

    renderHook(() => useUserVehicles(null));

    await waitFor(() => {
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it("loads vehicles when userId is provided", async () => {
    const mockVehicles = [
      { id: 1, brand: "VW", model: "Golf", registrationPlate: "ZG-123-AB" },
      { id: 2, brand: "Toyota", model: "Corolla", registrationPlate: "ZG-456-CD" },
    ];
    vi.spyOn(notesApi.vehiclesApi, "getByUser").mockResolvedValue(mockVehicles);

    const { result } = renderHook(() => useUserVehicles(1));

    await waitFor(() => {
      expect(result.current.vehicles).toEqual(mockVehicles);
      expect(result.current.loading).toBe(false);
    });
  });

  it("returns empty array on fetch error", async () => {
    vi.spyOn(notesApi.vehiclesApi, "getByUser").mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useUserVehicles(1));

    await waitFor(() => {
      expect(result.current.vehicles).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  it("resets vehicles when userId changes to null", async () => {
    const mockVehicles = [{ id: 1, brand: "VW", model: "Golf" }];
    vi.spyOn(notesApi.vehiclesApi, "getByUser").mockResolvedValue(mockVehicles);

    const { result, rerender } = renderHook(({ userId }) => useUserVehicles(userId), {
      initialProps: { userId: 1 },
    });

    await waitFor(() => expect(result.current.vehicles).toEqual(mockVehicles));

    rerender({ userId: null });

    expect(result.current.vehicles).toEqual([]);
  });
});