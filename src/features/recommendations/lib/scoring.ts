export type ScoreDimensionKey =
  | "audienceFit"
  | "brandFit"
  | "geographicFit"
  | "activationFit"
  | "budgetFit"
  | "timingFeasibility";

export type ScoreWeights = Record<ScoreDimensionKey, number>;

export interface RecommendationDerivedScoreInput {
  audienceFitScore?: number | null;
  brandFitScore?: number | null;
  geographicFitScore?: number | null;
  activationFitScore?: number | null;
  budgetFitScore?: number | null;
  timingFeasibilityScore?: number | null;
}

export interface ScoringComputationResult {
  weightedCompositeScore: number | null;
  confidenceScore: number | null;
  normalizedWeights: ScoreWeights;
  scoredDimensionCount: number;
}

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  audienceFit: 0.22,
  brandFit: 0.18,
  geographicFit: 0.16,
  activationFit: 0.18,
  budgetFit: 0.14,
  timingFeasibility: 0.12,
};

const SCORE_KEYS: ScoreDimensionKey[] = [
  "audienceFit",
  "brandFit",
  "geographicFit",
  "activationFit",
  "budgetFit",
  "timingFeasibility",
];

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function toScore(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return clampScore(value);
}

function normalizeWeights(weights: ScoreWeights): ScoreWeights {
  const total = SCORE_KEYS.reduce((sum, key) => sum + weights[key], 0);

  if (total <= 0) {
    return DEFAULT_SCORE_WEIGHTS;
  }

  return SCORE_KEYS.reduce((normalized, key) => {
    normalized[key] = weights[key] / total;
    return normalized;
  }, {} as ScoreWeights);
}

function getScoredDimensions(input: RecommendationDerivedScoreInput, weights: ScoreWeights) {
  const valueByKey: Record<ScoreDimensionKey, number | null> = {
    audienceFit: toScore(input.audienceFitScore),
    brandFit: toScore(input.brandFitScore),
    geographicFit: toScore(input.geographicFitScore),
    activationFit: toScore(input.activationFitScore),
    budgetFit: toScore(input.budgetFitScore),
    timingFeasibility: toScore(input.timingFeasibilityScore),
  };

  return SCORE_KEYS.map((key) => ({
    key,
    value: valueByKey[key],
    weight: weights[key],
  })).filter(
    (dimension): dimension is { key: ScoreDimensionKey; value: number; weight: number } =>
      dimension.value !== null
  );
}

export function calculateCompositeFitScore(
  input: RecommendationDerivedScoreInput,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
) {
  const normalizedWeights = normalizeWeights(weights);
  const scoredDimensions = getScoredDimensions(input, normalizedWeights);

  if (!scoredDimensions.length) {
    return null;
  }

  const appliedWeight = scoredDimensions.reduce((total, dimension) => total + dimension.weight, 0);

  if (appliedWeight <= 0) {
    return null;
  }

  const weightedScore = scoredDimensions.reduce(
    (total, dimension) => total + dimension.value * dimension.weight,
    0
  );

  return Number((weightedScore / appliedWeight).toFixed(2));
}

export function calculateConfidenceScore(input: RecommendationDerivedScoreInput) {
  const scoredDimensionCount = getScoredDimensions(input, DEFAULT_SCORE_WEIGHTS).length;

  if (scoredDimensionCount === 0) {
    return null;
  }

  return Number(((scoredDimensionCount / SCORE_KEYS.length) * 100).toFixed(2));
}

export function computeScoringResult(
  input: RecommendationDerivedScoreInput,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): ScoringComputationResult {
  const normalizedWeights = normalizeWeights(weights);
  const scoredDimensionCount = getScoredDimensions(input, normalizedWeights).length;

  return {
    weightedCompositeScore: calculateCompositeFitScore(input, normalizedWeights),
    confidenceScore: calculateConfidenceScore(input),
    normalizedWeights,
    scoredDimensionCount,
  };
}

export function normalizeMatchTags(tags: string[] | null | undefined) {
  if (!Array.isArray(tags)) {
    return [] as string[];
  }

  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)
    )
  ).sort();
}