from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/models", tags=["models"])

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

@router.get("/", response_model=List[ModelResponse])
async def get_models():
    # Return mock data for now
    return []

@router.get("/{model_id}", response_model=ModelResponse)
async def get_model(model_id: str):
    # Return mock data for now
    return None