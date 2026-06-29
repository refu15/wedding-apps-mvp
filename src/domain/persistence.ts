import { createInitialAppState } from "./appState";
import type { AppState } from "./types";

export const APP_STATE_STORAGE_KEY = "wedding-apps-mvp-state";

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export function loadAppState(storage: StorageLike | undefined): AppState {
  if (!storage) {
    return createInitialAppState();
  }

  const raw = storage.getItem(APP_STATE_STORAGE_KEY);

  if (!raw) {
    return createInitialAppState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return isStoredAppState(parsed) ? normalizeAppState(parsed) : createInitialAppState();
  } catch {
    storage.removeItem(APP_STATE_STORAGE_KEY);
    return createInitialAppState();
  }
}

export function saveAppState(storage: StorageLike | undefined, state: AppState): void {
  if (!storage) {
    return;
  }

  storage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
}

function isStoredAppState(value: Partial<AppState>): boolean {
  return (
    Array.isArray(value.customers) &&
    Array.isArray(value.cases) &&
    Array.isArray(value.meetings) &&
    Array.isArray(value.scheduleOptions) &&
    Array.isArray(value.shareLinks) &&
    typeof value.selectedCustomerId === "string" &&
    typeof value.selectedCaseId === "string" &&
    typeof value.selectedMeetingId === "string"
  );
}

function normalizeAppState(value: Partial<AppState>): AppState {
  const initial = createInitialAppState();

  return {
    customers: value.customers ?? initial.customers,
    cases: value.cases ?? initial.cases,
    meetings: value.meetings ?? initial.meetings,
    scheduleOptions: value.scheduleOptions ?? initial.scheduleOptions,
    driveAssets: value.driveAssets ?? initial.driveAssets,
    consentLogs: value.consentLogs ?? initial.consentLogs,
    partners: value.partners ?? initial.partners,
    availabilityRequests: value.availabilityRequests ?? initial.availabilityRequests,
    messageLogs: value.messageLogs ?? initial.messageLogs,
    auditLogs: value.auditLogs ?? initial.auditLogs,
    operationalErrors: value.operationalErrors ?? initial.operationalErrors,
    integrationStatus: value.integrationStatus ?? initial.integrationStatus,
    shareLinks: value.shareLinks ?? initial.shareLinks,
    shareWorkflow: value.shareWorkflow ?? {
      ...initial.shareWorkflow,
      caseId: value.selectedCaseId ?? initial.selectedCaseId,
      meetingId: value.selectedMeetingId ?? initial.selectedMeetingId
    },
    selectedCustomerId: value.selectedCustomerId ?? initial.selectedCustomerId,
    selectedCaseId: value.selectedCaseId ?? initial.selectedCaseId,
    selectedMeetingId: value.selectedMeetingId ?? initial.selectedMeetingId
  };
}
