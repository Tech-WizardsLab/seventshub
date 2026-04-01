interface MetricBarProps {
  label: string;
  value: number;
  max: number;
  helper?: string;
}

export function MetricBar({
  label,
  value,
  max,
  helper,
}: MetricBarProps) {
  const safeMax = max > 0 ? max : 1;
  const percentage = Math.max(0, Math.min(100, (value / safeMax) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}