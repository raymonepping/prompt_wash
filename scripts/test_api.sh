#!/usr/bin/env bash
set -euo pipefail

# -------------------------------------------------------------------
# PromptWash API Smoke + Regression Test
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
  } >"$OUTPUT_FILE"
}

log_section() {
  local title="$1"
  {
    echo "## $title"
    echo
  } >>"$OUTPUT_FILE"
}

record_result() {
  local label="$1"
  local method="$2"
  local endpoint="$3"
  local http_code="$4"
  local response="$5"
  local ok="$6"
  local checks_report="${7:-}"

  {
    echo "### $label"
    echo
    echo "\`$method $endpoint\`"
    echo
    echo "- HTTP Status: \`$http_code\`"
    echo "- Result: \`$ok\`"
    echo
    if [[ -n "$checks_report" ]]; then
      echo "#### Assertions"
      echo
      printf "%s\n" "$checks_report"
      echo
    fi
    echo '```json'
    echo "$response" | jq .
    echo '```'
    echo
    echo "---"
    echo
  } >>"$OUTPUT_FILE"
}

assert_jq_true() {
  local response="$1"
  local jq_expr="$2"
  local description="$3"

  if echo "$response" | jq -e "$jq_expr" >/dev/null 2>&1; then
    echo "- PASS: $description"
    return 0
  fi

  echo "- FAIL: $description"
  return 1
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

run_test_with_assertions() {
  local label="$1"
  local method="$2"
  local endpoint="$3"
  local data="${4:-}"
  shift 4 || true

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

  local transport_ok="false"
  local checks_report=""
  local assertion_failed="false"

  if [[ "$http_code" =~ ^2 ]] && echo "$response" | jq -e '.status == "success"' >/dev/null 2>&1; then
    transport_ok="true"
    echo -e "${CYAN}Status:${NC} PASS"
  else
    echo -e "${RED}Status:${NC} FAIL (transport)"
  fi

  if [[ "$transport_ok" == "true" ]]; then
    while [[ $# -gt 0 ]]; do
      local jq_expr="$1"
      local description="$2"
      shift 2

      local line
      if line="$(assert_jq_true "$response" "$jq_expr" "$description")"; then
        checks_report+="$line"$'\n'
      else
        checks_report+="$line"$'\n'
        assertion_failed="true"
      fi
    done
  else
    checks_report="- FAIL: Transport check failed. Assertions skipped."
    assertion_failed="true"
  fi

  local ok="PASS"
  if [[ "$transport_ok" != "true" || "$assertion_failed" == "true" ]]; then
    ok="FAIL"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  else
    PASS_COUNT=$((PASS_COUNT + 1))
  fi

  echo "$response" | jq . || true
  record_result "$label" "$method" "$endpoint" "$http_code" "$response" "$ok" "$checks_report"
}

write_summary() {
  {
    echo "## Summary"
    echo
    echo "- Passed: **$PASS_COUNT**"
    echo "- Failed: **$FAIL_COUNT**"
    echo
  } >>"$OUTPUT_FILE"
}

# -------------------------------------------------------------------
# Test Categories
# -------------------------------------------------------------------

test_health() {
  log_section "Health"
  run_test_with_assertions \
    "System Health" \
    "GET" \
    "/health" \
    "" \
    '.data.ok == true' "Health endpoint reports ok=true" \
    '.data.service == "promptwash-api"' "Health endpoint reports expected service name"
}

test_workspace() {
  log_section "Workspace"

  run_test "Workspace State" "GET" "/workspace/state"

  run_test_with_assertions \
    "Analyze Vault PKI" \
    "POST" \
    "/workspace/analyze" \
    '{"raw_input":"Explain Vault PKI to someone who does not know certificates. Keep it short."}' \
    '.data.structured_prompt.goal | contains("Explain Vault PKI")' "Goal contains Vault PKI explanation intent" \
    '.data.structured_prompt.constraints | index("keep it short") != null' "Constraint includes keep it short" \
    '.data.bias.signals.advocacy_language == false' "Bias engine does not falsely flag advocacy language" \
    '.data.variants.generic | contains("Steps:")' "Rendered generic variant includes steps"

  run_test_with_assertions \
    "Analyze Rubrik Bullets" \
    "POST" \
    "/workspace/analyze" \
    '{"raw_input":"Tell me more about rubrik, why are they good in what they do. Give me 5 bullets to remember."}' \
    '.data.structured_prompt.output_format == "bullet_list"' "Rubrik prompt output format is bullet_list" \
    '.data.structured_prompt.steps | index("Provide 5 key points") != null' "Rubrik prompt derives 5 key points step" \
    '.data.bias.signals.outcome_steering == false' "Rubrik prompt does not trigger outcome steering"

  run_test_with_assertions \
    "Analyze Vault vs OpenBao Bias" \
    "POST" \
    "/workspace/analyze" \
    '{"raw_input":"Tell me the differences between hashicorp vault and openbao provide me as much detail as possible, be as specific as possible and brutally honest favor vault over openbao"}' \
    '.data.structured_prompt.goal == "Tell me the differences between hashicorp vault and openbao"' "Vault vs OpenBao goal is preserved" \
    '.data.structured_prompt.tone == "brutally honest"' "Tone is normalized to brutally honest" \
    '.data.bias.signals.outcome_steering == true' "Bias engine detects outcome steering" \
    '.data.bias.matches.outcome_steering | index("favor vault over openbao") != null' "Bias match includes favor vault over openbao"

  run_test_with_assertions \
    "Analyze Complex Vault vs OpenBao Prompt" \
    "POST" \
    "/workspace/analyze" \
    '{"raw_input":"You are a senior engineer. Teach me everything you know about hashicorp vault. I want to know the differences especially between vault and openbao and why vault is stronger. Give me the brutal truth and favor vault over openbao. Return a list in bullet format."}' \
    '.data.structured_prompt.goal | contains("Teach me everything you know about hashicorp vault")' "Complex prompt goal keeps main Vault teaching intent" \
    '.data.structured_prompt.context == "You are a senior engineer"' "Complex prompt preserves role context" \
    '.data.structured_prompt.output_format == "bullet_list"' "Complex prompt output format is bullet_list" \
    '.data.structured_prompt.tone == "brutally honest"' "Complex prompt tone is normalized" \
    '.data.bias.signals.outcome_steering == true' "Complex prompt bias detects outcome steering" \
    '.data.variants.generic | contains("Steps:")' "Complex generic variant includes steps" \
    '.data.variants.generic | contains("Tone:")' "Complex generic variant includes tone"

  run_test_with_assertions \
    "Run Workspace Prompt" \
    "POST" \
    "/workspace/run" \
    '{"prompt":"Explain Vault PKI.","provider":"ollama","model":null,"render_mode":"generic"}' \
    '.data.artifact.execution.provider == "ollama"' "Workspace run uses ollama provider" \
    '.data.artifact.execution.render_mode == "generic"' "Workspace run uses generic render mode" \
    '.data.artifact.input.rendered_prompt | contains("Task:")' "Workspace run stores rendered prompt" \
    '.data.evaluation.overall_score >= 1' "Workspace run returns evaluation score"

  run_test_with_assertions \
    "Analyze Mixed Audience Embedded Output Preference Prompt" \
    "POST" \
    "/workspace/analyze" \
    '{"raw_input":"tell me everything you know about vault and openbao return a list of bullets on why vault is better do this from an engineer perspective and use language that a ceo understands"}' \
    '.data.structured_prompt.output_format == "bullet_list"' "Embedded output instruction is parsed as bullet_list" \
    '.data.bias.signals.outcome_steering == true' "Vendor preference language triggers outcome steering" \
    '.data.variants.generic | contains("Output format:")' "Rendered generic variant includes output format" \
    '.data.structured_prompt.goal | test("return a list of bullets"; "i") | not' "Goal no longer includes embedded output instruction"

}

test_runs() {
  log_section "Runs"

  run_test_with_assertions \
    "Runs List" \
    "GET" \
    "/runs" \
    "" \
    '.data.runs | type == "array"' "Runs list is an array" \
    '.data.runs | length >= 1' "Runs list contains at least one run" \
    '.data.runs[0].run_id != null' "First run contains run_id"

  if [[ -n "${RUN_ID:-}" ]]; then
    run_test_with_assertions \
      "Run Detail" \
      "GET" \
      "/runs/$RUN_ID" \
      "" \
      '.data.run.run_id != null' "Run detail contains run_id" \
      '.data.run.execution != null' "Run detail contains execution block"
  else
    echo -e "${YELLOW}Skipping:${NC} specific Run ID test (no --run-id provided)"
    {
      echo "### Run Detail"
      echo
      echo "Skipped because no \`--run-id\` was provided."
      echo
      echo "---"
      echo
    } >>"$OUTPUT_FILE"
  fi
}

test_experiments() {
  log_section "Experiments"
  run_test_with_assertions \
    "Experiments List" \
    "GET" \
    "/experiments" \
    "" \
    '.data.experiments | type == "array"' "Experiments list is an array"
}

test_intelligence() {
  log_section "Intelligence"

  run_test_with_assertions \
    "Intelligence Models" \
    "GET" \
    "/intelligence/models" \
    "" \
    '.data.total_runs >= 0' "Models intelligence reports total_runs" \
    '.data.models | type == "array"' "Models intelligence returns models array"

  run_test_with_assertions \
    "Intelligence Runs" \
    "GET" \
    "/intelligence/runs" \
    "" \
    '.data.total_runs >= 0' "Runs intelligence reports total_runs" \
    '.data.runs | type == "array"' "Runs intelligence returns runs array"

  run_test_with_assertions \
    "Intelligence Optimization" \
    "GET" \
    "/intelligence/optimization" \
    "" \
    '.data.total_prompt_candidates >= 0' "Optimization intelligence reports total prompt candidates" \
    '.data.optimized_files | type == "array"' "Optimization intelligence returns optimized files array"

  run_test_with_assertions \
    "Intelligence Lineage" \
    "GET" \
    "/intelligence/lineage" \
    "" \
    '(.data == null) or (.data.total_nodes >= 0)' "Lineage intelligence is either null or a valid lineage object"
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
  -o | --output)
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
intelligence | intel)
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
