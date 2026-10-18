#!/bin/sh
set -e

OUTPUT_FILE=/app/www/env-config.js

# Genera env-config.js con todas las variables que empiecen con VITE_
{
  echo "window._env_ = {"
  env | grep '^VITE_' | while IFS='=' read -r key value; do
    # Escapa comillas dobles y backslashes por seguridad
    escaped_value=$(printf '%s' "$value" | sed 's/\\/\\\\/g; s/"/\\"/g')
    printf '  "%s": "%s",\n' "$key" "$escaped_value"
  done
  echo "};"
} > "$OUTPUT_FILE"

echo "env-config.js generado:"
cat "$OUTPUT_FILE"