import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated circular progress ring with task stats.
 *
 * @param {{ total: number, completed: number }} props
 */
export default function ProgressIndicator({ total, completed }) {
  const remaining = total - completed;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  // SVG circle parameters
  const SIZE = 120;
  const STROKE = 8;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  // Color interpolation: red → amber → green
  const ringColor =
    pct < 30 ? '#ef4444' : pct < 70 ? '#f59e0b' : '#22c55e';

  return (
    <div className="flex flex-col items-center gap-3">
      {/* SVG ring */}
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          {/* background track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={STROKE}
          />
          {/* progress arc */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </svg>
        {/* center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={pct}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-white"
          >
            {pct}%
          </motion.span>
          <span className="text-[10px] text-slate-300 uppercase tracking-wider">
            done
          </span>
        </div>
      </div>

      {/* stats row */}
      <div className="flex gap-4 text-xs font-medium text-slate-300">
        <span>
          Total&nbsp;
          <span className="text-white font-semibold">{total}</span>
        </span>
        <span className="text-slate-500">|</span>
        <span>
          Done&nbsp;
          <span className="text-emerald-400 font-semibold">{completed}</span>
        </span>
        <span className="text-slate-500">|</span>
        <span>
          Left&nbsp;
          <span className="text-amber-400 font-semibold">{remaining}</span>
        </span>
      </div>
    </div>
  );
}
