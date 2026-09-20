#!/usr/bin/env bash

# Document-as-Code (DAC) Installer Script
# Kegunaan: Mengunduh dan menata struktur folder DAC ke dalam proyek target.

set -e

# Warna output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0;3m' # No Color
BOLD='\033[1m'

echo -e "${BLUE}${BOLD}⬡ Installing Docs-as-Code (DAC) Skeleton...${NC}"

# 1. Pastikan dijalankan di root repositori Git proyek target
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Perintah ini harus dijalankan di root direktori proyek Git Anda.${NC}"
    exit 1
fi

# Tentukan direktori target instalasi
TARGET_DIR="dac"
IS_UPDATE=false

if [ -d "$TARGET_DIR" ]; then
    echo -e "${BLUE}Menemukan folder '$TARGET_DIR/'. Menjalankan mode UPDATE aman...${NC}"
    IS_UPDATE=true
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Mengunduh file skeleton ke folder temporary..."

# Clone repositori dac ke folder temp secara silent
git clone --depth 1 https://github.com/winamus/document-as-code.git "$TEMP_DIR" > /dev/null 2>&1

# Buat folder target dac/ di proyek jika belum ada
mkdir -p "$TARGET_DIR"

if [ "$IS_UPDATE" = true ]; then
    echo "Memperbarui kode visualisasi dashboard dan protokol AI..."
    # Hapus dashboard & agents lama untuk menghindari file usang
    rm -rf "$TARGET_DIR/dashboard"
    rm -rf "$TARGET_DIR/.agents"
    
    # Salin dashboard & agents baru
    cp -r "$TEMP_DIR/dashboard" "$TARGET_DIR/"
    cp -r "$TEMP_DIR/.agents" "$TARGET_DIR/"
    cp "$TEMP_DIR/dac.sh" "$TARGET_DIR/"
    chmod +x "$TARGET_DIR/dac.sh"
    
    # Perbarui PROMPT_GUIDE.md
    cp "$TEMP_DIR/PROMPT_GUIDE.md" "$TARGET_DIR/"
    
    # JANGAN SALIN folder Tasks dan BRIEF.md (Menjaga data proyek Anda)
    echo "Folder Tasks/ dan BRIEF.md dilewati (aman dari overwrite)."
else
    echo "Menyusun struktur folder DAC baru di proyek Anda..."
    cp -r "$TEMP_DIR/Tasks" "$TARGET_DIR/"
    cp -r "$TEMP_DIR/.agents" "$TARGET_DIR/"
    cp -r "$TEMP_DIR/dashboard" "$TARGET_DIR/"
    cp -r "$TEMP_DIR/Specs" "$TARGET_DIR/"
    cp "$TEMP_DIR/BRIEF.md" "$TARGET_DIR/"
    cp "$TEMP_DIR/PROMPT_GUIDE.md" "$TARGET_DIR/"
    cp "$TEMP_DIR/dac.sh" "$TARGET_DIR/"
    chmod +x "$TARGET_DIR/dac.sh"
fi

# Setup gitignore di proyek target jika belum ada atau update isinya
echo "Mengonfigurasi pengabaian file deployment (.deployignore)..."
# Salin konfigurasi deployignore
if [ -f "$TEMP_DIR/.deployignore" ]; then
    cp "$TEMP_DIR/.deployignore" "./.deployignore"
fi

# Tambahkan build/log dashboard ke .gitignore utama proyek target jika belum terdaftar
if [ -f ".gitignore" ]; then
    if ! grep -q "dac/dashboard/.venv" .gitignore; then
        echo "" >> .gitignore
        echo "# Docs-as-Code (DAC) Dashboard" >> .gitignore
        echo "dac/dashboard/.venv/" >> .gitignore
        echo "dac/dashboard/__pycache__/" >> .gitignore
        echo "dac/dashboard/*.pyc" >> .gitignore
    fi
else
    echo "dac/dashboard/.venv/" > .gitignore
    echo "dac/dashboard/__pycache__/" >> .gitignore
fi

# Bersihkan folder temporary
rm -rf "$TEMP_DIR"

if [ "$IS_UPDATE" = true ]; then
    echo -e "\n${GREEN}${BOLD}✔ DAC berhasil diperbarui di folder './$TARGET_DIR/'!${NC}"
    echo -e "--------------------------------------------------------"
    echo -e "Catatan Pembaruan:"
    echo -e "- Protokol AI, Dashboard Visualisasi (FastAPI), dan Prompt Guide diperbarui."
    echo -e "- Folder Tasks/ dan file BRIEF.md Anda dipertahankan."
    echo -e "Silakan restart server dashboard jika sedang berjalan."
    echo -e "--------------------------------------------------------"
else
    echo -e "\n${GREEN}${BOLD}✔ DAC Skeleton berhasil di-embed di folder './$TARGET_DIR/'!${NC}"
    echo -e "--------------------------------------------------------"
    echo -e "Langkah selanjutnya:"
    echo -e "1. Buka file ${BLUE}dac/Specs/brief.md${NC} untuk melengkapi spesifikasi proyek Anda."
    echo -e "2. Jalankan Dashboard lokal Anda:"
    echo -e "   ${BOLD}./dac/dac.sh start${NC}"
    echo -e "3. Berikan instruksi awal ke AI Agent Anda dengan merujuk ke:"
    echo -e "   ${BLUE}dac/.agents/rules/tasks-protocol.md${NC}"
    echo -e "--------------------------------------------------------"
fi
