import { describe, expect, it } from "vitest";
import { createInitialAppState, updateCustomer } from "../domain/appState";
import { loadAppState, saveAppState, type StorageLike } from "../domain/persistence";

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
}

describe("persistence", () => {
  it("saves and loads app state", () => {
    const storage = createMemoryStorage();
    const state = updateCustomer(createInitialAppState(), "customer-1", {
      primaryName: "保存済み"
    });

    saveAppState(storage, state);
    const loaded = loadAppState(storage);

    expect(loaded.customers[0].primaryName).toBe("保存済み");
  });

  it("falls back to initial state when stored JSON is invalid", () => {
    const storage = createMemoryStorage();
    storage.setItem("wedding-apps-mvp-state", "{invalid");

    const loaded = loadAppState(storage);

    expect(loaded.selectedCustomerId).toBe("customer-1");
  });

  it("hydrates legacy stored state without share workflow", () => {
    const storage = createMemoryStorage();
    const { shareWorkflow, ...legacyState } = createInitialAppState();
    storage.setItem("wedding-apps-mvp-state", JSON.stringify(legacyState));

    const loaded = loadAppState(storage);

    expect(shareWorkflow.approvalStatus).toBe("draft");
    expect(loaded.shareWorkflow.caseId).toBe(legacyState.selectedCaseId);
    expect(loaded.shareWorkflow.approvalStatus).toBe("draft");
    expect(loaded.driveAssets.length).toBeGreaterThan(0);
    expect(loaded.partners.length).toBeGreaterThan(0);
    expect(loaded.integrationStatus.database).toBe("local_storage");
  });
});
