# AGENTS.md

## Development Commands

### Project Structure

This is a pnpm monorepo. Work primarily in `packages/ui/`.

```bash
# Install dependencies (from root)
pnpm install

# Storybook development (from root or packages/ui)
pnpm dev                    # or: cd packages/ui && pnpm dev

# Build
pnpm build                  # Build all packages
cd packages/ui && pnpm build  # Build UI package only

# Testing
pnpm test                   # Run all tests
cd packages/ui && pnpm test  # Run UI tests only
pnpm test:ui               # Run tests with Vitest UI

# Run single test file
cd packages/ui && pnpm test Button.test.tsx

# Watch mode
cd packages/ui && pnpm test --watch

# Linting & Formatting
pnpm lint                  # Lint all packages
cd packages/ui && pnpm lint  # Lint UI package only
pnpm format                # Format with Prettier

# Type check
cd packages/ui && npx tsc --noEmit
```

## Code Style Guidelines

### Imports

- Always use ES modules (`import`/`export`)
- Group imports: 1) React, 2) Third-party libs, 3) Internal modules
- Use path aliases: `@/` for `src/` (configured in tsconfig)
- Order imports alphabetically within each group

```tsx
import React, { useState } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/Button";
```

### Component Architecture

- Use `React.forwardRef` for all components that should support refs
- Define Props interface extending native HTML attributes
- Always set `displayName` for forwardRef components
- Export both component and props type

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ ... }, ref) => {
  // component logic
})

Button.displayName = 'Button'
export { Button }
```

### TypeScript

- Strict mode enabled (configured)
- Avoid `any` - use proper types or `unknown` if truly unknown
- Use `Omit` when extending native props to remove conflicting fields
- Define types in `src/types/` for shared interfaces

### Styling

- Use Tailwind CSS classes exclusively
- Combine classes with `cn()` utility: `cn('base-style', variantStyles[size], className)`
- Design tokens in `tailwind.config.ts` (colors, shadows, animations)
- Cyberpunk theme: `primary` (#06f9f9), `secondary` (#ff00ff)
- Effects: `neon-glow`, `glitch-border`, `clipped-corner-sm`

### Naming Conventions

- Components: PascalCase (`Button`, `UserProfile`)
- Props: camelCase (`onClick`, `isDisabled`)
- Types/Interfaces: PascalCase (`ButtonProps`, `Theme`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_VARIANT`, `MAX_RETRIES`)
- Files: PascalCase for components (`Button.tsx`), lowercase for utils (`cn.ts`)

### Error Handling

- Always handle async errors with try/catch
- Display user-friendly error messages
- Use error prop pattern (e.g., `error?: string`) for form validation
- Console errors in development only

### Testing

- Use Vitest + React Testing Library
- Test user behavior, not implementation details
- Use descriptive test names: `should disable button when loading prop is true`
- Mock external dependencies

### Formatting (Prettier)

- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- 2 spaces indentation
- 100 char line width
- Trailing commas in ES5 style
- LF line endings

### Icons

- Use `MaterialSymbolsOutlined` component from `@/components/MaterialIcons`
- Pass icon name as string prop (Material Symbols icon name)

### File Organization

```
src/
  components/        # Component files (Button.tsx, Input.tsx)
  types/            # Shared TypeScript interfaces
  utils/            # Utility functions (cn.ts)
  tests/            # Test files (Button.test.tsx)
  stories/           # Storybook stories
```

## Git Hooks

- Husky + lint-staged configured
- All staged files formatted with Prettier before commit
- Linting runs on pre-commit hook

## Design System

- Primary: `#06f9f9` (Cyan), Secondary: `#ff00ff` (Magenta)
- Background: `#0b0e14` (Dark charcoal)
- Font: Space Grotesk (display), Noto Sans (body), ui-monospace (mono)
- Effects: Neon glow, scanlines, clipped corners, glitch animations
