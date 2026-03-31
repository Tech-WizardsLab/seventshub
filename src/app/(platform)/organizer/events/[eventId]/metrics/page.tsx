import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getEventById } from "@/features/events/lib/get-event-by-id";
import { EventMetricsForm } from "@/features/events/components/event-metrics-form";

export default async function EventMetricsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  await requireOnboardedUser();

  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Event Metrics</h1>
        <p className="text-slate-600">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-slate-900">
              Event Metrics
            </h1>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              {event.status}
            </span>
          </div>

          <p className="mt-2 text-slate-600">
            Add the sponsor-facing data that makes <strong>{event.name}</strong> commercially compelling.
          </p>
        </div>

        <Link
          href="/organizer/events"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to events
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <EventMetricsForm event={event} />
      </div>
    </div>
  );
}