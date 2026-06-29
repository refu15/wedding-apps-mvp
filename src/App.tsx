import { useMemo, useState } from "react";
import { CustomerPortal } from "./components/CustomerPortal";
import { PlannerWorkspace } from "./components/PlannerWorkspace";
import { generateMockAiSummary } from "./domain/aiSummary";
import {
  addScheduleOptionToState,
  approveShareWorkflow,
  getSelectedCase,
  getSelectedCustomer,
  getSelectedMeeting,
  grantRecordingConsentForSelectedMeeting,
  markShareCopyFeedback,
  requestPartnerAvailabilityForState,
  selectScheduleOptionForState,
  sendQueuedMessagesForState,
  sendShareWorkflow,
  syncSelectedMeetingToDrive,
  updateCase,
  updateCustomer,
  updateMeeting,
} from "./domain/appState";
import { canGenerateAiSummary } from "./domain/permissions";
import { createSharePreview } from "./domain/sharePreview";
import type { Customer, UserRole, WeddingCase } from "./domain/types";
import { usePersistentState } from "./hooks/usePersistentState";

export default function App() {
  const [state, setState] = usePersistentState();
  const [role, setRole] = useState<UserRole>("admin");
  const customer = getSelectedCustomer(state);
  const weddingCase = getSelectedCase(state);
  const meeting = getSelectedMeeting(state);
  const scheduleOptions = state.scheduleOptions.filter(
    (option) => option.caseId === state.selectedCaseId
  );
  const selectedSchedule = scheduleOptions.find((option) => option.status === "selected");

  const sharePreview = useMemo(
    () => createSharePreview(customer, weddingCase, meeting),
    [customer, weddingCase, meeting]
  );

  const handleGenerateSummary = () => {
    if (!canGenerateAiSummary(meeting)) {
      return;
    }

    setState((current) =>
      updateMeeting(current, {
        ...meeting,
        summary: generateMockAiSummary(meeting.transcript)
      })
    );
  };

  return (
    <main className="appShell">
      <header className={role === "customer" ? "pageHeader customerHeader" : "pageHeader"}>
        <div>
          <p className="eyebrow">Wedding Crew Phase 1 MVP</p>
          <h1>{role === "customer" ? "ご相談内容の確認" : "松本様案件ワークスペース"}</h1>
        </div>
        <div className="headerControls">
          <label htmlFor="role">デモ表示</label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
          >
            <option value="admin">管理者</option>
            <option value="planner">プランナー</option>
            <option value="customer">顧客共有</option>
          </select>
          {role !== "customer" ? (
            <div className="headerBadge">localStorage保存 / 外部API未接続</div>
          ) : null}
        </div>
      </header>

      {role === "customer" ? (
        <CustomerPortal
          preview={sharePreview}
          scheduleOptions={scheduleOptions}
          shareWorkflow={state.shareWorkflow}
          selectedScheduleLabel={selectedSchedule?.label ?? null}
          onSelectSchedule={(optionId) =>
            setState((current) => selectScheduleOptionForState(current, optionId))
          }
        />
      ) : (
        <PlannerWorkspace
          role={role}
          customer={customer}
          weddingCase={weddingCase}
          meeting={meeting}
          scheduleOptions={scheduleOptions}
          driveAssets={state.driveAssets}
          consentLogs={state.consentLogs}
          partners={state.partners}
          availabilityRequests={state.availabilityRequests}
          messageLogs={state.messageLogs}
          auditLogs={state.auditLogs}
          operationalErrors={state.operationalErrors}
          integrationStatus={state.integrationStatus}
          sharePreview={sharePreview}
          shareWorkflow={state.shareWorkflow}
          selectedScheduleLabel={selectedSchedule?.label ?? null}
          onCustomerSave={(patch: Partial<Customer>) =>
            setState((current) => updateCustomer(current, customer.id, patch))
          }
          onCaseSave={(patch: Partial<WeddingCase>) =>
            setState((current) => updateCase(current, weddingCase.id, patch))
          }
          onGenerateSummary={handleGenerateSummary}
          onSyncDrive={() => setState((current) => syncSelectedMeetingToDrive(current))}
          onGrantConsent={() =>
            setState((current) =>
              grantRecordingConsentForSelectedMeeting(current, customer.primaryName)
            )
          }
          onCreateAvailabilityRequest={() =>
            setState((current) =>
              requestPartnerAvailabilityForState(
                current,
                "photographer",
                weddingCase.weddingDate
                  ? `${weddingCase.weddingDate}T10:00:00+09:00`
                  : "2027-04-18T10:00:00+09:00",
                "2026-07-09T18:00:00+09:00"
              )
            )
          }
          onSendQueuedMessages={() =>
            setState((current) => sendQueuedMessagesForState(current))
          }
          onAddScheduleOption={(input) =>
            setState((current) => addScheduleOptionToState(current, input))
          }
          onSelectSchedule={(optionId) =>
            setState((current) => selectScheduleOptionForState(current, optionId))
          }
          onApproveShare={() => setState((current) => approveShareWorkflow(current))}
          onSendShare={() => setState((current) => sendShareWorkflow(current))}
          onCopyFeedback={(status) =>
            setState((current) => markShareCopyFeedback(current, status))
          }
        />
      )}
    </main>
  );
}
