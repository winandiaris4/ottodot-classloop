"""
DAC Markdown Parsers — Python port dari fungsi-fungsi di server.js
Digunakan oleh main.py untuk membaca semua data DAC dari file Markdown.
"""

import re
import os
from pathlib import Path
from typing import Any

ROOT     = Path(__file__).parent.parent
TASKS_DIR = ROOT / "Tasks"
SPECS_DIR = ROOT / "Specs"
BRIEF_FILE = ROOT / "Specs" / "brief.md"


# ── Front Matter Parser ──────────────────────────────────────────────────────

def parse_front_matter(content: str) -> tuple[dict, str]:
    """Parse YAML front matter dari konten Markdown."""
    match = re.match(r"^---\n([\s\S]*?)\n---", content)
    if not match:
        return {}, content

    raw = match.group(1)
    data: dict[str, Any] = {}

    for line in raw.split("\n"):
        colon_idx = line.find(":")
        if colon_idx == -1:
            continue
        key = line[:colon_idx].strip()
        val: Any = line[colon_idx + 1:].strip()

        # Parse array: ["001", "002"] atau []
        if val.startswith("["):
            try:
                val = eval(val)  # safe untuk YAML-style arrays
                if not isinstance(val, list):
                    val = []
            except Exception:
                val = []
        else:
            # Strip quotes
            val = val.strip('"\'')

        data[key] = val

    body = content[match.end():].strip()
    return data, body


# ── Load Tasks ───────────────────────────────────────────────────────────────

def load_tasks() -> list[dict]:
    tasks = []
    if not TASKS_DIR.exists():
        return tasks

    files = sorted(
        f for f in TASKS_DIR.iterdir()
        if re.match(r"^task-\d+\.md$", f.name)
    )

    for file in files:
        raw = file.read_text(encoding="utf-8")
        data, content = parse_front_matter(raw)

        # Count checkboxes
        checkboxes = re.findall(r"- \[[ x]\]", content)
        done_count = len(re.findall(r"- \[x\]", content))
        total = len(checkboxes)

        # Parse subtask items
        list_items = []
        current_item = None
        for line in content.split("\n"):
            task_match = re.match(r"^\s*-\s+\[([ x])\]\s+(.*)", line)
            if task_match:
                if current_item:
                    list_items.append(current_item)
                current_item = {
                    "done": task_match.group(1) == "x",
                    "text": task_match.group(2).strip(),
                    "verification": "",
                }
            elif current_item and line.strip().startswith("*Verification:*"):
                current_item["verification"] = line.replace("*Verification:*", "").strip()
        if current_item:
            list_items.append(current_item)

        # Extract sections
        tech_match = re.search(r"## 🔍 Analisis Teknis\s*\n([\s\S]*?)(?=\n##|$)", content)
        ref_match  = re.search(r"## 📎 Referenced Files\s*\n([\s\S]*?)(?=\n##|$)", content)
        notes_match = re.search(r"## 💬 Notes\s*\n([\s\S]*?)(?=\n##|$)", content)

        blocked_by = data.get("blocked_by", [])
        blocks     = data.get("blocks", [])

        tasks.append({
            "id":       data.get("id", file.stem.replace("task-", "")),
            "title":    data.get("title", "Untitled"),
            "status":   (data.get("status", "TODO")).upper(),
            "urgency":  (data.get("urgency", "MEDIUM")).upper(),
            "category": data.get("category", "Other"),
            "created_at": data.get("created_at", ""),
            "blocked_by": blocked_by if isinstance(blocked_by, list) else [],
            "blocks":     blocks if isinstance(blocks, list) else [],
            "progress": round((done_count / total) * 100) if total > 0 else 0,
            "subtasks": {
                "done": done_count,
                "total": total,
                "items": list_items,
            },
            "details": {
                "analysis": tech_match.group(1).strip() if tech_match else "",
                "refFiles": ref_match.group(1).strip() if ref_match else "",
                "notes":    notes_match.group(1).strip() if notes_match else "",
            },
        })

    return tasks


# ── Load Specs ───────────────────────────────────────────────────────────────

def load_specs() -> list[dict]:
    specs = []
    if not SPECS_DIR.exists():
        return specs

    files = [
        f for f in SPECS_DIR.iterdir()
        if f.suffix == ".md" and f.name != "_index.md"
    ]

    for file in files:
        raw = file.read_text(encoding="utf-8")
        data, content = parse_front_matter(raw)

        specs.append({
            "filename": file.name,
            "id":       data.get("id", file.stem.upper()),
            "title":    data.get("title", file.stem.replace("-", " ")),
            "status":   (data.get("status", "DRAFT")).upper(),
            "type":     (data.get("type", "FEATURE")).upper(),
            "created_at": data.get("created_at", ""),
            "author":   data.get("author", ""),
            "content":  content,
        })

    # Prioritas: brief, vision, architecture di atas
    priority = ["brief.md", "vision.md", "architecture.md"]

    def sort_key(s):
        try:
            return priority.index(s["filename"])
        except ValueError:
            return len(priority) + 1

    return sorted(specs, key=sort_key)


# ── Load Brief ───────────────────────────────────────────────────────────────

def load_brief() -> dict:
    if not BRIEF_FILE.exists():
        return {"name": "Project", "description": "", "sourceDir": "src/"}

    raw = BRIEF_FILE.read_text(encoding="utf-8")

    name_match   = re.search(r"##\s+🎯\s+Nama Proyek\s*\n([^\n#]+)", raw)
    desc_match   = re.search(r"##\s+📖\s+Deskripsi\s*\n([^\n#]+)", raw)
    src_match    = re.search(r"\*\*Source Dir\*\*:\s*`([^`]+)`", raw)

    return {
        "name":        name_match.group(1).strip() if name_match else "Project",
        "description": desc_match.group(1).strip() if desc_match else "",
        "sourceDir":   src_match.group(1).strip() if src_match else "src/",
    }


