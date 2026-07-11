# CLAUDE.md — Mumbai DCPR Project Rules

## Read before every session
1. Read DCPR_MASTER_BRIEF.md
2. Read DCPR_DESIGN_BRIEF.md
3. Read relevant calculator brief before touching that module

## Coding rules — non-negotiable
- var not const/let
- No optional chaining (?.)
- No spread operators (...)
- Inline styles only — no external CSS
- Full file outputs only — never patches
- One change → push → verify → proceed

## Bug fix format
- Fix all bugs in one instruction
- Full file outputs for every file touched
- Push to GitHub when done
- Never fix one bug at a time

## Print / PDF rules
- Nav.jsx and Sidebar.jsx must always have print:display:none
- Results panel must be print-visible
- Project name and date must appear in PDF output

## Stack
- React + Vite
- No external libraries unless in DCPR_MASTER_BRIEF.md
- localStorage via storage.js only — never call localStorage directly
