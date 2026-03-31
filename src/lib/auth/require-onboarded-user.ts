import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";
import { getOnboardingStatus } from "@/features/onboarding/lib/get-onboarding-status";

export async function requireOnboardedUser() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const onboardingStatus = await getOnboardingStatus();

  if (!onboardingStatus.hasOrganizationMembership) {
    redirect("/onboarding");
  }

  return user;
}