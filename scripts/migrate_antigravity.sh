#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  IoT 4.0 — Migration Script (Windows -> Ubuntu/WSL)
# ═══════════════════════════════════════════════════════════════

set -e

SOURCE_DIR="/mnt/c/Users/Albert/.gemini/antigravity"
PROJECT_SOURCE="$SOURCE_DIR/scratch/iot40"
DEST_DIR="/home/albert/iot40"
AI_BACKUP_DIR="$DEST_DIR/.ai_backup"

echo "==========================================================="
echo "  🚀 Iniciando Migración: IoT 4.0"
echo "  Origen:  $PROJECT_SOURCE"
echo "  Destino: $DEST_DIR"
echo "==========================================================="

# 1. Verificaciones iniciales
if [ ! -d "$PROJECT_SOURCE" ]; then
    echo "❌ ERROR: No se encuentra el directorio origen del proyecto: $PROJECT_SOURCE"
    exit 1
fi

# Instalar dependencias necesarias si faltan
if ! command -v rsync &> /dev/null; then
    echo "📦 Instalando rsync..."
    sudo apt-get update && sudo apt-get install -y rsync
fi

if ! command -v dos2unix &> /dev/null; then
    echo "📦 Instalando dos2unix para conversión de finales de línea..."
    sudo apt-get update && sudo apt-get install -y dos2unix
fi

# 2. Crear estructura de carpetas en Ubuntu
echo "📁 Creando estructura de directorios en $DEST_DIR..."
mkdir -p "$DEST_DIR"
mkdir -p "$DEST_DIR/apps"
mkdir -p "$DEST_DIR/services"
mkdir -p "$DEST_DIR/data/logs"
mkdir -p "$DEST_DIR/docs"
mkdir -p "$DEST_DIR/scripts"
mkdir -p "$DEST_DIR/shared"
mkdir -p "$DEST_DIR/workspace"
mkdir -p "$DEST_DIR/backups"
mkdir -p "$AI_BACKUP_DIR"

# 3. Sincronizar el Proyecto IoT 4.0
echo "🔄 Sincronizando código fuente del proyecto..."
rsync -av --exclude "node_modules" \
          --exclude ".git" \
          --exclude "dist" \
          --exclude "*.tmp" \
          --exclude "*.swp" \
          "$PROJECT_SOURCE/" "$DEST_DIR/"

# 4. Respaldar datos de la IA (Aislamiento)
echo "🤖 Respaldando datos de Antigravity IA en $AI_BACKUP_DIR..."

if [ -d "$SOURCE_DIR/brain" ]; then
    rsync -a "$SOURCE_DIR/brain/" "$AI_BACKUP_DIR/brain/"
fi

if [ -d "$SOURCE_DIR/knowledge" ]; then
    rsync -a "$SOURCE_DIR/knowledge/" "$AI_BACKUP_DIR/knowledge/"
fi

if [ -d "$SOURCE_DIR/conversations" ]; then
    rsync -a "$SOURCE_DIR/conversations/" "$AI_BACKUP_DIR/conversations/"
fi

if [ -f "$SOURCE_DIR/mcp_config.json" ]; then
    cp "$SOURCE_DIR/mcp_config.json" "$AI_BACKUP_DIR/"
fi

if [ -f "$SOURCE_DIR/installation_id" ]; then
    cp "$SOURCE_DIR/installation_id" "$AI_BACKUP_DIR/"
fi

# Exclusiones conscientes (No se copian):
# - context_state/ (Temporal / estado en memoria)
# - html_artifacts/ (Basura operativa / renders)

# 5. Corrección de permisos y finales de línea
echo "🔧 Ajustando permisos y finales de línea (CRLF -> LF)..."
find "$DEST_DIR" -type f -name "*.sh" -exec dos2unix {} + -exec chmod +x {} +
find "$DEST_DIR" -type f -name "*.js" -exec dos2unix {} +
find "$DEST_DIR" -type f -name "*.json" -exec dos2unix {} +
find "$DEST_DIR" -type f -name "*.env*" -exec dos2unix {} +

# Ocultar la carpeta de backups de la IA del proyecto principal
chmod 700 "$AI_BACKUP_DIR"

echo "==========================================================="
echo "  ✅ Migración Completada con Éxito."
echo "  Puedes entrar a tu proyecto usando: cd $DEST_DIR"
echo "  Ejecuta ./scripts/verify_migration.sh para validar."
echo "==========================================================="
