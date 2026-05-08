from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
from . import models, benchmarks, news, guides

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

class NewsItemResponse(BaseModel):
    id: str
    title: str
    source: str
    date: str
    summary: str
    tags: List[str]
    url: str
    is_breaking: bool
    thumbnail: Optional[str] = None

def get_models(db: Session, skip: int = 0, limit: int = 100):
    # This would be a real implementation in a full backend
    pass

def get_benchmarks(db: Session, skip: int = 0, limit: int = 100):
    # This would be a real implementation in a full backend
    pass

def get_news(db: Session, skip: int = 0, limit: int = 100):
    # This would be a real implementation in a full backend
    pass

def search_models(db: Session, query: str):
    # This would be a real implementation in a full backend
    pass