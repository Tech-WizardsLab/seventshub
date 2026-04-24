export interface TimelineInput {
  now: Date;
  eventStartDate: Date | null;
  sponsorshipSalesDeadline: Date | null;
  activationLockDate: Date | null;
  assetDeliveryDeadline: Date | null;
  logisticsCutoffDate: Date | null;
}

export interface BudgetCompatibilityInput {
  sponsorMinBudgetEur: number | null;
  sponsorMaxBudgetEur: number | null;
  packagePriceMinEur: number | null;
  packagePriceMaxEur: number | null;
}

export interface ActivationSignalInput {
  preferredActivationTypes: string[];
  availableActivationTags: string[];
}

function daysUntil(from: Date, to: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((to.getTime() - from.getTime()) / msPerDay);
}

function midpoint(min: number | null, max: number | null) {
  if (typeof min === "number" && typeof max === "number") {
    return (min + max) / 2;
  }

  if (typeof min === "number") {
    return min;
  }

  if (typeof max === "number") {
    return max;
  }

  return null;
}

export function calculateTimelineFeasibility(input: TimelineInput) {
  const checkpoints = [
    input.sponsorshipSalesDeadline,
    input.activationLockDate,
    input.assetDeliveryDeadline,
    input.logisticsCutoffDate,
    input.eventStartDate,
  ].filter((date): date is Date => Boolean(date));

  if (!checkpoints.length) {
    return { isFeasible: null, daysBuffer: null, score: null as number | null };
  }

  const minimumDays = Math.min(...checkpoints.map((date) => daysUntil(input.now, date)));
  const isFeasible = minimumDays >= 0;

  if (!isFeasible) {
    return { isFeasible, daysBuffer: minimumDays, score: 0 };
  }

  const capped = Math.min(60, minimumDays);
  const score = Number(((capped / 60) * 100).toFixed(2));

  return {
    isFeasible,
    daysBuffer: minimumDays,
    score,
  };
}

export function calculateBudgetCompatibility(input: BudgetCompatibilityInput) {
  const sponsorMid = midpoint(input.sponsorMinBudgetEur, input.sponsorMaxBudgetEur);
  const packageMid = midpoint(input.packagePriceMinEur, input.packagePriceMaxEur);

  if (sponsorMid === null || packageMid === null || sponsorMid <= 0 || packageMid < 0) {
    return {
      sponsorBudgetMidEur: sponsorMid,
      ratio: null as number | null,
      score: null as number | null,
    };
  }

  const ratioRaw = packageMid / sponsorMid;
  const ratio = Number(Math.max(0, Math.min(1.5, ratioRaw)).toFixed(4));

  const distance = Math.abs(1 - ratio);
  const score = Number((Math.max(0, 1 - distance) * 100).toFixed(2));

  return {
    sponsorBudgetMidEur: sponsorMid,
    ratio,
    score,
  };
}

export function calculateActivationSignalStrength(input: ActivationSignalInput) {
  const preferred = new Set(input.preferredActivationTypes.map((entry) => entry.trim().toLowerCase()));
  const available = new Set(input.availableActivationTags.map((entry) => entry.trim().toLowerCase()));

  if (!preferred.size || !available.size) {
    return { hasActivationInventory: available.size > 0, strength: null as number | null };
  }

  let overlap = 0;
  preferred.forEach((entry) => {
    if (available.has(entry)) {
      overlap += 1;
    }
  });

  const strength = Number(((overlap / preferred.size) * 100).toFixed(2));

  return {
    hasActivationInventory: available.size > 0,
    strength,
  };
}