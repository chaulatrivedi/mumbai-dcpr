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

## PDF Download rules
- Every calculator must have a project name text input field
- Every calculator must have a Download PDF button
- PDF method: window.print() only — no external libraries
- Print CSS must hide: Nav, Sidebar, input panel, Calculate button, Download PDF button
- Print CSS must show: project name, date of calculation, results panel only
- Project name and date of calculation must appear at top of PDF
- Regulation reference line must appear at bottom of PDF

## Stack
- React + Vite
- No external libraries unless in DCPR_MASTER_BRIEF.md
- localStorage via storage.js only — never call localStorage directly
