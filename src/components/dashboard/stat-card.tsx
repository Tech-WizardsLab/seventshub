import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, helper, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
        </div>

        {icon ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-600">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}