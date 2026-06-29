import type { DriveAsset, Meeting, RecordingConsentLog } from "../domain/types";

type DriveEvidencePanelProps = {
  meeting: Meeting;
  assets: DriveAsset[];
  consentLogs: RecordingConsentLog[];
  onGenerateSummary: () => void;
  onSyncDrive: () => void;
  onGrantConsent: () => void;
};

export function DriveEvidencePanel({
  meeting,
  assets,
  consentLogs,
  onGenerateSummary,
  onSyncDrive,
  onGrantConsent
}: DriveEvidencePanelProps) {
  const meetingAssets = assets.filter((asset) => asset.meetingId === meeting.id);
  const meetingConsentLogs = consentLogs.filter((log) => log.meetingId === meeting.id);
  const latestConsent = meetingConsentLogs[meetingConsentLogs.length - 1];

  return (
    <section className="sectionPage" aria-label="Google Drive証跡管理">
      <div className="sectionHero">
        <p className="sectionLabel">Google Drive Source of Truth</p>
        <h2>打ち合わせ証跡</h2>
        <p>
          録音、文字起こし、AI要約、顧客共有版を案件フォルダに集約し、言った言わないを防ぐ前提です。
        </p>
      </div>

      <div className="driveFolder">
        <div>
          <span className="folderIcon" aria-hidden="true">Drive</span>
          <strong>{meetingAssets[0]?.folderPath ?? "Drive / Wedding Crew / 未同期"}</strong>
        </div>
        <span className="statusPill success">権限: 担当者・管理者</span>
      </div>

      <div className="evidenceList" role="list">
        {meetingAssets.map((asset) => (
          <article className="evidenceItem" role="listitem" key={asset.id}>
            <div>
              <p className="sectionLabel">{asset.provider}</p>
              <h3>{asset.name}</h3>
              <p>{asset.url}</p>
            </div>
            <span className="statusPill">{assetStatusLabel(asset.status)}</span>
          </article>
        ))}
      </div>

      <div className="consentBox">
        <div>
          <p className="sectionLabel">Consent</p>
          <h3>録音・AI解析同意</h3>
          <p>
            {latestConsent
              ? `${latestConsent.status} / ${latestConsent.policyVersion} / ${new Date(latestConsent.capturedAt).toLocaleString("ja-JP")}`
              : "同意ログがありません。"}
          </p>
        </div>
        <button type="button" className="secondaryButton" onClick={onGrantConsent}>
          同意取得を記録
        </button>
      </div>

      <div className="meetingRecord">
        <div className="meetingMeta">
          <span>{meeting.title}</span>
          <span>{new Date(meeting.scheduledAt).toLocaleString("ja-JP")}</span>
          <span>{meeting.location}</span>
        </div>
        <details className="transcriptDisclosure">
          <summary>Drive文字起こしプレビュー</summary>
          <p className="transcriptPreview">{meeting.transcript}</p>
        </details>
      </div>

      <div className="actionRow">
        <button type="button" className="secondaryButton" onClick={onSyncDrive}>
          Drive同期
        </button>
        <button type="button" onClick={onGenerateSummary}>
          要約を再生成
        </button>
        <p className="inlineNotice">
          実装時はGoogle Docsの本文を読み取り、要約結果を同じ案件フォルダへ保存します。
        </p>
      </div>
    </section>
  );
}

function assetStatusLabel(status: DriveAsset["status"]): string {
  const labels: Record<DriveAsset["status"], string> = {
    missing: "未作成",
    ready: "保存済み",
    needs_review: "確認待ち",
    shared: "共有済み"
  };

  return labels[status];
}
