---
name: Precision Monitor
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#424754'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#dee0e2'
  on-secondary-container: '#606365'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e1e2e4'
  secondary-fixed-dim: '#c5c6c8'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-metrics:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-desktop: 32px
  margin-mobile: 16px
---

## Brand & Style
The brand personality is high-performance, analytical, and hyper-efficient. It is designed for power users, developers, and hardware enthusiasts who require real-time data at a glance without the "gamer" aesthetic typical of the industry. 

This design system utilizes a **Minimalist-Glassmorphic** hybrid style. It prioritizes clarity and precision through a "Bento box" layout—modular, organized, and data-dense yet breathable. The emotional response should be one of control and calm, achieved through ample whitespace, soft translucent layers, and high-contrast telemetry indicators.

## Colors
The palette is rooted in a pristine white environment to maximize legibility. 
- **Technology Blue (#3B82F6):** Used for primary action states, active metric traces, and focus indicators.
- **Soft Gray (#F3F4F6):** Applied to card backgrounds and secondary containers to create subtle depth against the white base.
- **Status Colors:** Emerald (#10B981) represents "Healthy/Optimal" states, while Amber (#F59E0B) is reserved for "High Usage/Warning" thresholds.
- **Neutrals:** A range of grays provides hierarchy for labels and inactive states.

## Typography
The system uses **Inter** exclusively to leverage its exceptional legibility in small sizes and data-heavy environments. 
- **Display Metrics:** Large, bold weights for primary numbers (e.g., CPU %, Temperature).
- **Label Caps:** Used for category headers and metadata to provide clear structural anchors.
- **Hierarchy:** High contrast between metric values (Bold/Large) and their descriptive labels (Regular/Small) is essential to ensure the dashboard remains scannable.

## Layout & Spacing
This design system employs a **Bento Box** layout model, utilizing a 12-column fluid grid for desktop and a single-column stack for mobile.
- **Grid Strategy:** Use a fixed 16px gutter. Elements should span columns in increments of 3 or 4 to maintain a rhythmic modularity.
- **Rhythm:** An 8px base unit drives all padding and margins. 
- **Bento Logic:** Components are contained within cards of varying sizes. "Large" cards for primary graphs (GPU/CPU load) and "Small" cards for static hardware info.
- **Desktop (1440px+):** 32px outer margins, 12 columns.
- **Tablet (768px - 1439px):** 24px outer margins, 6 columns.
- **Mobile (<767px):** 16px outer margins, single column grid; use "headline-lg-mobile" for section titles.

## Elevation & Depth
Depth is created through a combination of tonal layering and soft ambient shadows.
- **Base Surface:** Pure White (#FFFFFF).
- **Cards:** Use a semi-transparent Soft Gray (#F3F4F6) with a 60% opacity and a `backdrop-filter: blur(12px)`. This creates a sophisticated "Glassmorphism" effect that feels light and modern.
- **Shadows:** Use a single, highly diffused shadow style for floating elements or active cards: `0 8px 30px rgba(0, 0, 0, 0.04)`. Avoid heavy or dark shadows to maintain the minimalist aesthetic.
- **Outlines:** Use a subtle 1px inner border (`#E5E7EB`) on cards to provide crisp definition against the white background.

## Shapes
The system utilizes a **Rounded** shape language to soften the technical nature of the data. 
- **Cards:** All container cards must use `rounded-lg` (16px) to reinforce the friendly, modern aesthetic.
- **Buttons & Chips:** Use `rounded-md` (8px) for interactive elements.
- **Data Visualization:** Line chart nodes and progress bar ends should be rounded to match the container language.

## Components
- **Buttons:** Primary buttons use Technology Blue with white text. Secondary buttons use a subtle gray stroke with no fill.
- **Data Cards:** The core unit of the system. They feature a title in `label-caps`, a large metric in `display-metrics`, and a sparkline or circular progress indicator.
- **Circular Progress:** Use a thick stroke (8-12px) for the active value and a very light gray track.
- **Line Charts:** Use a 2px stroke width for data lines with a subtle gradient fill underneath (fade to transparent).
- **Status Chips:** Small badges with a light background tint and dark text (e.g., Light Green background with Dark Green text) for "Healthy" or "Warning" status.
- **Input Fields:** Minimalist design with only a bottom border or a very light gray background; focus states must be Technology Blue.
- **Lists:** Clean rows with 16px vertical padding, separated by a 1px soft gray divider.