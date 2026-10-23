"""
Pydantic v2 request / response schemas for the Task Board API.

Strict validation on create, lenient on update (all fields optional).
"""

from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator


# ---------- helpers ----------

PRIORITIES = Literal["high", "medium", "low"]
CATEGORIES = Literal["work", "personal", "shopping", "health", "other"]


def _validate_iso_date(v: Optional[str]) -> Optional[str]:
    """Ensure the string is a valid YYYY-MM-DD date."""
    if v is None:
        return v
    try:
        date.fromisoformat(v)
    except (ValueError, TypeError):
        raise ValueError("dueDate must be a valid ISO date (YYYY-MM-DD)")
    return v


# ---------- request schemas ----------


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    model_config = {"str_strip_whitespace": True}

    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=1000)
    priority: PRIORITIES = "medium"
    category: CATEGORIES = "other"
    dueDate: Optional[str] = None

    @field_validator("dueDate")
    @classmethod
    def check_due_date(cls, v: Optional[str]) -> Optional[str]:
        return _validate_iso_date(v)


class TaskUpdate(BaseModel):
    """Schema for partially updating a task. Every field is optional."""

    model_config = {"str_strip_whitespace": True}

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: Optional[PRIORITIES] = None
    category: Optional[CATEGORIES] = None
    completed: Optional[bool] = None
    dueDate: Optional[str] = None

    @field_validator("dueDate")
    @classmethod
    def check_due_date(cls, v: Optional[str]) -> Optional[str]:
        return _validate_iso_date(v)


class SubTaskUpdate(BaseModel):
    """Schema for toggling a sub-task's completion."""

    id: str
    completed: bool


# ---------- response schemas ----------


class SubTaskResponse(BaseModel):
    id: str
    title: str
    completed: bool


class TaskResponse(BaseModel):
    """Full task representation returned by the API."""

    id: str
    title: str
    description: str
    priority: str
    category: str
    completed: bool
    dueDate: Optional[str] = None
    createdAt: str
    subTasks: list[SubTaskResponse] = []
