from fastapi import APIRouter, HTTPException
from typing import List
from pydictionary import BaseModel
import json

router = APIRouter(prefix="/api/mock", tags=["mock"])

class ModelResponse(BaseModel):
    id: str
    name: str
    organization: str
    release_date: str
    license_type: str
    parameters: str
    context_window: int
    modalities: List[str]
    vram_required: str
    api_available: bool
    status: str
    description: str
    links: dict
    is_open_source: bool
    family: str
    version: str

# Simple mock data access for the backend
def get_models():
    return []

def get_benchmarks():
    return []

def get_news():
    return []

def get_guides():
    return []

def get_lessons():
    return []

def get_lessons():
    return []