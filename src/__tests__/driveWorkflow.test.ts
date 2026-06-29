import { describe, expect, it } from "vitest";
import {
  createDriveAssetsForMeeting,
  getVisibleDriveAssets,
  isDriveEvidenceReady
} from "../domain/driveWorkflow";
import { sampleCase, sampleMeeting } from "../domain/sampleData";

describe("driveWorkflow", () => {
  it("creates the required Drive assets for a meeting", () => {
    const assets = createDriveAssetsForMeeting(
      sampleCase,
      sampleMeeting,
      "2026-07-02T10:20:00+09:00"
    );

    expect(assets.map((asset) => asset.kind)).toEqual([
      "recording",
      "transcript",
      "ai_summary",
      "customer_share"
    ]);
    expect(isDriveEvidenceReady(assets, sampleMeeting.id)).toBe(true);
  });

  it("hides internal Drive assets from customer role", () => {
    const assets = createDriveAssetsForMeeting(
      sampleCase,
      sampleMeeting,
      "2026-07-02T10:20:00+09:00"
    );

    const visible = getVisibleDriveAssets(assets, "customer");

    expect(visible).toHaveLength(1);
    expect(visible[0].kind).toBe("customer_share");
  });
});
