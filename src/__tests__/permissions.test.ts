import { describe, expect, it } from "vitest";
import { canGenerateAiSummary } from "../domain/permissions";
import type { Meeting } from "../domain/types";

const baseMeeting: Meeting = {
  id: "meeting-1",
  caseId: "case-1",
  title: "初回相談",
  scheduledAt: "2026-07-02T10:00:00+09:00",
  location: "オンライン",
  participants: ["松本さん", "櫻井"],
  transcript: "",
  publicNotes: [],
  internalNotes: ["予算感は内部確認が必要"],
  summary: null,
  recordingConsent: {
    status: "granted",
    grantedBy: "松本さん",
    grantedAt: "2026-07-02T09:58:00+09:00",
    policyVersion: "v0.1"
  }
};

describe("canGenerateAiSummary", () => {
  it("returns true only when recording consent is granted", () => {
    expect(canGenerateAiSummary(baseMeeting)).toBe(true);
    expect(
      canGenerateAiSummary({
        ...baseMeeting,
        recordingConsent: { status: "not_requested" }
      })
    ).toBe(false);
    expect(
      canGenerateAiSummary({
        ...baseMeeting,
        recordingConsent: { status: "denied", deniedReason: "録音は不可" }
      })
    ).toBe(false);
  });
});
