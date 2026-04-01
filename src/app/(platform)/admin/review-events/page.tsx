import { getProfile } from "@/lib/auth/get-profile";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getReviewEvents } from "@/features/admin/lib/get-review-events";
import { EventReviewActions } from "@/features/admin/components/event-review-actions";

export default async function AdminReviewEventsPage() {
  await requireOnboardedUser();

  const profile = await getProfile();

  if (profile?.platform_role !== "admin") {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Admin Review</h1>
        <p className="text-slate-600">You do not have access to this page.</p>
      </div>
    );
  }

  const events = await getReviewEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Review Events</h1>
        <p className="mt-2 text-slate-600">
          Approve or reject organizer events before they appear in the marketplace.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {events.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            No events awaiting review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-600">
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Organizer</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {events.map((event) => (
                  <tr key={event.id} className="text-sm text-slate-700">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{event.name}</div>
                      <div className="text-slate-500">{event.sport_type}</div>
                    </td>

                    <td className="px-6 py-4">{event.organization_name}</td>

                    <td className="px-6 py-4">
                      {[event.city, event.country].filter(Boolean).join(", ") || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        {event.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(event.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <EventReviewActions
                        eventId={event.id}
                        currentStatus={event.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}