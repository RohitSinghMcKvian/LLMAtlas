from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import models, benchmarks, news, search

app = FastAPI(title="LLMAtlas API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(models.router)
app.include_router(benchmarks.router)
app.include_router(news.router)
app.include_router(search.router)

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "LLMAtlas"}

# Simple data seeding function
def seed_data():
    print("Data seeding would happen here in a real implementation")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)