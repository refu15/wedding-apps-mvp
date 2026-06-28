import { useState } from "react";
import { canGenerateAiSummary, getAiSummaryBlockedReason } from "../domain/permissions";
import type { Meeting } from "../domain/types";

type MeetingPanelProps = {
  meeting: Meeting;
  onTranscriptChange: (transcript: string) => void;
  onGenerateSummary: () => void;
  onAddMeeting: (input: Pick<Meeting, "title" | "scheduledAt" | "location" | "transcript">) => void;
};

export function MeetingPanel({
  meeting,
  onAddMeeting,
  onTranscriptChange,
  onGenerateSummary
}: MeetingPanelProps) {
  const blockedReason = getAiSummaryBlockedReason(meeting);
  const canGenerate = canGenerateAiSummary(meeting);
  const [newTitle, setNewTitle] = useState("次回打ち合わせ");
  const [newScheduledAt, setNewScheduledAt] = useState("2026-07-20T10:00");
  const [newLocation, setNewLocation] = useState("サロン");

  return (
    <section className="panel panelWide">
      <div className="panelHeader">
        <div>
          <p className="sectionLabel">Meeting</p>
          <h2>打ち合わせ・AI要約</h2>
        </div>
        <span className={canGenerate ? "statusPill success" : "statusPill warning"}>
          録音同意: {meeting.recordingConsent.status}
        </span>
      </div>

      <div className="meetingMeta">
        <span>{meeting.title}</span>
        <span>{new Date(meeting.scheduledAt).toLocaleString("ja-JP")}</span>
        <span>{meeting.location}</span>
      </div>

      <details className="transcriptDisclosure">
        <summary>文字起こしテキスト</summary>
        <textarea
          id="transcript"
          aria-label="文字起こしテキスト"
          value={meeting.transcript}
          onChange={(event) => onTranscriptChange(event.target.value)}
          rows={8}
        />
      </details>

      <div className="actionRow">
        <button type="button" onClick={onGenerateSummary} disabled={!canGenerate}>
          AI要約モックを生成
        </button>
        {blockedReason ? <p className="inlineNotice">{blockedReason}</p> : null}
      </div>

      {meeting.summary ? (
        <div className="summaryGrid" aria-label="AI要約結果">
          <SummaryColumn title="決定事項" items={meeting.summary.decisions} />
          <SummaryColumn title="未決事項" items={meeting.summary.openQuestions} />
          <SummaryColumn title="宿題" items={meeting.summary.tasks} />
          <SummaryColumn title="好み/メモ" items={meeting.summary.preferences} />
        </div>
      ) : (
        <p className="emptyText">文字起こしを編集すると、要約は未生成状態に戻ります。</p>
      )}

      <details className="disclosureForm">
        <summary>新しい打ち合わせを追加</summary>
        <form
          className="editForm"
          onSubmit={(event) => {
            event.preventDefault();
            onAddMeeting({
              title: newTitle,
              scheduledAt: new Date(newScheduledAt).toISOString(),
              location: newLocation,
              transcript: "未決: 新しい打ち合わせ内容を入力してください。"
            });
          }}
        >
          <label>
            タイトル
            <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
          </label>
          <label>
            日時
            <input
              type="datetime-local"
              value={newScheduledAt}
              onChange={(event) => setNewScheduledAt(event.target.value)}
            />
          </label>
          <label>
            場所
            <input
              value={newLocation}
              onChange={(event) => setNewLocation(event.target.value)}
            />
          </label>
          <button type="submit">打ち合わせを追加</button>
        </form>
      </details>
    </section>
  );
}

function SummaryColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="summaryColumn">
      <h3>{title}</h3>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="emptyText">該当なし</p>
      )}
    </div>
  );
}
