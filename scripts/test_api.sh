#!/usr/bin/env bash
set -euo pipefail

# -------------------------------------------------------------------
# PromptWash API Smoke / Hardening Test
# -------------------------------------------------------------------

BASE_URL="${BASE_URL:-http://127.0.0.1:3000/api}"
OUTPUT_FILE="${OUTPUT_FILE:-api_test_results.md}"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"

BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0

usage() {
  cat <<EOF
Usage: $0 <category> [-o output_path] [--base-url URL] [--run-id ID]

Categories:
  all
  health
  workspace
  runs
  experiments
  intelligence

Examples:
  $0 all
  $0 workspace -o ./logs/workspace_report.md
  $0 runs --run-id run_20260314_145050_018c9c
  BASE_URL=http://127.0.0.1:3000/api $0 intelligence
EOF
  exit 1
}

require_tools() {
  command -v curl >/dev/null 2>&1 || {
    echo -e "${RED}Error:${NC} curl is required"
    exit 1
  }

  command -v jq >/dev/null 2>&1 || {
    echo -e "${RED}Error:${NC} jq is required"
    exit 1
  }
}

init_log() {
  mkdir -p "$(dirname "$OUTPUT_FILE")"
  {
    echo "# API Test Results - $1"
    echo "Generated on: $TIMESTAMP"
    echo "Base URL: $BASE_URL"
    echo
    echo "---"
    echo
  } > "$OUTPUT_FILE"
}

log_section() {
  local title="$1"
  {
    echo "## $title"
    echo
  } >> "$OUTPUT_FILE"
}

record_result() {
  local label="$1"
  local method="$2"
  local endpoint="$3"
  local http_code="$4"
  local response="$5"
  local ok="$6"

  {
    echo "### $label"
    echo
    echo "\`$method $endpoint\`"
    echo
    echo "- HTTP Status: \`$http_code\`"
    echo "- Result: \`$ok\`"
    echo
    echo '```json'
    echo "$response" | jq .
    echo '```'
    echo
    echo "---"
    echo
  } >> "$OUTPUT_FILE"
}

run_test() {
  local label="$1"
  local method="$2"
  local endpoint="$3"
  local data="${4:-}"

  echo -e "${GREEN}Testing:${NC} $label ($method $endpoint)"

  local tmp_body
  tmp_body="$(mktemp)"
  local http_code

  if [[ "$method" == "GET" ]]; then
    http_code="$(curl -sS -o "$tmp_body" -w "%{http_code}" "$BASE_URL$endpoint" || true)"
  else
    http_code="$(curl -sS -o "$tmp_body" -w "%{http_code}" \
      -X "$method" "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data" || true)"
  fi

  local response
  response="$(cat "$tmp_body")"
  rm -f "$tmp_body"

  local ok="FAIL"
  if [[ "$http_code" =~ ^2 ]]; then
    if echo "$response" | jq -e '.status == "success"' >/dev/null 2>&1; then
      ok="PASS"
      PASS_COUNT=$((PASS_COUNT + 1))
      echo -e "${CYAN}Status:${NC} PASS"
    else
      FAIL_COUNT=$((FAIL_COUNT + 1))
      echo -e "${RED}Status:${NC} FAIL (response status not success)"
    fi
  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
    echo -e "${RED}Status:${NC} FAIL (HTTP $http_code)"
  fi

  echo "$response" | jq . || true
  record_result "$label" "$method" "$endpoint" "$http_code" "$response" "$ok"
}

write_summary() {
  {
    echo "## Summary"
    echo
    echo "- Passed: **$PASS_COUNT**"
    echo "- Failed: **$FAIL_COUNT**"
    echo
  } >> "$OUTPUT_FILE"
}

# -------------------------------------------------------------------
# Test Categories
# -------------------------------------------------------------------

test_health() {
  log_section "Health"
  run_test "System Health" "GET" "/health"
}

test_workspace() {
  log_section "Workspace"

  run_test "Workspace State" "GET" "/workspace/state"

  run_test \
    "Analyze Vault PKI" \
    "POST" \
    "/workspace/analyze" \
    '{"raw_input":"Explain Vault PKI to someone who does not know certificates. Keep it short."}'

  run_test \
    "Analyze Rubrik Bullets" \
    "POST" \
    "/workspace/analyze" \
    '{"raw_input":"Tell me more about rubrik, why are they good in what they do. Give me 5 bullets to remember."}'

  run_test \
    "Analyze Vault vs OpenBao Bias" \
    "POST" \
    "/workspace/analyze" \
    '{"raw_input":"Tell me the differences between hashicorp vault and openbao provide me as much detail as possible, be as specific as possible and brutally honest favor vault over openbao"}'

  run_test \
    "Analyze Complex Vault vs OpenBao Prompt" \
    "POST" \
    "/workspace/analyze" \
    '{"raw_input":"You are a senior engineer. Teach me everything you know about hashicorp vault. I want to know the differences especially between vault and openbao and why vault is stronger. Give me the brutal truth and favor vault over openbao. Return a list in bullet format."}'

  run_test \
    "Run Workspace Prompt" \
    "POST" \
    "/workspace/run" \
    '{"prompt":"Explain Vault PKI.","provider":"ollama","model":null,"render_mode":"generic"}'
}

test_runs() {
  log_section "Runs"

  run_test "Runs List" "GET" "/runs"

  if [[ -n "${RUN_ID:-}" ]]; then
    run_test "Run Detail" "GET" "/runs/$RUN_ID"
  else
    echo -e "${YELLOW}Skipping:${NC} specific Run ID test (no --run-id provided)"
    {
      echo "### Run Detail"
      echo
      echo "Skipped because no \`--run-id\` was provided."
      echo
      echo "---"
      echo
    } >> "$OUTPUT_FILE"
  fi
}

test_experiments() {
  log_section "Experiments"
  run_test "Experiments List" "GET" "/experiments"
}

test_intelligence() {
  log_section "Intelligence"

  run_test "Intelligence Models" "GET" "/intelligence/models"
  run_test "Intelligence Runs" "GET" "/intelligence/runs"
  run_test "Intelligence Optimization" "GET" "/intelligence/optimization"
  run_test "Intelligence Lineage" "GET" "/intelligence/lineage"
}

# -------------------------------------------------------------------
# Argument Parsing
# -------------------------------------------------------------------

CATEGORY="${1:-}"
[[ -z "$CATEGORY" ]] && usage
shift || true

RUN_ID=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -o|--output)
      OUTPUT_FILE="${2:-}"
      shift 2
      ;;
    --base-url)
      BASE_URL="${2:-}"
      shift 2
      ;;
    --run-id)
      RUN_ID="${2:-}"
      shift 2
      ;;
    *)
      usage
      ;;
  esac
done

require_tools
init_log "$CATEGORY"

case "$CATEGORY" in
  health)
    test_health
    ;;
  workspace)
    test_workspace
    ;;
  runs)
    test_runs
    ;;
  experiments)
    test_experiments
    ;;
  intelligence|intel)
    test_intelligence
    ;;
  all)
    test_health
    test_workspace
    test_runs
    test_experiments
    test_intelligence
    ;;
  *)
    usage
    ;;
esac

write_summary

echo
echo -e "${BOLD}${CYAN}Results saved to:${NC} $OUTPUT_FILE"
echo -e "${BOLD}${GREEN}Passed:${NC} $PASS_COUNT"
echo -e "${BOLD}${RED}Failed:${NC} $FAIL_COUNT"