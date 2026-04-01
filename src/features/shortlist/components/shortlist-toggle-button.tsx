"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleShortlistEvent } from "@/features/shortlist/lib/toggle-shortlist-event";

interface ShortlistToggleButtonProps {
  eventId: string;
  initiallySaved?: boolean;
}

export function ShortlistToggleButton({
  eventId,
  initiallySaved = false,
}: ShortlistToggleButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setPending(true);
    setError(null);

    const result = await toggleShortlistEvent(eventId);

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    setSaved(result.saved);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Updating..." : saved ? "Saved" : "Save event"}
      </button>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}