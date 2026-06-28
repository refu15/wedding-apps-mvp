import { describe, expect, it } from "vitest";
import { canViewInternalNotes, getVisibleWorkspacePanels } from "../domain/accessControl";

describe("accessControl", () => {
  it("allows only internal roles to view internal notes", () => {
    expect(canViewInternalNotes("admin")).toBe(true);
    expect(canViewInternalNotes("planner")).toBe(true);
    expect(canViewInternalNotes("customer")).toBe(false);
  });

  it("limits customer role to the share preview workflow", () => {
    expect(getVisibleWorkspacePanels("customer")).toEqual(["sharePreview", "schedule"]);
    expect(getVisibleWorkspacePanels("admin")).toContain("meeting");
  });
});
