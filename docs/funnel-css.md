# Funnel — CSS & styling guide

Complete reference for **funnel editor chrome** (left/right sidebars, layout grid, phone preview frame) and **landing page content** inside the preview and on live public routes.

There are **no dedicated `.css` files**. Styling uses **Tailwind CSS utility classes** on React components, plus **inline styles** for brand colors and CTA gradients.

---

## Table of contents

1. [Plain-language summary](#plain-language-summary)
2. [Part 1 — Funnel editor (sidebars & layout)](#part-1--funnel-editor-sidebars--layout)
3. [Part 2 — Landing page content (inside preview)](#part-2--landing-page-content-inside-preview)
4. [What file to edit (quick reference)](#what-file-to-edit-quick-reference)
5. [Notes](#notes)

---

## Plain-language summary

| Area | What it is | Main files |
|------|------------|------------|
| **Editor shell** | Gray background, 3-column grid on desktop | `editor-layout.ts`, `EditorShell.tsx` |
| **Left sidebar** | Pick funnel step (Landing, Signup, …) | `EditorLeftSidebar.tsx`, `EditorPageItem.tsx` |
| **Right sidebar** | Edit copy, colors, hero, forms | `SettingsPanel.tsx`, `TemplateEditorSidebar.tsx` |
| **Center** | Phone-shaped preview frame | `CanvasWorkspace.tsx`, `previewPhoneFrameClass` |
| **Landing content** | Headlines, CTA, themes inside the phone | `LandingPagePreview.tsx`, `landing-designs/` |

---

# Part 1 — Funnel editor (sidebars & layout)

## Where the editor lives

| Route | Component |
|--------|-----------|
| `/restaurant/[restaurantId]/dashboard/campaigns/[campaignId]/funnel` | `CrmTemplateEditor` inside `h-[100dvh] overflow-hidden` |
| `/funnel/landing-page` | Same editor (CRM template flow) |

Entry: `app/components/crm-template-editor/CrmTemplateEditor.tsx` → wraps content in `EditorShell`.

---

## Overall layout (4 regions)

`EditorShell.tsx` places four children into a CSS grid using constants from `editor-layout.ts`:

```
┌─────────────────────────────────────────────────────────────┐
│  LEFT SIDEBAR          │  TOP NAV (save, undo, preview)     │
│  (funnel steps)        ├────────────────────────────────────┤
│                        │  CANVAS (phone preview)  │ RIGHT   │
│                        │                          │ SETTINGS│
└─────────────────────────────────────────────────────────────┘
```

### Shell background

| Constant | Classes | Purpose |
|----------|---------|---------|
| `editorShellClass` | `flex h-full min-h-0 w-full max-h-full flex-col overflow-hidden bg-zinc-50 text-[#111827]` | Outer editor background (light gray) |

### Grid definition

| Constant | Role |
|----------|------|
| `editorShellGridClass` | Main grid: rows + columns |
| `editorWorkspaceColsClass` | **Column widths** at `lg` / `xl` / `2xl` breakpoints |

**Column widths (desktop `lg+`):**

| Breakpoint | Grid columns |
|------------|----------------|
| `lg` | `12.5rem` · `1fr` (flexible center) · `16.5rem` |
| `xl` | `14rem` · `1fr` · `19rem` |
| `2xl` | `clamp(15rem,16vw,17rem)` · `1fr` · `clamp(17rem,20vw,21rem)` |

**Rows (desktop `lg+`):**

- Row 1: top navigation (spans center + right columns)
- Row 2: canvas (center) + settings (right)
- Left sidebar **spans both rows** (`lg:row-span-2`)

**Mobile (below `lg`):** single column stack with CSS `order`:

| Order | Slot | Constant |
|-------|------|----------|
| 1 | Top nav | `editorNavbarSlotClass` |
| 2 | Left sidebar | `editorSidebarSlotClass` |
| 3 | Canvas | `editorCanvasSlotClass` |
| 4 | Right settings | `editorSettingsSlotClass` — capped at **`max-h-[38vh]`** |

On large screens, the right panel uses full height (`lg:h-full lg:max-h-none`).

---

## Left sidebar CSS

**Files:** `EditorLeftSidebar.tsx`, `TemplatePageList.tsx`, `editor-ui/EditorPageItem.tsx`  
**Grid slot:** `editorSidebarSlotClass`

### Outer frame (`EditorLeftSidebar`)

```txt
aside: flex h-full min-h-0 flex-col border-r border-zinc-200/90 bg-white
```

| Section | Classes | What you see |
|---------|---------|----------------|
| Header | `shrink-0 border-b border-zinc-100 px-3 py-3` | “Funnel editor” title + step counter |
| Icon badge | `size-9 rounded-lg bg-zinc-900 text-white shadow-sm` | Template icon |
| Title | `text-sm font-semibold text-zinc-900` | Main label |
| Subtitle | `text-[0.65rem] text-zinc-500` | “Step X of 4” |
| Progress bar track | `mt-3 h-1 rounded-full bg-zinc-200` | Gray track |
| Progress fill | `h-full rounded-full bg-zinc-900` (Framer `width` animation) | Dark fill |
| Scroll area | `editorPanelScrollClass` | `min-h-0 flex-1 overflow-y-auto overscroll-contain` |

### Step list (`TemplatePageList`)

```txt
nav: px-2.5 py-3
section label: text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-zinc-500
list: space-y-3
optional page name: text-[0.65rem] text-zinc-400 truncate
```

### Step row (`EditorPageItem`)

| State | Container | Text / icon |
|--------|-----------|-------------|
| **Selected** | `rounded-xl bg-zinc-900 shadow-md shadow-black/20` | White text; icon on `bg-white/12` |
| **Default** | `bg-transparent hover:bg-zinc-50` | `text-zinc-900`; icon on `bg-zinc-100 text-zinc-600` |
| Edit button (selected) | `text-white/90 hover:bg-white/10` | Pencil |
| Edit button (default) | `text-zinc-400 hover:bg-zinc-100` | Pencil |

Typography: title `text-[0.8125rem] font-semibold`; description `text-[0.65rem]` (`text-white/65` when selected).

**Behavior:** Row click = preview in center. Pencil = open right sidebar (`settingsOpen`).

---

## Right sidebar CSS

**Files:** `SettingsPanel.tsx` (shell), `TemplateEditorSidebar.tsx` (content)  
**Grid slot:** `editorSettingsSlotClass`

### Outer frame (`SettingsPanel`)

Hidden below `lg` until desktop (`hidden … lg:flex`). Uses `editorCardClass` with `!rounded-none !border-y-0 !border-r-0 !shadow-none`.

| State | Classes |
|--------|---------|
| **Closed** | `border-l border-slate-200/90 bg-white` + hint `text-sm text-[#6B7280]` |
| **Open** | `border-l border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80` + `editorPanelScrollClass` |

`editorCardClass`: `rounded-2xl border border-slate-200/80 bg-white shadow-sm`

### Inner panel (`TemplateEditorSidebar`)

Root: `w-full bg-white [&_button]:cursor-pointer [&_select]:cursor-pointer`

**Accordion header:** `border-b border-zinc-200`; open = `bg-zinc-50`; closed = `hover:bg-zinc-50/80`; body `space-y-3 px-4 pb-4 pt-0.5`.

**Inputs (`contentInputClass`):**

```txt
w-full rounded-xl border border-zinc-200/95 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm
focus:border-zinc-300 focus:shadow-md focus:ring-2 focus:ring-zinc-900/10
```

**Icon chip:** `border border-zinc-900 bg-black text-white ring-1 ring-white/10`

**Design / hero pickers:** `editorSidebarPickerPanelClass`, `editorSidebarPickerScrollClass` (`max-h-[13.5rem]`, thin scrollbar)

---

## Center canvas

**File:** `CanvasWorkspace.tsx`

| Layer | Classes |
|-------|---------|
| Main | `flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-50` |
| Inner | `p-2 sm:p-3 lg:justify-center lg:p-4 lg:py-10` |
| Phone frame | `previewPhoneFrameClass` |

```txt
mx-auto w-full max-w-[min(390px,100%)]
max-h-[calc(100dvh-5.5rem)] min-h-0 overflow-x-hidden overflow-y-auto
rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/80 [scrollbar-width:thin]
```

Landing/signup/payment **content** inside this frame → [Part 2](#part-2--landing-page-content-inside-preview).

---

## Top navigation

**File:** `TopNavigation.tsx` · **Slot:** `editorNavbarSlotClass`

```txt
border-b border-slate-200/80 bg-white
min-h-[3.25rem] lg:min-h-[3.5rem] px-3 py-2.5 sm:px-4 lg:px-5
```

Colors from `editor-theme.ts` (`#111827`, `#6B7280`); motion from `editor-animation.ts`.

---

## Editor theme tokens

`editor-theme.ts` (chrome only — not landing page colors):

| Token | Value |
|--------|--------|
| `primary` | `#5B5FEF` |
| `text` | `#111827` |
| `muted` | `#6B7280` |
| `editorCardClass` | rounded white card |

Landing colors inside preview → `landing-designs/`.

---

# Part 2 — Landing page content (inside preview)

## Quick summary

| Topic | Where it lives |
|--------|----------------|
| Landing page UI | `LandingPagePreview.tsx` |
| Hero image frame | `hero-designs/` |
| Color themes (20+ presets) | `landing-designs/` |
| Section order (eyebrow → CTA) | `landing-sections.ts` |
| Custom hex overrides | `landing-content-colors.ts` |
| Public live page shell | `app/(routes)/funnel/[campaignId]/landing/page.tsx` |
| Editor / live preview wrapper | `LandingFunnelPreview.tsx` |

---

## Public routes

| Route | Purpose |
|--------|---------|
| `/funnel/[campaignId]/landing` | Live campaign landing page |
| `/funnel/landing-page` | CRM template editor (landing tab) |
| `/funnel/[campaignId]/signup` | Signup step (landing colors when blended) |

**Live page wrapper** — mobile-first phone width:

```tsx
// app/(routes)/funnel/[campaignId]/landing/page.tsx
<div className="flex min-h-dvh flex-col bg-zinc-100">
  <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
    <div className="flex flex-1 flex-col justify-center px-3 py-8 sm:px-4">
      <div className="mx-auto w-full max-w-[390px] shrink-0">
        {/* LandingFunnelPreview */}
      </div>
    </div>
  </main>
</div>
```

---

## Architecture

```
LANDING_DESIGN_CATALOG (colors + mode)
        ↓
buildLandingDesignStyle() + landing-theme-presets.ts
        ↓
getLandingDesignStyle(designId) → LandingDesignStyle
        ↓
LandingPagePreview / LandingFunnelStepShell
        +
HERO_DESIGN_CATALOG → hero-layout-presets.ts → LandingHero
```

| File | Role |
|------|------|
| `landing-design-catalog.ts` | All landing themes (id, hex, light/dark/mono) |
| `landing-theme-presets.ts` | Tailwind class bundles per accent |
| `build-landing-design.ts` | `LandingDesignStyle` + dynamic CTA shadow |
| `registry.ts` | `normalizeLandingDesign()`, `getLandingDesignStyle()` |
| `LandingPagePreview.tsx` | Hero + sections + CTA |
| `LandingFunnelStepShell.tsx` | Shared shell for signup/payment under hero |
| `landing-sections.ts` | Section order |
| `landing-content-colors.ts` | Optional `#RRGGBB` overrides |
| `landing-blended-form-styles.ts` | Dark-landing form class rewrites |

---

## Layout types

| `layoutType` | Behavior |
|--------------|----------|
| `centered` | `text-center items-center`; headline `max-w-[18ch]`; CTA `max-w-sm mx-auto` |
| `split` | `text-left items-start` (hero still on top) |

**Content shell:**

```txt
flex flex-col gap-4 {align} px-5 pb-8 pt-6 sm:px-6
background: page.backgroundColor || design.backgroundDefault
```

---

## Content sections (order)

1. **eyebrow** — pill badge  
2. **heading**  
3. **subheading**  
4. **divider** — 12px gradient line  
5. **body** — `\n\n` paragraphs  
6. **cta** — gradient button  
7. **trust**  

Defined in `landing-sections.ts` as `LandingContentSectionId`.

---

## Section-level CSS

### Eyebrow

```txt
inline-flex w-fit rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]
+ {style.badgeClass}
```

### Heading

```txt
text-[1.65rem] font-bold leading-[1.15] sm:text-3xl + {style.headingClass} OR headingColor
centered: mx-auto max-w-[18ch]
```

### Subheading

```txt
text-base font-medium leading-snug max-w-prose + {style.subheadingClass} OR subheadingColor
```

### Divider

```txt
h-px w-12 + {style.dividerClass}
```

### Body

```txt
mt-5 space-y-3.5 text-[0.9375rem] leading-relaxed + {style.bodyClass} OR bodyColor
```

### CTA button

**Classes:** `group relative mt-8 flex w-full … rounded-2xl px-6 py-3.5 text-sm font-semibold hover:brightness-105 active:scale-[0.99]` + `{style.ctaShadow}` + centered `mx-auto max-w-sm`

**Inline:**

```css
background: linear-gradient(135deg, {primary} 0%, {secondary} 100%);
```

Arrow hover: `group-hover:translate-x-0.5` on `→`.

### Trust

```txt
text-[0.65rem] + {style.trustClass}
```

---

## Design tokens (per theme)

| Token | Used for |
|--------|----------|
| `backgroundDefault` | Page background fallback |
| `primary` / `secondary` | CTA gradient + shadow RGB |
| `mode` | `light` \| `dark` \| `mono` → preset bundle |
| `accent` | Maps to `LIGHT_THEME_PRESETS` / `DARK_THEME_PRESETS` |

**Built object:** `badgeClass`, `headingClass`, `subheadingClass`, `bodyClass`, `dividerClass`, `trustClass`, `heroPlaceholderClass`, `ctaShadow`

**Example ids:** `classic_offer`, `midnight_glow`, `sunset_warm`, `forest_fresh`, `ocean_breeze`, `minimal_mono`, … (full list in `landing-design-catalog.ts`).

---

## Custom colors (editor overrides)

JSON fields: `headingColor`, `subheadingColor`, `bodyColor`, `buttonTextColor`, `backgroundColor`.

- `normalizeHexColor()` in `landing-content-colors.ts`
- When set → inline `style={{ color / backgroundColor }}` replaces preset class
- Empty → use design preset

---

## Hero image CSS

`HERO_DESIGN_CATALOG` + `HERO_LAYOUT_PRESETS` (separate from color catalog).

| Preset | Frame |
|--------|--------|
| `edge_bleed` | Full width `aspect-[4/3] sm:aspect-[3/2]`, fade into content |
| `inset_rounded` | `px-4 pt-4`, `rounded-2xl shadow-md ring-1 ring-black/5` |
| `inset_premium` | `rounded-2xl shadow-lg`, `aspect-[5/4]` |
| `cinema_wide` | `aspect-[21/9]` |
| `portrait_tall` | `aspect-[4/5]` |
| `floating_card` | Floating card, deep shadow |

**Image:** `h-full w-full object-cover` + optional scale from `template-image.ts`

**Fade:** `linear-gradient(to top, {fadeColor} …, transparent)` when preset fade is `soft` or `full`

**Placeholder:** `flex flex-col items-center justify-center …` + `{heroPlaceholderClass}`

---

## Signup / payment blend (dark landing)

When `mode === "dark"`, `blendFormDesignWithLanding()` in `landing-blended-form-styles.ts` rewrites classes:

| Light | Dark landing |
|-------|----------------|
| `text-zinc-900` | `text-white` |
| `bg-white` | `bg-white/10` |
| `border-zinc-200` | `border-white/20` |

Used from checkout-form-styles and signup previews.

---

## Add a new landing theme

1. Add row to `LANDING_DESIGN_CATALOG` in `landing-design-catalog.ts`
2. New accent → extend `LIGHT_THEME_PRESETS` / `DARK_THEME_PRESETS` in `landing-theme-presets.ts`
3. Optional `swatchKind` in `landing-designs/types.ts`
4. No CSS file — map rebuilds via `landingDesignStyles`

---

# What file to edit (quick reference)

| Goal | Edit |
|------|------|
| Sidebar column widths | `editor-layout.ts` → `editorWorkspaceColsClass` |
| Mobile stack / settings max height | `editor-layout.ts` → `editorShellGridClass`, `editorSettingsSlotClass` |
| Left sidebar / progress bar | `EditorLeftSidebar.tsx` |
| Step card selected state | `editor-ui/EditorPageItem.tsx` |
| Right sidebar shell | `SettingsPanel.tsx` |
| Right sidebar accordions / inputs | `TemplateEditorSidebar.tsx` |
| Picker scroll height | `editor-layout.ts` → `editorSidebarPickerScrollClass` |
| Phone preview frame | `editor-layout.ts` → `previewPhoneFrameClass` |
| CTA shape / hover | `LandingPagePreview.tsx` |
| Landing typography sizes | `LandingPagePreview.tsx` |
| Theme text colors | `landing-theme-presets.ts` |
| Theme brand hex only | `landing-design-catalog.ts` |
| Hero frame | `hero-layout-presets.ts` / `hero-design-catalog.ts` |
| Live page outer bg / max width | `funnel/[campaignId]/landing/page.tsx` |

---

## Related components

| Component | Role |
|-----------|------|
| `EditorShell.tsx` | Grid slots |
| `CrmTemplateEditor.tsx` | `settingsOpen`, `activeId`, save state |
| `TemplatePreview.tsx` | Step preview in canvas |
| `SignupPagePreview.tsx` / `PaymentPagePreview.tsx` | Other funnel steps |
| `LandingPagePreview.tsx` | Shared by editor + live funnel |

---

## Notes

- **Tailwind** must include all classes from the files above (standard Next.js build).
- Editor preview and live funnel share **`LandingPagePreview`** (WYSIWYG).
- CTA shadows use dynamic `rgba` from theme **primary**, not fixed shadow utilities.
- Right sidebar: `lg:flex` only; mobile stacks with settings `max-h-[38vh]`.
- Editor animations use **Framer Motion**, not separate CSS keyframe files.
