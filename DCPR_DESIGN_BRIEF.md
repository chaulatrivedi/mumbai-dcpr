# DCPR DESIGN BRIEF
## Mumbai DCPR — Smart App
**Version:** 1.0  
**Date:** 22 June 2026  
**Status:** FROZEN — do not deviate without master chat sign-off  
**Source:** Claude Design mockup approved by Chaula, 22 June 2026

---

## 1. DESIGN PERSONALITY

**3 words:** Authoritative. Warm. Precise.

The app feels like a well-designed Indian professional tool — not a government portal, not a generic SaaS product. Architects open it under deadline pressure; every element must be immediately readable and trustworthy.

---

## 2. COLOUR PALETTE — LOCKED

```
Page background       #F5F0E8   warm sand
Nav bar               #1E2820   near black
Active sidebar item   #2D5A3D   deep green
Primary action btn    #CC6644   terracotta
Results panel bg      #1E2820   dark (same as nav)
Regulation tag bg     #4A7C5F   teal
Regulation tag text   #FFFFFF   white
Card surface          #FFFFFF   white
Card border           #E2DDD5   warm border
Dividers              #E2DDD5   warm border
Primary text          #1E2820   near black
Secondary text        #787774   muted grey
Warning               #F0C040   amber
Error                 #C0392B   red
Success badge bg      #E8F4F0   teal tint
Success badge text    #2D5A3D   deep green
```

---

## 3. TYPOGRAPHY — LOCKED

```
Font family:      system-ui
                  (no Google Fonts, no external imports)

Nav brand name:   13px, font-weight 500, color #F5F0E8
Nav links:        12px, font-weight 400, color #9BB5BF (inactive)
                                         color #F5F0E8 (active)

Sidebar numbers:  11px, font-weight 400, color #787774
Sidebar labels:   13px, font-weight 400, color #1E2820 (inactive)
                                          color #FFFFFF (active)

Section labels:   10px, uppercase, letter-spacing 0.08em, color #787774
Input text:       14px, font-weight 400, color #1E2820
Input placeholder:14px, font-weight 400, color #BCBCBC

Result number:    48px, font-weight 700, color #FFFFFF (on dark panel)
Result unit:      14px, font-weight 400, color #9BB5BF
Stat numbers:     18px, font-weight 500, color #FFFFFF
Stat labels:      10px, font-weight 400, color #9BB5BF

Basis line:       12px, font-style italic, color #9BB5BF
Regulation tag:   11px, font-weight 500, color #FFFFFF

Body text:        14px, font-weight 400, color #1E2820
Muted body:       13px, font-weight 400, color #787774

Card title:       15px, font-weight 500, color #1E2820
Page heading:     28px, font-weight 600, color #1E2820
Page subheading:  14px, font-weight 400, color #787774
```

---

## 4. LAYOUT — LOCKED

### Overall structure
```
┌─────────────────────────────────────────────────┐
│  NAV BAR (#1E2820)                              │
│  [logo] Mumbai DCPR   Calculators Regs Ask AI   │
└─────────────────────────────────────────────────┘
┌───────────┬─────────────────────────────────────┐
│ SIDEBAR   │  CONTENT AREA                       │
│ (#F5F0E8) │  (#F5F0E8 background)               │
│           │                                     │
│ 01 Parking│  ┌──────────────┬────────────────┐  │
│ 02 FSI    │  │ INPUTS PANEL │ RESULTS PANEL  │  │
│ 03 Toilets│  │ (#FFFFFF)    │ (#1E2820)      │  │
│ 04 Refuge │  │              │                │  │
│ 05 Stairs │  └──────────────┴────────────────┘  │
│ 06 Open Sp│                                     │
│ 07 Lifts  │                                     │
│           │                                     │
│ ─────────│                                     │
│ ASK AI    │                                     │
│ panel     │                                     │
└───────────┴─────────────────────────────────────┘
```

### Sidebar
```
Width:            220px fixed
Background:       #F5F0E8
Active item bg:   #2D5A3D
Active item text: #FFFFFF
Inactive text:    #1E2820
Number prefix:    #787774
Separator:        1px #E2DDD5
Bottom AI panel:  #1E2820 bg, #CC6644 button
```

### Calculator two-panel layout
```
Left panel (inputs):
  Background:   #FFFFFF
  Border:       0.5px solid #E2DDD5
  Border-radius: 8px
  Padding:      20px 24px

Right panel (results):
  Background:   #1E2820
  Border-radius: 8px
  Padding:      20px 24px
  Min-width:    280px
```

