# DCPR MASTER BRIEF
## Mumbai DCPR — Smart App
**Version:** 1.0  
**Date:** 22 June 2026  
**Status:** FROZEN — do not deviate without master chat sign-off

---

## 1. APP OVERVIEW

**Name:** Mumbai DCPR  
**Purpose:** Project companion for architects working under DCPR 2034. Stores project decisions, pulls applicable regulations, runs calculations, generates design brief documents.  
**Users:** Architects and designers, team of 5–10, Mumbai-based projects.  
**Deployment:** GitHub (chaulatrivedis-projects) → Vercel auto-deploy  
**Stack:** React + Vite  

---

## 2. CODING RULES — LOCKED

```
- var (not const/let at top level)
- No optional chaining (?.)
- No spread operators (...)
- Inline styles only — no external CSS classes
- Full file outputs only — never patches
- One change → push → verify → proceed
```

**Design reference:** See DCPR_DESIGN_BRIEF.md for all colour tokens, typography, layout, and UI patterns. Claude Code must read that file before writing any UI code.

---

## 3. FOLDER STRUCTURE — LOCKED

```
mumbai-dcpr/
│
├── src/
│   ├── App.jsx                   ← Router + layout shell
│   ├── components/
│   │   ├── Nav.jsx               ← Top navigation bar
│   │   ├── Sidebar.jsx           ← Calculator list (01–07)
│   │   └── AiPanel.jsx           ← Ask DCPR AI widget (Phase 5)
│   │
│   ├── pages/
│   │   ├── Home.jsx              ← Project list / dashboard
│   │   ├── NewProject.jsx        ← Project creation flow
│   │   └── ProjectDashboard.jsx  ← Per-project view
│   │
│   ├── calculators/
│   │   ├── Parking.jsx           ← Module 01
│   │   ├── FSI.jsx               ← Module 02
│   │   ├── Toilets.jsx           ← Module 03
│   │   ├── RefugeArea.jsx        ← Module 04
│   │   ├── Staircase.jsx         ← Module 05
│   │   ├── OpenSpaces.jsx        ← Module 06
│   │   └── Lifts.jsx             ← Module 07
│   │
│   ├── data/
│   │   ├── parkingRates.json     ← Table 21 all typologies
│   │   ├── fsiRates.json         ← Table 12 + 33-series FSI
│   │   ├── toiletRates.json      ← Toilet requirements by use
│   │   └── projectQuestions.json ← Branched question logic
│   │
│   ├── utils/
│   │   ├── storage.js            ← ALL read/write — localStorage now, Supabase later
│   │   ├── parkingCalc.js        ← Parking logic
│   │   ├── fsiCalc.js            ← FSI logic
│   │   └── toiletCalc.js         ← Toilet logic
│   │
│
├── DCPR_MASTER_BRIEF.md          ← This document
├── DCPR_DESIGN_BRIEF.md          ← All design tokens, colours, typography, UI patterns
├── DCPR_TEST_LOG.md              ← Test status per module
├── index.html
├── vite.config.js
└── package.json
```

---

## 4. STORAGE ARCHITECTURE — LOCKED

### Current: localStorage
### Future: Supabase (one function swap in storage.js)

### Data Structure (UUID-based, cloud-ready from day one)

```json
{
  "project_id": "uuid-v4",
  "project_name": "Ashwamegh CHS",
  "created_at": "2026-06-22",
  "updated_at": "2026-06-22",
  "owner": "chaula",

  "parameters": {
    "primary_use": "mixed",
    "use_mix": ["residential", "retail", "commercial"],
    "zone": "R2",
    "location": "extended_suburbs",
    "plot_area_range": "500_1000",
    "plot_area_exact": null,
    "road_width_range": "9_12",
    "road_width_exact": null,
    "development_type": "new_development"
  },

  "branch_parameters": {},

  "deviations": [
    {
      "id": "uuid",
      "rule_ref": "Reg 37 — side margin",
      "default_value": "H/5 min 3m",
      "override_value": "3.0m fixed",
      "reason": "Minimum applicable, confirmed with consultant",
      "date": "2026-06-22",
      "locked": true
    }
  ],

  "calculations": {
    "parking":    { "result": null, "version": null, "locked": false, "date": null },
    "fsi":        { "result": null, "version": null, "locked": false, "date": null },
    "toilets":    { "result": null, "version": null, "locked": false, "date": null },
    "refuge":     { "result": null, "version": null, "locked": false, "date": null },
    "staircase":  { "result": null, "version": null, "locked": false, "date": null },
    "openspaces": { "result": null, "version": null, "locked": false, "date": null },
    "lifts":      { "result": null, "version": null, "locked": false, "date": null }
  },

  "stage": "brief",
  "design_brief_generated": false
}
```

### storage.js — interface (never call localStorage directly)
```js
storage.getProject(id)
storage.saveProject(project)
storage.getAllProjects()
storage.deleteProject(id)
storage.exportProject(id)     // → JSON file download
storage.importProject(json)   // → import JSON file
```

---

