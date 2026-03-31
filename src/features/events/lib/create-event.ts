import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface CreateEventInput {
  name: string;
  sportType: string;
  city: string;
  country: string;
  venueName: string;
  websiteUrl: string;
  shortDescription: string;
  description: string;
  startsAt: string;
  endsAt: string;
  attendeeCapacity: string;
}

export interface CreateEventResult {
  error: string | null;
  eventId: string | null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createEvent(input: CreateEventInput): Promise<CreateEventResult> {
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in.", eventId: null };
  }

  const supabase = await createClient();

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership?.organization_id) {
    return { error: "No organization found for this user.", eventId: null };
  }

  const baseSlug = slugify(input.name);
  const uniqueSlug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

  const attendeeCapacity =
    input.attendeeCapacity.trim() === ""
      ? null
      : Number.parseInt(input.attendeeCapacity.trim(), 10);

  if (attendeeCapacity !== null && Number.isNaN(attendeeCapacity)) {
    return { error: "Attendee capacity must be a valid number.", eventId: null };
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      organization_id: membership.organization_id,
      name: input.name.trim(),
      slug: uniqueSlug,
      sport_type: input.sportType.trim(),
      city: input.city.trim() || null,
      country: input.country.trim() || null,
      venue_name: input.venueName.trim() || null,
      website_url: input.websiteUrl.trim() || null,
      short_description: input.shortDescription.trim() || null,
      description: input.description.trim() || null,
      starts_at: input.startsAt || null,
      ends_at: input.endsAt || null,
      attendee_capacity: attendeeCapacity,
      status: "draft",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      error: error?.message ?? "Could not create event.",
      eventId: null,
    };
  }

  return {
    error: null,
    eventId: data.id,
  };
}