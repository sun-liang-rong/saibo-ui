# React Component Library - Complete Setup Guide

## 📦 Complete Directory Structure

```
zujian/
├── .changeset/
│   └── config.json                    # Changesets configuration
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI/CD pipeline
├── .husky/
│   └── pre-commit                     # Git pre-commit hook
├── packages/
│   └── ui/
│       ├── .storybook/
│       │   ├── main.ts                # Storybook main configuration
│       │   └── preview.ts             # Storybook preview configuration
│       ├── src/
│       │   ├── components/
│       │   │   ├── Button.tsx         # Button component
│       │   │   ├── Input.tsx          # Input component
│       │   │   └── Modal.tsx         # Modal component
│       │   ├── tests/
│       │   │   ├── setup.ts           # Test setup file
│       │   │   ├── Button.test.tsx    # Button tests
│       │   │   ├── Input.test.tsx     # Input tests
│       │   │   └── Modal.test.tsx     # Modal tests
│       │   ├── utils/
│       │   │   └── cn.ts              # Class name utility (clsx + tailwind-merge)
│       │   ├── index.css              # Tailwind CSS entry point
│       │   └── index.ts               # Main export file (barrel export)
│       ├── stories/
│       │   ├── Button.stories.tsx     # Button stories
│       │   ├── Input.stories.tsx      # Input stories
│       │   └── Modal.stories.tsx      # Modal stories
│       ├── .eslintrc.cjs               # ESLint configuration
│       ├── .gitignore                 # Git ignore for package
│       ├── .prettierrc                # Prettier configuration
│       ├── .prettierignore            # Prettier ignore patterns
│       ├── package.json               # Package configuration
│       ├── postcss.config.js          # PostCSS configuration
│       ├── tailwind.config.ts         # Tailwind CSS configuration
│       ├── tsconfig.json              # TypeScript configuration
│       ├── vite.config.ts             # Vite build configuration
│       └── vitest.config.ts           # Vitest configuration
├── .changeset/
│   └── config.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   └── pre-commit
├── .gitignore                         # Root git ignore
├── .lintstagedrc.json                # Lint-staged configuration
├── .npmrc                             # npm configuration
├── package.json                       # Root package configuration
├── pnpm-workspace.yaml                # pnpm workspace configuration
└── README.md                          # Project documentation
```

## 🚀 Initial Setup Commands

### 1. Install Dependencies

```bash
# Install all dependencies
pnpm install
```

### 2. Initialize Git (if not already initialized)

```bash
# Initialize git repository
git init

# Initialize Husky git hooks
pnpm prepare
```

## 📋 Available Commands

### Development

```bash
# Start Storybook dev server (port 6006)
pnpm dev
# or
pnpm --filter @my-org/ui storybook
```

### Building

```bash
# Build the component library
pnpm build
# or
pnpm --filter @my-org/ui build

# Build Storybook for production
pnpm --filter @my-org/ui build:storybook
```

### Testing

```bash
# Run all tests
pnpm test
# or
pnpm --filter @my-org/ui test

# Run tests in watch mode
pnpm --filter @my-org/ui test --watch

# Run tests with UI
pnpm --filter @my-org/ui test:ui
```

### Linting & Formatting

```bash
# Run ESLint
pnpm lint
# or
pnpm --filter @my-org/ui lint

# Format code with Prettier
pnpm format
# or
pnpm --filter @my-org/ui format

# Check types
pnpm --filter @my-org/ui tsc --noEmit
```

### Version Management & Publishing

```bash
# Create a new changeset
pnpm changeset

# Update versions based on changesets
pnpm version
# or
pnpm changeset version

# Publish to npm
pnpm release
# or
pnpm changeset publish
```

## 🎯 Workflow for Adding New Components

### 1. Create the Component

```bash
# Create component file
cd packages/ui/src/components
touch MyComponent.tsx
```

### 2. Implement the Component

```tsx
// MyComponent.tsx
import React from 'react'
import { cn } from '../utils/cn'

export interface MyComponentProps {
  // Define your props here
  className?: string
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('base-styles', className)} {...props}>
        {/* Component content */}
      </div>
    )
  }
)

MyComponent.displayName = 'MyComponent'
export { MyComponent }
```

### 3. Export from Index

```tsx
// src/index.ts
export { MyComponent } from './components/MyComponent'
export type { MyComponentProps } from './components/MyComponent'
```

### 4. Create Tests

```bash
touch src/tests/MyComponent.test.tsx
```

```tsx
// src/tests/MyComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '../components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByRole('div')).toBeInTheDocument()
  })
})
```

### 5. Create Stories

```bash
touch stories/MyComponent.stories.tsx
```

```tsx
// stories/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from '../src/components/MyComponent'

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
```

## 🎨 Customizing Tailwind Theme

Edit `packages/ui/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Add custom colors
        brand: {
          50: '#f0f9ff',
          // ... more shades
        },
      },
      spacing: {
        // Add custom spacing
        '128': '32rem',
      },
    },
  },
  plugins: [],
}

export default config
```

## 🌙 Adding Dark Mode Support

### 1. Enable Dark Mode in Tailwind

Already configured with `darkMode: 'class'` in `tailwind.config.ts`.

### 2. Use Dark Mode in Components

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Content
</div>
```

### 3. Add Dark Mode Toggle to Your App

```tsx
import { useState, useEffect } from 'react'

export const ThemeToggle = () => {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
```

## 🌍 Adding Internationalization (i18n)

### 1. Install i18n Package

```bash
pnpm add react-i18next i18next
```

### 2. Create Language Files

```bash
mkdir -p src/i18n/locales
touch src/i18n/locales/en.json
touch src/i18n/locales/zh.json
```

### 3. Configure i18n

```tsx
// src/i18n/config.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zh from './locales/zh.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: 'en',
  fallbackLng: 'en',
})

export default i18n
```

### 4. Use in Components

```tsx
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation()
  return <div>{t('hello')}</div>
}
```

## 📦 Publishing to npm

### 1. Configure npm Registry

```bash
# Login to npm
npm login

# Set your npm org scope
npm config set @my-org:registry https://registry.npmjs.org
```

### 2. Update Version

```bash
# Create a changeset
pnpm changeset

# Update versions
pnpm changeset version

# This will update package.json and generate CHANGELOG.md
```

### 3. Publish

```bash
# Build and publish
pnpm release

# This will:
# 1. Build the package
# 2. Publish to npm
# 3. Create a GitHub release
```

### 4. Configure GitHub Secrets

In your GitHub repository settings, add:
- `NPM_TOKEN`: Your npm authentication token
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## 🚢 Deploying Storybook

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd packages/ui
pnpm build:storybook
vercel --prod
```

### Deploy to GitHub Pages

1. Update `.github/workflows/ci.yml`:
```yaml
deploy-storybook:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: pnpm install
    - run: pnpm build:storybook
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./packages/ui/storybook-static
```

## 🧪 Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Run tests for a specific file
pnpm test Button.test.tsx

# Run tests in UI mode
pnpm test:ui
```

## 🔧 Troubleshooting

### Issues with Vite Build

```bash
# Clear cache
rm -rf node_modules .vite dist

# Reinstall
pnpm install
```

### Issues with TypeScript

```bash
# Check types
pnpm --filter @my-org/ui tsc --noEmit
```

### Issues with Tailwind

```bash
# Verify Tailwind is scanning the right files
# Check tailwind.config.ts content array
```

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Storybook Documentation](https://storybook.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
