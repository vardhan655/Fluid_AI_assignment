import React, { useState, useEffect, useCallback, useRef } from 'react';
import { List, LayoutGrid, Sparkles } from 'lucide-react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  generateBreakdown,
  updateSubTask,
} from './services/api';
import Toast from './components/Toast';
import ProgressIndicator from './components/ProgressIndicator';
import TaskInput from './components/TaskInput';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import KanbanBoard from './components/KanbanBoard';

const DEFAULT_FILTERS = {
  search: '',
  category: 'all',
  status: 'all',
  priority: 'all',
};

/**
 * Root application component.
 *
 * Manages global state for tasks, filters, view mode, and toast
 * notifications. Orchestrates API calls and passes data down
 * to presentational children.
 */
export default function App() {
  // ----- state -----
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  // ----- toast helpers -----
  const addToast = useCallback((type, message) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ----- data fetching -----
  const loadTasks = useCallback(async (f = filters) => {
    try {
      const params = {};
      if (f.status === 'active') params.completed = false;
      if (f.status === 'completed') params.completed = true;
      if (f.priority !== 'all') params.priority = f.priority;
      if (f.category !== 'all') params.category = f.category;
      if (f.search) params.search = f.search;

      const { data } = await fetchTasks(params);
      setTasks(data);
    } catch {
      addToast('error', 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  // Debounced search
  const debounceRef = useRef(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadTasks(filters), 300);
    return () => clearTimeout(debounceRef.current);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ----- CRUD handlers -----

  const handleAdd = async (taskData) => {
    try {
      const { data } = await createTask(taskData);
      setTasks((prev) => [data, ...prev]);
      addToast('success', 'Task created!');
    } catch {
      addToast('error', 'Failed to create task');
    }
  };

  const handleToggle = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );
    try {
      await updateTask(id, { completed: newCompleted });
      addToast('success', newCompleted ? 'Task completed 🎉' : 'Task reopened');
    } catch {
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !newCompleted } : t))
      );
      addToast('error', 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    const prev = tasks;
    setTasks((t) => t.filter((x) => x.id !== id));
    try {
      await deleteTask(id);
      addToast('success', 'Task deleted');
    } catch {
      setTasks(prev);
      addToast('error', 'Failed to delete task');
    }
  };

  const handleBreakdown = async (id) => {
    try {
      const { data } = await generateBreakdown(id);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, subTasks: data.subTasks } : t))
      );
      addToast('info', 'AI generated sub-tasks! 🤖');
    } catch {
      addToast('error', 'AI breakdown failed');
    }
  };

  const handleSubTaskToggle = async (taskId, subTaskId, completed) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subTasks: t.subTasks.map((s) =>
                s.id === subTaskId ? { ...s, completed } : s
              ),
            }
          : t
      )
    );
    try {
      await updateSubTask(taskId, { id: subTaskId, completed });
    } catch {
      loadTasks();
      addToast('error', 'Failed to update sub-task');
    }
  };

  // ----- filter helpers -----

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all';

  // ----- derived data -----
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  // ----- render -----
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {/* Branding */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <Sparkles size={20} className="text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                  Fluid AI
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Task Board
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Organize your work with AI-powered intelligence
              </p>
            </div>

            {/* Progress */}
            <ProgressIndicator total={totalTasks} completed={completedTasks} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4 pb-16 space-y-4">
        {/* Task input */}
        <TaskInput onAdd={handleAdd} />

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
        />

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${viewMode === 'list'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:bg-white/60'}`}
          >
            <List size={14} /> List
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${viewMode === 'kanban'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:bg-white/60'}`}
          >
            <LayoutGrid size={14} /> Kanban
          </button>
          <span className="ml-auto text-xs text-slate-400">
            {totalTasks} task{totalTasks !== 1 ? 's' : ''}
          </span>
        </div>

        {/* View */}
        {viewMode === 'list' ? (
          <TaskList
            tasks={tasks}
            loading={loading}
            hasFilters={hasFilters}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onBreakdown={handleBreakdown}
            onSubTaskToggle={handleSubTaskToggle}
          />
        ) : (
          <KanbanBoard
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onBreakdown={handleBreakdown}
            onSubTaskToggle={handleSubTaskToggle}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400">
        Built with ❤️ for Fluid AI &middot; React + FastAPI + AI
      </footer>
    </div>
  );
}
