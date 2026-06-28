import { generateMockAiSummary } from "./aiSummary";
import {
  sampleCase,
  sampleCustomer,
  sampleMeeting,
  sampleScheduleOptions
} from "./sampleData";
import { createScheduleOption, selectScheduleOption } from "./scheduling";
import type {
  AppState,
  Customer,
  Meeting,
  ShareCopyFeedbackStatus,
  ScheduleOption,
  WeddingCase
} from "./types";

export function createInitialAppState(): AppState {
  return {
    customers: [sampleCustomer],
    cases: [sampleCase],
    meetings: [sampleMeeting],
    scheduleOptions: sampleScheduleOptions,
    shareLinks: [
      {
        token: "share-case-1-meeting-1",
        caseId: sampleCase.id,
        meetingId: sampleMeeting.id,
        expiresAt: "2026-12-31T23:59:59+09:00"
      }
    ],
    shareWorkflow: {
      caseId: sampleCase.id,
      meetingId: sampleMeeting.id,
      approvalStatus: "draft",
      deliveryStatus: "not_sent",
      copyFeedbackStatus: "idle",
      updatedAt: null
    },
    selectedCustomerId: sampleCustomer.id,
    selectedCaseId: sampleCase.id,
    selectedMeetingId: sampleMeeting.id
  };
}

export function getSelectedCustomer(state: AppState): Customer {
  return requireEntity(
    state.customers.find((customer) => customer.id === state.selectedCustomerId),
    "選択中の顧客が見つかりません。"
  );
}

export function getSelectedCase(state: AppState): WeddingCase {
  return requireEntity(
    state.cases.find((weddingCase) => weddingCase.id === state.selectedCaseId),
    "選択中の案件が見つかりません。"
  );
}

export function getSelectedMeeting(state: AppState): Meeting {
  return requireEntity(
    state.meetings.find((meeting) => meeting.id === state.selectedMeetingId),
    "選択中の打ち合わせが見つかりません。"
  );
}

export function updateCustomer(
  state: AppState,
  customerId: string,
  patch: Partial<Customer>
): AppState {
  return {
    ...state,
    customers: state.customers.map((customer) =>
      customer.id === customerId ? { ...customer, ...patch, id: customer.id } : customer
    )
  };
}

export function updateCase(
  state: AppState,
  caseId: string,
  patch: Partial<WeddingCase>
): AppState {
  return {
    ...state,
    cases: state.cases.map((weddingCase) =>
      weddingCase.id === caseId
        ? { ...weddingCase, ...patch, id: weddingCase.id }
        : weddingCase
    )
  };
}

export function addMeeting(
  state: AppState,
  input: Pick<Meeting, "title" | "scheduledAt" | "location" | "transcript">
): AppState {
  const id = `meeting-${state.meetings.length + 1}`;
  const meeting: Meeting = {
    id,
    caseId: state.selectedCaseId,
    title: input.title.trim() || "新規打ち合わせ",
    scheduledAt: input.scheduledAt,
    location: input.location.trim() || "未設定",
    participants: [getSelectedCustomer(state).primaryName, "櫻井"],
    transcript: input.transcript,
    publicNotes: [],
    internalNotes: [],
    summary: generateMockAiSummary(input.transcript),
    recordingConsent: { status: "not_requested" }
  };

  return {
    ...state,
    meetings: [...state.meetings, meeting],
    selectedMeetingId: id
  };
}

export function updateMeetingTranscript(
  state: AppState,
  meetingId: string,
  transcript: string
): AppState {
  return {
    ...state,
    meetings: state.meetings.map((meeting) =>
      meeting.id === meetingId ? { ...meeting, transcript, summary: null } : meeting
    )
  };
}

export function updateMeeting(state: AppState, meeting: Meeting): AppState {
  return {
    ...state,
    meetings: state.meetings.map((item) => (item.id === meeting.id ? meeting : item))
  };
}

export function addScheduleOptionToState(
  state: AppState,
  input: Omit<ScheduleOption, "id" | "caseId" | "status">
): AppState {
  const option = createScheduleOption({
    ...input,
    caseId: state.selectedCaseId
  });

  return {
    ...state,
    scheduleOptions: [...state.scheduleOptions, option]
  };
}

export function selectScheduleOptionForState(
  state: AppState,
  optionId: string
): AppState {
  return {
    ...state,
    scheduleOptions: selectScheduleOption(state.scheduleOptions, optionId)
  };
}

export function approveShareWorkflow(state: AppState): AppState {
  return updateShareWorkflow(state, {
    approvalStatus: "approved",
    copyFeedbackStatus: "idle"
  });
}

export function sendShareWorkflow(state: AppState): AppState {
  if (state.shareWorkflow.approvalStatus !== "approved") {
    return state;
  }

  return updateShareWorkflow(state, {
    deliveryStatus: "sent",
    copyFeedbackStatus: "idle"
  });
}

export function markShareCopyFeedback(
  state: AppState,
  copyFeedbackStatus: ShareCopyFeedbackStatus
): AppState {
  return updateShareWorkflow(state, { copyFeedbackStatus });
}

function updateShareWorkflow(
  state: AppState,
  patch: Partial<AppState["shareWorkflow"]>
): AppState {
  return {
    ...state,
    shareWorkflow: {
      ...state.shareWorkflow,
      caseId: state.selectedCaseId,
      meetingId: state.selectedMeetingId,
      ...patch,
      updatedAt: new Date().toISOString()
    }
  };
}

function requireEntity<T>(value: T | undefined, message: string): T {
  if (!value) {
    throw new Error(message);
  }

  return value;
}
