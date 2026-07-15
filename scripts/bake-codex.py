#!/usr/bin/env python3
"""Re-bake the codex's planning snapshots (Project section fallbacks for file:// viewing).

Run after any planning change worth publishing:
    python3 scripts/bake-codex.py
Refreshes TASKS_SNAPSHOT, DECISIONS_SNAPSHOT, QUESTIONS_SNAPSHOT, PROPOSALS_SNAPSHOT
(all task files), and SNAPSHOT_DATE inside planning/brightwell-codex.html.
When the codex is served over http these snapshots are ignored (it fetches live).
"""
import datetime
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODEX = os.path.join(ROOT, "planning", "brightwell-codex.html")

def read(rel: str) -> str:
    with open(os.path.join(ROOT, rel)) as f:
        return f.read()

src = open(CODEX).read()
today = datetime.date.today().isoformat()

tasks_files = {
    os.path.basename(p): open(p).read()
    for p in sorted(glob.glob(os.path.join(ROOT, "planning", "tasks", "*.md")))
}

# the harness summary (sim/out/summary.json is gitignored — bake it so Reports shows offline too)
summary_path = os.path.join(ROOT, "sim", "out", "summary.json")
summary_obj = json.load(open(summary_path)) if os.path.exists(summary_path) else None

replacements = {
    r'const SNAPSHOT_DATE = "[^"]*";': f'const SNAPSHOT_DATE = "{today}";',
    r"const TASKS_SNAPSHOT = .*?;\n": f"const TASKS_SNAPSHOT = {json.dumps(read('planning/TASKS.md'))};\n",
    r"const DECISIONS_SNAPSHOT = .*?;\n": f"const DECISIONS_SNAPSHOT = {json.dumps(read('planning/DECISIONS.md'))};\n",
    r"const QUESTIONS_SNAPSHOT = .*?;\n": f"const QUESTIONS_SNAPSHOT = {json.dumps(read('planning/QUESTIONS.md'))};\n",
    r"const RUBRIC_SNAPSHOT = .*?;\n": f"const RUBRIC_SNAPSHOT = {json.dumps(read('planning/card-design.md'))};\n",
    r"const REPORTS_SNAPSHOT = .*?;\n": f"const REPORTS_SNAPSHOT = {json.dumps(summary_obj)};\n",
    r"const PROPOSALS_SNAPSHOT = .*?;\n": f"const PROPOSALS_SNAPSHOT = {json.dumps(tasks_files)};\n",
}

for pattern, replacement in replacements.items():
    src, n = re.subn(pattern, lambda m: replacement, src, count=1)
    if n != 1:
        sys.exit(f"bake-codex: anchor not found for {pattern!r}")

open(CODEX, "w").write(src)
print(f"baked: {today} · {len(tasks_files)} task files · TASKS/DECISIONS/QUESTIONS refreshed")
