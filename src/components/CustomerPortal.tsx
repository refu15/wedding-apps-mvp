import { useState } from "react";
import type { WorkspacePanel } from "../domain/accessControl";
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

type CustomerPanel = Extract<WorkspacePanel, "sharePreview" | "schedule">;

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
          <h2>内容確認と日程選択</h2>
          <p>
            共有内容を確認したうえで、次回打ち合わせの日程を選択してください。
          </p>
        </div>
        <dl className="customerStatusList">
          <div>
            <dt>共有内容</dt>
            <dd>{shareStatusLabel(shareWorkflow)}</dd>
          </div>
          <div>
            <dt>選択日程</dt>
            <dd>{selectedScheduleLabel ?? "未選択"}</dd>
          </div>
        </dl>
      </section>

      <nav className="mobileTabs" aria-label="表示セクション">
        <button
          type="button"
          className={activePanel === "sharePreview" ? "mobileTab active" : "mobileTab"}
          aria-pressed={activePanel === "sharePreview"}
          onClick={() => setActivePanel("sharePreview")}
        >
          共有
        </button>
        <button
          type="button"
          className={activePanel === "schedule" ? "mobileTab active" : "mobileTab"}
          aria-pressed={activePanel === "schedule"}
          onClick={() => setActivePanel("schedule")}
        >
          日程
        </button>
      </nav>

      <section className="workspaceGrid customerPortalGrid" aria-label="顧客向け手続き">
        <div className={getPanelSlotClass(activePanel, "sharePreview")}>
          <SharePreview preview={preview} />
        </div>
        <div className={getPanelSlotClass(activePanel, "schedule")}>
          <SchedulePanel
            canManage={false}
            options={scheduleOptions}
            onAddOption={() => undefined}
            onSelect={onSelectSchedule}
          />
        </div>
      </section>
    </>
  );
}

function getPanelSlotClass(activePanel: CustomerPanel, panel: CustomerPanel): string {
  return activePanel === panel ? "panelSlot" : "panelSlot mobilePanelHidden";
}
