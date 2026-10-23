/**
 * API service layer for the Task Board.
 *
 * Centralises every backend call so components never import axios
 * directly. Uses the Vite proxy in dev; set VITE_API_URL for production.
 *
 * @module services/api
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch tasks with optional filters.
 * @param {{ completed?: boolean, priority?: string, category?: string, search?: string }} filters
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const fetchTasks = (filters = {}) => {
  const params = {};
  if (filters.completed !== undefined && filters.completed !== null) {
    params.completed = filters.completed;
  }
  if (filters.priority) params.priority = filters.priority;
  if (filters.category) params.category = filters.category;
  if (filters.search) params.search = filters.search;
  return api.get('/api/tasks', { params });
};

/** Create a new task. */
export const createTask = (data) => api.post('/api/tasks', data);

/** Partially update a task. */
export const updateTask = (id, data) => api.patch(`/api/tasks/${id}`, data);

/** Delete a task permanently. */
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

/** Trigger AI-powered task breakdown. */
export const generateBreakdown = (id) => api.post(`/api/tasks/${id}/breakdown`);

/** Toggle a sub-task's completion. */
export const updateSubTask = (taskId, subTaskData) =>
  api.patch(`/api/tasks/${taskId}/subtasks`, subTaskData);
