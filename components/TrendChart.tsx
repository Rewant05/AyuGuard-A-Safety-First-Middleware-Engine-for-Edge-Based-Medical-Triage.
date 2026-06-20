import type { VitalsReading } from "@/lib/types";
import { formatTime } from "@/lib/format";

interface TrendChartProps {
  title: string;
  unit: string;
  readings: VitalsReading[];
  getValue: (reading: VitalsReading) => number;
  color: string;
}

export function TrendChart({ title, unit, readings, getValue, color }: TrendChartProps) {
  const values = readings.map(getValue);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = 34;
  const width = 640;
  const height = 220;
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y, value };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

  const first = readings[0];
  const last = readings[readings.length - 1];

  return (
    <article className="glass-panel rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400 font-medium">
            <span className="text-white font-bold">{values[values.length - 1]}</span> {unit} latest
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">
          {readings.length} points
        </div>
      </div>

      <svg
        className="mt-6 h-auto w-full"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${title} trend chart`}
      >
        <rect x="0" y="0" width={width} height={height} rx="12" fill="#020617" opacity="0.5" />
        {[0, 1, 2, 3].map((line) => {
          const y = padding + line * ((height - padding * 2) / 3);
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#1e293b" strokeDasharray="4 4" />;
        })}
        <path d={path} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0px 4px 6px ${color}40)` }} />
        {points.map((point, index) => (
          <circle key={`${title}-${index}`} cx={point.x} cy={point.y} r="5" fill="#020617" stroke={color} strokeWidth="3" />
        ))}
        <text x={padding} y={height - 8} fill="#64748b" fontSize="13" fontWeight="700">
          {formatTime(first.timestamp)}
        </text>
        <text x={width - padding} y={height - 8} textAnchor="end" fill="#64748b" fontSize="13" fontWeight="700">
          {formatTime(last.timestamp)}
        </text>
        <text x={padding} y={22} fill="#64748b" fontSize="13" fontWeight="700">
          {max} {unit}
        </text>
        <text x={width - padding} y={22} textAnchor="end" fill="#64748b" fontSize="13" fontWeight="700">
          {min} {unit}
        </text>
      </svg>
    </article>
  );
}
