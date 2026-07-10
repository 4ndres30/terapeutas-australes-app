#!/usr/bin/env bash
# Enforcement mecanico del flujo serial de AGENTS.md: bloquea `gh pr create`
# si existe cualquier PR abierto sin mergear. Exit 2 = bloquear la tool call.
input=$(cat)
if echo "$input" | grep -q "gh pr create"; then
  abiertos=$(gh pr list --state open --json number --jq 'length' 2>/dev/null)
  if [ -n "$abiertos" ] && [ "$abiertos" -gt 0 ]; then
    echo "BLOQUEADO por AGENTS.md (flujo serial): hay $abiertos PR(s) abierto(s) sin mergear. Mergear o cerrar primero (gh pr list --state open)." >&2
    exit 2
  fi
fi
exit 0
