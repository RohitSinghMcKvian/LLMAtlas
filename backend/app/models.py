from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Model(Base):
    __tablename__ = "models"
    id = Column(String, primary_key=True)
    name = Column(String)
    organization = Column(String)
    release_date = Column(String)
    license_type = Column(String)
    parameters = Column(String)
    context_window = Column(Integer)
    modalities = Column(String)  # JSON string
    vram_required = Column(String)
    api_available = Column(Boolean)
    status = Column(String)
    description = Column(Text)
    links = Column(Text)  # JSON string
    is_open_source = Column(Boolean)
    family = Column(String)
    version = Column(String)

class Benchmark(Base):
    __tablename__ = "benchmarks"
    id = Column(String, primary_key=True)
    name = Column(String)
    short_name = Column(String)
    category = Column(String)
    description = Column(Text)
    why_it_matters = Column(Text)
    limitations = Column(Text)
    higher_is_better = Column(Boolean)
    scale_min = Column(Float)
    scale_max = Column(Float)

class BenchmarkScore(Base):
    __tablename__ = "benchmark_scores"
    id = Column(Integer, primary_key=True)
    benchmark_id = Column(String)
    model_id = Column(String)
    score = Column(Float)
    raw_score = Column(Float)
    normalized_score = Column(Float)
    confidence_interval = Column(String)  # JSON string
    date_evaluated = Column(String)
    evaluator = Column(String)

class NewsItem(Base):
    __tablename__ = "news"
    id = Column(String, primary_key=True)
    title = Column(String)
    source = Column(String)
    date = Column(String)
    summary = Column(Text)
    tags = Column(String)  # JSON string
    url = Column(String)
    is_breaking = Column(Boolean)
    thumbnail = Column(String)