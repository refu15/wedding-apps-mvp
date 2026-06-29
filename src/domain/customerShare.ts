import type { AiSummary, Meeting, WeddingCase } from "./types";

export function createCustomerShareText(weddingCase: WeddingCase, meeting: Meeting): string {
  const summary = meeting.summary ?? emptySummary();
  const lines = [
    `${weddingCase.title}`,
    `会場候補: ${weddingCase.venueCandidate}`,
    `希望: ${weddingCase.stylePreference}`,
    "",
    "共有メモ:",
    ...meeting.publicNotes.map((note) => `- ${note}`),
    "",
    "決定事項:",
    ...summary.decisions.map((item) => `- ${item}`),
    "",
    "未決事項:",
    ...summary.openQuestions.map((item) => `- ${item}`)
  ];

  return lines.join("\n").trim();
}

export function validateCustomerShare(meeting: Meeting): string[] {
  const errors: string[] = [];

  if (meeting.recordingConsent.status !== "granted") {
    errors.push("録音同意が取得されていません。");
  }

  if (!meeting.summary) {
    errors.push("AI要約が未生成です。");
  }

  if (meeting.publicNotes.length === 0) {
    errors.push("顧客共有メモがありません。");
  }

  return errors;
}

function emptySummary(): AiSummary {
  return {
    decisions: [],
    openQuestions: [],
    tasks: [],
    preferences: []
  };
}
