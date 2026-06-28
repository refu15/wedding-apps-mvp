import { generateMockAiSummary } from "./aiSummary";
import { createScheduleOption, selectScheduleOption } from "./scheduling";
import type { Customer, Meeting, ScheduleOption, WeddingCase } from "./types";

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
