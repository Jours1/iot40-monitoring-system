# Guía de Migración: IoT 4.0 a Ubuntu (WSL)

Este documento explica el proceso automatizado de migración del entorno de desarrollo Windows hacia Ubuntu.

## ¿Qué se migró y qué se omitió?

**Migrado al Proyecto Principal (`/home/albert/iot40/`):**
- Todo el código fuente del proyecto **IoT 4.0** (Backend, Frontend, Gateway, Firmware ESP32).
- Configuraciones compartidas, utilidades, scripts de desarrollo e inicialización.

**Aislado como Respaldo Técnico (`/home/albert/iot40/.ai_backup/`):**
- Carpetas de IA Antigravity y Gemini: `brain`, `knowledge`, `conversations`.
- Archivos de configuración de IA: `mcp_config.json`, `installation_id`.
*¿Por qué?* Estos metadatos ensucian el proyecto de desarrollo (`git`, `node_modules`, linting). Es necesario un espacio puramente para el software IoT, manteniendo a salvo la historia conversacional por si alguna vez montas Antigravity directamente en Linux.

**Omitido (No migrado):**
- `node_modules` y `dist`: Se instalarán/recrearán nativamente en Ubuntu.
- `context_state` y `html_artifacts`: Basura operativa, cachés de interfaz de la IA y variables efímeras sin valor a largo plazo.

## Ejecutando la Migración

1. **Abre tu terminal de Ubuntu (WSL).**
2. Ejecuta el script de migración, que se encuentra ahora mismo en tu disco C (montado en `/mnt/c`):
   ```bash
   bash /mnt/c/Users/Albert/.gemini/antigravity/scratch/iot40/scripts/migrate_antigravity.sh
   ```
3. Una vez finalizado, ingresa al nuevo directorio:
   ```bash
   cd /home/albert/iot40
   ```
4. Verifica que todo está en orden ejecutando el inspector:
   ```bash
   ./scripts/verify_migration.sh
   ```

## Siguientes Pasos

1. **Instalar dependencias:** `npm run install:all`
2. **Iniciar servicios (requiere MongoDB y Mosquitto instalados en Linux):**
   * Configura tus archivos `.env` (basados en `.env.example`).
   * Arranca Backend, Gateway y Frontend según instrucciones del proyecto principal.

*Nota: Para generar un respaldo en cualquier momento, ejecuta `./scripts/backup_antigravity.sh`.*
