"""
DAC Dashboard — FastAPI Server
Python port dari dashboard/server.js

Jalankan:
    uvicorn main:app --reload --port 3737
    atau: python -m uvicorn main:app --reload --port 3737
"""

from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, PlainTextResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel
from parsers import (
    load_tasks,
    load_specs,
    load_brief,
    load_backlog,
    load_archive,
    update_task_status,
    toggle_subtask_state,
    archive_task,
)
from scanner import scan, generate_section, write_to_brief

# ── App Setup ─────────────────────────────────────────────────────────────────

ROOT = Path(__file__).parent.parent
DASHBOARD_DIR = Path(__file__).parent
PROMPT_GUIDE = ROOT / "PROMPT_GUIDE.md"

app = FastAPI(
    title="DAC Dashboard API",
    description="Document-as-Code local dashboard",
    version="2.0.0",
    docs_url="/api/docs",
)


# ── API Routes ────────────────────────────────────────────────────────────────

@app.get("/api/tasks")
async def get_tasks():
    return JSONResponse(content=load_tasks(), headers={"Cache-Control": "no-cache"})


@app.get("/api/brief")
async def get_brief():
    return load_brief()


@app.get("/api/backlog")
async def get_backlog():
    return JSONResponse(content=load_backlog(), headers={"Cache-Control": "no-cache"})


@app.get("/api/archive")
async def get_archive():
    return JSONResponse(content=load_archive(), headers={"Cache-Control": "no-cache"})


@app.get("/api/specs")
async def get_specs():
    return JSONResponse(content=load_specs(), headers={"Cache-Control": "no-cache"})


@app.get("/api/prompt-guide", response_class=PlainTextResponse)
async def get_prompt_guide():
    if PROMPT_GUIDE.exists():
        return PROMPT_GUIDE.read_text(encoding="utf-8")
    return "# Prompt Guide\nFile PROMPT_GUIDE.md tidak ditemukan."


@app.get("/api/scan")
async def get_scan():
    try:
        result = scan()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/scan/write")
async def post_scan_write():
    try:
        result = scan()
        section = generate_section(result)
        write_to_brief(section)
        return {"success": True, "section": section}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Pydantic Request Models ──────────────────────────────────────────────────

class StatusUpdate(BaseModel):
    status: str

class SubtaskUpdate(BaseModel):
    done: bool

class ArchiveRequest(BaseModel):
    problem: str
    solution: str
    commit_hash: str


# ── Write-back API Routes ─────────────────────────────────────────────────────

@app.put("/api/tasks/{task_id}/status")
async def put_task_status(task_id: str, payload: StatusUpdate):
    success = update_task_status(task_id, payload.status)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True}


@app.put("/api/tasks/{task_id}/subtasks/{index}")
async def put_subtask_state(task_id: str, index: int, payload: SubtaskUpdate):
    success = toggle_subtask_state(task_id, index, payload.done)
    if not success:
        raise HTTPException(status_code=404, detail="Task or subtask index not found")
    return {"success": True}


@app.post("/api/tasks/{task_id}/archive")
async def post_archive_task(task_id: str, payload: ArchiveRequest):
    success = archive_task(task_id, payload.problem, payload.solution, payload.commit_hash)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True}



# ── Health Check ─────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "2.0.0", "runtime": "FastAPI"}


# ── Serve Frontend (index.html) ───────────────────────────────────────────────
# Semua route selain /api/* diarahkan ke index.html

@app.get("/")
async def serve_index():
    index = DASHBOARD_DIR / "index.html"
    if index.exists():
        return FileResponse(str(index))
    raise HTTPException(status_code=404, detail="index.html not found")


# Fallback untuk semua route non-API (SPA support)
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    # Cek apakah file statis ada (css, js, gambar)
    static_file = DASHBOARD_DIR / full_path
    if static_file.exists() and static_file.is_file():
        return FileResponse(str(static_file))
    # Fallback ke index.html untuk SPA routing
    index = DASHBOARD_DIR / "index.html"
    if index.exists():
        return FileResponse(str(index))
    raise HTTPException(status_code=404, detail="Not found")


# ── Entry Point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    print("\n🚀 DAC Dashboard (FastAPI) running at http://localhost:3737\n")
    print(f"   Reading tasks from: {ROOT / 'Tasks'}")
    print(f"   Reading brief from: {ROOT / 'Specs' / 'brief.md'}\n")
    uvicorn.run("main:app", host="0.0.0.0", port=3737, reload=True)
