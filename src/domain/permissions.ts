import type { Meeting } from "./types";

export function canGenerateAiSummary(meeting: Meeting): boolean {
  return meeting.recordingConsent.status === "granted";
}

export function getAiSummaryBlockedReason(meeting: Meeting): string | null {
  if (meeting.recordingConsent.status === "granted") {
    return null;
  }

  if (meeting.recordingConsent.status === "denied") {
    return "録音同意が拒否されているため、AI要約は実行できません。";
  }

  return "録音同意が未取得のため、AI要約は実行できません。";
}