### Cards (project dashboard, home screen)
```
Background:     #FFFFFF
Border:         0.5px solid #E2DDD5
Border-radius:  8px
Padding:        16px 20px
Shadow:         none
```

---

## 5. COMPONENTS — LOCKED

### Navigation bar
```
Height:         48px
Background:     #1E2820
Logo mark:      Diamond ◆ in #CC6644
Brand name:     "Mumbai DCPR" in #F5F0E8
Badge "2034":   small pill, #2D5A3D bg, #FFFFFF text, 10px
Active nav link: #F5F0E8, underline or bg pill
Inactive link:  #787774
Search field:   right-aligned, #2D5A3D bg, #9BB5BF text
```

### Regulation tag / badge
```
Background:     #4A7C5F
Text:           #FFFFFF
Font:           11px, font-weight 500, uppercase
Padding:        3px 10px
Border-radius:  4px
Example:        [REG 44 · T.21]
Position:       top-right of results panel
```

### Primary button (Calculate)
```
Background:     #CC6644
Text:           #FFFFFF
Font:           13px, font-weight 500
Padding:        8px 20px
Border-radius:  6px
Width:          full width of inputs panel
Hover:          #B85A3A (10% darker)
```

### Secondary button
```
Background:     #1E2820
Text:           #F5F0E8
Font:           13px, font-weight 400
Padding:        6px 16px
Border-radius:  6px
```

### Input field
```
Background:     #F5F0E8
Border:         0.5px solid #E2DDD5
Border-radius:  5px
Padding:        6px 10px
Font:           14px, #1E2820
Unit label:     right-aligned inside field, #787774
Focus border:   #CC6644
```

### Dropdown select
```
Same as input field
Arrow indicator: #787774
```

### Basis line (below inputs)
```
Background:     #F5F0E8 (slightly darker than card)
Border:         0.5px solid #E2DDD5
Border-radius:  4px
Padding:        6px 12px
Font:           12px italic, #787774
Prefix "BASIS": 10px uppercase, font-weight 500, #787774, margin-right 8px
```

### Results panel stats row
```
Layout:         3 columns, equal width
Stat number:    18px, font-weight 500, #FFFFFF
Stat label:     10px, #9BB5BF
Divider:        1px vertical, #2D5A3D
```

### Amber warning flag (deviations)
```
Background:     #FEF3D8
Text:           #8B5E0A
Border-left:    3px solid #F0C040
Padding:        8px 12px
Border-radius:  0 4px 4px 0
Font:           12px
```

### AI panel (sidebar bottom)
```
Background:     #1E2820
Border-radius:  8px
Padding:        14px
Label:          "ASK DCPR AI" — 10px uppercase, #4A7C5F
Sample question: 13px italic, #F5F0E8
Button:         #CC6644 bg, "Ask a question →", full width
```

---

## 6. SPACING SYSTEM

```
4px   — micro gap (icon to label)
8px   — small gap (between related elements)
12px  — medium gap (between fields)
16px  — section padding
20px  — card padding
24px  — large section gap
32px  — between major sections
```

---

## 7. BORDER RADIUS

```
Input fields, dropdowns:  5px
Cards, panels:            8px
Buttons:                  6px
Tags / pills:             4px (regulation tags)
                          20px (status pills)
Nav bar:                  0
```

---

## 8. WHAT TO NEVER DO

```
✗ Do not use Google Fonts or external font imports
✗ Do not use box shadows on cards
✗ Do not use pure white (#FFFFFF) as page background
✗ Do not use blue as primary action colour
✗ Do not use dark mode as default
✗ Do not add advisory notes or disclaimers to calculator outputs
✗ Do not use border-radius above 8px on panels
✗ Do not use CSS classes — inline styles only
✗ Do not use gradients
✗ Do not use animation except subtle hover state changes
```

---

## 9. REFERENCE

**Approved mockup:** Claude Design output, reviewed and confirmed by Chaula, 22 June 2026.  
**Palette origin:** Claude Design suggestion based on Mumbai DCPR design prompt.  
**Comparable feel:** Figma sidebar + municipal authority + warm Indian professional tool.

---

*End of DCPR Design Brief v1.0*  
*All tokens in this document are frozen. Changes require master chat sign-off and version increment.*
