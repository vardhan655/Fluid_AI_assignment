"""
Data models and thread-safe in-memory storage with JSON persistence.

This module provides the core data structures for tasks and a singleton
TaskStore that handles CRUD operations with automatic file persistence
and crash recovery.
"""

import json
import logging
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from uuid import uuid4

logger = logging.getLogger(__name__)

STORAGE_FILE = Path(__file__).parent / "tasks.json"


class TaskStore:
    """Thread-safe in-memory task store with JSON file persistence.

    Uses a singleton pattern so every part of the application shares
    the same store instance. All mutations are guarded by a
    threading.Lock and automatically flushed to disk.
    """

    _instance: Optional["TaskStore"] = None
    _lock = threading.Lock()

    def __new__(cls) -> "TaskStore":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    instance = super().__new__(cls)
                    instance._tasks: dict[str, dict] = {}
                    instance._file_lock = threading.Lock()
                    instance._load_from_file()
                    cls._instance = instance
        return cls._instance

    # ------------------------------------------------------------------
    # Persistence helpers
    # ------------------------------------------------------------------

    def _load_from_file(self) -> None:
        """Load tasks from the JSON file, recovering gracefully on error."""
        if not STORAGE_FILE.exists():
            logger.info("No existing tasks.json — starting with empty store.")
            return
        try:
            raw = STORAGE_FILE.read_text(encoding="utf-8")
            data = json.loads(raw)
            if isinstance(data, list):
                self._tasks = {t["id"]: t for t in data if isinstance(t, dict) and "id" in t}
            elif isinstance(data, dict):
                self._tasks = data
            else:
                raise ValueError("Unexpected root type in tasks.json")
            logger.info("Loaded %d tasks from disk.", len(self._tasks))
        except (json.JSONDecodeError, ValueError, KeyError) as exc:
            logger.warning("Corrupt tasks.json — starting fresh. Error: %s", exc)
            backup = STORAGE_FILE.with_suffix(".json.bak")
            STORAGE_FILE.rename(backup)
            self._tasks = {}

    def _save_to_file(self) -> None:
        """Persist the current task dict to disk as a JSON array."""
        try:
            with self._file_lock:
                STORAGE_FILE.write_text(
                    json.dumps(list(self._tasks.values()), indent=2, default=str),
                    encoding="utf-8",
                )
        except OSError as exc:
            logger.error("Failed to write tasks.json: %s", exc)

    # ------------------------------------------------------------------
    # Public CRUD API
    # ------------------------------------------------------------------

    def add(self, task: dict) -> dict:
        """Insert a new task and persist."""
        with self._lock:
            self._tasks[task["id"]] = task
            self._save_to_file()
        return task

    def get(self, task_id: str) -> Optional[dict]:
        """Return a single task by ID, or None."""
        return self._tasks.get(task_id)

    def get_all(self) -> list[dict]:
        """Return every task as a list, newest first."""
        return sorted(
            self._tasks.values(),
            key=lambda t: t.get("createdAt", ""),
            reverse=True,
        )

    def update(self, task_id: str, updates: dict) -> Optional[dict]:
        """Merge *updates* into an existing task. Returns the updated task."""
        with self._lock:
            task = self._tasks.get(task_id)
            if task is None:
                return None
            task.update(updates)
            self._save_to_file()
        return task

    def delete(self, task_id: str) -> bool:
        """Remove a task. Returns True if it existed."""
        with self._lock:
            if task_id not in self._tasks:
                return False
            del self._tasks[task_id]
            self._save_to_file()
        return True


def new_task(
    title: str,
    description: str = "",
    priority: str = "medium",
    category: str = "other",
    due_date: Optional[str] = None,
) -> dict:
    """Factory for creating a well-formed task dict."""
    return {
        "id": str(uuid4()),
        "title": title,
        "description": description,
        "priority": priority,
        "category": category,
        "completed": False,
        "dueDate": due_date,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "subTasks": [],
    }
