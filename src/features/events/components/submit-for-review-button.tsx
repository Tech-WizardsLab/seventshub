"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitEventForReview } from "@/features/events/lib/submit-event-for-review";

interface SubmitForReviewButtonProps {
  eventId: string;
  currentStatus: string;
}

export function SubmitForReviewButton({
  eventId,
  currentStatus,
}: SubmitForReviewButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = currentStatus === "draft" || currentStatus === "rejected";

  async function handleSubmit() {
    setPending(true);
    setError(null);

    const result = await submitEventForReview(eventId);

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    router.refresh();
    setPending(false);
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={!canSubmit || pending}
        onClick={handleSubmit}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit for review"}
      </button>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}