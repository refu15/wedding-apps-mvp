import { generateMockAiSummary } from "./aiSummary";
import { createScheduleOption, selectScheduleOption } from "./scheduling";
import type {
  AuditLog,
  AvailabilityRequest,
  DriveAsset,
  IntegrationStatus,
  Meeting,
  MessageLog,
  OperationalError,
  Partner,
  RecordingConsentLog,
  ScheduleOption,
  Customer,
  WeddingCase
} from "./types";

export const sampleCustomer: Customer = {
  id: "customer-1",
  primaryName: "松本 花",
  partnerName: "松本 樹",
  lineDisplayName: "matsumoto_wedding",
  email: "matsumoto@example.com",
  preferredContact: "line",
  tags: ["初回相談済み", "フォトウェディング関心", "ナチュラル"]
};

export const sampleCase: WeddingCase = {
  id: "case-1",
  customerId: sampleCustomer.id,
  title: "松本様 2027年春 挙式相談",
  status: "proposal",
  weddingDate: "2027-04-18",
  venueCandidate: "塩釜エリア・少人数会場",
  budgetRange: "180万円〜250万円",
  stylePreference: "家族中心で自然体の写真を残したい",
  ownerName: "櫻井"
};

export const sampleTranscript = `
決定: 次回打ち合わせはオンラインで実施する。
未決: 会場候補は塩釜エリアを中心に追加確認する。
宿題: 櫻井がプランナー候補と撮影候補の整理案を作成する。
メモ: 写真はナチュラルで家族の会話が見える雰囲気が好み。
`;

export const sampleMeeting: Meeting = {
  id: "meeting-1",
  caseId: sampleCase.id,
  title: "初回相談",
  scheduledAt: "2026-07-02T10:00:00+09:00",
  location: "オンライン",
  participants: ["松本 花", "松本 樹", "櫻井"],
  transcript: sampleTranscript,
  publicNotes: ["次回までに会場候補と撮影候補を整理します。"],
  internalNotes: ["予算は柔らかく確認。提携カメラマン候補を先に洗い出す。"],
  summary: generateMockAiSummary(sampleTranscript),
  recordingConsent: {
    status: "granted",
    grantedBy: "松本 花",
    grantedAt: "2026-07-02T09:58:00+09:00",
    policyVersion: "v0.1"
  }
};

const pendingScheduleOptions: ScheduleOption[] = [
  createScheduleOption({
    caseId: sampleCase.id,
    startsAt: "2026-07-10T13:00:00+09:00",
    endsAt: "2026-07-10T14:00:00+09:00",
    channel: "mock_line",
    label: "7/10 金 13:00"
  }),
  createScheduleOption({
    caseId: sampleCase.id,
    startsAt: "2026-07-11T15:00:00+09:00",
    endsAt: "2026-07-11T16:00:00+09:00",
    channel: "mock_line",
    label: "7/11 土 15:00"
  }),
  createScheduleOption({
    caseId: sampleCase.id,
    startsAt: "2026-07-14T10:00:00+09:00",
    endsAt: "2026-07-14T11:00:00+09:00",
    channel: "email",
    label: "7/14 火 10:00"
  })
];

export const sampleScheduleOptions = selectScheduleOption(
  pendingScheduleOptions,
  pendingScheduleOptions[1].id
);

const now = "2026-07-02T10:20:00+09:00";

