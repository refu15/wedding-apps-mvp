import { generateMockAiSummary } from "./aiSummary";
import { createAvailabilityRequest, recordAvailabilityResponse } from "./assignment";
import { grantRecordingConsent, createConsentLog } from "./consent";
import { createCustomerShareText } from "./customerShare";
import { createDriveAssetsForMeeting, upsertDriveAssets } from "./driveWorkflow";
import { markMessagesSent, queueAvailabilityMessages, queueCustomerShareMessage } from "./messaging";
import { createAuditLog } from "./operations";
import {
  sampleAuditLogs,
  sampleAvailabilityRequests,
  sampleCase,
  sampleConsentLogs,
  sampleCustomer,
  sampleDriveAssets,
  sampleIntegrationStatus,
  sampleMeeting,
  sampleMessageLogs,
  sampleOperationalErrors,
  samplePartners,
  sampleScheduleOptions
} from "./sampleData";
import { createScheduleOption, selectScheduleOption } from "./scheduling";
import type {
  AppState,
  AvailabilityResponse,
  Customer,
  Meeting,
  PartnerRole,
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
    driveAssets: sampleDriveAssets,
    consentLogs: sampleConsentLogs,
    partners: samplePartners,
    availabilityRequests: sampleAvailabilityRequests,
    messageLogs: sampleMessageLogs,
    auditLogs: sampleAuditLogs,
    operationalErrors: sampleOperationalErrors,
    integrationStatus: sampleIntegrationStatus,
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

export function grantRecordingConsentForSelectedMeeting(
  state: AppState,
  grantedBy: string,
  policyVersion = "v0.1"
): AppState {
  const now = new Date().toISOString();
  const meeting = grantRecordingConsent(
    getSelectedMeeting(state),
    grantedBy,
    policyVersion,
    now
  );
  const consentLog = createConsentLog(
    state.selectedCustomerId,
    meeting,
    "manual",
    now
  );

  return {
    ...updateMeeting(state, meeting),
    consentLogs: [...state.consentLogs, consentLog],
    auditLogs: [
      ...state.auditLogs,
      createAuditLog({
        actorRole: "planner",
        action: "recording_consent_granted",
        entityType: "consent",
        entityId: consentLog.id,
        detail: `${grantedBy} が録音同意を付与`,
        now
      })
    ]
  };
}

export function syncSelectedMeetingToDrive(state: AppState): AppState {
  const now = new Date().toISOString();
  const meeting = getSelectedMeeting(state);
  const weddingCase = getSelectedCase(state);
  const assets = createDriveAssetsForMeeting(weddingCase, meeting, now);

  return {
    ...state,
    driveAssets: upsertDriveAssets(state.driveAssets, assets),
    auditLogs: [
      ...state.auditLogs,
      createAuditLog({
        actorRole: "planner",
        action: "drive_assets_synced",
        entityType: "drive_asset",
        entityId: meeting.id,
        detail: "録音・文字起こし・AI要約・顧客共有版をDrive案件フォルダへ同期",
        now
      })
    ]
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

  const now = new Date().toISOString();
  const shareBody = createCustomerShareText(getSelectedCase(state), getSelectedMeeting(state));
  const message = queueCustomerShareMessage(getSelectedCustomer(state), shareBody, now);
  const workflowState = updateShareWorkflow(state, {
    deliveryStatus: "sent",
    copyFeedbackStatus: "idle"
  });

  return {
    ...workflowState,
    messageLogs: markMessagesSent([...state.messageLogs, message], [message.id], now),
    auditLogs: [
      ...state.auditLogs,
      createAuditLog({
        actorRole: "planner",
        action: "customer_share_sent",
        entityType: "message",
        entityId: message.id,
        detail: "顧客共有メッセージを送信モックで記録",
        now
      })
    ]
  };
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

export function requestPartnerAvailabilityForState(
  state: AppState,
  role: PartnerRole,
  eventDate: string,
  responseDeadline: string
): AppState {
  const now = new Date().toISOString();
  const weddingCase = getSelectedCase(state);
  const request = createAvailabilityRequest({
    caseId: state.selectedCaseId,
    eventDate,
    role,
    responseDeadline,
    partners: state.partners,
    now
  });
  const messages = queueAvailabilityMessages(request, state.partners, weddingCase, now);

  return {
    ...state,
    availabilityRequests: [
      ...state.availabilityRequests.filter((item) => item.id !== request.id),
      request
    ],
    messageLogs: [...state.messageLogs, ...messages],
    auditLogs: [
      ...state.auditLogs,
      createAuditLog({
        actorRole: "planner",
        action: "availability_requested",
        entityType: "availability_request",
        entityId: request.id,
        detail: `${request.partnerIds.length}名へ空き確認を作成`,
        now
      })
    ]
  };
}

export function recordPartnerAvailabilityResponseForState(
  state: AppState,
  requestId: string,
  response: Omit<AvailabilityResponse, "respondedAt">
): AppState {
  const now = new Date().toISOString();

  return {
    ...state,
    availabilityRequests: state.availabilityRequests.map((request) =>
      request.id === requestId
        ? recordAvailabilityResponse(request, { ...response, respondedAt: now }, now)
        : request
    ),
    auditLogs: [
      ...state.auditLogs,
      createAuditLog({
        actorRole: "planner",
        action: "availability_response_recorded",
        entityType: "availability_request",
        entityId: requestId,
        detail: `${response.partnerId} の空き回答を記録`,
        now
      })
    ]
  };
}

export function sendQueuedMessagesForState(state: AppState): AppState {
  const now = new Date().toISOString();
  const queuedIds = state.messageLogs
    .filter((message) => message.status === "queued")
    .map((message) => message.id);

  return {
    ...state,
    messageLogs: markMessagesSent(state.messageLogs, queuedIds, now),
    auditLogs: [
      ...state.auditLogs,
      createAuditLog({
        actorRole: "planner",
        action: "queued_messages_sent",
        entityType: "message",
        entityId: "bulk",
        detail: `${queuedIds.length}件の通知を送信モックで記録`,
        now
      })
    ]
  };
}

function requireEntity<T>(value: T | undefined, message: string): T {
  if (!value) {
    throw new Error(message);
  }

  return value;
}
