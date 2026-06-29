import type { UserRole } from "./types";

export type AppAction =
  | "view_internal"
  | "sync_drive"
  | "approve_share"
  | "send_share"
  | "request_assignment"
  | "select_candidate"
  | "view_customer_portal";

const rolePermissions: Record<UserRole, AppAction[]> = {
  admin: [
    "view_internal",
    "sync_drive",
    "approve_share",
    "send_share",
    "request_assignment",
    "select_candidate",
    "view_customer_portal"
  ],
  planner: [
    "view_internal",
    "sync_drive",
    "approve_share",
    "send_share",
    "request_assignment",
    "select_candidate"
  ],
  customer: ["select_candidate", "view_customer_portal"]
};

export function canPerform(role: UserRole, action: AppAction): boolean {
  return rolePermissions[role].includes(action);
}

export function requirePermission(role: UserRole, action: AppAction): void {
  if (!canPerform(role, action)) {
    throw new Error(`権限がありません: ${action}`);
  }
}
