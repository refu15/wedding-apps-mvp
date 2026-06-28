import type { UserRole } from "./types";

export type WorkspacePanel = "customer" | "meeting" | "sharePreview" | "schedule";

export function canViewInternalNotes(role: UserRole): boolean {
  return role === "admin" || role === "planner";
}

export function getVisibleWorkspacePanels(role: UserRole): WorkspacePanel[] {
  if (role === "customer") {
    return ["sharePreview", "schedule"];
  }

  return ["customer", "meeting", "sharePreview", "schedule"];
}
