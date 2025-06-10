#!/bin/bash

# =============================================================================
# MODULE GENERATOR - Cria novo módulo com estrutura padrão
# Usage: ./new-module.sh <module-id> <module-title>
# =============================================================================

set -euo pipefail

if [[ $# -lt 2 ]]; then
    echo "Usage: $0 <module-id> <module-title>"
    echo "Example: $0 13-advanced-algorithms 'Advanced Algorithms'"
    exit 1
fi

MODULE_ID=$1
MODULE_TITLE=$2
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "Creating new module: $MODULE_ID"

# Create module structure
mkdir -p "$PROJECT_ROOT/modules/$MODULE_ID"/{lessons,exercises,examples,resources,assets}

# Create audio directory
mkdir -p "$PROJECT_ROOT/assets/audio/$MODULE_ID"

# Create README
# (Template content would go here)

echo "✅ Module $MODULE_ID created successfully"
