import os
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# .env.local 로드
env_path = os.path.join(os.path.dirname(__file__), ".env.local")
load_dotenv(dotenv_path=env_path)

import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("todos-backend")

# 환경 변수 및 설정
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.warning("DATABASE_URL environment variable is missing. Falling back to default: sqlite:///./todos.db")
    DATABASE_URL = "sqlite:///./todos.db"
else:
    logger.info("Loaded DATABASE_URL from environment")

FRONTEND_URL = os.getenv("FRONTEND_URL")
if not FRONTEND_URL:
    logger.warning("FRONTEND_URL environment variable is missing. Falling back to default: http://localhost:3000")
    FRONTEND_URL = "http://localhost:3000"
else:
    logger.info("Loaded FRONTEND_URL from environment")

# SQLAlchemy 설정
# sqlite인 경우 멀티스레드 접근을 허용하기 위한 connect_args 설정 필요
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ----------------- DB Model -----------------
class TodoModel(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD 포맷

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# ----------------- Pydantic Schema -----------------
class TodoBase(BaseModel):
    text: str = Field(..., description="할 일 내용")
    completed: bool = Field(default=False, description="완료 여부")
    date: str = Field(..., description="등록 일자 (YYYY-MM-DD 포맷)")

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    text: Optional[str] = Field(default=None, description="수정할 할 일 내용")
    completed: Optional[bool] = Field(default=None, description="수정할 완료 여부")
    date: Optional[str] = Field(default=None, description="수정할 등록 일자 (YYYY-MM-DD 포맷)")

class TodoResponse(TodoBase):
    id: int

    class Config:
        from_attributes = True

# ----------------- FastAPI App -----------------
app = FastAPI(
    title="Antigravity Todo API",
    description="FastAPI + SQLite 기반의 Todo 백엔드 API",
    version="1.0.0"
)

# CORS 설정
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if FRONTEND_URL and FRONTEND_URL not in origins:
    origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------- API Endpoints -----------------

@app.get("/", status_code=status.HTTP_200_OK)
def read_root():
    """백엔드 API 서버의 정상 작동 여부를 확인하는 헬스체크 엔드포인트"""
    return {"status": "ok", "message": "Antigravity Todo Backend API is running"}

@app.get("/todos", response_model=List[TodoResponse], status_code=status.HTTP_200_OK)
def get_todos(
    date: Optional[str] = Query(None, description="특정 날짜 필터 (YYYY-MM-DD)"),
    filter: Optional[str] = Query("all", description="필터 조건 (all, active, completed)"),
    search: Optional[str] = Query(None, description="검색 키워드"),
    db: Session = Depends(get_db)
):
    """
    Todo 아이템 목록을 조회합니다. 날짜 필터, 완료 여부 필터, 검색어를 데이터베이스 레벨에서 적용합니다.
    """
    query = db.query(TodoModel)

    # 1. 날짜 필터 적용
    if date:
        query = query.filter(TodoModel.date == date)

    # 2. 완료 상태 필터 적용
    if filter == "active":
        query = query.filter(TodoModel.completed == False)
    elif filter == "completed":
        query = query.filter(TodoModel.completed == True)

    # 3. 검색 키워드 필터 적용
    if search:
        # 대소문자 구분 없이 부분 일치 검색
        query = query.filter(TodoModel.text.ilike(f"%{search}%"))

    # ID 오름차순으로 정렬하여 일관된 렌더링 유지
    return query.order_by(TodoModel.id.asc()).all()

@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    """
    새로운 Todo 아이템을 생성하고 데이터베이스에 저장합니다.
    """
    db_todo = TodoModel(
        text=todo.text,
        completed=todo.completed,
        date=todo.date
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.get("/todos/{todo_id}", response_model=TodoResponse, status_code=status.HTTP_200_OK)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    특정 ID의 Todo 아이템을 단건 조회합니다.
    """
    db_todo = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo item with id {todo_id} not found"
        )
    return db_todo

@app.put("/todos/{todo_id}", response_model=TodoResponse, status_code=status.HTTP_200_OK)
def update_todo(todo_id: int, todo_update: TodoUpdate, db: Session = Depends(get_db)):
    """
    특정 ID의 Todo 아이템을 수정하거나 완료 상태를 변경합니다.
    """
    db_todo = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo item with id {todo_id} not found"
        )

    # 제공된 필드가 있을 때만 값 업데이트
    update_data = todo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_todo, key, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    특정 ID의 Todo 아이템을 데이터베이스에서 영구 삭제합니다.
    """
    db_todo = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo item with id {todo_id} not found"
        )
    db.delete(db_todo)
    db.commit()
    return None
