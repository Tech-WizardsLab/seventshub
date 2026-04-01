"use client";

import { useState } from "react";
import { INQUIRY_STATUSES } from "@/lib/constants/statuses";
import type { InquiryStatus } from "@/types/database";
import { updateInquiryStatus } from "@/features/inquiries/lib/update-inquiry-status";

interface InquiryStatusSelectProps {
  inquiryId: string;
  currentStatus: InquiryStatus;
}

export function InquiryStatusSelect({
  inquiryId,
  currentStatus,
}: InquiryStatusSelectProps) {
  const [status, setStatus] = useState<InquiryStatus>(currentStatus);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(nextStatus: InquiryStatus) {
    setStatus(nextStatus);
    setPending(true);
    setError(null);

    const result = await updateInquiryStatus({
      inquiryId,
      status: nextStatus,
    });

    if (result.error) {
      setError(result.error);
      setStatus(currentStatus);
    }

    setPending(false);
  }

  return (
    <div className="space-y-2">
      <select
        value={status}
        disabled={pending}
        onChange={(event) => handleChange(event.target.value as InquiryStatus)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {INQUIRY_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}