# ── Load Backlog ─────────────────────────────────────────────────────────────

def load_backlog() -> list[dict]:
    index_file = TASKS_DIR / "_index.md"
    if not index_file.exists():
        return []

    raw = index_file.read_text(encoding="utf-8")
    backlog_match = re.search(
        r"## 📋 Backlog[\s\S]*?\n\| --- \|[\s\S]*?\n([\s\S]*?)(?=\n---|$)",
        raw
    )
    if not backlog_match:
        return []

    items = []
    for line in backlog_match.group(1).strip().split("\n"):
        if not line.strip().startswith("|"):
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) < 6 or parts[1].startswith("ID") or parts[1].startswith("---"):
            continue
        items.append({
            "id":       parts[1],
            "title":    parts[2],
            "category": parts[3].replace("`", ""),
            "urgency":  parts[4].replace("`", ""),
            "notes":    parts[5],
        })
    return items


# ── Load Archive ─────────────────────────────────────────────────────────────

def load_archive() -> list[dict]:
    archive_dir = TASKS_DIR / "Archive"
    if not archive_dir.exists():
        return []

    files = sorted(
        [f for f in archive_dir.iterdir() if re.match(r"^task-\d+\.md$", f.name)],
        key=lambda f: f.name,
        reverse=True,
    )

    archive = []
    for file in files:
        raw = file.read_text(encoding="utf-8")
        task_id = file.stem.replace("task-", "")

        problem_match  = re.search(r"-\s+\*\*Masalah:\*\*\s*(.*)", raw, re.IGNORECASE)
        solution_match = re.search(r"-\s+\*\*Solusi:\*\*\s*(.*)", raw, re.IGNORECASE)
        commit_match   = re.search(r"-\s+\*\*Commit:\*\*\s*(.*)", raw, re.IGNORECASE)

        archive.append({
            "id":       task_id,
            "problem":  problem_match.group(1).strip() if problem_match else "(tidak tercantum)",
            "solution": solution_match.group(1).strip() if solution_match else "(tidak tercantum)",
            "commit":   commit_match.group(1).strip() if commit_match else "(tidak tercantum)",
        })

    return archive


# ── Write Back Utilities ──────────────────────────────────────────────────────

def update_task_status(task_id: str, new_status: str) -> bool:
    """Updates status in task file front matter and Tasks/_index.md."""
    task_id_padded = task_id.zfill(3)
    task_file = TASKS_DIR / f"task-{task_id_padded}.md"
    if not task_file.exists():
        return False

    status_upper = new_status.upper()

    # 1. Update task file front matter
    content = task_file.read_text(encoding="utf-8")
    content = re.sub(
        r'(\bstatus:\s*)(["\']?)[a-zA-Z_]+(["\']?)',
        rf'\1\2{status_upper}\3',
        content
    )
    task_file.write_text(content, encoding="utf-8")

    # 2. Update Tasks/_index.md
    index_file = TASKS_DIR / "_index.md"
    if index_file.exists():
        index_content = index_file.read_text(encoding="utf-8")
        # Match task ID row in the table, e.g. | 004 | `TODO` |
        pattern = rf'(^\|\s*{task_id_padded}\s*\|\s*`)\w+(`\s*\|)'
        index_content = re.sub(
            pattern,
            rf'\1{status_upper}\2',
            index_content,
            flags=re.MULTILINE
        )
        index_file.write_text(index_content, encoding="utf-8")

    return True


def toggle_subtask_state(task_id: str, subtask_index: int, done: bool) -> bool:
    """Toggles N-th subtask done state (checkbox) in task markdown file."""
    task_id_padded = task_id.zfill(3)
    task_file = TASKS_DIR / f"task-{task_id_padded}.md"
    if not task_file.exists():
        return False

    content = task_file.read_text(encoding="utf-8")
    lines = content.splitlines()

    match_idx = 0
    updated = False
    for i, line in enumerate(lines):
        match = re.match(r"^(\s*-\s+\[)([ x])(\]\s+.*)", line)
        if match:
            if match_idx == subtask_index:
                new_char = 'x' if done else ' '
                lines[i] = f"{match.group(1)}{new_char}{match.group(3)}"
                updated = True
                break
            match_idx += 1

    if updated:
        has_trailing = content.endswith("\n")
        new_content = "\n".join(lines)
        if has_trailing:
            new_content += "\n"
        task_file.write_text(new_content, encoding="utf-8")
        return True

    return False


def archive_task(task_id: str, problem: str, solution: str, commit_hash: str) -> bool:
    """Archives active task, moves it to Archive/, and deletes active file."""
    task_id_padded = task_id.zfill(3)
    task_file = TASKS_DIR / f"task-{task_id_padded}.md"
    archive_dir = TASKS_DIR / "Archive"
    archive_dir.mkdir(parents=True, exist_ok=True)
    archive_file = archive_dir / f"task-{task_id_padded}.md"

    # 1. Update Tasks/_index.md status to DONE
    update_task_status(task_id_padded, "DONE")

    # 2. Write compressed post-mortem file
    post_mortem = f"""# Post-Mortem Task {task_id_padded}
- **Masalah:** {problem}
- **Solusi:** {solution}
- **Commit:** {commit_hash}
"""
    archive_file.write_text(post_mortem, encoding="utf-8")

    # 3. Delete active task file
    if task_file.exists():
        task_file.unlink()

    return True

