import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, BarChart3 } from 'lucide-react';
import TaskCard from './TaskCard';

const PRIORITY_COLS = [
  { key: 'high', label: 'High Priority', accent: 'bg-red-500', bg: 'bg-red-50' },
  { key: 'medium', label: 'Medium Priority', accent: 'bg-amber-500', bg: 'bg-amber-50' },
  { key: 'low', label: 'Low Priority', accent: 'bg-emerald-500', bg: 'bg-emerald-50' },
];

const STATUS_COLS = [
  { key: false, label: 'Active', accent: 'bg-blue-500', bg: 'bg-blue-50' },
  { key: true, label: 'Completed', accent: 'bg-emerald-500', bg: 'bg-emerald-50' },
];

/**
 * Kanban board view — group tasks by priority or status.
 *
 * @param {{
 *   tasks: object[],
 *   onToggle: Function,
 *   onDelete: Function,
 *   onBreakdown: Function,
 *   onSubTaskToggle: Function,
 * }} props
 */
export default function KanbanBoard({ tasks, onToggle, onDelete, onBreakdown, onSubTaskToggle }) {
  const [groupBy, setGroupBy] = useState('priority'); // 'priority' | 'status'

  const columns = groupBy === 'priority' ? PRIORITY_COLS : STATUS_COLS;

  const grouped = {};
  columns.forEach((col) => {
    grouped[col.key] = tasks.filter((t) =>
      groupBy === 'priority' ? t.priority === col.key : t.completed === col.key
    );
  });

  return (
    <div>
      {/* Group-by toggle */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Group by</span>
        <button
          onClick={() => setGroupBy('priority')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
            ${groupBy === 'priority'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          <BarChart3 size={12} /> Priority
        </button>
        <button
          onClick={() => setGroupBy('status')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
            ${groupBy === 'status'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          <Layers size={12} /> Status
        </button>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colTasks = grouped[col.key] || [];
          return (
            <div
              key={String(col.key)}
              className="bg-slate-50/80 rounded-2xl border border-slate-200 p-3 min-h-[200px]"
            >
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={`w-2.5 h-2.5 rounded-full ${col.accent}`} />
                <h3 className="text-sm font-bold text-slate-700">{col.label}</h3>
                <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {colTasks.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-slate-400 text-center py-8"
                    >
                      No tasks
                    </motion.p>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onBreakdown={onBreakdown}
                        onSubTaskToggle={onSubTaskToggle}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
