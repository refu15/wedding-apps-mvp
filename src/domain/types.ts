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

export type DriveAssetKind = "recording" | "transcript" | "ai_summary" | "customer_share";

export type DriveAssetStatus = "missing" | "ready" | "needs_review" | "shared";

export type DriveAsset = {
  id: string;
  caseId: string;
  meetingId: string;
  kind: DriveAssetKind;
  name: string;
  folderPath: string;
  provider: "google_drive";
  status: DriveAssetStatus;
  url: string;
  allowedRoles: UserRole[];
  updatedAt: string;
};

export type RecordingConsentLog = {
  id: string;
  customerId: string;
  meetingId: string;
  status: RecordingConsent["status"];
  policyVersion: string;
  capturedAt: string;
  channel: "online_meeting" | "salon" | "line" | "manual";
};

export type PartnerRole = "photographer" | "hair_make" | "planner" | "venue_staff";

export type Partner = {
  id: string;
  name: string;
  role: PartnerRole;
  portfolioUrl: string;
  tags: string[];
  contactChannel: "line" | "email";
  status: "active" | "paused";
};

export type AvailabilityResponseStatus = "available" | "unavailable" | "tentative";

export type AvailabilityResponse = {
  partnerId: string;
  status: AvailabilityResponseStatus;
  respondedAt: string;
  note: string;
};

export type AvailabilityRequest = {
  id: string;
  caseId: string;
  eventDate: string;
  role: PartnerRole;
  status: "draft" | "sent" | "collecting" | "ready" | "expired";
  responseDeadline: string;
  partnerIds: string[];
  responses: AvailabilityResponse[];
  createdAt: string;
  updatedAt: string;
};

export type MessageLog = {
  id: string;
  channel: "line" | "email";
  recipientType: "customer" | "partner";
  recipientId: string;
  template: "availability_request" | "customer_share" | "reminder";
  status: "queued" | "sent" | "failed" | "read";
  body: string;
  createdAt: string;
  sentAt: string | null;
};

export type AuditLog = {
  id: string;
  actorRole: UserRole;
  action: string;
  entityType:
    | "drive_asset"
    | "meeting"
    | "share_workflow"
    | "availability_request"
    | "message"
    | "consent";
  entityId: string;
  detail: string;
  createdAt: string;
};

export type OperationalError = {
  id: string;
  area: "drive" | "ai" | "messaging" | "auth" | "assignment" | "persistence";
  severity: "info" | "warning" | "critical";
  message: string;
  status: "open" | "resolved";
  createdAt: string;
};

export type IntegrationStatus = {
  drive: "mock_connected" | "needs_backend";
  ai: "mock_connected" | "needs_backend";
  messaging: "mock_connected" | "needs_backend";
  database: "local_storage" | "needs_backend";
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
  driveAssets: DriveAsset[];
  consentLogs: RecordingConsentLog[];
  partners: Partner[];
  availabilityRequests: AvailabilityRequest[];
  messageLogs: MessageLog[];
  auditLogs: AuditLog[];
  operationalErrors: OperationalError[];
  integrationStatus: IntegrationStatus;
  shareLinks: ShareLink[];
  shareWorkflow: ShareWorkflow;
  selectedCustomerId: string;
  selectedCaseId: string;
  selectedMeetingId: string;
};
