export type RecordingConsent =
  | {
      status: "granted";
      grantedBy: string;
      grantedAt: string;
      policyVersion: string;
    }
  | {
      status: "denied";
      deniedReason: string;
    }
  | {
      status: "not_requested";
    };

export type AiSummary = {
  decisions: string[];
  openQuestions: string[];
  tasks: string[];
  preferences: string[];
};

export type Customer = {
  id: string;
  primaryName: string;
  partnerName: string;
  lineDisplayName: string;
  email: string;
  preferredContact: "line" | "email" | "phone";
  tags: string[];
};

export type WeddingCase = {
  id: string;
  customerId: string;
  title: string;
  status:
    | "inquiry"
    | "first_meeting_scheduled"
    | "proposal"
    | "contracted"
    | "planning"
    | "completed"
    | "paused";
  weddingDate: string | null;
  venueCandidate: string;
  budgetRange: string;
  stylePreference: string;
  ownerName: string;
};

export type Meeting = {
  id: string;
  caseId: string;
  title: string;
  scheduledAt: string;
  location: string;
  participants: string[];
  transcript: string;
  publicNotes: string[];
  internalNotes: string[];
  summary: AiSummary | null;
  recordingConsent: RecordingConsent;
};

export type ScheduleOption = {
  id: string;
  caseId: string;
  startsAt: string;
  endsAt: string;
  channel: "mock_line" | "email" | "manual";
  label: string;
  status: "pending" | "selected" | "declined";
};

export type CustomerSharePreview = {
  customer: Pick<Customer, "primaryName" | "partnerName" | "preferredContact">;
  case: Pick<
    WeddingCase,
    "title" | "status" | "weddingDate" | "venueCandidate" | "stylePreference"
  >;
  meeting: {
    title: string;
    scheduledAt: string;
    publicNotes: string[];
    summary: AiSummary | null;
    recordingConsentStatus: RecordingConsent["status"];
  };
};

export type UserRole = "admin" | "planner" | "customer";

export type ShareLink = {
  token: string;
  caseId: string;
  meetingId: string;
  expiresAt: string;
};

export type ShareApprovalStatus = "draft" | "approved";

export type ShareDeliveryStatus = "not_sent" | "sent";

export type ShareCopyFeedbackStatus = "idle" | "copied" | "unavailable" | "failed";

export type ShareWorkflow = {
  caseId: string;
  meetingId: string;
  approvalStatus: ShareApprovalStatus;
  deliveryStatus: ShareDeliveryStatus;
  copyFeedbackStatus: ShareCopyFeedbackStatus;
  updatedAt: string | null;
};

export type AppState = {
  customers: Customer[];
  cases: WeddingCase[];
  meetings: Meeting[];
  scheduleOptions: ScheduleOption[];
  shareLinks: ShareLink[];
  shareWorkflow: ShareWorkflow;
  selectedCustomerId: string;
  selectedCaseId: string;
  selectedMeetingId: string;
};
