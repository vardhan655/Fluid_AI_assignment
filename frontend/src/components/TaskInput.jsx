import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

const PRIORITY_OPTS = [
  { value: 'high', label: 'High', color: 'bg-red-500' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500' },
  { value: 'low', label: 'Low', color: 'bg-emerald-500' },
];

const CATEGORY_OPTS = [
  { value: 'work', label: '💼 Work' },
  { value: 'personal', label: '👤 Personal' },
  { value: 'shopping', label: '🛒 Shopping' },
  { value: 'health', label: '❤️ Health' },
  { value: 'other', label: '📌 Other' },
];

/**
 * Task creation form with expandable extra fields.
 *
 * @param {{ onAdd: (task: object) => void }} props
 */
export default function TaskInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('other');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('other');
    setDueDate('');
    setExpanded(false);
    setError('');
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || undefined,
    });
    reset();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      reset();
    }
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      {/* Main input row */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setExpanded(true)}
            placeholder="What needs to be done?"
            className={`w-full text-lg px-4 py-3 rounded-xl border transition-colors focus-ring
              ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white'}`}
            aria-label="Task title"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-5 left-4 text-xs text-red-500 font-medium"
            >
              {error}
            </motion.p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700
                     text-white font-semibold rounded-xl transition-colors focus-ring shrink-0"
          aria-label="Add task"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-3 rounded-xl text-slate-400 hover:text-slate-600
                     hover:bg-slate-100 transition-colors focus-ring"
          aria-label={expanded ? 'Collapse form' : 'Expand form'}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expandable extra fields */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-slate-100">
              {/* Description */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add details…"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50
                             focus:bg-white text-sm resize-none transition-colors focus-ring"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  Priority
                </label>
                <div className="flex gap-1">
                  {PRIORITY_OPTS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPriority(opt.value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold
                                  transition-all border
                        ${priority === opt.value
                          ? 'border-slate-300 bg-white shadow-sm'
                          : 'border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50
                             text-sm focus-ring appearance-none cursor-pointer"
                >
                  {CATEGORY_OPTS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  Due date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50
                             text-sm focus-ring"
                />
              </div>

              {/* Keyboard hint */}
              <div className="flex items-end">
                <p className="text-[11px] text-slate-400">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Enter</kbd> to add
                  &nbsp;·&nbsp;
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Esc</kbd> to collapse
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
