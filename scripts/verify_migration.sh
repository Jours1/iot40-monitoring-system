#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  IoT 4.0 — Verificación de Migración
# ═══════════════════════════════════════════════════════════════

DEST_DIR="/home/albert/iot40"
AI_BACKUP_DIR="$DEST_DIR/.ai_backup"

echo "🔍 Verificando migración en $DEST_DIR..."

ERRORS=0

function check_dir() {
    if [ ! -d "$1" ]; then
        echo "❌ FALTA Directorio: $1"
        ERRORS=$((ERRORS+1))
    else
        echo "✅ OK: Directorio $1"
    fi
}

function check_file() {
    if [ ! -f "$1" ]; then
        echo "❌ FALTA Fichero: $1"
        ERRORS=$((ERRORS+1))
    else
        echo "✅ OK: Fichero $1"
    fi
}

echo "─── Estructura de Proyecto ───"
check_dir "$DEST_DIR/apps/backend"
check_dir "$DEST_DIR/apps/gateway"
check_dir "$DEST_DIR/apps/frontend"
check_dir "$DEST_DIR/services/mosquitto"
check_dir "$DEST_DIR/services/mongodb"
check_dir "$DEST_DIR/workspace/esp32/firmware"
check_dir "$DEST_DIR/data/logs"

echo "─── Ficheros Clave ───"
check_file "$DEST_DIR/package.json"
check_file "$DEST_DIR/.env.example"
check_file "$DEST_DIR/apps/backend/src/index.js"
check_file "$DEST_DIR/apps/gateway/src/index.js"

echo "─── Respaldo de IA ───"
check_dir "$AI_BACKUP_DIR/brain"
check_dir "$AI_BACKUP_DIR/knowledge"
check_file "$AI_BACKUP_DIR/mcp_config.json"

if [ $ERRORS -eq 0 ]; then
    echo "==========================================================="
    echo "  🌟 MIGRACIÓN VERIFICADA EXITOSAMENTE."
    echo "  Todos los ficheros y directorios base están presentes!"
    echo "==========================================================="
else
    echo "==========================================================="
    echo "  ⚠️ SE ENCONTRARON $ERRORS ERRORES DURANTE LA VERIFICACIÓN."
    echo "  Revisa la salida de arriba para arreglar rutas faltantes."
    echo "==========================================================="
fi
