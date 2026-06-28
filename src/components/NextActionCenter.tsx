import type { Meeting, ShareWorkflow } from "../domain/types";

type NextActionCenterProps = {
  meeting: Meeting;
  selectedScheduleLabel: string | null;
  shareWorkflow: ShareWorkflow;
  onGoToMeeting: () => void;
  onGoToShare: () => void;
  onGoToSchedule: () => void;
};

export function NextActionCenter({
  meeting,
  selectedScheduleLabel,
  shareWorkflow,
  onGoToMeeting,
  onGoToShare,
  onGoToSchedule
}: NextActionCenterProps) {
  const summaryReady = meeting.summary !== null;
  const shareReady = summaryReady && shareWorkflow.approvalStatus === "approved";

  return (
    <section className="actionCenter" aria-label="今日やること">
      <div className="actionCenterLead">
        <p className="sectionLabel">Next Actions</p>
        <h2>今日やること</h2>
        <p>
          打ち合わせ内容を確認し、顧客共有を整えて、次回日程を確定する流れです。
        </p>
      </div>
      <div className="taskRail" role="list">
        <WorkflowTask
          label="1"
          title="打合せ処理"
          status={summaryReady ? "完了" : "要対応"}
          description={
            summaryReady
              ? "AI要約が生成済みです。公開前に内容だけ確認してください。"
              : "文字起こしを確認してAI要約を生成してください。"
          }
          actionLabel="打合せを確認"
          onAction={onGoToMeeting}
        />
        <WorkflowTask
          label="2"
          title="顧客共有"
          status={shareStatusLabel(shareWorkflow)}
          description={
            shareReady
              ? "共有内容は承認済みです。送信状態を確認してください。"
              : "内部メモを除外した共有内容を確認し、承認してください。"
          }
          actionLabel="共有を確認"
          onAction={onGoToShare}
        />
        <WorkflowTask
          label="3"
          title="日程確定"
          status={selectedScheduleLabel ? "選択済み" : "未選択"}
          description={
            selectedScheduleLabel
              ? `${selectedScheduleLabel} が選択されています。`
              : "顧客に提示する候補から確定枠を選びます。"
          }
          actionLabel="日程を見る"
          onAction={onGoToSchedule}
        />
      </div>
    </section>
  );
}

function WorkflowTask({
  label,
  title,
  status,
  description,
  actionLabel,
  onAction
}: {
  label: string;
  title: string;
  status: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <article className="workflowTask" role="listitem">
      <div className="workflowTaskNumber" aria-hidden="true">
        {label}
      </div>
      <div>
        <div className="workflowTaskHeader">
          <h3>{title}</h3>
          <span>{status}</span>
        </div>
        <p>{description}</p>
        <button type="button" className="secondaryButton" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </article>
  );
}

export function shareStatusLabel(workflow: ShareWorkflow): string {
  if (workflow.deliveryStatus === "sent") {
    return "送信済み";
  }

  if (workflow.approvalStatus === "approved") {
    return "承認済み";
  }

  return "未承認";
}
