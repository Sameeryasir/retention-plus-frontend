# Funnel landing page — CSS & styling guide

This document describes how **funnel landing page** styling works in the Retention Plus frontend. There is **no separate `.css` file** for the public landing funnel. Styles are applied with **Tailwind CSS utility classes** and **inline styles** (for brand colors and gradients) inside React components.

---

## Quick summary

| Topic | Where it lives |
|--------|----------------|
| Landing page UI | `app/components/crm-template-editor/LandingPagePreview.tsx` |
| Hero image frame | `app/components/crm-template-editor/hero-designs/` |
| Color themes (20+ presets) | `app/components/crm-template-editor/landing-designs/` |
| Section order (eyebrow → CTA) | `app/components/crm-template-editor/landing-sections.ts` |
| Custom hex overrides | `app/components/crm-template-editor/landing-content-colors.ts` |
| Public live page shell | `app/(routes)/funnel/[campaignId]/landing/page.tsx` |
| Editor preview | `app/components/LandingFunnelPreview.tsx` |

---

## Public routes

| Route | Purpose |
|--------|---------|
| `/funnel/[campaignId]/landing` | Live campaign landing page |
| `/funnel/landing-page` | CRM template editor (landing tab) |
| `/funnel/[campaignId]/signup` | Signup step (uses landing colors when blended) |

**Page wrapper (live funnel)** — mobile-first phone width:

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
buildLandingDesignStyle() + landing-theme-presets.ts (Tailwind class bundles)
        ↓
getLandingDesignStyle(designId) → LandingDesignStyle
        ↓
LandingPagePreview / LandingFunnelStepShell
        +
HERO_DESIGN_CATALOG → hero-layout-presets.ts → LandingHero
```

### Main files

| File | Role |
|------|------|
| `landing-designs/landing-design-catalog.ts` | All landing themes (id, hex colors, light/dark/mono) |
| `landing-designs/landing-theme-presets.ts` | Shared Tailwind classes per accent (badge, heading, body, divider) |
| `landing-designs/build-landing-design.ts` | Builds `LandingDesignStyle` + dynamic CTA shadow from primary hex |
| `landing-designs/registry.ts` | `normalizeLandingDesign()`, `getLandingDesignStyle()` |
| `LandingPagePreview.tsx` | Renders hero + content sections + CTA |
| `LandingFunnelStepShell.tsx` | Shared shell for signup/payment steps that sit under the same hero |
| `landing-sections.ts` | Order of content blocks on the page |
| `landing-content-colors.ts` | Optional `#RRGGBB` overrides for heading, body, button text |
| `landing-blended-form-styles.ts` | Signup/payment fields adapted when landing theme is **dark** |

---

## Layout types

Controlled by `layoutType` on the landing template page:

| Value | Behavior |
|--------|----------|
| `centered` | `text-center items-center`; headline `max-w-[18ch]`; CTA `max-w-sm mx-auto` |
| `split` | `text-left items-start` (same stack as centered today; hero still on top) |

**Content area shell:**

```txt
flex flex-col gap-4 {align} px-5 pb-8 pt-6 sm:px-6
background: page.backgroundColor || design.backgroundDefault
```

---

## Content sections (order)

Default order (can be reordered in the editor):

1. **eyebrow** — pill badge  
2. **heading** — main headline  
3. **subheading**  
4. **divider** — 12px wide gradient line  
5. **body** — paragraphs (`\n\n` split)  
6. **cta** — gradient button  
7. **trust** — small trust line  

Defined in `landing-sections.ts` as `LandingContentSectionId`.

---

## Section-level CSS reference

### Eyebrow badge

```txt
inline-flex w-fit items-center rounded-full px-3 py-1
text-[0.65rem] font-semibold uppercase tracking-[0.12em]
+ {style.badgeClass}   ← from theme preset (e.g. border-violet-200 bg-white/80 text-violet-700)
```

### Heading

```txt
text-[1.65rem] font-bold leading-[1.15] sm:text-3xl
+ {style.headingClass} OR inline color from headingColor
+ centered: mx-auto max-w-[18ch]
```

### Subheading

```txt
text-base font-medium leading-snug max-w-prose
+ {style.subheadingClass} OR subheadingColor
```

### Divider

```txt
h-px w-12 + {style.dividerClass}   ← usually bg-gradient-to-r from-{accent} to-{accent}
```

### Body

```txt
mt-5 space-y-3.5 text-[0.9375rem] leading-relaxed
+ {style.bodyClass} OR bodyColor
```

### CTA button (gradient — inline style)

**Classes:**

```txt
group relative mt-8 flex w-full items-center justify-center gap-2
overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-semibold
transition hover:brightness-105 active:scale-[0.99]
text-white (unless buttonTextColor set)
+ {style.ctaShadow}   ← e.g. shadow-[0_12px_28px_rgba(91,95,239,0.28)]
+ centered: mx-auto max-w-sm
```

**Inline style:**

```css
background: linear-gradient(135deg, {primary} 0%, {secondary} 100%);
```

Arrow on hover: `group-hover:translate-x-0.5` on `→` span.

### Trust line

```txt
text-[0.65rem] + {style.trustClass}
```

---

## Design tokens (per theme)

Each row in `LANDING_DESIGN_CATALOG` defines:

