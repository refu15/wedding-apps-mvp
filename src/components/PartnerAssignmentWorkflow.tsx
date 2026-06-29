import type {
  AvailabilityRequest,
  MessageLog,
  Partner,
  ScheduleOption
} from "../domain/types";
import { SchedulePanel } from "./SchedulePanel";

type PartnerAssignmentWorkflowProps = {
  partners: Partner[];
  availabilityRequests: AvailabilityRequest[];
  messageLogs: MessageLog[];
  scheduleOptions: ScheduleOption[];
  onCreateAvailabilityRequest: () => void;
  onSendQueuedMessages: () => void;
  onAddScheduleOption: (input: Omit<ScheduleOption, "id" | "caseId" | "status">) => void;
  onSelectSchedule: (optionId: string) => void;
};

export function PartnerAssignmentWorkflow({
  partners,
  availabilityRequests,
  messageLogs,
  scheduleOptions,
  onCreateAvailabilityRequest,
  onSendQueuedMessages,
  onAddScheduleOption,
  onSelectSchedule
}: PartnerAssignmentWorkflowProps) {
  const latestRequest = availabilityRequests[availabilityRequests.length - 1];
  const queuedMessages = messageLogs.filter((message) => message.status === "queued");
  const activePhotographers = partners.filter(
    (partner) => partner.status === "active" && partner.role === "photographer"
  );

  return (
    <section className="sectionPage" aria-label="提携先アサインロジック">
      <div className="assignmentOps">
        <div>
          <p className="sectionLabel">Assignment Logic</p>
          <h3>空き確認フロー</h3>
          <p>
            提携先DBから対象者を抽出し、LINE/メール通知をキュー化して、回答状況から顧客提示候補を作ります。
          </p>
        </div>
        <div className="shareActionButtons">
          <button type="button" onClick={onCreateAvailabilityRequest}>
            カメラマンへ空き確認
          </button>
          <button
            type="button"
            className="secondaryButton"
            onClick={onSendQueuedMessages}
            disabled={queuedMessages.length === 0}
          >
            キュー通知を送信
          </button>
        </div>
      </div>

      <dl className="detailGrid">
        <div>
          <dt>対象カメラマン</dt>
          <dd>{activePhotographers.length}名</dd>
        </div>
        <div>
          <dt>最新依頼</dt>
          <dd>{latestRequest ? latestRequest.status : "未作成"}</dd>
        </div>
        <div>
          <dt>回答数</dt>
          <dd>{latestRequest ? latestRequest.responses.length : 0}件</dd>
        </div>
        <div>
          <dt>送信待ち通知</dt>
          <dd>{queuedMessages.length}件</dd>
        </div>
      </dl>

      <div className="partnerList" role="list" aria-label="提携先一覧">
        {activePhotographers.map((partner) => (
          <article className="partnerItem" role="listitem" key={partner.id}>
            <div>
              <strong>{partner.name}</strong>
              <span>{partner.tags.join(" / ")}</span>
            </div>
            <a href={partner.portfolioUrl}>Portfolio</a>
          </article>
        ))}
      </div>

      <SchedulePanel
        canManage
        options={scheduleOptions}
        onAddOption={onAddScheduleOption}
        onSelect={onSelectSchedule}
      />
    </section>
  );
}
