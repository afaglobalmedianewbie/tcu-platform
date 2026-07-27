#!/usr/bin/env bash
# Script untuk menjalankan LiteLLM Proxy Server

# 1. Pastikan Anda berada di direktori llm-engine
cd /home/tcu/llm-engine

# 2. Aktifkan virtual environment
source llm-env/bin/activate

# 3. Export API Keys (Silakan ganti dengan API key yang valid atau masukkan di .env)
export ANTHROPIC_API_KEY="sk-ant-..."
export GEMINI_API_KEY="AIzaSy..."

# 4. Jalankan LiteLLM menggunakan konfigurasi yang sudah kita buat
echo "Memulai LiteLLM Proxy Router di port 4000..."
litellm --config litellm_config.yaml --port 4000
