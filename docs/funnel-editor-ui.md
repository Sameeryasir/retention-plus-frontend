# Funnel editor — UI overview (simple)

Plain guide to what you see on the **Funnel** tab when editing a campaign landing page.

**Route:** Campaign → **Funnel** tab  
**Example:** `/restaurant/{id}/dashboard/campaigns/{id}/funnel`

---

## The 5 areas on screen

```
┌──────────┬─────────────────────────────────────┬──────────────┐
│  Global  │  Top tabs + campaign bar            │              │
│  icons   ├──────────┬──────────────────────────┤  Right       │
│  (far    │  Funnel  │  Preview (phone)         │  settings    │
│  left)   │  steps   │                          │  accordions  │
│          │  (left)  │                          │              │
└──────────┴──────────┴──────────────────────────┴──────────────┘
```

| # | Area | What it does |
|---|------|----------------|
| 1 | **Top bar** | Campaign name, back, “Generate Tracking Link” |
| 2 | **Tabs** | Overview, Guests, Orders, **Funnel**, Automations, etc. |
| 3 | **Left — Funnel steps** | Pick step: Landing, Signup, Payment, Confirmation |
| 4 | **Center — Preview** | Phone view of the page; Save / Publish at top |
| 5 | **Right — Settings** | Accordions to edit that step (templates, content, media…) |

---

## Left sidebar — Funnel steps

| Item | Meaning |
|------|---------|
| **Funnel editor** | Title + “Step X of 4” progress bar |
| **Landing** | Offer page (hero image, headline, CTA) — usually step 1 |
| **Signup** | Form step |
| **Payment** | Checkout step |
| **Confirmation** | Thank-you step |

- **Click a row** → preview that step in the center  
- **Click pencil** → open the right settings panel for that step  
- **Active step** → dark (black) card with white text  

---

## Center — Preview

| Item | Meaning |
|------|---------|
| **Landing Page** (title) | Which step you’re editing |
| **Draft synced** | Changes saved locally / synced |
| **Preview** | Open public preview |
| **Save** | Save to backend |
| **Publish** | Make funnel live |
| **Phone frame** | Mobile preview (e.g. pizza hero + “PREMIUM” + headline) |

What you change on the **right** updates here live.

---

## Right sidebar — Accordion panels (Landing step)

Each block is a **card** you tap to expand. Only **one** section open at a time.

| Accordion | Subtitle | Purpose |
|-----------|----------|---------|
| **Starter templates** | Design presets & starter copy | Pick a page design or browse template gallery |
| **Section order** | Drag blocks on the page | Reorder eyebrow, heading, body, CTA |
| **Content** | Headlines, body & buttons | Edit text + colors (Heading, Subheading, Body, Button) |
| **Media** | Upload hero & adjust zoom | Hero image, design style, zoom |

When closed, you see: **icon + title + gray subtitle + chevron (▼)**.

---

## Content panel (inside “Content” accordion)

| Field | What it changes in preview |
|-------|----------------------------|
| **Heading** | Big title under the hero |
| **Subheading** | Line under the heading |
| **Body text** | Paragraph(s) |
| **Button text** | CTA button label |
| **COLOR** (each field) | Text color — “Default” = theme color, or pick hex |

More detail: [funnel-content-panel.md](./funnel-content-panel.md)

---

## Colors & style (current look)

| Element | Style |
|---------|--------|
| Page background | Light gray (`zinc-50`) |
| Sidebars | White / soft gray |
| Active funnel step | Black card, white text |
| Right accordions | White cards, light border, soft shadow |
| Open accordion icon | Black square, white icon |
| Primary buttons | Black (Save, Browse templates, Upload) |

Styling lives in: `app/components/crm-template-editor/editor-sidebar-theme.ts`

---

## Main code files

| File | Role |
|------|------|
| `CrmTemplateEditor.tsx` | Main editor page |
| `EditorShell.tsx` | 3-column layout |
| `EditorLeftSidebar.tsx` | Funnel steps list |
| `CanvasWorkspace.tsx` | Center preview area |
| `SettingsPanel.tsx` | Right panel shell |
| `TemplateEditorSidebar.tsx` | Accordions + Content fields |
| `editor-sidebar-theme.ts` | Right panel colors & borders |

---

## Quick workflow

1. Open **Funnel** tab  
2. Click **Landing** (or another step) on the left  
3. Click **pencil** on that step → right panel opens  
4. Open **Content** (or Media, etc.)  
5. Edit fields → see changes in center preview  
6. Click **Save** → then **Publish** when ready  

---

## Related docs

- [Content panel (fields & colors)](./funnel-content-panel.md)  
- [Funnel CSS & layout](./funnel-css.md)
