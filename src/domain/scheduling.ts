import type { ScheduleOption } from "./types";

type ScheduleOptionInput = Omit<ScheduleOption, "id" | "status">;

export function createScheduleOption(input: ScheduleOptionInput): ScheduleOption {
  return {
    ...input,
    id: [
      "schedule",
      input.caseId,
      input.startsAt.replace(/[^0-9]/g, ""),
      input.channel
    ].join("-"),
    status: "pending"
  };
}

export function selectScheduleOption(
  options: ScheduleOption[],
  selectedOptionId: string
): ScheduleOption[] {
  const selected = options.find((option) => option.id === selectedOptionId);

  if (!selected) {
    throw new Error("選択対象の日程候補が見つかりません。");
  }

  return options.map((option) => {
    if (option.caseId !== selected.caseId) {
      return option;
    }

    return {
      ...option,
      status: option.id === selectedOptionId ? "selected" : "declined"
    };
  });
}
