#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  IoT 4.0 — Backup Script
# ═══════════════════════════════════════════════════════════════

TARGET_DIR="/home/albert/iot40"
BACKUP_DEST="$TARGET_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="iot40_backup_$TIMESTAMP.tar.gz"

echo "📦 Creando copia de seguridad del proyecto en $BACKUP_DEST..."

# Crear carpeta de backups si por algún motivo no existe
mkdir -p "$BACKUP_DEST"

# Comprimir excluyendo dependencias de JS, basura temporal, y los propios backups
tar -czvf "$BACKUP_DEST/$BACKUP_FILE" \
    --exclude="node_modules" \
    --exclude="dist" \
    --exclude="backups" \
    --exclude="*.tmp" \
    --exclude="data/mongodb" \
    -C "$TARGET_DIR" .

echo "==========================================================="
echo "  ✅ Backup Completo: $BACKUP_DEST/$BACKUP_FILE"
echo "==========================================================="
