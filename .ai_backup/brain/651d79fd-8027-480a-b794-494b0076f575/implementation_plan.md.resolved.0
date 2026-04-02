# Plan de Migración: Windows a Ubuntu (IoT 4.0)

Este plan detalla la estrategia para migrar tu entorno de desarrollo actual en Windows (`C:\Users\Albert\.gemini\antigravity`) a un entorno limpio y profesional en Ubuntu (vía WSL o máquina dedicada) en la ruta `/home/albert/iot40`.

## Análisis e Inventario de Origen

Directorio de origen visto desde WSL: `/mnt/c/Users/Albert/.gemini/antigravity/`

| Elemento Original | Tipo | Acción de Migración Propuesta | Destino en Ubuntu |
| :--- | :--- | :--- | :--- |
| `scratch/iot40/` | Proyecto IoT | **Migrar completo directamente.** | `/home/albert/iot40/` |
| `brain/` | Datos IA | **Clonar como respaldo.** | `/home/albert/iot40/.ai_backup/brain/` |
| `knowledge/` | Datos IA | **Clonar como respaldo.** | `/home/albert/iot40/.ai_backup/knowledge/` |
| `conversations/` | Datos IA | **Clonar como respaldo.** | `/home/albert/iot40/.ai_backup/conversations/` |
| `mcp_config.json` | Config IA | **Clonar.** | `/home/albert/iot40/.ai_backup/` |
| `context_state/` | Estado IA | Excluir (temporal / reconstruible). | n/a |
| `html_artifacts/` | Caché IA | Excluir (temporal / basura). | n/a |
| `installation_id` | Config IA | Excluir o copiar (opcional). | `/home/albert/iot40/.ai_backup/` |

**Justificación:**
El proyecto principal (`scratch/iot40`) contiene toda la estructura que creamos (`apps`, `services`, `workspace`, etc.). Debe ser la raíz del nuevo sistema.
Las carpetas de la IA no pertenecen conceptualmente al proyecto IoT, pero como quieres migrar tu "entorno de trabajo", consolidaremos esos metadatos en una carpeta de respaldo oculta (`.ai_backup`) para que no entorpezca la subida a Git o la ejecución de Node.

## Estructura Final en Ubuntu (`/home/albert/iot40`)

```text
/home/albert/iot40/
├── .ai_backup/         # [Nuevo] Archivos de Gemini/Antigravity transferidos para backup
├── apps/               # Proyecto: backend, frontend, gateway
├── backups/            # [Nuevo] Carpeta de rutinas de respaldo de BD y configuraciones
├── data/               # Bases de datos locas
│   └── logs/           # Archivos de bitácora
├── docs/               # Documentación del proyecto
├── scripts/            # [Actualizado] Scripts de inicio (start_all), migración y verificación
├── services/           # mosquitto, mongodb
├── shared/             # constants, validators
├── workspace/          # esp32/firmware
├── .env.example        # Variables de entorno globales
└── package.json        # Archivo maestro de scripts npm
```

## User Review Required

> [!IMPORTANT]
> - ¿Estás de acuerdo en aislar las carpetas del asistente de IA (`brain`, `knowledge`) en la carpeta oculta `.ai_backup`?
> - ¿El usuario y rutas en Ubuntu son exactamente `/home/albert/`?

## Fases de la Implementación (Creación de Scripts)

Crearé **3 scripts bash** que se colocarán de inmediato en `C:\Users\Albert\.gemini\antigravity\scratch\iot40\scripts\` para que los llames desde WSL o Ubuntu.

1.  **`migrate_antigravity.sh`**:
    *   Verificará que `/mnt/c/Users/Albert/.gemini/antigravity` exista.
    *   Creará la estructura raíz (apps, backup, etc.).
    *   Utilizará `rsync` o `cp` para transferir los archivos omitiendo basura temporal (`node_modules`, `context_state`).
    *   Limpiará nombres o convertirá fin de línea (CRLF a LF) si fuera necesario.
2.  **`verify_migration.sh`**:
    *   Revisará que el tamaño y existencia de ficheros críticos coincida.
    *   Corregirá permisos (`chmod +x` en scripts, configuración restrictiva en `.env`).
3.  **`backup_antigravity.sh`**:
    *   Plantilla futura para hacer un `.tar.gz` de `/home/albert/iot40` (excluyendo la misma carpeta de backup y node_modules) en `/home/albert/iot40/backups`.

Una vez apruebes el plan, procederé a programar estos scripts directamente en tu proyecto.
