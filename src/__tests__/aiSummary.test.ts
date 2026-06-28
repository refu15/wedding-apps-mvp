import { describe, expect, it } from "vitest";
import { generateMockAiSummary } from "../domain/aiSummary";

describe("generateMockAiSummary", () => {
  it("classifies decisions, open questions, and tasks from transcript text", () => {
    const summary = generateMockAiSummary(`
決定: 初回相談はオンラインで実施する。
未決: 会場候補は次回までに確認する。
宿題: 櫻井が見積のたたき台を作成する。
メモ: 写真はナチュラルな雰囲気が好み。
`);

    expect(summary.decisions).toEqual(["初回相談はオンラインで実施する。"]);
    expect(summary.openQuestions).toEqual(["会場候補は次回までに確認する。"]);
    expect(summary.tasks).toEqual(["櫻井が見積のたたき台を作成する。"]);
    expect(summary.preferences).toEqual(["写真はナチュラルな雰囲気が好み。"]);
  });

  it("falls back to a review note when no structured lines exist", () => {
    const summary = generateMockAiSummary("今日はサロンと日程調整について話しました。");

    expect(summary.decisions).toEqual([]);
    expect(summary.openQuestions).toEqual(["担当者が全文を確認して未決事項を確定する"]);
    expect(summary.tasks).toEqual(["AI要約モックの結果を人間がレビューする"]);
  });
});
