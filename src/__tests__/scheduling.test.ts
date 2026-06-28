import { describe, expect, it } from "vitest";
import { createScheduleOption, selectScheduleOption } from "../domain/scheduling";
import type { ScheduleOption } from "../domain/types";

describe("scheduling", () => {
  it("creates schedule options with a pending status", () => {
    const option = createScheduleOption({
      caseId: "case-1",
      startsAt: "2026-07-10T13:00:00+09:00",
      endsAt: "2026-07-10T14:00:00+09:00",
      channel: "mock_line",
      label: "7/10 13:00"
    });

    expect(option.status).toBe("pending");
    expect(option.id).toContain("schedule-case-1");
  });

  it("keeps only one selected option per case", () => {
    const options: ScheduleOption[] = [
      createScheduleOption({
        caseId: "case-1",
        startsAt: "2026-07-10T13:00:00+09:00",
        endsAt: "2026-07-10T14:00:00+09:00",
        channel: "mock_line",
        label: "7/10 13:00"
      }),
      createScheduleOption({
        caseId: "case-1",
        startsAt: "2026-07-11T15:00:00+09:00",
        endsAt: "2026-07-11T16:00:00+09:00",
        channel: "mock_line",
        label: "7/11 15:00"
      })
    ];

    const updated = selectScheduleOption(options, options[1].id);

    expect(updated.filter((option) => option.status === "selected")).toHaveLength(1);
    expect(updated[1].status).toBe("selected");
    expect(updated[0].status).toBe("declined");
  });
});
