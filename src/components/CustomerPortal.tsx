import { useState } from "react";
import type {
  CustomerSharePreview,
  ScheduleOption,
  ShareWorkflow
} from "../domain/types";
import { SchedulePanel } from "./SchedulePanel";
import { SharePreview } from "./SharePreview";
import { shareStatusLabel } from "./NextActionCenter";

type CustomerPortalProps = {
  preview: CustomerSharePreview;
  scheduleOptions: ScheduleOption[];
  shareWorkflow: ShareWorkflow;
  selectedScheduleLabel: string | null;
  onSelectSchedule: (optionId: string) => void;
};

type CustomerPanel = "sharePreview" | "schedule";

export function CustomerPortal({
  preview,
  scheduleOptions,
  shareWorkflow,
  selectedScheduleLabel,
  onSelectSchedule
}: CustomerPortalProps) {
  const [activePanel, setActivePanel] = useState<CustomerPanel>("sharePreview");

  return (
    <>
      <section className="customerNextStep" aria-label="次の手続き">
        <div>
          <p className="sectionLabel">Next Step</p>
          <h2>内容確認と候補選択</h2>
          <p>
            共有内容を確認したうえで、提携先候補と候補枠を選択してください。
          </p>
        </div>
        <dl className="customerStatusList">
          <div>
            <dt>共有内容</dt>
            <dd>{shareStatusLabel(shareWorkflow)}</dd>
          </div>
          <div>
            <dt>選択候補</dt>
            <dd>{selectedScheduleLabel ?? "未選択"}</dd>
          </div>
        </dl>
      </section>

      <nav className="sectionTabs" aria-label="表示セクション">
        <button
          type="button"
          className={activePanel === "sharePreview" ? "sectionTab active" : "sectionTab"}
          aria-pressed={activePanel === "sharePreview"}
          onClick={() => setActivePanel("sharePreview")}
        >
          共有
        </button>
        <button
          type="button"
          className={activePanel === "schedule" ? "sectionTab active" : "sectionTab"}
          aria-pressed={activePanel === "schedule"}
          onClick={() => setActivePanel("schedule")}
        >
          候補
        </button>
      </nav>

      <section className="sectionPageFrame" aria-label="顧客向け手続き">
        {activePanel === "sharePreview" ? (
          <div className="sectionPage">
            <SharePreview preview={preview} />
          </div>
        ) : null}
        {activePanel === "schedule" ? (
          <div className="sectionPage">
            <SchedulePanel
              canManage={false}
              options={scheduleOptions}
              onAddOption={() => undefined}
              onSelect={onSelectSchedule}
            />
          </div>
        ) : null}
      </section>
    </>
  );
}
