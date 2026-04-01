"use client";

import { useState } from "react";
import { createSlotInquiry } from "@/features/marketplace/lib/create-slot-inquiry";

interface SlotInquiryButtonProps {
  eventId: string;
  sponsorshipSlotId: string;
}

export function SlotInquiryButton({
  eventId,
  sponsorshipSlotId,
}: SlotInquiryButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleClick() {
    setPending(true);
    setError(null);
    setSuccess(false);

    const result = await createSlotInquiry({
      eventId,
      sponsorshipSlotId,
    });

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending || success}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {success ? "Inquiry submitted" : pending ? "Submitting..." : "Inquire about this slot"}
      </button>

      {error ? (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}