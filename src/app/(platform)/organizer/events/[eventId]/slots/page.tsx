import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getEventById } from "@/features/events/lib/get-event-by-id";
import { getEventSlots } from "@/features/events/lib/get-event-slots";
import { SponsorshipSlotForm } from "@/features/events/components/sponsorship-slot-form";

export default async function EventSlotsPage({
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
        <h1 className="text-3xl font-semibold text-slate-900">Sponsorship Slots</h1>
        <p className="text-slate-600">Event not found.</p>
      </div>
    );
  }

  const slots = await getEventSlots(eventId);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-slate-900">
              Sponsorship Slots
            </h1>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              {event.status}
            </span>
          </div>

          <p className="mt-2 text-slate-600">
            Define the sponsorship inventory for <strong>{event.name}</strong>.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/organizer/events/${event.id}/metrics`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Metrics
          </Link>

          <Link
            href="/organizer/events"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to events
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Create new slot</h2>
        <p className="mt-2 text-sm text-slate-600">
          Add one sponsorship opportunity at a time. Sponsors will later inquire on these.
        </p>

        <div className="mt-6">
          <SponsorshipSlotForm eventId={event.id} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Current slots</h2>
        </div>

        {slots.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            No sponsorship slots yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {slots.map((slot) => (
              <div key={slot.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {slot.title}
                      </h3>
                      <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {slot.slot_type}
                      </span>
                      <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {slot.visibility}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600">
                      {slot.description ?? "No description yet."}
                    </p>
                  </div>

                  <div className="text-right text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-900">List price:</span>{" "}
                      {slot.list_price_eur ?? "—"} €
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Min price:</span>{" "}
                      {slot.minimum_price_eur ?? "—"} €
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Inventory:</span>{" "}
                      {slot.remaining_inventory}/{slot.inventory_count}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Benefits</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {slot.benefits.length ? slot.benefits.join(", ") : "Not set"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-900">Audience fit</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {slot.audience_fit_tags.length
                        ? slot.audience_fit_tags.join(", ")
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}