"""
DAC Project Scanner — Python port of scan-project.js
Usage:
    python scanner.py           → print detected info
    python scanner.py --write   → auto-update Specs/brief.md
"""

import sys
import os
import re
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
BRIEF = ROOT / "Specs" / "brief.md"
WRITE = "--write" in sys.argv
SILENT = "--silent" in sys.argv

SKIP_DIRS = {
    "Tasks", ".agents", "dashboard", "node_modules", ".git",
    "__pycache__", ".venv", "venv", "env", ".env",
    "dist", "build", ".next", "out", ".cache", "coverage",
    "static", "media", "migrations",
}

SOURCE_SIGNALS = {
    "app":      [r"manage\.py", r"settings\.py", r"urls\.py", r"\.py$"],
    "src":      [r"\.(ts|tsx|js|jsx|py|go|rs)$"],
    "backend":  [r"\.(py|go|ts|js)$"],
    "frontend": [r"\.(ts|tsx|js|jsx|vue|svelte)$"],
    "api":      [r"\.(py|ts|js|go)$"],
    "lib":      [r"\.(ts|js|py)$"],
    "core":     [r"\.(py|go|rs)$"],
}


def exists(p: str) -> bool:
    return (ROOT / p).exists()


def read(p: str) -> str:
    try:
        return (ROOT / p).read_text(encoding="utf-8")
    except Exception:
        return ""


def is_dir(p: str) -> bool:
    return (ROOT / p).is_dir()


def list_dir(p: str) -> list[str]:
    try:
        return os.listdir(ROOT / p)
    except Exception:
        return []


def has_file(directory: str, patterns: list[str]) -> bool:
    files = list_dir(directory)
    for f in files:
        for pat in patterns:
            if re.search(pat, f):
                return True
    return False


def detect_source_dirs() -> list[str]:
    found = []
    for dir_name, signals in SOURCE_SIGNALS.items():
        if is_dir(dir_name) and has_file(dir_name, signals):
            found.append(dir_name + "/")
    if exists("manage.py"):
        found.insert(0, ".")
    return list(dict.fromkeys(found))  # deduplicate


def detect_stack() -> dict:
    stack = {"backend": [], "frontend": [], "database": [], "infra": [], "tools": []}

    # Python frameworks
    reqs = (
        read("requirements.txt") + read("Pipfile") +
        read("pyproject.toml") + read("app/requirements.txt")
    )
    if "django" in reqs:
        stack["backend"].append("Django")
    if "djangorestframework" in reqs or "rest_framework" in reqs:
        stack["backend"].append("Django REST Framework")
    if "fastapi" in reqs:
        stack["backend"].append("FastAPI")
    if "flask" in reqs:
        stack["backend"].append("Flask")
    if "celery" in reqs:
        stack["infra"].append("Celery")
    if "redis" in reqs:
        stack["infra"].append("Redis")
    if "psycopg" in reqs:
        stack["database"].append("PostgreSQL")
    if "pymysql" in reqs or "mysqlclient" in reqs:
        stack["database"].append("MySQL")
    if "pymongo" in reqs:
        stack["database"].append("MongoDB")

    # Node.js / JS frameworks
    pkg_raw = read("package.json")
    if pkg_raw:
        try:
            pkg = json.loads(pkg_raw)
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            if "next" in deps:         stack["frontend"].append("Next.js")
            if "react" in deps:        stack["frontend"].append("React")
            if "vue" in deps:          stack["frontend"].append("Vue")
            if "svelte" in deps:       stack["frontend"].append("Svelte")
            if "vite" in deps:         stack["tools"].append("Vite")
            if "express" in deps:      stack["backend"].append("Express")
            if "fastify" in deps:      stack["backend"].append("Fastify")
            if "prisma" in deps or "@prisma/client" in deps:
                stack["database"].append("Prisma ORM")
            if "tailwindcss" in deps:  stack["frontend"].append("TailwindCSS")
            if "typescript" in deps:   stack["tools"].append("TypeScript")
        except json.JSONDecodeError:
            pass

    # Go
    if exists("go.mod"):
        gomod = read("go.mod")
        stack["backend"].append("Go")
        if "gin-gonic" in gomod: stack["backend"].append("Gin")
        if "echo" in gomod:      stack["backend"].append("Echo")

    # Rust
    if exists("Cargo.toml"):
        stack["backend"].append("Rust")
        cargo = read("Cargo.toml")
        if "actix" in cargo: stack["backend"].append("Actix-web")
        if "axum" in cargo:  stack["backend"].append("Axum")

    # Docker / Infra
    dc_content = read("docker-compose.yml") or read("docker-compose.yaml")
    if dc_content:
        stack["infra"].append("Docker Compose")
        if "nginx" in dc_content:         stack["infra"].append("Nginx")
        if "postgres" in dc_content:      stack["database"].append("PostgreSQL")
        if "mysql" in dc_content:         stack["database"].append("MySQL")
        if "redis" in dc_content:         stack["infra"].append("Redis")
        if "rabbitmq" in dc_content:      stack["infra"].append("RabbitMQ")
        if "elasticsearch" in dc_content: stack["infra"].append("Elasticsearch")
        if "celery" in dc_content:        stack["infra"].append("Celery")
        if "mongo" in dc_content:         stack["database"].append("MongoDB")

    if exists("Dockerfile"):     stack["infra"].append("Docker")
    if is_dir("kubernetes") or is_dir("k8s"): stack["infra"].append("Kubernetes")
    if is_dir(".github/workflows"): stack["tools"].append("GitHub Actions")

    # Deduplicate
    for key in stack:
        stack[key] = list(dict.fromkeys(stack[key]))
    return stack


