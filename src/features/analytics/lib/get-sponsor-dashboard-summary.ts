import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import type { InquiryStatus } from "@/types/database";

export interface SponsorDashboardSummary {
  totalInquiries: number;
  totalTrackedEvents: number;
  totalTrackedSlots: number;
  potentialAttendance: number;
  potentialDigitalReach: number;
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

export async function getSponsorDashboardSummary(): Promise<SponsorDashboardSummary> {
  const user = await getUser();

  if (!user) {
    return {
      totalInquiries: 0,
      totalTrackedEvents: 0,
      totalTrackedSlots: 0,
      potentialAttendance: 0,
      potentialDigitalReach: 0,
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
      totalInquiries: 0,
      totalTrackedEvents: 0,
      totalTrackedSlots: 0,
      potentialAttendance: 0,
      potentialDigitalReach: 0,
      inquiriesByStatus: { ...EMPTY_STATUS_COUNTS },
    };
  }

  const { data: inquiries } = await supabase
    .from("slot_inquiries")
    .select("status, event_id, sponsorship_slot_id")
    .eq("sponsor_organization_id", membership.organization_id);

  if (!inquiries || inquiries.length === 0) {
    return {
      totalInquiries: 0,
      totalTrackedEvents: 0,
      totalTrackedSlots: 0,
      potentialAttendance: 0,
      potentialDigitalReach: 0,
      inquiriesByStatus: { ...EMPTY_STATUS_COUNTS },
    };
  }

  const inquiriesByStatus = { ...EMPTY_STATUS_COUNTS };

  for (const inquiry of inquiries) {
    const status = inquiry.status as InquiryStatus;
    if (status in inquiriesByStatus) {
      inquiriesByStatus[status] += 1;
    }
  }

  const uniqueEventIds = [...new Set(inquiries.map((inquiry) => inquiry.event_id))];
  const uniqueSlotIds = [...new Set(inquiries.map((inquiry) => inquiry.sponsorship_slot_id))];

  const { data: eventMetrics } = await supabase
    .from("event_metrics")
    .select("event_id, expected_attendance, email_reach, social_impressions")
    .in("event_id", uniqueEventIds);

  const potentialAttendance = (eventMetrics ?? []).reduce(
    (sum, item) => sum + (item.expected_attendance ?? 0),
    0
  );

  const potentialDigitalReach = (eventMetrics ?? []).reduce(
    (sum, item) =>
      sum + (item.email_reach ?? 0) + (item.social_impressions ?? 0),
    0
  );

  return {
    totalInquiries: inquiries.length,
    totalTrackedEvents: uniqueEventIds.length,
    totalTrackedSlots: uniqueSlotIds.length,
    potentialAttendance,
    potentialDigitalReach,
    inquiriesByStatus,
  };
}