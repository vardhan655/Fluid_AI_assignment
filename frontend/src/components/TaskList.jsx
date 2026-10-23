import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardList, SearchX } from 'lucide-react';
import TaskCard from './TaskCard';

/**
 * List view — renders task cards with enter/exit animations plus empty states.
 *
 * @param {{
 *   tasks: object[],
 *   loading: boolean,
 *   hasFilters: boolean,
 *   onToggle: Function,
 *   onDelete: Function,
 *   onBreakdown: Function,
 *   onSubTaskToggle: Function,
 * }} props
 */
export default function TaskList({
  tasks,
  loading,
  hasFilters,
  onToggle,
  onDelete,
  onBreakdown,
  onSubTaskToggle,
}) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        {hasFilters ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <SearchX size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No matching tasks</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              Try adjusting your filters or search query to find what you&apos;re looking for.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <ClipboardList size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No tasks yet!</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              Add your first task above to get started. Press{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Enter</kbd> to quickly add a
              task.
            </p>
          </>
        )}
      </motion.div>
    );
  }

  // Task list
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onBreakdown={onBreakdown}
            onSubTaskToggle={onSubTaskToggle}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
