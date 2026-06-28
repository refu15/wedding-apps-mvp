import { useRef, useState } from "react";
import { getVisibleWorkspacePanels, type WorkspacePanel } from "../domain/accessControl";
import type {
  Customer,
  CustomerSharePreview,
  Meeting,
  ScheduleOption,
  ShareCopyFeedbackStatus,
  ShareWorkflow,
  UserRole,
  WeddingCase
} from "../domain/types";
import { CustomerPanel } from "./CustomerPanel";
import { DashboardMetrics } from "./DashboardMetrics";
import { MeetingPanel } from "./MeetingPanel";
import { NextActionCenter } from "./NextActionCenter";
import { SchedulePanel } from "./SchedulePanel";
import { ShareActions } from "./ShareActions";
import { SharePreview } from "./SharePreview";

type PlannerWorkspaceProps = {
  role: Exclude<UserRole, "customer">;
  customer: Customer;
  weddingCase: WeddingCase;
  meeting: Meeting;
  scheduleOptions: ScheduleOption[];
  sharePreview: CustomerSharePreview;
  shareWorkflow: ShareWorkflow;
  selectedScheduleLabel: string | null;
  onCustomerSave: (patch: Partial<Customer>) => void;
  onCaseSave: (patch: Partial<WeddingCase>) => void;
  onAddMeeting: (
    input: Pick<Meeting, "title" | "scheduledAt" | "location" | "transcript">
  ) => void;
  onGenerateSummary: () => void;
  onTranscriptChange: (transcript: string) => void;
  onAddScheduleOption: (input: Omit<ScheduleOption, "id" | "caseId" | "status">) => void;
  onSelectSchedule: (optionId: string) => void;
  onApproveShare: () => void;
  onSendShare: () => void;
  onCopyFeedback: (status: ShareCopyFeedbackStatus) => void;
};

export function PlannerWorkspace({
  role,
  customer,
  weddingCase,
  meeting,
  scheduleOptions,
  sharePreview,
  shareWorkflow,
  selectedScheduleLabel,
  onCustomerSave,
  onCaseSave,
  onAddMeeting,
  onGenerateSummary,
  onTranscriptChange,
  onAddScheduleOption,
  onSelectSchedule,
  onApproveShare,
  onSendShare,
  onCopyFeedback
}: PlannerWorkspaceProps) {
  const visiblePanels = getVisibleWorkspacePanels(role);
  const [activePanel, setActivePanel] = useState<WorkspacePanel>("customer");
  const panelRefs = useRef<Partial<Record<WorkspacePanel, HTMLDivElement | null>>>({});

  const goToPanel = (panel: WorkspacePanel) => {
    setActivePanel(panel);
    window.requestAnimationFrame(() => {
      const target = panelRefs.current[panel];
      target?.scrollIntoView({ block: "start", behavior: "smooth" });
      target?.focus({ preventScroll: true });
    });
  };

  const handleCopyShareText = async () => {
    const shareText = [
      `${sharePreview.customer.primaryName}様 / ${sharePreview.customer.partnerName}様`,
      sharePreview.case.title,
      `会場候補: ${sharePreview.case.venueCandidate}`,
      `共有メモ: ${sharePreview.meeting.publicNotes.join(" / ")}`,
      `日程候補: ${scheduleOptions.map((option) => option.label).join(", ")}`
    ].join("\n");

    if (!navigator.clipboard) {
      onCopyFeedback("unavailable");
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      onCopyFeedback("copied");
    } catch {
      onCopyFeedback("failed");
    }
  };

  return (
    <>
      <NextActionCenter
        meeting={meeting}
        selectedScheduleLabel={selectedScheduleLabel}
        shareWorkflow={shareWorkflow}
        onGoToMeeting={() => goToPanel("meeting")}
        onGoToShare={() => goToPanel("sharePreview")}
        onGoToSchedule={() => goToPanel("schedule")}
      />

      <DashboardMetrics
        meeting={meeting}
        scheduleOptions={scheduleOptions}
        sharePreview={sharePreview}
        role={role}
      />

      <nav className="mobileTabs" aria-label="表示セクション">
        {visiblePanels.map((panel) => (
          <button
            type="button"
            key={panel}
            className={activePanel === panel ? "mobileTab active" : "mobileTab"}
            aria-pressed={activePanel === panel}
            onClick={() => goToPanel(panel)}
          >
            {panelLabels[panel]}
          </button>
        ))}
      </nav>

      <section className="workspaceGrid" aria-label="プランナー業務フロー">
        <div
          ref={(node) => {
            panelRefs.current.customer = node;
          }}
          className={getPanelSlotClass(activePanel, "customer")}
          tabIndex={-1}
        >
          <CustomerPanel
            customer={customer}
            weddingCase={weddingCase}
            onCustomerSave={onCustomerSave}
            onCaseSave={onCaseSave}
          />
        </div>
        <div
          ref={(node) => {
            panelRefs.current.meeting = node;
          }}
          className={`${getPanelSlotClass(activePanel, "meeting")} wideSlot`}
          tabIndex={-1}
        >
          <MeetingPanel
            meeting={meeting}
            onAddMeeting={onAddMeeting}
            onGenerateSummary={onGenerateSummary}
            onTranscriptChange={onTranscriptChange}
          />
        </div>
        <div
          ref={(node) => {
            panelRefs.current.sharePreview = node;
          }}
          className={getPanelSlotClass(activePanel, "sharePreview")}
          tabIndex={-1}
        >
          <SharePreview preview={sharePreview} />
          <ShareActions
            shareWorkflow={shareWorkflow}
            onApprove={onApproveShare}
            onSend={onSendShare}
            onCopy={handleCopyShareText}
          />
        </div>
        <div
          ref={(node) => {
            panelRefs.current.schedule = node;
          }}
          className={getPanelSlotClass(activePanel, "schedule")}
          tabIndex={-1}
        >
          <SchedulePanel
            canManage
            options={scheduleOptions}
            onAddOption={onAddScheduleOption}
            onSelect={onSelectSchedule}
          />
        </div>
      </section>
    </>
  );
}

const panelLabels: Record<WorkspacePanel, string> = {
  customer: "顧客",
  meeting: "打合せ",
  sharePreview: "共有",
  schedule: "日程"
};

function getPanelSlotClass(activePanel: WorkspacePanel, panel: WorkspacePanel): string {
  return activePanel === panel ? "panelSlot" : "panelSlot mobilePanelHidden";
}