## 5. PROJECT CREATION FLOW — LOCKED

### Screen 1 — Name
```
Field: Project name (text input, required)
Field: Your name (text input, optional)
```

### Screen 2 — Base 6 Questions (ALL project types)

| # | Question | Type | Options |
|---|---|---|---|
| 1 | Primary use | Dropdown | Residential / Commercial / Institutional / Mixed / Industrial |
| 2 | Use mix (if mixed) | Multi-select | Residential + Retail / + Commercial / + Institutional |
| 3 | Zone | Dropdown | R1 / R2 / C1 / C2 |
| 4 | Location | Dropdown | Island City / Suburbs / Extended Suburbs |
| 5 | Plot area | Dropdown | <300 / 300–500 / 500–1000 / 1000–2500 / 2500–5000 / >5000 / Not known |
| 6 | Road width | Dropdown | <9m / 9–12m / 12–18m / 18–24m / 24–30m / >30m / Not known |

### Screen 3 — Development Type
```
Options:
  New development (vacant plot)
  Self redevelopment (existing old building)
  33(5) — MHADA redevelopment
  33(7) — Cessed buildings (Island City)
  33(7A) — Dilapidated buildings (Suburbs)
  33(9) — Slum redevelopment
  33(10) — SRA scheme
  Not decided yet
```

### Screen 4 — Branch Questions

**New development:** No additional questions → proceed directly to brief

**Self redevelopment:**
1. Existing authorised BUA (sqm)
2. No. of existing tenements
3. Year of construction (pre/post 1969)

**33(5) MHADA:**
1. No. of existing tenements
2. Existing carpet area per tenement (sqm)
3. Plot area under redevelopment (exact sqm)
4. LR/RC ratio from ASR

**33(7) Cessed (Island City):**
1. No. of existing tenements (MBRRB certified)
2. Existing carpet area per tenement
3. No. of plots in scheme (1 / 2–5 / 6+)
4. LR/RC ratio from ASR

**33(7A) Dilapidated (Suburbs):**
1. No. of existing lawful tenants
2. Existing carpet area per tenant
3. No. of plots in scheme (1 / 2–5 / 6+)
4. Non-tenanted component present? (Yes/No)

**33(9) Slum:**
1. No. of eligible hutment dwellers
2. No. of commercial slum dwellers
3. Land ownership (Govt/MCGM/MHADA/Private)
4. Net plot area after deductions (sqm)
5. LR/RC ratio from ASR
6. Transit accommodation required? (Yes/No)

**33(10) SRA:**
1. No. of eligible hutment dwellers
2. No. of commercial slum dwellers
3. Land ownership
4. Net plot area after deductions (sqm)
5. LR/RC ratio from ASR
6. Min tenement density achievable? (650/ha or 500/ha with CEO SRA)

---

## 6. FSI CALCULATION LOGIC — LOCKED

### New Development — Table 12 (Suburbs & Extended Suburbs)

| Road width | Zonal (Basic) FSI | Premium FSI | TDR | Max |
|---|---|---|---|---|
| Below 9m | 1.00 | — | — | 1.00 |
| 9–12m | 1.00 | 0.50 | 0.50 | 2.00 |
| 12–18m | 1.00 | 1.00 | 0.50 | 2.50 |
| 18–27m | 1.00 | 1.50 | 0.50 | 3.00 |
| 27m+ | 1.00 | 2.00 | 0.50 | 3.50 |

### New Development — Island City (Table 12)

| Road width | Zonal FSI | Premium | TDR | Max |
|---|---|---|---|---|
| Below 9m | 1.33 | — | — | 1.33 |
| 9–12m | 1.33 | 0.50 | 0.17 | 2.00 |
| 12–18m | 1.33 | 0.62 | 0.45 | 2.40 |
| 18–27m | 1.33 | 0.73 | 0.64 | 2.70 |
| 27m+ | 1.33 | 0.84 | 0.83 | 3.00 |

### Development Type FSI Summary

| Type | Regulation | Max FSI | Key rule |
|---|---|---|---|
| New development | Reg 30, Table 12 | 3.50 (Ext Suburbs) | Road width × location |
| Self redevelopment | Reg 30(C) + 33(6) | Protected + Table 12 | Existing BUA protected |
| MHADA 33(5) | Reg 33(5) | 3.0 / 4.0 | Rehab + incentive (Table A+B) |
| Cessed 33(7) | Reg 33(7) | 3.0 | Rehab + 50/60/70% incentive |
| Dilapidated 33(7A) | Reg 33(7A) | Rehab + incentive | 50/60/70% based on plot count |
| Slum 33(9) | Reg 33(9) | 4.0 | Rehab + Table B incentive |
| SRA 33(10) | Reg 33(10) | 4.0 | Same as 33(9), SRA administered |

---

## 7. CALCULATORS — MODULE LIST

