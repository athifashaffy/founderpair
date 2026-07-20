import type {
  DimensionScores,
  FounderProfile,
  MatchExplanation,
} from "../domain/types";

export type ExplanationInput = {
  seeker: FounderProfile;
  candidate: FounderProfile;
  scores: DimensionScores;
};

function isExplanation(value: unknown): value is MatchExplanation {
  if (!value || typeof value !== "object") return false;
  const explanation = value as Partial<MatchExplanation>;
  return (
    typeof explanation.summary === "string" &&
    explanation.summary.trim().length > 0 &&
    Array.isArray(explanation.strengths) &&
    explanation.strengths.length >= 2 &&
    explanation.strengths.length <= 3 &&
    explanation.strengths.every(
      (strength) => typeof strength === "string" && strength.trim().length > 0,
    ) &&
    typeof explanation.friction === "string" &&
    explanation.friction.trim().length > 0 &&
    Array.isArray(explanation.questions) &&
    explanation.questions.length === 3 &&
    explanation.questions.every(
      (question) => typeof question === "string" && question.trim().length > 0,
    )
  );
}

export async function getMatchExplanation(
  input: ExplanationInput,
  fallback: MatchExplanation,
  fetcher: typeof fetch = fetch,
): Promise<MatchExplanation> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6_000);

  try {
    const response = await fetcher(`${import.meta.env.BASE_URL}api/explain.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    if (!response.ok) return fallback;
    const payload: unknown = await response.json();
    return isExplanation(payload) ? payload : fallback;
  } catch {
    return fallback;
  } finally {
    window.clearTimeout(timeout);
  }
}