export const sampleDriveAssets: DriveAsset[] = [
  {
    id: "drive-recording-meeting-1",
    caseId: sampleCase.id,
    meetingId: sampleMeeting.id,
    kind: "recording",
    name: "初回相談_録音.mp4",
    folderPath: "Drive / Wedding Crew / 松本様 / 初回相談",
    provider: "google_drive",
    status: "ready",
    url: "https://drive.google.com/mock/recording-meeting-1",
    allowedRoles: ["admin", "planner"],
    updatedAt: now
  },
  {
    id: "drive-transcript-meeting-1",
    caseId: sampleCase.id,
    meetingId: sampleMeeting.id,
    kind: "transcript",
    name: "初回相談_文字起こし",
    folderPath: "Drive / Wedding Crew / 松本様 / 初回相談",
    provider: "google_drive",
    status: "needs_review",
    url: "https://docs.google.com/document/d/mock-transcript-meeting-1",
    allowedRoles: ["admin", "planner"],
    updatedAt: now
  },
  {
    id: "drive-summary-meeting-1",
    caseId: sampleCase.id,
    meetingId: sampleMeeting.id,
    kind: "ai_summary",
    name: "初回相談_AI要約",
    folderPath: "Drive / Wedding Crew / 松本様 / 初回相談",
    provider: "google_drive",
    status: "ready",
    url: "https://docs.google.com/document/d/mock-summary-meeting-1",
    allowedRoles: ["admin", "planner"],
    updatedAt: now
  },
  {
    id: "drive-share-meeting-1",
    caseId: sampleCase.id,
    meetingId: sampleMeeting.id,
    kind: "customer_share",
    name: "初回相談_顧客共有版",
    folderPath: "Drive / Wedding Crew / 松本様 / 初回相談",
    provider: "google_drive",
    status: "needs_review",
    url: "https://docs.google.com/document/d/mock-share-meeting-1",
    allowedRoles: ["admin", "planner", "customer"],
    updatedAt: now
  }
];

export const sampleConsentLogs: RecordingConsentLog[] = [
  {
    id: "consent-meeting-1",
    customerId: sampleCustomer.id,
    meetingId: sampleMeeting.id,
    status: "granted",
    policyVersion: "v0.1",
    capturedAt: "2026-07-02T09:58:00+09:00",
    channel: "online_meeting"
  }
];

export const samplePartners: Partner[] = [
  {
    id: "partner-photo-1",
    name: "佐藤 カメラ",
    role: "photographer",
    portfolioUrl: "https://example.com/portfolio/sato",
    tags: ["家族写真", "ナチュラル", "塩釜対応"],
    contactChannel: "line",
    status: "active"
  },
  {
    id: "partner-photo-2",
    name: "高橋 フォト",
    role: "photographer",
    portfolioUrl: "https://example.com/portfolio/takahashi",
    tags: ["少人数婚", "ドキュメンタリー"],
    contactChannel: "email",
    status: "active"
  },
  {
    id: "partner-hair-1",
    name: "鈴木 ヘアメイク",
    role: "hair_make",
    portfolioUrl: "https://example.com/portfolio/suzuki",
    tags: ["和装", "持ち込み対応"],
    contactChannel: "line",
    status: "active"
  }
];

export const sampleAvailabilityRequests: AvailabilityRequest[] = [
  {
    id: "availability-case-1-photo",
    caseId: sampleCase.id,
    eventDate: "2027-04-18T10:00:00+09:00",
    role: "photographer",
    status: "ready",
    responseDeadline: "2026-07-09T18:00:00+09:00",
    partnerIds: ["partner-photo-1", "partner-photo-2"],
    responses: [
      {
        partnerId: "partner-photo-1",
        status: "available",
        respondedAt: "2026-07-02T12:00:00+09:00",
        note: "終日対応可能"
      },
      {
        partnerId: "partner-photo-2",
        status: "tentative",
        respondedAt: "2026-07-02T12:20:00+09:00",
        note: "午後のみ仮対応可能"
      }
    ],
    createdAt: now,
    updatedAt: now
  }
];

export const sampleMessageLogs: MessageLog[] = [
  {
    id: "message-availability-1",
    channel: "line",
    recipientType: "partner",
    recipientId: "partner-photo-1",
    template: "availability_request",
    status: "sent",
    body: "2027/4/18の撮影可否を確認してください。",
    createdAt: now,
    sentAt: now
  }
];

export const sampleAuditLogs: AuditLog[] = [
  {
    id: "audit-initial-drive",
    actorRole: "admin",
    action: "drive_assets_initialized",
    entityType: "drive_asset",
    entityId: sampleMeeting.id,
    detail: "初回相談のDrive証跡を初期化",
    createdAt: now
  }
];

export const sampleOperationalErrors: OperationalError[] = [];

export const sampleIntegrationStatus: IntegrationStatus = {
  drive: "mock_connected",
  ai: "mock_connected",
  messaging: "mock_connected",
  database: "local_storage"
};
