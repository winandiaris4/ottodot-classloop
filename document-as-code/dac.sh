#!/usr/bin/env bash

# Docs-as-Code (DAC) Helper Script
# Sediakan cara mudah untuk menjalankan dashboard, men-scan proyek, dan setup venv.

set -e

# Dapatkan lokasi absolut dari script dac.sh ini
SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
DASHBOARD_DIR="$SCRIPT_DIR/dashboard"
VENV_DIR="$DASHBOARD_DIR/.venv"

# Deteksi perintah
CMD=$1

case "$CMD" in
    setup)
        echo "⚙️ Menyiapkan Virtual Environment Python untuk DAC..."
        python3 -m venv "$VENV_DIR"
        "$VENV_DIR/bin/pip" install --upgrade pip
        "$VENV_DIR/bin/pip" install -r "$DASHBOARD_DIR/requirements.txt"
        echo "✅ Setup selesai! Jalankan './dac/dac.sh start' atau 'dac/dac.sh start' untuk memulai dashboard."
        ;;
    start|dev)
        if [ ! -d "$VENV_DIR" ]; then
            echo "⚠️ Virtual Environment tidak ditemukan. Menjalankan setup otomatis..."
            "$SCRIPT_DIR/dac.sh" setup
        fi
        echo "🚀 Memulai DAC Dashboard di http://localhost:3737..."
        "$VENV_DIR/bin/uvicorn" main:app --app-dir "$DASHBOARD_DIR" --reload --port 3737
        ;;
    scan)
        if [ ! -d "$VENV_DIR" ]; then
            echo "⚠️ Virtual Environment tidak ditemukan. Menjalankan setup otomatis..."
            "$SCRIPT_DIR/dac.sh" setup
        fi
        "$VENV_DIR/bin/python" "$DASHBOARD_DIR/scanner.py"
        ;;
    scan-write)
        if [ ! -d "$VENV_DIR" ]; then
            echo "⚠️ Virtual Environment tidak ditemukan. Menjalankan setup otomatis..."
            "$SCRIPT_DIR/dac.sh" setup
        fi
        "$VENV_DIR/bin/python" "$DASHBOARD_DIR/scanner.py" --write
        ;;
    *)
        echo "Penggunaan: ./dac/dac.sh [setup|start|scan|scan-write]"
        echo "  setup       - Membuat python virtual environment & menginstall dependensi"
        echo "  start       - Menjalankan DAC Dashboard di port 3737"
        echo "  scan        - Mendeteksi stack teknologi proyek"
        echo "  scan-write  - Mendeteksi & memperbarui Specs/brief.md secara otomatis"
        exit 1
        ;;
esac
