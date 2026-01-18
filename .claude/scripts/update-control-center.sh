#!/bin/bash
# update-control-center.sh
# Generates visual ASCII art Control Center dashboard from batch file checkboxes
#
# Usage: .claude/scripts/update-control-center.sh <plan-path>
# Example: .claude/scripts/update-control-center.sh plans/active/canvas-overlay-system

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <plan-path>"
  echo "Example: $0 plans/active/my-project"
  exit 1
fi

PLAN_DIR="$1"
BATCHES_DIR="$PLAN_DIR/batches"
OUTPUT="$PLAN_DIR/control-center.md"

if [ ! -d "$BATCHES_DIR" ]; then
  echo "Error: Batches directory not found: $BATCHES_DIR"
  exit 1
fi

# Get project name from what_and_why.md first line
PROJECT_NAME=$(head -1 "$PLAN_DIR/what_and_why.md" 2>/dev/null | sed 's/^# //' | sed 's/ *$//' || echo "Project")

# Initialize arrays for phase data
declare -a PHASE_IDS
declare -a PHASE_NAMES
declare -a PHASE_DONE
declare -a PHASE_TOTAL

total_done=0
total_tasks=0

# Process each phase directory
for phase_dir in "$BATCHES_DIR"/phase-*; do
  if [ ! -d "$phase_dir" ]; then
    continue
  fi

  phase_id=$(basename "$phase_dir" | sed 's/phase-//')
  phase_done=0
  phase_pending=0

  # Get phase name from README.md if exists
  if [ -f "$phase_dir/README.md" ]; then
    phase_name=$(head -1 "$phase_dir/README.md" | sed 's/^# //' | sed 's/^Phase [0-9X]*[: —|-]*//' | sed 's/^[— -]*//')
  else
    phase_name="Phase $phase_id"
  fi

  # Process each batch file in this phase
  for batch_file in "$phase_dir"/P*.md; do
    if [ ! -f "$batch_file" ]; then
      continue
    fi

    # Count checkboxes (handles both formats: - [ ] and - [x])
    done_count=$(grep -cE '^\s*-\s*\[x\]' "$batch_file" 2>/dev/null || true)
    pending_count=$(grep -cE '^\s*-\s*\[ \]' "$batch_file" 2>/dev/null || true)

    # Ensure we have valid numbers
    done_count=${done_count:-0}
    pending_count=${pending_count:-0}
    done_count=$((done_count + 0))
    pending_count=$((pending_count + 0))

    phase_done=$((phase_done + done_count))
    phase_pending=$((phase_pending + pending_count))
  done

  phase_total=$((phase_done + phase_pending))

  # Store phase data
  PHASE_IDS+=("$phase_id")
  PHASE_NAMES+=("$phase_name")
  PHASE_DONE+=("$phase_done")
  PHASE_TOTAL+=("$phase_total")

  total_done=$((total_done + phase_done))
  total_tasks=$((total_tasks + phase_total))
done

# Calculate percentage
if [ "$total_tasks" -gt 0 ]; then
  percentage=$((total_done * 100 / total_tasks))
else
  percentage=0
fi

# Generate progress bar (56 chars wide)
bar_width=56
filled=$((percentage * bar_width / 100))
empty=$((bar_width - filled))
progress_bar=""
for ((p=0; p<filled; p++)); do progress_bar+="▓"; done
for ((p=0; p<empty; p++)); do progress_bar+="░"; done

# Generate phase circles for progress (one per task)
generate_circles() {
  local done=$1
  local total=$2
  local circles=""
  for ((i=0; i<done; i++)); do
    circles+="● "
  done
  for ((i=done; i<total; i++)); do
    circles+="○ "
  done
  echo "$circles"
}

# Generate phase box
generate_phase_box() {
  local id=$1
  local name=$2
  local done=$3
  local total=$4

  # Status indicator
  if [ "$total" -eq 0 ]; then
    status="○"
  elif [ "$done" -eq "$total" ]; then
    status="●"
  elif [ "$done" -gt 0 ]; then
    status="◐"
  else
    status="○"
  fi

  printf "    │  P%s  │\n" "$id"
  printf "    │ %d/%d  │\n" "$done" "$total"
}

# Start generating output
cat > "$OUTPUT" << 'HEADER'
```
│
│                     ░█▀▀░█▀█░█▀█░▀█▀░█▀▄░█▀█░█░░
│                     ░█░░░█░█░█░█░░█░░█▀▄░█░█░█░░
│                     ░▀▀▀░▀▀▀░▀░▀░░▀░░▀░▀░▀▀▀░▀▀▀
│
│           ██████╗███████╗███╗   ██╗████████╗███████╗██████╗
│          ██╔════╝██╔════╝████╗  ██║╚══██╔══╝██╔════╝██╔══██╗
│          ██║     █████╗  ██╔██╗ ██║   ██║   █████╗  ██████╔╝
│          ██║     ██╔══╝  ██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗
│          ╚██████╗███████╗██║ ╚████║   ██║   ███████╗██║  ██║
│           ╚═════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
│
│                 ─────── Plan Tracking System ───────
│

```
HEADER

