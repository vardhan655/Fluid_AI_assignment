import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Trash2,
  Bot,
  Loader2,
  ChevronDown,
  ChevronRight,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

const PRIORITY_BORDER = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-emerald-500',
};

const CATEGORY_BADGE = {
  work: 'bg-blue-100 text-blue-700',
  personal: 'bg-violet-100 text-violet-700',
  shopping: 'bg-amber-100 text-amber-700',
  health: 'bg-rose-100 text-rose-700',
  other: 'bg-slate-100 text-slate-600',
};

const CATEGORY_EMOJI = {
  work: '💼',
  personal: '👤',
  shopping: '🛒',
  health: '❤️',
  other: '📌',
};

/**
 * Compute a human-friendly due-date label.
 * @param {string} dueDate - ISO date string (YYYY-MM-DD)
 */
function dueDateLabel(dueDate) {
  if (!dueDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffMs = due - now;
  const diffDays = Math.round(diffMs / 86400000);

  if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)}d`, color: 'text-red-600 bg-red-50' };
  if (diffDays === 0) return { text: 'Due today', color: 'text-amber-600 bg-amber-50' };
  if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-amber-600 bg-amber-50' };
  if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: 'text-blue-600 bg-blue-50' };
  return { text: `Due in ${diffDays} days`, color: 'text-slate-500 bg-slate-50' };
}

/**
 * A single task card with checkbox, metadata, AI breakdown, and delete.
 *
 * @param {{
 *   task: object,
 *   onToggle: (id: string) => void,
 *   onDelete: (id: string) => void,
 *   onBreakdown: (id: string) => Promise<void>,
 *   onSubTaskToggle: (taskId: string, subTaskId: string, completed: boolean) => void,
 * }} props
 */
export default function TaskCard({ task, onToggle, onDelete, onBreakdown, onSubTaskToggle }) {
  const [loadingAI, setLoadingAI] = useState(false);
  const [showSubs, setShowSubs] = useState(task.subTasks?.length > 0);

  const handleBreakdown = async () => {
    setLoadingAI(true);
    try {
      await onBreakdown(task.id);
      setShowSubs(true);
    } finally {
      setLoadingAI(false);
    }
  };

  const due = dueDateLabel(task.dueDate);
  const subsCompleted = (task.subTasks || []).filter((s) => s.completed).length;
  const subsTotal = (task.subTasks || []).length;
  const subPct = subsTotal > 0 ? Math.round((subsCompleted / subsTotal) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -60, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className={`group relative bg-white rounded-2xl border border-slate-200 border-l-4
                  shadow-sm hover:shadow-md transition-shadow overflow-hidden
                  ${PRIORITY_BORDER[task.priority] || 'border-l-slate-300'}
                  ${task.completed ? 'bg-emerald-50/50' : ''}`}
    >
      <div className="p-4">
        {/* Top row: checkbox + title + actions */}
        <div className="flex items-start gap-3">
          {/* Custom checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center
                        transition-all duration-200
              ${task.completed
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-slate-300 hover:border-indigo-400'}`}
            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Check size={12} strokeWidth={3} />
              </motion.div>
            )}
          </button>

          {/* Title + description */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-semibold leading-snug transition-all
                ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-xs mt-0.5 leading-relaxed ${task.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                {task.description}
              </p>
            )}
          </div>

          {/* Delete */}
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400
                       hover:text-red-500 hover:bg-red-50 transition-all"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 mt-3 ml-8">
          {/* Category badge */}
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
              ${CATEGORY_BADGE[task.category] || CATEGORY_BADGE.other}`}
          >
            {CATEGORY_EMOJI[task.category]} {task.category}
          </span>

          {/* Due date */}
          {due && (
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${due.color}`}
            >
              {due.text.includes('Overdue') ? (
                <AlertTriangle size={10} />
              ) : (
                <Calendar size={10} />
              )}
              {due.text}
            </span>
          )}

          {/* AI breakdown button */}
          {!task.completed && subsTotal === 0 && (
            <button
              onClick={handleBreakdown}
              disabled={loadingAI}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]
                         font-semibold bg-indigo-50 text-indigo-600
                         hover:bg-indigo-100 transition-colors disabled:opacity-60"
            >
              {loadingAI ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Bot size={10} />
              )}
              {loadingAI ? 'Thinking…' : '🤖 AI Breakdown'}
            </button>
          )}
        </div>

        {/* Sub-tasks section */}
        {subsTotal > 0 && (
          <div className="mt-3 ml-8">
            {/* Toggle header */}
            <button
              onClick={() => setShowSubs(!showSubs)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700
                         transition-colors"
            >
              {showSubs ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Sub-tasks ({subsCompleted}/{subsTotal})
            </button>

            {/* Mini progress bar */}
            <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden w-40">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${subPct}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            {/* Sub-task list */}
            {showSubs && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 space-y-1.5 overflow-hidden"
              >
                {task.subTasks.map((sub) => (
                  <li key={sub.id} className="flex items-center gap-2">
                    <button
                      onClick={() => onSubTaskToggle(task.id, sub.id, !sub.completed)}
                      className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center
                                  transition-all text-[10px]
                        ${sub.completed
                          ? 'bg-indigo-500 border-indigo-500 text-white'
                          : 'border-slate-300 hover:border-indigo-400'}`}
                      aria-label={`Toggle sub-task: ${sub.title}`}
                    >
                      {sub.completed && <Check size={10} strokeWidth={3} />}
                    </button>
                    <span
                      className={`text-xs ${sub.completed ? 'line-through text-slate-400' : 'text-slate-600'}`}
                    >
                      {sub.title}
                    </span>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
