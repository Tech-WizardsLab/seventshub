import type { PlatformRole } from "@/types/database";

interface RoleSelectorProps {
  value: PlatformRole | "";
  onChange: (role: PlatformRole) => void;
  showOrganizerOption?: boolean;
}

const options: Array<{
  value: Exclude<PlatformRole, "admin">;
  title: string;
  description: string;
}> = [
  {
    value: "organizer",
    title: "Event organizer",
    description:
      "Your company creates and manages sports events and wants to attract sponsors.",
  },
  {
    value: "sponsor",
    title: "Sponsor",
    description:
      "Your company wants strategic support to evaluate sponsorship opportunities and execute stronger deals.",
  },
];

export function RoleSelector({
  value,
  onChange,
  showOrganizerOption = true,
}: RoleSelectorProps) {
  const visibleOptions = showOrganizerOption
    ? options
    : options.filter((option) => option.value === "sponsor");

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">Company type</p>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleOptions.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-2xl border p-5 text-left transition ${
                selected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
              }`}
            >
              <div className="space-y-2">
                <h3 className="text-base font-semibold">{option.title}</h3>
                <p
                  className={`text-sm leading-6 ${
                    selected ? "text-slate-200" : "text-slate-600"
                  }`}
                >
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {!showOrganizerOption ? (
        <p className="text-xs leading-6 text-slate-500">
          Organizer onboarding is still supported internally and can be enabled later.
        </p>
      ) : null}
    </div>
  );
}