# Mission Status box - use printf for lines with dynamic unicode content
cat >> "$OUTPUT" << 'MISSION_HEADER'

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                       ┃
┃                      M I S S I O N   S T A T U S                      ┃
┃                                                                       ┃
┃      ╭────────────────────────────────────────────────────────╮       ┃
MISSION_HEADER

# Progress bar line with printf (heredocs mangle unicode in variable expansion)
printf "┃      │%s│ %d%%    ┃\n" "$progress_bar" "$percentage" >> "$OUTPUT"

cat >> "$OUTPUT" << 'MISSION_MIDDLE'
┃      ╰────────────────────────────────────────────────────────╯       ┃
┃                                                                       ┃
┃                       ┌───────────────────────┐                       ┃
┃                       │                       │                       ┃
MISSION_MIDDLE

# Task count line with printf
printf "┃                       │       %3d / %-3d       │                       ┃\n" "$total_done" "$total_tasks" >> "$OUTPUT"

cat >> "$OUTPUT" << 'MISSION_FOOTER'
┃                       │      ━━━━━━━━━━━      │                       ┃
┃                       │     TASKS COMPLETE    │                       ┃
┃                       │                       │                       ┃
┃                       └───────────────────────┘                       ┃
┃                                                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

`                       ═══════════ ✦ ═══════════                        `⠀

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                         P R O J E C T   M A P                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
.     START                                                      FINISH
.       │                                                           │
.       ▼                                                           ▼
MISSION_FOOTER

# Generate project map boxes
num_phases=${#PHASE_IDS[@]}
box_line1=".    "
box_line2=".    "
box_line3=".    "
box_line4=".    "
circle_line=".       "
name_line=".    "

for ((i=0; i<num_phases; i++)); do
  id="${PHASE_IDS[$i]}"
  done_val="${PHASE_DONE[$i]}"
  total_val="${PHASE_TOTAL[$i]}"
  name="${PHASE_NAMES[$i]}"

  # Truncate name to 8 chars
  short_name=$(echo "$name" | cut -c1-8)

  # Status circle
  if [ "$total_val" -eq 0 ]; then
    status="○"
  elif [ "$done_val" -eq "$total_val" ]; then
    status="●"
  elif [ "$done_val" -gt 0 ]; then
    status="◐"
  else
    status="○"
  fi

  # Format id for display
  if [ "$id" = "x" ]; then
    display_id="PX"
  else
    display_id="P$id"
  fi

  # Format count centered in 5 chars (e.g., " 0/4 " or " 0/10")
  count_str=$(printf "%d/%d" "$done_val" "$total_val")
  count_len=${#count_str}
  # Box inner is 6 chars: │xxxxxx│, we want count centered
  case $count_len in
    2) count_padded="  $count_str " ;;  # "0/1" -> "  0/1 "
    3) count_padded=" $count_str " ;;   # "0/10" -> " 0/7 "
    4) count_padded=" $count_str" ;;    # "0/10" -> " 0/10"
    *) count_padded="$count_str" ;;     # fallback
  esac

  if [ $i -lt $((num_phases - 1)) ]; then
    box_line1+="┌──────┐    "
    box_line2+="│  $display_id  │───▶"
    box_line3+="│$count_padded │    "
    box_line4+="└──────┘    "
    circle_line+="$status           "
  else
    box_line1+="┌──────┐"
    box_line2+="│  $display_id  │"
    box_line3+="│$count_padded │"
    box_line4+="└──────┘"
    circle_line+="$status"
  fi
  name_line+=$(printf "%-12s" "$short_name")
done

cat >> "$OUTPUT" << EOF
$box_line1
$box_line2
$box_line3
$box_line4
$circle_line
$name_line

┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
\`\`\`

---

EOF

# Generate phase detail boxes
for ((i=0; i<num_phases; i++)); do
  id="${PHASE_IDS[$i]}"
  name="${PHASE_NAMES[$i]}"
  done_val="${PHASE_DONE[$i]}"
  total_val="${PHASE_TOTAL[$i]}"

  # Status circles
  circles=""
  for ((j=0; j<done_val; j++)); do circles+="● "; done
  for ((j=done_val; j<total_val; j++)); do circles+="○ "; done

  # Format count string with space
  count_str="$done_val / $total_val"

  # Calculate padding: inner width is 62, minus 2 leading spaces, minus count length, minus 2 trailing spaces
  # circles go left, count goes right
  inner_width=58  # 62 - 2 - 2 (leading/trailing spaces)
  circles_visible_len=$((total_val * 2))  # each circle + space
  count_len=${#count_str}
  padding_len=$((inner_width - circles_visible_len - count_len))

  # Build padding
  padding=""
  for ((p=0; p<padding_len; p++)); do padding+=" "; done

  # Format phase id
  if [ "$id" = "x" ]; then
    display_id="X"
    phase_num="PHASE X"
  else
    display_id="$id"
    phase_num="PHASE $id"
  fi

  cat >> "$OUTPUT" << EOF
## ⬡ $phase_num │ $name

\`\`\`
╔══════════════════════════════════════════════════════════════╗
║  $circles$padding$count_str  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
EOF

  # List batch files for this phase
  phase_dir="$BATCHES_DIR/phase-$id"
  for batch_file in "$phase_dir"/P*.md; do
    if [ ! -f "$batch_file" ]; then
      continue
    fi

    batch_name=$(basename "$batch_file" .md)
    # Extract just the batch ID (e.g., P0-A from P0-A-cleanup-and-fixes)
    batch_id=$(echo "$batch_name" | grep -oE '^P[0-9X]+-[A-Z]' || echo "$batch_name")
    # Get title from first line, removing the "P0-A: " prefix if present
    batch_title=$(head -1 "$batch_file" | sed 's/^# //' | sed 's/^P[0-9X]*-[A-Z][: |-]*//' | cut -c1-30)

    batch_done=$(grep -cE '^\s*-\s*\[x\]' "$batch_file" 2>/dev/null || true)
    batch_pending=$(grep -cE '^\s*-\s*\[ \]' "$batch_file" 2>/dev/null || true)
    batch_done=${batch_done:-0}
    batch_pending=${batch_pending:-0}
    batch_done=$((batch_done + 0))
    batch_pending=$((batch_pending + 0))
    batch_total=$((batch_done + batch_pending))

    # Status checkbox
    if [ "$batch_total" -eq 0 ]; then
      check="☐"
    elif [ "$batch_done" -eq "$batch_total" ]; then
      check="☑"
    else
      check="☐"
    fi

    # Progress bar (4 chars)
    if [ "$batch_total" -gt 0 ]; then
      batch_pct=$((batch_done * 4 / batch_total))
    else
      batch_pct=0
    fi
    mini_bar=""
    for ((b=0; b<batch_pct; b++)); do mini_bar+="▓"; done
    for ((b=batch_pct; b<4; b++)); do mini_bar+="░"; done

    # Format count as "d/d" right-padded to 4 chars
    batch_count=$(printf "%-4s" "$batch_done/$batch_total")

    # Format: ║   ☐  P0-A   Title (34 chars)              ░░░░ 0/4    ║
    # Truncate title to 34 chars max
    batch_title_short=$(printf "%-34.34s" "$batch_title")

    printf "║   %s  %-4s   %s    %s %s  ║\n" "$check" "$batch_id" "$batch_title_short" "$mini_bar" "$batch_count" >> "$OUTPUT"
  done

  cat >> "$OUTPUT" << 'EOF'
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

EOF
done

# Legend and footer
cat >> "$OUTPUT" << EOF
\`\`\`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                       ┃
┃                         ╔═══════════════╗                             ┃
┃                         ║    LEGEND     ║                             ┃
┃                         ╚═══════════════╝                             ┃
┃                                                                       ┃
┃         ┌─────────────────────────────────────────────┐               ┃
┃         │                                             │               ┃
┃         │     ○   NOT STARTED    ░░░░░░░░░░░░░░░░     │               ┃
┃         │                                             │               ┃
┃         │     ◐   IN PROGRESS    ▓▓▓▓▓▓░░░░░░░░░░     │               ┃
┃         │                                             │               ┃
┃         │     ●   COMPLETE       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │               ┃
┃         │                                             │               ┃
┃         └─────────────────────────────────────────────┘               ┃
┃                                                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
\`\`\`

\`\`\`
╭───────────────────────────────────────────────────────────────────────╮
│                                                                       │
│      ↻  UPDATE       .claude/scripts/update-control-center.sh         │
│                                                                       │
│      📅 GENERATED    $(date '+%Y-%m-%d')                                       │
│                                                                       │
╰───────────────────────────────────────────────────────────────────────╯
\`\`\`

\`\`\`
│                          ✧ ✦ ✧  E N D  ✧ ✦ ✧
\`\`\`
EOF

echo "Control Center updated: $OUTPUT"
echo "Progress: $total_done/$total_tasks tasks ($percentage%)"
