import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { runMatchingForBrief } from "@/features/recommendations/lib/run-matching-for-brief";

interface RunMatchingPayload {
  briefId?: string;
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as RunMatchingPayload;
  const briefId = body.briefId?.trim();
  if (!briefId) {
    return NextResponse.json({ error: "briefId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: brief } = await supabase
    .from("sponsor_onboarding_briefs")
    .select("id")
    .eq("id", briefId)
    .maybeSingle();

  if (!brief) {
    return NextResponse.json({ error: "Brief not found or not accessible" }, { status: 404 });
  }

  try {
    const result = await runMatchingForBrief(briefId);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown matching error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}