def detect_entry_point() -> str | None:
    candidates = [
        ("manage.py",        "manage.py"),
        ("app/manage.py",    "app/manage.py"),
        ("src/index.ts",     "src/index.ts"),
        ("src/main.ts",      "src/main.ts"),
        ("src/index.js",     "src/index.js"),
        ("src/main.py",      "src/main.py"),
        ("main.go",          "main.go"),
        ("src/main.go",      "src/main.go"),
        ("app/page.tsx",     "app/page.tsx"),
        ("pages/index.tsx",  "pages/index.tsx"),
        ("pages/index.js",   "pages/index.js"),
        ("dashboard/main.py", "dashboard/main.py"),
    ]
    for check, label in candidates:
        if exists(check):
            return label
    # Fallback: package.json main
    pkg_raw = read("package.json")
    if pkg_raw:
        try:
            pkg = json.loads(pkg_raw)
            if "main" in pkg:
                return pkg["main"]
        except json.JSONDecodeError:
            pass
    return None


def detect_config_files() -> list[str]:
    candidates = [
        "docker-compose.yml", "docker-compose.yaml",
        "docker-compose.prod.yml", "docker-compose.override.yml",
        ".env", ".env.example", ".env.local",
        "next.config.js", "next.config.ts",
        "vite.config.ts", "vite.config.js",
        "tsconfig.json", "jsconfig.json",
        "package.json", "requirements.txt", "Pipfile", "pyproject.toml",
        "go.mod", "Cargo.toml",
        "nginx.conf", "docker/nginx/nginx.conf",
        ".github/workflows",
        "Makefile",
        "dashboard/requirements.txt",
    ]
    return [c for c in candidates if exists(c)]


def detect_test_dir() -> list[str]:
    candidates = [
        ("tests",        "tests/"),
        ("test",         "test/"),
        ("__tests__",    "__tests__/"),
        ("spec",         "spec/"),
        ("src/tests",    "src/tests/"),
        ("app/tests",    "app/tests/"),
        ("src/__tests__", "src/__tests__/"),
    ]
    found = [label for d, label in candidates if is_dir(d)]
    return found if found else ["(belum terdeteksi)"]


def scan() -> dict:
    return {
        "sourceDirs":   detect_source_dirs(),
        "stack":        detect_stack(),
        "entryPoint":   detect_entry_point(),
        "configFiles":  detect_config_files(),
        "testDirs":     detect_test_dir(),
    }


def generate_section(result: dict) -> str:
    source_dirs  = result["sourceDirs"]
    stack        = result["stack"]
    entry_point  = result["entryPoint"]
    config_files = result["configFiles"]
    test_dirs    = result["testDirs"]

    src_str = (
        f"`{', '.join(source_dirs)}`" if source_dirs
        else "[PANDUAN AI: Cari folder kode utama seperti src/, app/, lib/, dll.]"
    )
    entry_str = (
        f"`{entry_point}`" if entry_point
        else "[PANDUAN AI: Temukan file entry point utama]"
    )
    cfg_str = ", ".join(config_files[:6]) or "package.json, requirements.txt"

    def fmt(items, key):
        return items[key] if items[key] else [f"[PANDUAN AI: Deteksi {key}]"]

    return f"""## 📂 Struktur Folder Kode
> ⚠️ **Panduan AI**: Baca bagian ini sebelum menyentuh file apapun.
> Selalu gunakan path ini sebagai root pencarian kode — jangan scan seluruh repo.

- **Source Dir**: {src_str}
- **Entry Point**: {entry_str}
- **Config Files**: `{cfg_str}`
- **Test Dir**: `{", ".join(test_dirs)}`

## 🛠️ Stack Teknologi
- **Backend**: {", ".join(fmt(stack, "backend"))}
- **Frontend**: {", ".join(fmt(stack, "frontend"))}
- **Database**: {", ".join(fmt(stack, "database"))}
- **Infra / DevOps**: {", ".join(fmt(stack, "infra"))}
- **Tools**: {", ".join(fmt(stack, "tools"))}
"""


def write_to_brief(section: str) -> None:
    if not BRIEF.exists():
        print("❌ Specs/brief.md tidak ditemukan.")
        sys.exit(1)
    content = BRIEF.read_text(encoding="utf-8")

    # Replace Struktur Folder section
    updated = re.sub(
        r"## 📂 Struktur Folder Kode[\s\S]*?(?=## 👥|## 📅|## 📦|## 🚫|## 🔗|## 🛠️|$)",
        section.split("## 🛠️")[0],
        content,
    )
    # Replace Stack section
    updated = re.sub(
        r"## 🛠️ Stack Teknologi[\s\S]*?(?=## 👥|## 📅|## 📦|## 🚫|## 🔗|$)",
        "## 🛠️ Stack Teknologi" + section.split("## 🛠️ Stack Teknologi")[1] + "\n",
        updated,
    )
    BRIEF.write_text(updated, encoding="utf-8")
    print("✅ Specs/brief.md berhasil diperbarui.")


# ── CLI Run ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    result = scan()
    section = generate_section(result)

    if not SILENT:
        print("\n🔍 DAC Project Scanner (Python)\n")
        print("━" * 50)
        print(section)
        print("━" * 50)

        if not WRITE:
            print("\n💡 Jalankan dengan --write untuk langsung update Specs/brief.md:")
            print("   python dashboard/scanner.py --write\n")

    if WRITE:
        write_to_brief(section)