| # | Module | File | Data file | Logic file | Status |
|---|---|---|---|---|---|
| 01 | Parking | Parking.jsx | parkingRates.json | parkingCalc.js | 📋 Briefed |
| 02 | FSI & Built-up | FSI.jsx | fsiRates.json | fsiCalc.js | 📋 Briefed |
| 03 | Toilet Count | Toilets.jsx | toiletRates.json | toiletCalc.js | 📋 Briefed |
| 04 | Refuge Area | RefugeArea.jsx | — | refugeCalc.js | ⏳ Pending |
| 05 | Staircase | Staircase.jsx | — | staircaseCalc.js | ⏳ Pending |
| 06 | Open Spaces | OpenSpaces.jsx | — | openSpaceCalc.js | ⏳ Pending |
| 07 | Lifts | Lifts.jsx | — | liftCalc.js | ⏳ Pending |

### Parking Calculator — Rules (Reg 44(2), Table 21)

**Rounding:** Fractions above 0.5 round up. 0.5 and below round down.  
**Visitor parking:** 10% of base, minimum 2 spaces. Non-residential only.  
**Two-wheelers:** Equal to total 4-wheeler count (non-residential). 1 per 2 tenements (residential).  
**Transport vehicles:** 1 per 2000 sqm (offices, mercantile, industrial, storage). First 400 sqm excluded. Min 1, max 6.  
**Output:** Clean numbers only. No advisory flags.

---

## 8. DEVIATION SYSTEM — LOCKED

### How it works
Every project stores two layers:
- **Layer 1:** Base DCPR 2034 rules (never changed)
- **Layer 2:** Project-specific overrides (deviations)

When a calculation runs, it checks Layer 2 first. If an override exists, it uses that. Otherwise uses Layer 1.

### Deviation record structure
```json
{
  "id": "uuid",
  "rule_ref": "Reg 37 — side margin",
  "regulation_text": "H/5 minimum 3m",
  "override_value": "3.0m fixed",
  "reason": "Minimum applicable",
  "approved_by": "structural consultant",
  "date": "2026-06-22",
  "locked": true
}
```

### UI behaviour
- Deviations shown as amber flags in project dashboard
- Regulation notes generated for drawings show deviation inline
- Locked deviations cannot be changed without explicit unlock

---

## 9. BUILD SEQUENCE — LOCKED

```
PHASE 0 (complete) — Architecture & master brief
PHASE 1 — App skeleton (Nav + Sidebar + routing + placeholder screens)
PHASE 2 — Project creation flow (base 6 questions + new development branch)
PHASE 3 — Parking Calculator (Module 01, complete)
PHASE 4 — FSI Calculator (Module 02, complete)
PHASE 5 — Toilet Calculator (Module 03, complete)
PHASE 6 — Refuge + Staircase + Open Spaces + Lifts (Modules 04–07)
PHASE 7 — Design Brief Generator
PHASE 8 — Deviation system
PHASE 9 — Regulation Note Generator
PHASE 10 — AI Q&A layer (Claude API)
PHASE 11 — Supabase migration (when team sharing needed)
```

---

## 10. FEEDBACK LOOP & VERSIONING — LOCKED

### Module status codes
```
📋 Briefed     — spec locked, not yet built
🔨 Building    — Claude Code working on it
🧪 Testing     — built, under test
🔁 Revising    — issue found, fix in progress
✅ Locked      — all tests passed, signed off
```

### Version numbering
```
v1.0 — first build
v1.1 — bug fix
v1.2 — bug fix
v2.0 — improvement / new feature
```

### Bug vs Improvement rule
```
Bug        → fix immediately, retest, increment minor version
Improvement → log it, batch into next major version
             never touch working code for improvements mid-build
```

### Regression rule
Every file change → retest ALL locked modules before sign-off.

---

## 11. TEST LOG REFERENCE

See: `DCPR_TEST_LOG.md` (updated by Claude Code with every push)

Format:
```
MODULE       VERSION   STATUS      LAST TESTED    NOTES
Parking      —         📋 Briefed  —              —
FSI          —         📋 Briefed  —              —
```

---

## 12. CHAT STRUCTURE — LOCKED

| Chat | Owns | Does NOT own |
|---|---|---|
| This chat (Master) | Architecture, master brief, sign-offs, issue log | Design, calculation details, code |
| Parking chat | All parking regulation knowledge, parking brief | Architecture decisions |
| Toilet chat | All toilet regulation knowledge, toilet brief | Architecture decisions |
| [Future specialist chats] | Their regulation domain | Architecture decisions |
| Claude Code (terminal) | Building, pushing, file verification | Any decisions |

### Handoff protocol
```
Specialist chat → produces locked brief
      ↓
Master chat → reviews, approves, adds to master brief
      ↓
Claude Code → receives complete brief, builds
      ↓
Master chat → reviews Vercel output, signs off
      ↓
Next module unlocked
```

---

## 13. ISSUE LOG

*(Populated as issues are found during testing)*

| # | Module | Issue | Found | Fixed | Verified |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

---

*End of DCPR Master Brief v1.1*  
*v1.1 change: Design tokens moved to DCPR_DESIGN_BRIEF.md*  
*Next update: after Phase 1 skeleton built and approved*
