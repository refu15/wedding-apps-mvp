import type { Meeting } from "../domain/types";

type DriveEvidencePanelProps = {
  meeting: Meeting;
  onGenerateSummary: () => void;
};

const driveFiles = [
  {
    title: "録音ファイル",
    owner: "Google Drive / 案件フォルダ",
    status: "保存済み",
    detail: "打ち合わせ終了後に録音を案件フォルダへ格納"
  },
  {
    title: "文字起こし",
    owner: "Google Docs",
    status: "確認待ち",
    detail: "Tactiq / Fireflies等から取り込み、担当者が要点を確認"
  },
  {
    title: "AI要約",
    owner: "Google Docs",
    status: "生成済み",
    detail: "決定事項・未決事項・宿題・好みを共有前にレビュー"
  },
  {
    title: "顧客共有版",
    owner: "Google Docs / 共有リンク",
    status: "未承認",
    detail: "内部メモを除外した内容のみを顧客へ共有"
  }
];

export function DriveEvidencePanel({ meeting, onGenerateSummary }: DriveEvidencePanelProps) {
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
          <strong>Drive / Wedding Crew / 松本様 / 初回相談</strong>
        </div>
        <span className="statusPill success">権限: 担当者・管理者</span>
      </div>

      <div className="evidenceList" role="list">
        {driveFiles.map((file) => (
          <article className="evidenceItem" role="listitem" key={file.title}>
            <div>
              <p className="sectionLabel">{file.owner}</p>
              <h3>{file.title}</h3>
              <p>{file.detail}</p>
            </div>
            <span className="statusPill">{file.status}</span>
          </article>
        ))}
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
