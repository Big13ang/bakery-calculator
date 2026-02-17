# 🥖 Bakery Classic - Design System Guide

This document serves as the single source of truth for all visual and structural patterns in the RecipeCost Pro application, verified against the current codebase.

## 🎨 Color Palette (Semantic)
| Token | Hex Code | Usage | Tailwind Class |
| :--- | :--- | :--- | :--- |
| **Main Background** | `#FDF8F1` | Primary screen background. | `bg-[#FDF8F1]` |
| **Card Surface** | `#FFFFFF` | Main content containers. | `bg-white` |
| **Text Primary** | `#4A3728` | Headings, body text, and primary icons. | `text-[#4A3728]` |
| **Accent (Brand)** | `#D97706` | Primary buttons, active states, "Yield" badges. | `bg-[#D97706]` |
| **Soft Layer** | `#F9F1E5` | Secondary buttons, input backgrounds, subtle cards. | `bg-[#F9F1E5]` |
| **Border / Stroke** | `#D9C4A9` | Dividers, card borders, interactive element strokes. | `border-[#D9C4A9]` |
| **Danger / Alert** | `#7C2D12` | Delete actions, warnings, negative inflation. | `text-[#7C2D12]` |

## Typography
- **Display Font:** `Lalezar` (used for titles, numbers, and hero stats).
- **Body Font:** `Vazirmatn` (used for labels, descriptions, and inputs).

### Font Scale
- **H1 (Header):** `24px` / `text-2xl`
- **H2 (Sub-header):** `20px` / `text-xl`
- **Body Large:** `16px` / `text-base`
- **Body Small:** `14px` / `text-sm`
- **Metadata:** `11px` / `text-[11px]`
- **Micro Labels:** `9px` / `text-[9px]` (Black weight, uppercase).

## 📐 Spacing & Grid
- **Page Gutter:** `16px` (`p-4`)
- **Card Internal Padding:** `20px` (`p-5`)
- **Section Vertical Gap:** `20px` (`gap-y-5`)
- **Nested Component Gap:** `12px` (`gap-3`)

## 💠 Component Patterns
### The "Bakery Card"
- **Background:** White
- **Border:** `1px solid #D9C4A9`
- **Radius:** `16px` (`rounded-2xl`)
- **Shadow:** `shadow-md`

### Interactive Elements
- **Primary Buttons:** Accent background, white text, `16px` radius.
- **Secondary Buttons:** Soft Layer background, Text Primary color, `12px` radius.
- **Form Inputs:** Soft Layer background, Text Primary color, `shadow-inner` on focus.
- **Navigation Tabs (Inactive):** Soft Layer background, Text Primary color (70% opacity), `1px` subtle border, `shadow-sm`.
- **Navigation Tabs (Active):** Accent background, white text, `shadow-lg`, scaled 110%.

## 🎞️ Animation Tokens
- **Duration:** `300ms`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Interactions:** `active:scale-95` (on click/tap).
- **Entry:** `animate-in fade-in` with `slide-in-from-left/bottom`.

---
*Refer to this guide before implementing any new feature to keep the "Classic Bakery" aesthetic intact.*
