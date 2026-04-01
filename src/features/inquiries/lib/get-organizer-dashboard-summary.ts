import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import type { InquiryStatus } from "@/types/database";

export interface OrganizerDashboardSummary {
  totalEvents: number;
  totalInquiries: number;
  inquiriesByStatus: Record<InquiryStatus, number>;
}

const EMPTY_STATUS_COUNTS: Record<InquiryStatus, number> = {
  submitted: 0,
  under_review: 0,
  contacted: 0,
  negotiating: 0,
  won: 0,
  lost: 0,
  withdrawn: 0,
};

export async function getOrganizerDashboardSummary(): Promise<OrganizerDashboardSummary> {
  const user = await getUser();

  if (!user) {
    return {
      totalEvents: 0,
      totalInquiries: 0,
      inquiriesByStatus: { ...EMPTY_STATUS_COUNTS },
    };
  }

  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.organization_id) {
    return {
      totalEvents: 0,
      totalInquiries: 0,
      inquiriesByStatus: { ...EMPTY_STATUS_COUNTS },
    };
  }

  const { data: events } = await supabase
    .from("events")
    .select("id")
    .eq("organization_id", membership.organization_id);

  const totalEvents = events?.length ?? 0;

  if (!events || events.length === 0) {
    return {
      totalEvents,
      totalInquiries: 0,
      inquiriesByStatus: { ...EMPTY_STATUS_COUNTS },
    };
  }

  const eventIds = events.map((event) => event.id);

  const { data: inquiries } = await supabase
    .from("slot_inquiries")
    .select("status")
    .in("event_id", eventIds);

  const inquiriesByStatus = { ...EMPTY_STATUS_COUNTS };

  for (const inquiry of inquiries ?? []) {
    const status = inquiry.status as InquiryStatus;
    if (status in inquiriesByStatus) {
      inquiriesByStatus[status] += 1;
    }
  }

  return {
    totalEvents,
    totalInquiries: inquiries?.length ?? 0,
    inquiriesByStatus,
  };
}