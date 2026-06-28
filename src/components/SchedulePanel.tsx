import { useState } from "react";
import type { ScheduleOption } from "../domain/types";

type SchedulePanelProps = {
  options: ScheduleOption[];
  canManage: boolean;
  onAddOption: (input: Omit<ScheduleOption, "id" | "caseId" | "status">) => void;
  onSelect: (optionId: string) => void;
};

export function SchedulePanel({
  options,
  canManage,
  onAddOption,
  onSelect
}: SchedulePanelProps) {
  const [label, setLabel] = useState("7/22 14:00");
  const [startsAt, setStartsAt] = useState("2026-07-22T14:00");
  const [endsAt, setEndsAt] = useState("2026-07-22T15:00");
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);
  const pendingOption = options.find((option) => option.id === pendingOptionId);
  const selectedOption = options.find((option) => option.status === "selected");

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <p className="sectionLabel">LINE Availability</p>
          <h2>提携先アサイン</h2>
        </div>
        <span className="statusPill">空き確認モック</span>
      </div>

      <div className="scheduleList" role="list" aria-label="アサイン候補">
        {options.map((option) => (
          <div
            className={option.id === pendingOptionId ? "scheduleItem pending" : "scheduleItem"}
            role="listitem"
            key={option.id}
          >
            <div>
              <strong>{option.label}</strong>
              <span>
                {new Date(option.startsAt).toLocaleString("ja-JP")} -{" "}
                {new Date(option.endsAt).toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
              <span>
                {option.channel === "mock_line"
                  ? "LINEで提携先に一括確認し、仮押さえ候補として提示します。"
                  : "メールで補足確認する候補です。"}
              </span>
            </div>
            <button
              type="button"
              className={option.status === "selected" ? "selectedButton" : ""}
              onClick={() => setPendingOptionId(option.id)}
              disabled={option.status === "selected"}
            >
              {option.status === "selected" ? "仮押さえ中" : "候補を確認"}
            </button>
          </div>
        ))}
      </div>

      <div className="confirmationPanel" aria-live="polite">
        <div>
          <p className="sectionLabel">Confirm</p>
          <h3>仮押さえ前の確認</h3>
          <p>
            {pendingOption
              ? `${pendingOption.label} を選択中です。仮押さえ後、空いている提携先とポートフォリオを顧客へ提示します。`
              : selectedOption
                ? `${selectedOption.label} を仮押さえ中です。変更する場合は別候補を確認してください。`
                : "候補を選ぶと、ここに仮押さえ前の確認が表示されます。"}
          </p>
        </div>
        <div className="confirmationActions">
          <button
            type="button"
            onClick={() => {
              if (pendingOption) {
                onSelect(pendingOption.id);
                setPendingOptionId(null);
              }
            }}
            disabled={!pendingOption}
          >
            仮押さえする
          </button>
          <button
            type="button"
            className="secondaryButton"
            onClick={() => setPendingOptionId(null)}
            disabled={!pendingOption}
          >
            取り消し
          </button>
        </div>
      </div>

      {canManage ? (
        <details className="disclosureForm">
          <summary>空き確認候補を追加</summary>
          <form
            className="editForm"
            onSubmit={(event) => {
              event.preventDefault();
              onAddOption({
                label,
                startsAt: new Date(startsAt).toISOString(),
                endsAt: new Date(endsAt).toISOString(),
                channel: "mock_line"
              });
            }}
          >
            <label>
              候補ラベル
              <input value={label} onChange={(event) => setLabel(event.target.value)} />
            </label>
            <label>
              開始
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
              />
            </label>
            <label>
              終了
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(event) => setEndsAt(event.target.value)}
              />
            </label>
            <button type="submit">空き確認候補を追加</button>
          </form>
        </details>
      ) : null}
    </section>
  );
}
