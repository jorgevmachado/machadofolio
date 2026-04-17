#!/bin/bash
set -e

# Usage: bash ../../scripts/dev-env.sh <environment> <port>
# Example: bash ../../scripts/dev-env.sh production 4201

ENV_NAME="$1"
PORT="$2"

if [ -z "$ENV_NAME" ] || [ -z "$PORT" ]; then
  echo "Uso: bash ../../scripts/dev-env.sh <environment> <port>"
  echo "Exemplo: bash ../../scripts/dev-env.sh production 4201"
  exit 1
fi

# Caminho do monorepo (corrigido para subir dois níveis)
MONOREPO_ROOT="$(dirname $(dirname $(realpath $0)))"
if [ "$ENV_NAME" = "development" ]; then
  ENV_FILE="$MONOREPO_ROOT/.env.monorepo"
else
  ENV_FILE="$MONOREPO_ROOT/.env.$ENV_NAME"
fi
ENV_DEV=".env.development"

if [ ! -f "$ENV_FILE" ]; then
  echo "Arquivo $ENV_FILE não encontrado na raiz do monorepo ($MONOREPO_ROOT)."
  exit 1
fi

# Gera .env.development com todas as variáveis prefixadas com NEXT_PUBLIC_
awk 'BEGIN { OFS="" }
  /^\s*$/ { print $0; next } # linha em branco
  /^\s*#/ { print $0; next } # comentário
  /^[A-Za-z_][A-Za-z0-9_]*=/ {
    split($0, arr, "=");
    key=arr[1];
    val=substr($0, length(key)+2);
    if (key ~ /^NEXT_PUBLIC_/) {
      print key "=" val;
    } else {
      print "NEXT_PUBLIC_" key "=" val;
    }
    next;
  }
  { print $0 } # qualquer outra linha
' "$ENV_FILE" > "$ENV_DEV"

# Executa Next.js em modo dev na porta informada
next dev --turbopack --port $PORT

# Remove o .env.development temporário do diretório atual
test -f "$ENV_DEV" && rm "$ENV_DEV"
