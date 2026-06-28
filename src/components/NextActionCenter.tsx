import type { Meeting, ShareWorkflow } from "../domain/types";

type NextActionCenterProps = {
  meeting: Meeting;
  selectedScheduleLabel: string | null;
  shareWorkflow: ShareWorkflow;
  onGoToDrive: () => void;
  onGoToShare: () => void;
  onGoToAssignment: () => void;
};

export function NextActionCenter({
  meeting,
  selectedScheduleLabel,
  shareWorkflow,
  onGoToDrive,
  onGoToShare,
  onGoToAssignment
}: NextActionCenterProps) {
  const summaryReady = meeting.summary !== null;
  const shareReady = summaryReady && shareWorkflow.approvalStatus === "approved";

  return (
    <section className="actionCenter" aria-label="今日やること">
      <div className="actionCenterLead">
        <p className="sectionLabel">Next Actions</p>
        <h2>今日やること</h2>
        <p>
          Drive上の打ち合わせ証跡を確認し、共有版を承認して、提携先の空き確認へ進めます。
        </p>
      </div>
      <div className="taskRail" role="list">
        <WorkflowTask
          label="1"
          title="Drive証跡"
          status={summaryReady ? "完了" : "要対応"}
          description={
            summaryReady
              ? "録音・文字起こし・要約を案件フォルダで確認できます。"
              : "Drive文字起こしからAI要約を生成してください。"
          }
          actionLabel="Driveを確認"
          onAction={onGoToDrive}
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
          title="提携先アサイン"
          status={selectedScheduleLabel ? "選択済み" : "未選択"}
          description={
            selectedScheduleLabel
              ? `${selectedScheduleLabel} が仮押さえ対象です。`
              : "LINEで空き確認し、候補者を顧客に提示します。"
          }
          actionLabel="アサインを見る"
          onAction={onGoToAssignment}
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
