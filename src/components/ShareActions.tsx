import type { ShareCopyFeedbackStatus, ShareWorkflow } from "../domain/types";
import { shareStatusLabel } from "./NextActionCenter";

type ShareActionsProps = {
  shareWorkflow: ShareWorkflow;
  onApprove: () => void;
  onSend: () => void;
  onCopy: () => void;
};

export function ShareActions({
  shareWorkflow,
  onApprove,
  onSend,
  onCopy
}: ShareActionsProps) {
  const canSend = shareWorkflow.approvalStatus === "approved";

  return (
    <section className="shareActions" aria-label="共有操作">
      <div>
        <p className="sectionLabel">Share Flow</p>
        <h3>共有前チェック</h3>
        <p>内部メモを除外した内容だけを、承認後に送信モックへ進めます。</p>
      </div>
      <div className="shareActionButtons">
        <button type="button" onClick={onApprove}>
          承認
        </button>
        <button
          type="button"
          className="secondaryButton"
          onClick={onSend}
          disabled={!canSend}
        >
          送信モック
        </button>
        <button type="button" className="secondaryButton" onClick={onCopy}>
          共有文をコピー
        </button>
      </div>
      <p className="inlineNotice" role="status">
        共有状態: {shareStatusLabel(shareWorkflow)}
        {copyFeedbackText(shareWorkflow.copyFeedbackStatus)}
      </p>
    </section>
  );
}

function copyFeedbackText(status: ShareCopyFeedbackStatus): string {
  const labels: Record<ShareCopyFeedbackStatus, string> = {
    idle: "",
    copied: " / コピー済み",
    unavailable: " / コピー非対応",
    failed: " / コピー失敗"
  };

  return labels[status];
}
