#!/usr/bin/env python3
"""Re-bake the codex's planning snapshots (Project section fallbacks for file:// viewing).

Run after any planning change worth publishing:
    python3 scripts/bake-codex.py
Refreshes TASKS_SNAPSHOT, RUBRIC_SNAPSHOT, REPORTS_SNAPSHOT, PROPOSALS_SNAPSHOT
(all task files), WAY_LAWS (the Workbench's per-Way laws, from design/way-laws.json),
and SNAPSHOT_DATE inside planning/brightwell-codex.html. Board / Card
Rubric / Reports / Proposals fetch live markdown when served over http and fall back to
these snapshots for file:// viewing.

The Questions / Decisions / Glossary tabs are different: they render hand-authored
plain-English mirrors (planning/readable/*.html), baked into QUESTIONS_READABLE /
DECISIONS_READABLE / GLOSSARY_HTML and used always (never the raw markdown). These
mirrors do NOT auto-translate — rewrite the matching planning/readable/*.html when
QUESTIONS.md / DECISIONS.md change, then re-bake.
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

# generated reports for the Reports-tab shelf: the card-audit dashboard + every findings narrative.
# Globbed, not hand-listed — a new docs/balance-findings-*.html appears on the next bake.
def title_of(path: str, fallback: str) -> str:
    m = re.search(r"<title>(.*?)</title>", open(path).read())
    return m.group(1) if m else fallback

report_pages = []
if os.path.exists(os.path.join(ROOT, "planning", "card-audit.html")):
    report_pages.append({"href": "card-audit.html", "title": "Card Audit",
                         "sub": "every card vs the rubric + harness telemetry, sortable (npm run audit)"})
for p in sorted(glob.glob(os.path.join(ROOT, "docs", "balance-findings-*.html")), reverse=True):
    name = os.path.basename(p)
    report_pages.append({"href": f"../docs/{name}", "title": title_of(p, name), "sub": "findings narrative"})

replacements = {
    r'const SNAPSHOT_DATE = "[^"]*";': f'const SNAPSHOT_DATE = "{today}";',
    # the Data Viewer's card data — always the shipped pool, never a hand-copy
    r"const CARDS_SNAPSHOT = .*?;\n": f"const CARDS_SNAPSHOT = {json.dumps(json.loads(read('src/content/cards/starter-pool.json')))};\n",
    # the Workbench's per-Way laws — shared with card-lint; design/way-laws.json is the source of truth
    r"const WAY_LAWS = .*?;\n": f"const WAY_LAWS = {json.dumps(json.loads(read('design/way-laws.json')))};\n",
    r"const TASKS_SNAPSHOT = .*?;\n": f"const TASKS_SNAPSHOT = {json.dumps(read('planning/TASKS.md'))};\n",
    # Questions / Decisions / Glossary tabs render hand-authored plain-English mirrors, not raw markdown.
    # Source of truth: planning/readable/*.html — re-write those when QUESTIONS.md/DECISIONS.md change, then re-bake.
    r"const DECISIONS_READABLE = .*?;\n": f"const DECISIONS_READABLE = {json.dumps(read('planning/readable/decisions.html'))};\n",
    r"const QUESTIONS_READABLE = .*?;\n": f"const QUESTIONS_READABLE = {json.dumps(read('planning/readable/questions.html'))};\n",
    r"const GLOSSARY_HTML = .*?;\n": f"const GLOSSARY_HTML = {json.dumps(read('planning/readable/glossary.html'))};\n",
    r"const RUBRIC_SNAPSHOT = .*?;\n": f"const RUBRIC_SNAPSHOT = {json.dumps(read('planning/card-design.md'))};\n",
    r"const REPORTS_SNAPSHOT = .*?;\n": f"const REPORTS_SNAPSHOT = {json.dumps(summary_obj)};\n",
    r"const REPORT_PAGES = .*?;\n": f"const REPORT_PAGES = {json.dumps(report_pages)};\n",
    r"const PROPOSALS_SNAPSHOT = .*?;\n": f"const PROPOSALS_SNAPSHOT = {json.dumps(tasks_files)};\n",
}

for pattern, replacement in replacements.items():
    src, n = re.subn(pattern, lambda m: replacement, src, count=1)
    if n != 1:
        sys.exit(f"bake-codex: anchor not found for {pattern!r}")

open(CODEX, "w").write(src)
print(f"baked: {today} · {len(tasks_files)} task files · TASKS + readable Questions/Decisions/Glossary refreshed")
