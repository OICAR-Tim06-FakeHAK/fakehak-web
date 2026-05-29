import { describe, it, expect } from "vitest";
import { formatDate, formatRelative, formatCoords, getStatusMeta, FILTER_OPTIONS } from "../../utils/index.js";

describe("formatDate", () => {
  it("returns '—' for null", () => {
    expect(formatDate(null)).toBe("—");
  });

  it("returns '—' for undefined", () => {
    expect(formatDate(undefined)).toBe("—");
  });

  it("formats ISO string and contains the year", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(result).toContain("2024");
  });
});

describe("formatRelative", () => {
  it("returns 'upravo' for less than a minute ago", () => {
    const now = new Date().toISOString();
    expect(formatRelative(now)).toBe("upravo");
  });

  it("returns minutes for 5 minutes ago", () => {
    const before = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(formatRelative(before)).toBe("5m");
  });

  it("returns hours for 3 hours ago", () => {
    const before = new Date(Date.now() - 3 * 3600_000).toISOString();
    expect(formatRelative(before)).toBe("3h");
  });

  it("returns days for 2 days ago", () => {
    const before = new Date(Date.now() - 2 * 86400_000).toISOString();
    expect(formatRelative(before)).toBe("2d");
  });
});

describe("formatCoords", () => {
  it("formats coordinates to 5 decimal places", () => {
    expect(formatCoords(45.81234567, 15.98765432)).toBe("45.81235, 15.98765");
  });
});

describe("getStatusMeta", () => {
  it("returns correct metadata for ACTIVE", () => {
    const meta = getStatusMeta("ACTIVE");
    expect(meta.label).toBe("Aktivan");
    expect(meta.next).toContain("IN_PROGRESS");
  });

  it("returns empty next array for CLOSED", () => {
    const meta = getStatusMeta("CLOSED");
    expect(meta.next).toHaveLength(0);
  });

  it("returns fallback for unknown status", () => {
    const meta = getStatusMeta("UNKNOWN");
    expect(meta.label).toBe("UNKNOWN");
    expect(meta.color).toBe("#888");
  });
});

describe("FILTER_OPTIONS", () => {
  it("has ALL as the first option", () => {
    expect(FILTER_OPTIONS[0].value).toBe("ALL");
  });

  it("contains all statuses", () => {
    const values = FILTER_OPTIONS.map(f => f.value);
    expect(values).toContain("ACTIVE");
    expect(values).toContain("IN_PROGRESS");
    expect(values).toContain("RESOLVED");
    expect(values).toContain("CLOSED");
  });
});