"use client";

import { useState } from "react";
import { updateInquiryWorkflow } from "@/features/inquiries/lib/update-inquiry-workflow";
import type { InquiryDetail } from "@/features/inquiries/lib/get-inquiry-detail";

interface InquiryWorkflowPanelProps {
  inquiry: InquiryDetail;
}

export function InquiryWorkflowPanel({
  inquiry,
}: InquiryWorkflowPanelProps) {
  const [organizerNotes, setOrganizerNotes] = useState(
    inquiry.organizer_notes ?? ""
  );
  const [adminNotes, setAdminNotes] = useState(inquiry.admin_notes ?? "");
  const [nextAction, setNextAction] = useState(inquiry.next_action ?? "");
  const [nextActionDueAt, setNextActionDueAt] = useState(
    inquiry.next_action_due_at
      ? new Date(inquiry.next_action_due_at).toISOString().slice(0, 16)
      : ""
  );

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSaved(false);

    const result = await updateInquiryWorkflow({
      inquiryId: inquiry.id,
      organizerNotes,
      adminNotes,
      nextAction,
      nextActionDueAt,
    });

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    setSaved(true);
    setPending(false);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Inquiry workflow
        </h2>
        <p className="text-sm text-slate-600">
          Manage internal notes and next steps for this sponsorship lead.
        </p>
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Sponsor
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {inquiry.sponsor_organization_name}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Event
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {inquiry.event_name}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Slot
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {inquiry.slot_title}
          </p>
          <p className="mt-1 text-xs text-slate-500">{inquiry.slot_type}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current status
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {inquiry.status}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="organizerNotes"
            className="text-sm font-medium text-slate-700"
          >
            Organizer notes
          </label>
          <textarea
            id="organizerNotes"
            rows={5}
            value={organizerNotes}
            onChange={(event) => setOrganizerNotes(event.target.value)}
            placeholder="Internal commercial notes, meeting outcomes, objections, context..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="adminNotes"
            className="text-sm font-medium text-slate-700"
          >
            Admin notes
          </label>
          <textarea
            id="adminNotes"
            rows={4}
            value={adminNotes}
            onChange={(event) => setAdminNotes(event.target.value)}
            placeholder="Optional internal marketplace/admin notes..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="nextAction"
              className="text-sm font-medium text-slate-700"
            >
              Next action
            </label>
            <input
              id="nextAction"
              type="text"
              value={nextAction}
              onChange={(event) => setNextAction(event.target.value)}
              placeholder="Send proposal, schedule call, follow up by email..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="nextActionDueAt"
              className="text-sm font-medium text-slate-700"
            >
              Next action due
            </label>
            <input
              id="nextActionDueAt"
              type="datetime-local"
              value={nextActionDueAt}
              onChange={(event) => setNextActionDueAt(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {saved ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Workflow details saved.
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save workflow details"}
        </button>
      </form>
    </div>
  );
}