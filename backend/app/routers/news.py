from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/news", tags=["news"])

class NewsItemResponse(BaseModel):
    id: str
    title: str
    source: str
    date: str
    summary: str
    tags: List[str]
    url: str
    is_breaking: bool
    thumbnail: str

@router.get("/", response_model=List[NewsItemResponse])
async def get_news():
    # Return mock data for now
    return []

@router.get("/{news_id}", response_model=NewsItemResponse)
async def get_news_item(news_id: str):
    # Return mock data for now
    return None