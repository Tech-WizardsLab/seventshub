import { SignOutButton } from "@/components/layout/sign-out-button";

export function PlatformHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <p className="text-sm font-medium text-slate-600">
        Authenticated application area
      </p>

      <SignOutButton />
    </div>
  );
}