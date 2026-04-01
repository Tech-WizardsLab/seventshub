"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateEventReviewStatus } from "@/features/admin/lib/update-event-review-status";

interface EventReviewActionsProps {
  eventId: string;
  currentStatus: string;
}

export function EventReviewActions({
  eventId,
  currentStatus,
}: EventReviewActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(status: "approved" | "rejected") {
    setPending(true);
    setError(null);

    const result = await updateEventReviewStatus({
      eventId,
      status,
    });

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
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending || currentStatus === "approved"}
          onClick={() => handleAction("approved")}
          className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Approve
        </button>

        <button
          type="button"
          disabled={pending || currentStatus === "rejected"}
          onClick={() => handleAction("rejected")}
          className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reject
        </button>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}