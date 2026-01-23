# Cyberpunk UI Style Guide

## Overview

The Cyberpunk UI library follows a distinctive cyberpunk aesthetic with neon colors, glowing effects, and futuristic design elements. This guide outlines the design principles and styling patterns used throughout the library.

## Design Principles

### 1. Neon Glow Effect
- Primary color: `#00ffff` (cyan)
- Secondary color: `#ff00ff` (magenta)
- Use glow effects to highlight interactive elements
- Apply subtle shadows with neon colors for depth

### 2. Clipped Corners
- Use `clip-path` to create unique corner geometries
- Maintain readability while adding futuristic feel
- Consistent clipping patterns across components

### 3. Scanline Effects
- Add retro-futuristic scanline overlays
- Use subtle gradients to simulate CRT monitors
- Enhance the cyberpunk atmosphere

### 4. Glitch Effects
- Subtle animations to simulate digital glitches
- Enhance interactivity with dynamic effects
- Use sparingly to maintain usability

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#00ffff` | Main actions, highlights, accents |
| Secondary | `#ff00ff` | Destructive actions, warnings |
| Background Dark | `#0b0e14` | Main background |
| Surface Dark | `#1F2533` | Component backgrounds |
| Border Dark | `#2d3b4e` | Borders, dividers |

## Typography

- Font Family: Space Grotesk (for display), system fonts
- Weight: Bold for headings and important text
- Case: Uppercase for cyberpunk aesthetic
- Tracking: Wide letter spacing for futuristic feel

## Component Patterns

### States
- **Default**: Base appearance
- **Hover**: Slight scale increase and enhanced glow
- **Active**: Reduced opacity and inner shadow
- **Focus**: Enhanced glow effect
- **Loading**: Spinner with reduced interactivity
- **Disabled**: Reduced opacity and desaturated colors

### Sizing
- **Small**: 30px height for utility components
- **Medium**: 38px height for standard components
- **Large**: 48px height for prominent actions

## Accessibility

- High contrast ratios for readability
- Proper focus indicators
- Semantic HTML structure
- ARIA attributes where needed
- Keyboard navigation support