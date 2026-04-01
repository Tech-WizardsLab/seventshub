import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getInquiryDetail } from "@/features/inquiries/lib/get-inquiry-detail";
import { InquiryWorkflowPanel } from "@/features/inquiries/components/inquiry-workflow-panel";

export default async function OrganizerInquiryDetailPage({
  params,
}: {
  params: Promise<{ inquiryId: string }>;
}) {
  await requireOnboardedUser();

  const { inquiryId } = await params;
  const inquiry = await getInquiryDetail(inquiryId);

  if (!inquiry) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Inquiry not found</h1>
        <p className="text-slate-600">
          This inquiry is not available or you do not have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Inquiry detail
          </h1>
          <p className="mt-2 text-slate-600">
            Manage this sponsorship lead and plan the next commercial action.
          </p>
        </div>

        <Link
          href="/organizer/inquiries"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to inquiries
        </Link>
      </div>

      <InquiryWorkflowPanel inquiry={inquiry} />
    </div>
  );
}