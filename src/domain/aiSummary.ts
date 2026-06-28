import type { AiSummary } from "./types";

const decisionPrefixes = ["決定:", "決定：", "決まり:", "決まり："];
const openQuestionPrefixes = ["未決:", "未決：", "確認:", "確認："];
const taskPrefixes = ["宿題:", "宿題：", "TODO:", "TODO：", "タスク:", "タスク："];
const preferencePrefixes = ["メモ:", "メモ：", "好み:", "好み：", "希望:", "希望："];

function stripPrefix(line: string, prefixes: string[]): string | null {
  const prefix = prefixes.find((candidate) => line.startsWith(candidate));

  if (!prefix) {
    return null;
  }

  return line.slice(prefix.length).trim();
}

export function generateMockAiSummary(transcript: string): AiSummary {
  const summary: AiSummary = {
    decisions: [],
    openQuestions: [],
    tasks: [],
    preferences: []
  };

  for (const rawLine of transcript.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const decision = stripPrefix(line, decisionPrefixes);
    const openQuestion = stripPrefix(line, openQuestionPrefixes);
    const task = stripPrefix(line, taskPrefixes);
    const preference = stripPrefix(line, preferencePrefixes);

    if (decision) {
      summary.decisions.push(decision);
    } else if (openQuestion) {
      summary.openQuestions.push(openQuestion);
    } else if (task) {
      summary.tasks.push(task);
    } else if (preference) {
      summary.preferences.push(preference);
    }
  }

  if (
    summary.decisions.length === 0 &&
    summary.openQuestions.length === 0 &&
    summary.tasks.length === 0
  ) {
    summary.openQuestions.push("担当者が全文を確認して未決事項を確定する");
    summary.tasks.push("AI要約モックの結果を人間がレビューする");
  }

  return summary;
}
