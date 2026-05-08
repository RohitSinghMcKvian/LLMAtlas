from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/benchmarks", tags=["benchmarks"])

class BenchmarkResponse(BaseModel):
    id: str
    name: str
    short_name: str
    category: str
    description: str
    why_it_matters: str
    limitations: str
    higher_is_better: bool
    scale_min: float
    scale_max: float

class BenchmarkScoreResponse(BaseModel):
    benchmark_id: str
    model_id: str
    score: float
    raw_score: float
    normalized_score: float
    confidence_interval: List[float]
    date_evaluated: str
    evaluator: str

@router.get("/", response_model=List[BenchmarkResponse])
async def get_benchmarks():
    # Return mock data for now
    return []

@router.get("/scores", response_model=List[BenchmarkScoreResponse])
async def get_benchmark_scores():
    # Return mock data for now
    return []