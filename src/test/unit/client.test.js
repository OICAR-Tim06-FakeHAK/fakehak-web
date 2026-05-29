import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const { client } = await import("../../api/client.js");

describe("client", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET request", () => {
    it("sends GET request to correct URL", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 1 }),
      });

      await client.get("/cases");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/cases"),
        expect.objectContaining({ method: "GET" })
      );
    });

    it("returns parsed JSON response", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 1, name: "Test" }),
      });

      const result = await client.get("/cases/1");
      expect(result).toEqual({ id: 1, name: "Test" });
    });

    it("returns null for 204 No Content", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
        json: async () => null,
      });

      const result = await client.get("/cases/1");
      expect(result).toBeNull();
    });
  });

  describe("POST request", () => {
    it("sends POST request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 1 }),
      });

      await client.post("/cases", { userId: 1, vehicleId: 2 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/cases"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ userId: 1, vehicleId: 2 }),
        })
      );
    });
  });

  describe("PUT request", () => {
    it("sends PUT request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 1 }),
      });

      await client.put("/users/1", { firstName: "Ivan" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ firstName: "Ivan" }),
        })
      );
    });
  });

  describe("PATCH request", () => {
    it("sends PATCH request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 1 }),
      });

      await client.patch("/cases/1/status", { status: "RESOLVED" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/cases/1/status"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ status: "RESOLVED" }),
        })
      );
    });
  });

  describe("DELETE request", () => {
    it("sends DELETE request", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
        json: async () => null,
      });

      await client.delete("/users/1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/1"),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  describe("Authorization header", () => {
    it("includes Authorization header when token exists", async () => {
      sessionStorage.setItem("fhk_token", "my-token-123");

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await client.get("/cases");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer my-token-123",
          }),
        })
      );
    });

    it("does not include Authorization header when no token", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await client.get("/cases");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });
  });

  describe("Error handling", () => {
    it("throws ApiError on non-ok response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: "Not found" }),
      });

      await expect(client.get("/cases/999")).rejects.toThrow("Not found");
    });

    it("throws ApiError with status code", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: "Unauthorized" }),
      });

      try {
        await client.get("/cases");
      } catch (e) {
        expect(e.status).toBe(401);
        expect(e.message).toBe("Unauthorized");
        expect(e.name).toBe("ApiError");
      }
    });

    it("throws ApiError with fallback message on invalid JSON", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => { throw new Error("invalid json"); },
      });

      await expect(client.get("/cases")).rejects.toThrow("Neispravan odgovor servera");
    });
  });
});