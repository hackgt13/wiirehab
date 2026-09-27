import type { SessionHandoff } from '../data/types'
import type { SessionOverride } from '../data/unityProtocol'

interface LiveReadingsProps {
  session: SessionHandoff        // seed / last-session fallback
  wsStatus: string
  baselineDeg: number
  override?: SessionOverride | null  // data from Unity REST API when available
}

export function LiveReadings({ session, wsStatus, baselineDeg, override }: LiveReadingsProps) {
  const isLive = wsStatus === 'open'

  // When connected to Unity, show real values; otherwise show zeroes to make it
  // obvious that these numbers come from the headset and aren't seeded.
  const romDeg    = isLive ? (override?.romDeg         ?? session.medianPeakDeg) : 0
  const trunkDeg  = isLive ? (override?.trunkDeg       ?? session.trunkDeviation.finalRepsDeg) : 0
  const repsValid = isLive ? (override?.repsValid      ?? session.reps.valid) : 0
  const repsAtt   = isLive ? (override?.repsAttempted  ?? session.reps.attempted) : 0
  const repsPrx   = override?.prescribedReps || session.reps.prescribed
  const worstPain = isLive ? (override?.painVas ?? (
    session.patientReports.length
      ? Math.max(...session.patientReports.map(r => r.severity))
      : null
  )) : null

  const romDelta  = romDeg - baselineDeg
  const trunkWarn = isLive && trunkDeg > 8

  const metrics = [
    {
      label: 'Peak ROM',
      value: isLive ? `${romDeg}°` : '—',
      sub: isLive ? `${romDelta >= 0 ? '+' : ''}${romDelta}° vs baseline` : 'awaiting headset',
      warn: false,
    },
    {
      label: 'Trunk dev.',
      value: isLive ? `${trunkDeg}°` : '—',
      sub: isLive ? (trunkWarn ? 'exceeds 8° limit' : 'within limit') : 'awaiting headset',
      warn: trunkWarn,
    },
    {
      label: 'Reps',
      value: isLive ? `${repsValid} / ${repsAtt}` : '— / —',
      sub: `${repsPrx} prescribed`,
      warn: false,
    },
    {
      label: 'Pain (VAS)',
      value: isLive ? (worstPain !== null ? `${worstPain}/10` : '--') : '—',
      sub: isLive
        ? (worstPain !== null ? (worstPain >= 5 ? 'above threshold' : 'within limit') : 'no report')
        : 'awaiting headset',
      warn: isLive && worstPain !== null && worstPain >= 5,
    },
  ]

  return (
    <div className="flex items-stretch border border-[#D1D9E3] rounded-[3px] overflow-hidden">
      {/* Mode badge */}
      <div
        className={`flex items-center px-4 shrink-0 ${isLive ? 'bg-[#14532D]' : 'bg-[#1E3A5F]'}`}
        style={{ minWidth: 120 }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className="block w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: isLive ? '#4ADE80' : '#60A5FA',
                animation: isLive ? 'live-pulse 1.5s ease-in-out infinite' : undefined,
              }}
            />
            <p className="text-white text-[10px] font-bold uppercase tracking-wider leading-none">VR Headset</p>
          </div>
          <p className="text-white/70 text-[10px] leading-none pl-3.5">
            {isLive ? 'Live stream' : 'No connection'}
          </p>
        </div>
      </div>

      {/* Metric tiles */}
      <div className="flex flex-1 bg-white">
        {metrics.map((m, i) => (
          <div
            key={i}
            className={`flex-1 flex flex-col justify-center px-5 py-3 border-r border-[#E8EDF2] last:border-r-0 ${m.warn ? 'bg-[#FFF7ED]' : ''}`}
          >
            <p className="text-[10px] text-[#6B7280] uppercase tracking-wider leading-none mb-1.5 select-none">{m.label}</p>
            <p className={`text-[28px] font-bold tabular-nums leading-none ${
              !isLive ? 'text-[#D1D5DB]' : m.warn ? 'text-[#C67C1A]' : 'text-[#111827]'
            }`}>
              {m.value}
            </p>
            <p className={`text-[10px] mt-1.5 leading-none ${
              !isLive ? 'text-[#D1D5DB]' : m.warn ? 'text-[#C67C1A]' : 'text-[#9CA3AF]'
            }`}>
              {m.warn && <span className="inline-block mr-0.5">⚠</span>}
              {m.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
