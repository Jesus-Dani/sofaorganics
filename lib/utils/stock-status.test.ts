import { describe, expect, it } from "vitest";
import { aggregateStockStatus, deriveStockStatus } from "@/lib/utils/stock-status";

describe("deriveStockStatus", () => {
  it("is out_of_stock at zero quantity", () => {
    expect(deriveStockStatus(0, 10)).toBe("out_of_stock");
  });

  it("is low_stock at or below the threshold", () => {
    expect(deriveStockStatus(10, 10)).toBe("low_stock");
    expect(deriveStockStatus(1, 10)).toBe("low_stock");
  });

  it("is in_stock above the threshold", () => {
    expect(deriveStockStatus(11, 10)).toBe("in_stock");
  });
});

describe("aggregateStockStatus", () => {
  it("prefers in_stock if any variant is in stock", () => {
    expect(aggregateStockStatus(["out_of_stock", "in_stock", "low_stock"])).toBe("in_stock");
  });

  it("falls back to low_stock if nothing is in_stock", () => {
    expect(aggregateStockStatus(["out_of_stock", "low_stock"])).toBe("low_stock");
  });

  it("is out_of_stock only when every variant is out", () => {
    expect(aggregateStockStatus(["out_of_stock", "out_of_stock"])).toBe("out_of_stock");
  });
});
