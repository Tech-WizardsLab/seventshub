import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getOrganizerInquiries } from "@/features/inquiries/lib/get-organizer-inquiries";

export default async function OrganizerInquiriesPage() {
  await requireOnboardedUser();

  const inquiries = await getOrganizerInquiries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Incoming Inquiries</h1>
        <p className="mt-2 text-slate-600">
          Review sponsorship interest submitted for your event slots.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {inquiries.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            No incoming inquiries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-600">
                  <th className="px-6 py-4 font-medium">Sponsor</th>
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Slot</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="text-sm text-slate-700">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {inquiry.sponsor_organization_name}
                    </td>
                    <td className="px-6 py-4">{inquiry.event_name}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{inquiry.slot_title}</div>
                      <div className="text-slate-500">{inquiry.slot_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(inquiry.created_at).toLocaleDateString()}
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