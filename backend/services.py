"""
Business-logic service layer for the Task Board.

Keeps route handlers thin by encapsulating all domain logic here,
including the mock AI task-breakdown generator.
"""

import asyncio
import re
from typing import Optional
from uuid import uuid4

from models import TaskStore, new_task
from schemas import SubTaskUpdate, TaskCreate, TaskUpdate


# ------------------------------------------------------------------
# AI breakdown keyword mapping
# ------------------------------------------------------------------

_KEYWORD_SUBTASKS: dict[str, list[str]] = {
    "website|web app|landing page|frontend|ui": [
        "Research design inspiration and define visual requirements",
        "Build responsive layout with component architecture",
        "Write tests, optimize performance, and deploy",
    ],
    "api|backend|server|endpoint|microservice": [
        "Define API contracts, data models, and authentication flow",
        "Implement endpoints with validation and error handling",
        "Write integration tests and set up CI/CD pipeline",
    ],
    "database|migration|schema|data model": [
        "Audit current schema and plan migration strategy",
        "Write and test migration scripts with rollback support",
        "Validate data integrity and update documentation",
    ],
    "deploy|release|launch|ship": [
        "Prepare release checklist and staging environment",
        "Run smoke tests and verify monitoring/alerting",
        "Execute deployment and communicate release notes",
    ],
    "test|qa|quality|bug": [
        "Identify critical paths and write test plan",
        "Implement automated tests covering edge cases",
        "Run regression suite and document coverage report",
    ],
    "design|ux|ui|mockup|wireframe|figma": [
        "Conduct user research and define design requirements",
        "Create wireframes and high-fidelity mockups",
        "Build interactive prototype and gather feedback",
    ],
    "report|document|write|blog|article": [
        "Research and outline key sections",
        "Draft content with supporting data and visuals",
        "Review, proofread, and publish final version",
    ],
    "meeting|presentation|demo|pitch": [
        "Prepare agenda and supporting materials",
        "Create slide deck with key talking points",
        "Rehearse delivery and gather feedback",
    ],
    "learn|study|course|training|read": [
        "Identify learning resources and set schedule",
        "Complete core material and take notes",
        "Build a practice project to reinforce concepts",
    ],
    "hire|recruit|interview|onboard": [
        "Define role requirements and create job listing",
        "Screen candidates and conduct interviews",
        "Extend offer and prepare onboarding plan",
    ],
    "budget|finance|cost|expense|invoice": [
        "Gather financial data and categorize expenses",
        "Analyze spending patterns and identify savings",
        "Create budget proposal and present recommendations",
    ],
    "clean|organize|sort|declutter": [
        "Survey area and categorize items to keep/discard",
        "Deep clean and reorganize space efficiently",
        "Set up maintenance routine to stay organized",
    ],
    "shop|buy|purchase|order|grocery": [
        "Research options, compare prices, and read reviews",
        "Create prioritized shopping list with budget",
        "Purchase items and verify order/delivery",
    ],
    "exercise|workout|gym|run|health|fitness": [
        "Set specific fitness goals and create a schedule",
        "Plan workout routines with progressive overload",
        "Track progress and adjust plan based on results",
    ],
}

_DEFAULT_SUBTASKS = [
    "Break down requirements and create a detailed plan",
    "Execute the core work with regular progress checks",
    "Review results, gather feedback, and finalize",
]


def _generate_subtasks(title: str) -> list[dict]:
    """Produce three contextually relevant sub-tasks for *title*.

    Scans the title against keyword patterns and returns the best
    matching sub-task set. Falls back to generic but useful defaults.
    """
    title_lower = title.lower()
    for pattern, subtasks in _KEYWORD_SUBTASKS.items():
        if re.search(pattern, title_lower):
            return [
                {"id": str(uuid4()), "title": s, "completed": False}
                for s in subtasks
            ]
    return [
        {"id": str(uuid4()), "title": s, "completed": False}
        for s in _DEFAULT_SUBTASKS
    ]


# ------------------------------------------------------------------
# Service class
# ------------------------------------------------------------------


class TaskService:
    """Encapsulates all task-related business logic."""

    def __init__(self) -> None:
        self._store = TaskStore()

    # -- create --------------------------------------------------------

    def create_task(self, data: TaskCreate) -> dict:
        """Validate input, build a task dict, and persist it."""
        task = new_task(
            title=data.title,
            description=data.description,
            priority=data.priority,
            category=data.category,
            due_date=data.dueDate,
        )
        return self._store.add(task)

    # -- read ----------------------------------------------------------

    def get_tasks(
        self,
        completed: Optional[bool] = None,
        priority: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> list[dict]:
        """Return tasks filtered by the given criteria."""
        tasks = self._store.get_all()

        if completed is not None:
            tasks = [t for t in tasks if t["completed"] is completed]
        if priority:
            tasks = [t for t in tasks if t["priority"] == priority]
        if category:
            tasks = [t for t in tasks if t["category"] == category]
        if search:
            q = search.lower()
            tasks = [
                t
                for t in tasks
                if q in t["title"].lower() or q in t.get("description", "").lower()
            ]

        return tasks

    def get_task(self, task_id: str) -> Optional[dict]:
        return self._store.get(task_id)

    # -- update --------------------------------------------------------

    def update_task(self, task_id: str, data: TaskUpdate) -> Optional[dict]:
        """Apply partial updates to an existing task."""
        updates = data.model_dump(exclude_unset=True)
        if not updates:
            return self._store.get(task_id)
        return self._store.update(task_id, updates)

    def update_subtask(self, task_id: str, data: SubTaskUpdate) -> Optional[dict]:
        """Toggle the completed flag on a single sub-task."""
        task = self._store.get(task_id)
        if task is None:
            return None

        for st in task.get("subTasks", []):
            if st["id"] == data.id:
                st["completed"] = data.completed
                break
        else:
            return None  # sub-task not found

        return self._store.update(task_id, {"subTasks": task["subTasks"]})

    # -- delete --------------------------------------------------------

    def delete_task(self, task_id: str) -> bool:
        return self._store.delete(task_id)

    # -- AI breakdown --------------------------------------------------

    async def generate_breakdown(self, task_id: str) -> Optional[dict]:
        """Generate AI-powered sub-tasks for the given task.

        Uses keyword analysis to produce contextually relevant sub-tasks.
        Includes a short delay to simulate LLM processing time.
        """
        task = self._store.get(task_id)
        if task is None:
            return None

        # Simulate AI processing latency
        await asyncio.sleep(0.5)

        subtasks = _generate_subtasks(task["title"])
        self._store.update(task_id, {"subTasks": subtasks})

        return {
            "taskId": task_id,
            "subTasks": subtasks,
        }
