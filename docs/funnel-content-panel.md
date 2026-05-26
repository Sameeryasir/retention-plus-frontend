# Funnel editor — Content panel

Reference for the **Content** accordion in the funnel template editor (right sidebar on the **Landing** step). This is where you edit headline copy, body text, button label, and optional text colors that appear in the phone preview and on the live landing page.

---

## Table of contents

1. [What you see in the UI](#what-you-see-in-the-ui)
2. [Fields at a glance](#fields-at-a-glance)
3. [Color picker (Default vs custom)](#color-picker-default-vs-custom)
4. [How it connects to the preview](#how-it-connects-to-the-preview)
5. [Data saved on the landing page](#data-saved-on-the-landing-page)
6. [Code & file map](#code--file-map)
7. [Example content (from the editor)](#example-content-from-the-editor)

---

## What you see in the UI

The **Content** section is a collapsible panel in the right sidebar:

| UI element | Meaning |
|------------|---------|
| **Document icon + “Content”** | Panel title; tap to expand or collapse |
| **Chevron (up/down)** | Open = expanded; closed = collapsed |
| **H1 icon + Heading** | Main title on the landing page |
| **H2 icon + Subheading** | Supporting line under the title |
| **Document icon + Body text** | Longer paragraph block (scrollable textarea) |
| **Click icon + Button text** | Label on the primary CTA button |
| **COLOR + swatch + “Default”** | Optional custom hex color for that text block |

Only **one** sidebar section is open at a time (opening Content closes Starter templates, Section order, Media, etc.).

**Where to open it:** Campaign → Funnel → select **Landing** in the left step list → click the pencil on Landing (or open settings) → expand **Content** in the right panel.

---

## Fields at a glance

| Field | Control type | Preview / live page |
|-------|----------------|---------------------|
| **Heading** | Single-line text | Large title (H1-style) |
| **Subheading** | Multi-line text (3 rows) | Medium subtitle under the heading |
| **Body text** | Multi-line text (8 rows, scrollable) | Paragraph(s) below the subheading |
| **Button text** | Single-line text | Primary call-to-action button label |

Each text field (except when using theme-only styling) has its own **Color** row underneath.

---

## Color picker (Default vs custom)

Each field includes a **ContentTextColorPicker**:

| Control | What it does |
|---------|----------------|
| **COLOR** label | Visual group for the color row |
| **Color swatch** | Opens the system color picker |
| **“Default” text field** | Empty = use the page **design theme** colors; enter `#RRGGBB` for a custom color |
| **Reset** | Shown when a custom color is set; clears back to Default |

| Field | Data key | Default fallback when empty |
|-------|----------|-----------------------------|
| Heading | `headingColor` | Theme heading class (`#18181B` for picker display) |
| Subheading | `subheadingColor` | Theme subheading class |
| Body text | `bodyColor` | Theme body class |
| Button text | `buttonTextColor` | `#FFFFFF` (picker fallback; theme used when empty) |

Custom colors are applied as **inline styles** on the preview. Empty color strings mean “use the active landing design’s built-in text classes.”

---

## How it connects to the preview

```
Right sidebar (Content panel)
        │
        ▼  onChange({ heading, subheading, body, buttonText, …Color })
CrmTemplateEditor state (pages.landing)
        │
        ▼
Center phone preview — LandingPagePreview.tsx
        │
        ▼
Live funnel / public landing route (same template data)
```

- Edits update **immediately** in the center preview (no separate Save for preview-only; **Save** in the top bar persists to the backend).
- **Section order** (another accordion) controls whether eyebrow, heading, subheading, body, and CTA appear and in what order; **Content** controls the **text and colors** for those blocks.

---

## Data saved on the landing page

Landing-specific fields extend the base page shape (`heading`, `subheading`, `body`, `buttonText`):

| Property | Type | Description |
|----------|------|-------------|
| `heading` | `string` | Main title |
| `subheading` | `string` | Subtitle |
| `body` | `string` | Body copy (may include multiple paragraphs in one string) |
| `buttonText` | `string` | CTA label |
| `headingColor` | `string` | Hex e.g. `#111827` or `""` for default |
| `subheadingColor` | `string` | Hex or `""` |
| `bodyColor` | `string` | Hex or `""` |
| `buttonTextColor` | `string` | Hex or `""` |

Type definition: `app/components/crm-template-editor/template-types.ts` → `LandingTemplatePage`.

---

## Code & file map

| Piece | File |
|-------|------|
| Content accordion UI | `app/components/crm-template-editor/TemplateEditorSidebar.tsx` |
| Color picker component | `app/components/crm-template-editor/ContentTextColorPicker.tsx` |
| Hex normalization | `app/components/crm-template-editor/landing-content-colors.ts` |
| Preview rendering | `app/components/crm-template-editor/LandingPagePreview.tsx` |
| Default landing values | `app/components/crm-template-editor/template-data.ts` |
| Editor layout (preview not shifting when panel opens) | `app/components/crm-template-editor/CanvasWorkspace.tsx`, `docs/funnel-css.md` |

---

## Example content (from the editor)

Below is sample copy matching a typical **Content** panel setup (placeholder Latin text):

### Heading (H1)

```text
Lorem ipsum dolor sit ametsdfasd
```

### Subheading (H2)

```text
Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
```

### Body text

```text
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
```

### Button text

```text
Get started
```

*(Replace with your campaign copy; colors can stay **Default** or set per field.)*

---

## Related docs

- [Funnel — CSS & styling guide](./funnel-css.md) — editor layout, sidebars, phone frame
- [Funnel landing page CSS](./funnel-landing-css.md) — typography and section blocks inside the preview
