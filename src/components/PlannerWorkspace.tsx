import { useRef, useState } from "react";
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
import { DriveEvidencePanel } from "./DriveEvidencePanel";
import { NextActionCenter } from "./NextActionCenter";
import { SchedulePanel } from "./SchedulePanel";
import { ShareActions } from "./ShareActions";
import { SharePreview } from "./SharePreview";

type PlannerSection = "overview" | "drive" | "share" | "assignment";

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
  onGenerateSummary: () => void;
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
  onGenerateSummary,
  onAddScheduleOption,
  onSelectSchedule,
  onApproveShare,
  onSendShare,
  onCopyFeedback
}: PlannerWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<PlannerSection>("overview");
  const pageRef = useRef<HTMLDivElement | null>(null);

  const goToSection = (section: PlannerSection) => {
    setActiveSection(section);
    window.requestAnimationFrame(() => {
      pageRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      pageRef.current?.focus({ preventScroll: true });
    });
  };

  const handleCopyShareText = async () => {
    const shareText = [
      `${sharePreview.customer.primaryName}様 / ${sharePreview.customer.partnerName}様`,
      sharePreview.case.title,
      `会場候補: ${sharePreview.case.venueCandidate}`,
      `共有メモ: ${sharePreview.meeting.publicNotes.join(" / ")}`,
      `候補者: ${scheduleOptions.map((option) => option.label).join(", ")}`
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
      <nav className="sectionTabs" aria-label="業務セクション">
        {plannerSections.map((section) => (
          <button
            type="button"
            key={section.id}
            className={activeSection === section.id ? "sectionTab active" : "sectionTab"}
            aria-pressed={activeSection === section.id}
            onClick={() => goToSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div ref={pageRef} className="sectionPageFrame" tabIndex={-1}>
        {activeSection === "overview" ? (
          <section className="sectionPage" aria-label="案件概要">
            <NextActionCenter
              meeting={meeting}
              selectedScheduleLabel={selectedScheduleLabel}
              shareWorkflow={shareWorkflow}
              onGoToDrive={() => goToSection("drive")}
              onGoToShare={() => goToSection("share")}
              onGoToAssignment={() => goToSection("assignment")}
            />
            <DashboardMetrics
              meeting={meeting}
              scheduleOptions={scheduleOptions}
              sharePreview={sharePreview}
              role={role}
            />
            <CustomerPanel
              customer={customer}
              weddingCase={weddingCase}
              onCustomerSave={onCustomerSave}
              onCaseSave={onCaseSave}
            />
          </section>
        ) : null}

        {activeSection === "drive" ? (
          <DriveEvidencePanel meeting={meeting} onGenerateSummary={onGenerateSummary} />
        ) : null}

        {activeSection === "share" ? (
          <section className="sectionPage" aria-label="顧客共有">
            <SharePreview preview={sharePreview} />
            <ShareActions
              shareWorkflow={shareWorkflow}
              onApprove={onApproveShare}
              onSend={onSendShare}
              onCopy={handleCopyShareText}
            />
          </section>
        ) : null}

        {activeSection === "assignment" ? (
          <section className="sectionPage" aria-label="提携先アサイン">
            <div className="sectionHero">
              <p className="sectionLabel">Partner Assignment</p>
              <h2>空き確認と仮押さえ</h2>
              <p>
                元資料の課題は、顧客の日程調整だけではなく、カメラマン等の提携先に一括で空き確認し、
                候補者を顧客が選べる状態にすることです。
              </p>
            </div>
            <SchedulePanel
              canManage
              options={scheduleOptions}
              onAddOption={onAddScheduleOption}
              onSelect={onSelectSchedule}
            />
          </section>
        ) : null}
      </div>
    </>
  );
}

const plannerSections: Array<{ id: PlannerSection; label: string }> = [
  { id: "overview", label: "概要" },
  { id: "drive", label: "Drive" },
  { id: "share", label: "共有" },
  { id: "assignment", label: "アサイン" }
];
