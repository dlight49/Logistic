---
name: mobile-responsive-refactor
description: "Expert guide for refactoring React/Tailwind components into mobile-first, responsive layouts. Use when optimizing existing desktop-centric UIs (especially admin dashboards and data tables) for mobile devices."
---

# Mobile-Responsive Refactoring Skill

This skill provides procedural guidance for transforming desktop-oriented UIs into mobile-optimized experiences using Tailwind CSS and React.

## Core Refactoring Workflow

1.  **Analyze current layout**: Identify desktop-only patterns like fixed-width columns, multi-column grids that don't collapse, and complex tables.
2.  **Define mobile structure**: Map desktop components to mobile-friendly equivalents (e.g., Table Row -> Card, Horizontal Nav -> Bottom/Hamburger Nav).
3.  **Apply Mobile-First classes**: Start with mobile classes and add responsive prefixes (`sm:`, `md:`, `lg:`) for larger screens.
4.  **Optimize touch targets**: Ensure buttons and interactive areas are large enough for mobile usage.
5.  **Refactor Spacing/Typography**: Scale down padding, margins, and font sizes for smaller viewports.

## Implementation Guide

- **Tables to Cards**: See [references/mobile-patterns.md](references/mobile-patterns.md) for patterns on converting tables to mobile cards.
- **Grids**: Default to `grid-cols-1` and use `gap-3 sm:gap-4`.
- **Containers**: Use `p-4 sm:p-6 lg:p-8` consistently.
- **Headers**: Sticky headers with `backdrop-blur` are preferred for mobile context.

## Navigation Optimization

Ensure bottom navigation (like `AdminNav`) handles safe areas and uses appropriate icon/text sizing for mobile users.