| Token | Example | Used for |
|--------|---------|----------|
| `backgroundDefault` | `#F8F7FF` | Page background fallback |
| `primary` | `#5B5FEF` | CTA gradient start + shadow RGB |
| `secondary` | `#7C3AED` | CTA gradient end |
| `mode` | `light` \| `dark` \| `mono` | Which theme preset bundle |
| `accent` | `violet`, `cyan`, … | Maps to `LIGHT_THEME_PRESETS` / `DARK_THEME_PRESETS` |
| `eyebrow` / `trustLine` | Copy strings | Badge + trust text defaults |

**Built style object** (`LandingDesignStyle`):

- `badgeClass`, `headingClass`, `subheadingClass`, `bodyClass`, `dividerClass`, `trustClass`, `heroPlaceholderClass`
- `ctaShadow` — computed from primary hex in `build-landing-design.ts`

### Example themes (ids)

`classic_offer`, `midnight_glow`, `sunset_warm`, `forest_fresh`, `ocean_breeze`, `minimal_mono`, `rose_elegance`, `bold_contrast`, `golden_hour`, … (full list in `landing-design-catalog.ts`).

---

## Custom colors (editor overrides)

Stored on the landing page JSON: `headingColor`, `subheadingColor`, `bodyColor`, `buttonTextColor`, `backgroundColor`.

- Normalized with `normalizeHexColor()` in `landing-content-colors.ts`
- When set, they apply as **inline** `style={{ color: '#...' }}` or `backgroundColor` and **replace** the preset class for that element
- Empty string = use design preset

---

## Hero image CSS

Hero layouts are **not** part of the landing color catalog. They use `HERO_DESIGN_CATALOG` + `HERO_LAYOUT_PRESETS`.

| Preset key | Typical frame |
|------------|----------------|
| `edge_bleed` | Full width `aspect-[4/3] sm:aspect-[3/2]`, fade into content |
| `inset_rounded` | `px-4 pt-4`, `rounded-2xl shadow-md ring-1 ring-black/5` |
| `inset_premium` | `rounded-2xl shadow-lg`, `aspect-[5/4]` |
| `cinema_wide` | `aspect-[21/9]` letterbox |
| `portrait_tall` | `aspect-[4/5]` tall frame |
| `floating_card` | Floating card with deep shadow |

**Image:**

```txt
h-full w-full object-cover
+ optional transform scale from template-image.ts
```

**Fade overlay** (when preset `fade` is `soft` or `full`):

```css
linear-gradient(to top, {fadeColor} …, transparent)
```

`fadeColor` = landing content background (custom or `backgroundDefault`).

**Placeholder (no image):**

```txt
flex flex-col items-center justify-center gap-2 px-4 py-10 text-center
+ hero frame classes + {heroPlaceholderClass}
```

---

## Signup / payment blend (dark landing)

When the landing design `mode === "dark"`, signup and checkout forms call `blendFormDesignWithLanding()` in `landing-blended-form-styles.ts`. It rewrites common Tailwind classes, for example:

| Light class | Dark landing replacement |
|-------------|-------------------------|
| `text-zinc-900` | `text-white` |
| `bg-white` | `bg-white/10` |
| `border-zinc-200` | `border-white/20` |

Used from `app/components/payment-templates/shared/checkout-form-styles.ts` and signup previews.

---

## How to add a new landing theme

1. Add one object to `LANDING_DESIGN_CATALOG` in `landing-design-catalog.ts` (id, colors, mode, accent, copy).
2. If you need a **new accent**, extend `LIGHT_THEME_PRESETS` or `DARK_THEME_PRESETS` in `landing-theme-presets.ts`.
3. Optionally add a `swatchKind` in `landing-designs/types.ts` for the picker swatch gradient.
4. No CSS file changes — rebuild is automatic via `landingDesignStyles` map.

---

## How to change existing landing CSS

| Goal | Edit |
|------|------|
| CTA shape / hover | `LandingCta` in `LandingPagePreview.tsx` |
| Typography sizes | Same file — `heading`, `subheading`, `body` class strings |
| Theme text colors | `landing-theme-presets.ts` |
| Brand colors only | `landing-design-catalog.ts` row for that design id |
| Hero frame | `hero-layout-presets.ts` or new row in `hero-design-catalog.ts` |
| Live page outer background | `app/(routes)/funnel/[campaignId]/landing/page.tsx` (`bg-zinc-100`) |
| Mobile max width | Same route — `max-w-[390px]` |

---

## Related components (not landing-only)

| Component | Notes |
|-----------|--------|
| `SignupPagePreview.tsx` | Signup step; may use `LandingFunnelStepShell` |
| `PaymentPagePreview.tsx` | Payment step styling |
| `funnel-landing-copy-templates.ts` | Default copy text, not CSS |
| `CrmTemplateEditor.tsx` | Full editor chrome around previews |

---

## Notes

- Styling requires **Tailwind** to be compiled with all classes used in the files above (standard Next.js setup).
- Preview in the CRM editor and the live funnel share **`LandingPagePreview`** so WYSIWYG matches production.
- CTA shadows use dynamic `rgba(r,g,b,opacity)` from the theme **primary** color, not a fixed Tailwind shadow utility name.
