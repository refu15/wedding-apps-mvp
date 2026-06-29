import type {
  AuditLog,
  AvailabilityRequest,
  DriveAsset,
  IntegrationStatus,
  MessageLog,
  OperationalError
} from "../domain/types";

type WorkflowLogicPanelProps = {
  driveAssets: DriveAsset[];
  availabilityRequests: AvailabilityRequest[];
  messageLogs: MessageLog[];
  auditLogs: AuditLog[];
  operationalErrors: OperationalError[];
  integrationStatus: IntegrationStatus;
};

export function WorkflowLogicPanel({
  driveAssets,
  availabilityRequests,
  messageLogs,
  auditLogs,
  operationalErrors,
  integrationStatus
}: WorkflowLogicPanelProps) {
  const openErrors = operationalErrors.filter((error) => error.status === "open");

  return (
    <section className="panel" aria-label="実装済みロジック">
      <div className="panelHeader">
        <div>
          <p className="sectionLabel">Logic Status</p>
          <h2>実装済みロジック</h2>
        </div>
        <span className="statusPill">localStorage永続化</span>
      </div>

      <dl className="detailGrid compact">
        <div>
          <dt>Google Drive</dt>
          <dd>{statusLabel(integrationStatus.drive)} / {driveAssets.length}件</dd>
        </div>
        <div>
          <dt>AI要約</dt>
          <dd>{statusLabel(integrationStatus.ai)}</dd>
        </div>
        <div>
          <dt>LINE・メール</dt>
          <dd>{statusLabel(integrationStatus.messaging)} / {messageLogs.length}件</dd>
        </div>
        <div>
          <dt>アサイン</dt>
          <dd>{availabilityRequests.length}件の空き確認</dd>
        </div>
        <div>
          <dt>監査ログ</dt>
          <dd>{auditLogs.length}件</dd>
        </div>
        <div>
          <dt>未解決エラー</dt>
          <dd>{openErrors.length}件</dd>
        </div>
      </dl>
    </section>
  );
}

function statusLabel(status: IntegrationStatus[keyof IntegrationStatus]): string {
  const labels: Record<IntegrationStatus[keyof IntegrationStatus], string> = {
    mock_connected: "モック接続",
    needs_backend: "バックエンド接続待ち",
    local_storage: "ブラウザ保存"
  };

  return labels[status];
}
