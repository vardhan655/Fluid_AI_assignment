import React from 'react';
import { Search, X } from 'lucide-react';

const CATEGORY_PILLS = ['all', 'work', 'personal', 'shopping', 'health', 'other'];
const STATUS_PILLS = ['all', 'active', 'completed'];
const PRIORITY_PILLS = [
  { value: 'all', color: '' },
  { value: 'high', color: 'bg-red-500' },
  { value: 'medium', color: 'bg-amber-500' },
  { value: 'low', color: 'bg-emerald-500' },
];

/**
 * Advanced filter bar with search, category, status, and priority pills.
 *
 * @param {{
 *   filters: { search: string, category: string, status: string, priority: string },
 *   onFilterChange: (key: string, value: string) => void,
 *   onSearchChange: (value: string) => void,
 *   onClearFilters: () => void
 * }} props
 */
export default function FilterBar({ filters, onFilterChange, onSearchChange, onClearFilters }) {
  const activeCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.priority !== 'all' ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
      {/* Search row */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                     text-sm focus:bg-white transition-colors focus-ring"
          aria-label="Search tasks"
        />
        {filters.search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                       hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {/* Category */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Category</span>
          {CATEGORY_PILLS.map((cat) => (
            <Pill
              key={cat}
              label={cat}
              active={filters.category === cat}
              onClick={() => onFilterChange('category', cat)}
            />
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Status</span>
          {STATUS_PILLS.map((s) => (
            <Pill
              key={s}
              label={s}
              active={filters.status === s}
              onClick={() => onFilterChange('status', s)}
            />
          ))}
        </div>

        {/* Priority */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Priority</span>
          {PRIORITY_PILLS.map((p) => (
            <Pill
              key={p.value}
              label={p.value}
              active={filters.priority === p.value}
              onClick={() => onFilterChange('priority', p.value)}
              dot={p.color}
            />
          ))}
        </div>

        {/* Clear all */}
        {activeCount > 0 && (
          <button
            onClick={onClearFilters}
            className="ml-auto flex items-center gap-1 text-xs text-indigo-600 font-semibold
                       hover:text-indigo-800 transition-colors"
          >
            <X size={12} />
            Clear filters
            <span className="ml-0.5 bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {activeCount}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/** Small selectable pill button. */
function Pill({ label, active, onClick, dot }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all
        ${active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : dot}`} />}
      {label}
    </button>
  );
}
