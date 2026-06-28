import { describe, expect, it } from "vitest";
import { createSharePreview } from "../domain/sharePreview";
import { sampleCase, sampleCustomer, sampleMeeting } from "../domain/sampleData";

describe("createSharePreview", () => {
  it("does not expose internal notes to customer-facing preview data", () => {
    const preview = createSharePreview(sampleCustomer, sampleCase, {
      ...sampleMeeting,
      publicNotes: ["お二人の希望はナチュラルな写真"],
      internalNotes: ["担当者だけが見る営業メモ"]
    });

    expect(JSON.stringify(preview)).not.toContain("営業メモ");
    expect(preview.meeting.publicNotes).toEqual(["お二人の希望はナチュラルな写真"]);
    expect("internalNotes" in preview.meeting).toBe(false);
  });
});
