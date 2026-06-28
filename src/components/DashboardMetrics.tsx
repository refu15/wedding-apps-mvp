import type { CustomerSharePreview, Meeting, ScheduleOption, UserRole } from "../domain/types";

type DashboardMetricsProps = {
  meeting: Meeting;
  scheduleOptions: ScheduleOption[];
  sharePreview: CustomerSharePreview;
  role: UserRole;
};

export function DashboardMetrics({
  meeting,
  scheduleOptions,
  sharePreview,
  role
}: DashboardMetricsProps) {
  const selected = scheduleOptions.find((option) => option.status === "selected");

  return (
    <section className="metrics" aria-label="MVP状態">
      <Metric label="録音同意" value={meeting.recordingConsent.status} />
      <Metric label="AI要約" value={meeting.summary ? "生成済み" : "未生成"} />
      <Metric
        label="共有情報"
        value={`${sharePreview.meeting.publicNotes.length}件の公開メモ`}
      />
      <Metric label="ロール" value={role} />
      <Metric label="選択日程" value={selected?.label ?? "未選択"} />
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
