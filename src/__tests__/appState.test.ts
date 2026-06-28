import { describe, expect, it } from "vitest";
import {
  addMeeting,
  addScheduleOptionToState,
  approveShareWorkflow,
  createInitialAppState,
  markShareCopyFeedback,
  sendShareWorkflow,
  updateCustomer,
  updateMeetingTranscript
} from "../domain/appState";

describe("appState CRUD operations", () => {
  it("updates a customer without dropping existing case and meeting data", () => {
    const state = createInitialAppState();
    const updated = updateCustomer(state, state.selectedCustomerId, {
      primaryName: "松本 更新"
    });

    expect(updated.customers[0].primaryName).toBe("松本 更新");
    expect(updated.cases).toHaveLength(state.cases.length);
    expect(updated.meetings).toHaveLength(state.meetings.length);
  });

  it("adds a new meeting and selects it", () => {
    const state = createInitialAppState();
    const updated = addMeeting(state, {
      title: "会場候補確認",
      scheduledAt: "2026-07-20T10:00:00+09:00",
      location: "サロン",
      transcript: "決定: サロンで会場候補を確認する。"
    });

    expect(updated.meetings).toHaveLength(state.meetings.length + 1);
    expect(updated.selectedMeetingId).toBe(updated.meetings[updated.meetings.length - 1].id);
  });

  it("updates transcript and clears stale AI summary", () => {
    const state = createInitialAppState();
    const updated = updateMeetingTranscript(
      state,
      state.selectedMeetingId,
      "未決: 新しい候補日を確認する。"
    );
    const meeting = updated.meetings.find((item) => item.id === state.selectedMeetingId);

    expect(meeting?.transcript).toContain("新しい候補日");
    expect(meeting?.summary).toBeNull();
  });

  it("adds a pending schedule option to the selected case", () => {
    const state = createInitialAppState();
    const updated = addScheduleOptionToState(state, {
      startsAt: "2026-07-21T11:00:00+09:00",
      endsAt: "2026-07-21T12:00:00+09:00",
      label: "7/21 11:00",
      channel: "mock_line"
    });

    expect(updated.scheduleOptions).toHaveLength(state.scheduleOptions.length + 1);
    expect(updated.scheduleOptions[updated.scheduleOptions.length - 1].status).toBe("pending");
    expect(updated.scheduleOptions[updated.scheduleOptions.length - 1].caseId).toBe(
      state.selectedCaseId
    );
  });

  it("keeps share approval, delivery, and copy feedback as separate states", () => {
    const state = createInitialAppState();
    const copiedDraft = markShareCopyFeedback(state, "copied");
    const blockedSend = sendShareWorkflow(copiedDraft);
    const approved = approveShareWorkflow(blockedSend);
    const sent = sendShareWorkflow(approved);

    expect(blockedSend.shareWorkflow.deliveryStatus).toBe("not_sent");
    expect(approved.shareWorkflow.approvalStatus).toBe("approved");
    expect(approved.shareWorkflow.copyFeedbackStatus).toBe("idle");
    expect(sent.shareWorkflow.deliveryStatus).toBe("sent");
  });
});
