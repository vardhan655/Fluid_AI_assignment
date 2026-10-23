"""
FastAPI application for the Task Board API.

Provides RESTful endpoints for task CRUD operations and an AI-powered
task-breakdown feature. Uses dependency injection for the service layer
and clean separation of concerns.
"""

from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from schemas import SubTaskUpdate, TaskCreate, TaskResponse, TaskUpdate
from services import TaskService

# ------------------------------------------------------------------
# Application setup
# ------------------------------------------------------------------

app = FastAPI(
    title="Task Board API",
    description="A production-ready task management API with AI-powered features.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------
# Dependency injection
# ------------------------------------------------------------------

def get_task_service() -> TaskService:
    """Provide a TaskService instance to route handlers."""
    return TaskService()


# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------

@app.get("/", tags=["root"])
async def root() -> dict:
    """Health-check / API info endpoint."""
    return {
        "application": "Task Board API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "tasks": "/api/tasks",
            "task_detail": "/api/tasks/{id}",
            "ai_breakdown": "/api/tasks/{id}/breakdown",
        },
    }


@app.post(
    "/api/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["tasks"],
)
async def create_task(
    body: TaskCreate,
    svc: TaskService = Depends(get_task_service),
) -> dict:
    """Create a new task with validated input."""
    return svc.create_task(body)


@app.get("/api/tasks", response_model=list[TaskResponse], tags=["tasks"])
async def list_tasks(
    completed: Optional[bool] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    svc: TaskService = Depends(get_task_service),
) -> list[dict]:
    """Retrieve tasks with optional filtering."""
    return svc.get_tasks(
        completed=completed,
        priority=priority,
        category=category,
        search=search,
    )


@app.get("/api/tasks/{task_id}", response_model=TaskResponse, tags=["tasks"])
async def get_task(
    task_id: str,
    svc: TaskService = Depends(get_task_service),
) -> dict:
    """Retrieve a single task by ID."""
    task = svc.get_task(task_id)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@app.patch("/api/tasks/{task_id}", response_model=TaskResponse, tags=["tasks"])
async def update_task(
    task_id: str,
    body: TaskUpdate,
    svc: TaskService = Depends(get_task_service),
) -> dict:
    """Partially update an existing task."""
    task = svc.update_task(task_id, body)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@app.delete(
    "/api/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["tasks"],
)
async def delete_task(
    task_id: str,
    svc: TaskService = Depends(get_task_service),
) -> None:
    """Permanently remove a task."""
    if not svc.delete_task(task_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Task not found")


@app.post("/api/tasks/{task_id}/breakdown", tags=["ai"])
async def ai_breakdown(
    task_id: str,
    svc: TaskService = Depends(get_task_service),
) -> dict:
    """Use the AI engine to decompose a task into actionable sub-tasks."""
    result = await svc.generate_breakdown(task_id)
    if result is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Task not found")
    return result


@app.patch("/api/tasks/{task_id}/subtasks", response_model=TaskResponse, tags=["tasks"])
async def update_subtask(
    task_id: str,
    body: SubTaskUpdate,
    svc: TaskService = Depends(get_task_service),
) -> dict:
    """Toggle a sub-task's completion status."""
    task = svc.update_subtask(task_id, body)
    if task is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="Task or sub-task not found",
        )
    return task
