import type { DriveAsset, DriveAssetKind, Meeting, UserRole, WeddingCase } from "./types";

const assetNames: Record<DriveAssetKind, string> = {
  recording: "録音ファイル",
  transcript: "文字起こし",
  ai_summary: "AI要約",
  customer_share: "顧客共有版"
};

export function buildDriveFolderPath(weddingCase: WeddingCase, meeting: Meeting): string {
  return ["Drive", "Wedding Crew", weddingCase.title, meeting.title].join(" / ");
}

export function createDriveAssetsForMeeting(
  weddingCase: WeddingCase,
  meeting: Meeting,
  now: string
): DriveAsset[] {
  return (Object.keys(assetNames) as DriveAssetKind[]).map((kind) => {
    const isCustomerShare = kind === "customer_share";
    const isSummary = kind === "ai_summary";
    const status = isSummary && meeting.summary ? "ready" : isCustomerShare ? "needs_review" : "ready";

    return {
      id: `drive-${kind}-${meeting.id}`,
      caseId: weddingCase.id,
      meetingId: meeting.id,
      kind,
      name: `${meeting.title}_${assetNames[kind]}`,
      folderPath: buildDriveFolderPath(weddingCase, meeting),
      provider: "google_drive",
      status,
      url: `https://drive.google.com/mock/${kind}-${meeting.id}`,
      allowedRoles: isCustomerShare ? ["admin", "planner", "customer"] : ["admin", "planner"],
      updatedAt: now
    };
  });
}

export function upsertDriveAssets(
  existing: DriveAsset[],
  assets: DriveAsset[]
): DriveAsset[] {
  const incomingIds = new Set(assets.map((asset) => asset.id));
  return [...existing.filter((asset) => !incomingIds.has(asset.id)), ...assets];
}

export function getVisibleDriveAssets(assets: DriveAsset[], role: UserRole): DriveAsset[] {
  return assets.filter((asset) => asset.allowedRoles.includes(role));
}

export function isDriveEvidenceReady(assets: DriveAsset[], meetingId: string): boolean {
  const requiredKinds: DriveAssetKind[] = ["recording", "transcript", "ai_summary", "customer_share"];
  return requiredKinds.every((kind) =>
    assets.some(
      (asset) =>
        asset.meetingId === meetingId &&
        asset.kind === kind &&
        asset.status !== "missing"
    )
  );
}
