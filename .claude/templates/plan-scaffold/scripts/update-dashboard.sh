#!/bin/bash
# update-dashboard.sh
# Scans batch files for checkboxes and generates DASHBOARD.md
#
# Usage: ./scripts/update-dashboard.sh
# Run from plan root directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLAN_DIR="$(dirname "$SCRIPT_DIR")"
BATCHES_DIR="$PLAN_DIR/batches"
DASHBOARD="$PLAN_DIR/DASHBOARD.md"

# Get project name from what_and_why.md first line
PROJECT_NAME=$(head -1 "$PLAN_DIR/what_and_why.md" | sed 's/^# //' | sed 's/ *$//')

# Initialize counters
total_done=0
total_pending=0

# Start building dashboard content
cat > "$DASHBOARD" << EOF
# Dashboard — $PROJECT_NAME

**Generated:** $(date '+%Y-%m-%d %H:%M')

---

EOF

# Process each phase
for phase_dir in "$BATCHES_DIR"/phase-*; do
  if [ ! -d "$phase_dir" ]; then
    continue
  fi

  phase_name=$(basename "$phase_dir")
  phase_done=0
  phase_pending=0
  batch_lines=""

  # Process each batch file in this phase
  for batch_file in "$phase_dir"/P*.md; do
    if [ ! -f "$batch_file" ]; then
      continue
    fi

    batch_name=$(basename "$batch_file" .md)

    # Count checkboxes
    done_count=$(grep -c '^\- \[x\]' "$batch_file" 2>/dev/null || echo 0)
    pending_count=$(grep -c '^\- \[ \]' "$batch_file" 2>/dev/null || echo 0)
    batch_total=$((done_count + pending_count))

    phase_done=$((phase_done + done_count))
    phase_pending=$((phase_pending + pending_count))

    # Determine status icon
    if [ "$pending_count" -eq 0 ] && [ "$done_count" -gt 0 ]; then
      status="[x]"
    elif [ "$done_count" -gt 0 ]; then
      status="[~]"  # In progress
    else
      status="[ ]"
    fi

    # Get batch title from first line
    batch_title=$(head -1 "$batch_file" | sed 's/^# //')

    batch_lines+="- $status $batch_title ($done_count/$batch_total)\n"
  done

  phase_total=$((phase_done + phase_pending))
  total_done=$((total_done + phase_done))
  total_pending=$((total_pending + phase_pending))

  # Determine phase status icon
  if [ "$phase_pending" -eq 0 ] && [ "$phase_done" -gt 0 ]; then
    phase_icon="✅"
  elif [ "$phase_done" -gt 0 ]; then
    phase_icon="🔄"
  else
    phase_icon="⏳"
  fi

  # Format phase name nicely
  case "$phase_name" in
    phase-0) nice_name="Phase 0: Foundation" ;;
    phase-1) nice_name="Phase 1: Core" ;;
    phase-2) nice_name="Phase 2: Polish" ;;
    phase-x) nice_name="Phase X: Overflow" ;;
    *) nice_name="$phase_name" ;;
  esac

  # Write phase section
  cat >> "$DASHBOARD" << EOF
### $nice_name [$phase_done/$phase_total] $phase_icon

$(echo -e "$batch_lines")
EOF

done

# Calculate overall stats
grand_total=$((total_done + total_pending))
if [ "$grand_total" -gt 0 ]; then
  percentage=$((total_done * 100 / grand_total))
else
  percentage=0
fi

# Insert summary at top (after header)
tmp_file=$(mktemp)
head -6 "$DASHBOARD" > "$tmp_file"
cat >> "$tmp_file" << EOF
## Overall: $total_done/$grand_total tasks ($percentage%)

EOF
tail -n +7 "$DASHBOARD" >> "$tmp_file"
mv "$tmp_file" "$DASHBOARD"

echo "Dashboard updated: $DASHBOARD"
echo "Progress: $total_done/$grand_total tasks ($percentage%)"
