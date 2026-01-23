# @my-org/ui

Cyberpunk-themed React component library with TypeScript, Tailwind CSS, and Vite.

## Features

- ⚡ Built with Vite for fast builds and HMR
- 🎨 Cyberpunk-themed UI with neon glow effects
- 🔷 Full TypeScript support with generated type declarations
- 📚 Storybook for component documentation
- 🧪 Vitest + React Testing Library for testing
- 🎯 ESLint + Prettier for code quality
- 🦋 Changesets for version management
- 📝 Husky + lint-staged for git hooks

## Design System

The library features a **Cyberpunk** design system with:

### Color Palette
- **Primary (Cyan)**: #00ffff - Used for primary actions and positive states
- **Secondary (Magenta)**: #ff00ff - Used for destructive actions and alerts
- **Background**: #0b0e14 - Deep charcoal background
- **Surface**: #1F2533 - Component background
- **Border**: #2d3b4e - Border colors

### Visual Effects
- ✨ Neon glow effects on primary colors
- 🔲 Clipped corner design
- 📺 Scanline overlays
- 🌐 Grid pattern backgrounds
- 💫 Floating animations
- 🎭 Glitch hover effects

## Installation

```bash
npm install @my-org/ui
# or
yarn add @my-org/ui
# or
pnpm add @my-org/ui
```

## Usage

### Import Styles

Make sure to import CSS file in your application:

```tsx
import '@my-org/ui/style.css'
```

### Import Components

```tsx
import {
  Button,
  Input,
  Modal,
  Switch,
  Checkbox,
  Radio,
  Badge,
  Progress,
  Toast,
  Card,
} from '@my-org/ui'

function App() {
  return (
    <div className="bg-background-dark text-white">
      <Button variant="primary" icon="bolt">
        Execute Protocol
      </Button>
      <Input
        label="User Identification"
        placeholder="ENTER ID..."
        icon="person"
      />
      <Badge variant="success" pulse>
        Online
      </Badge>
    </div>
  )
}
```

## Components

### Button

Cyberpunk-styled buttons with clipped corners and neon glow effects.

```tsx
<Button
  variant="primary"
  size="md"
  icon="bolt"
  loading={false}
  disabled={false}
  fullWidth={false}
>
  Execute Protocol
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' - Defines the button style
- `size`: 'sm' | 'md' | 'lg' - Controls the button dimensions
- `loading`: boolean - Shows loading spinner and disables interaction
- `fullWidth`: boolean - Makes button take full width of container
- `icon`: string - Material icon name to display
- `iconPosition`: 'left' | 'right' - Position of the icon relative to text
- `disabled`: boolean - Disables the button and reduces opacity

### Input

Cyberpunk input fields with icons and neon focus effects.

```tsx
<Input
  label="Security Key"
  type="password"
  placeholder="•••••••••"
  icon="visibility_off"
  iconPosition="right"
  badge="REQUIRED"
  error="Invalid key"
  helperText="Must be at least 8 characters"
  fullWidth={false}
/>
```

**Props:**
- `label`: string - Label text for the input field
- `type`: 'text' | 'password' | 'email' | 'number' - Input type attribute
- `placeholder`: string - Placeholder text when input is empty
- `icon`: string - Material icon name to display
- `iconPosition`: 'left' | 'right' - Position of the icon relative to text
- `badge`: string - Additional badge text to display
- `error`: string - Error message to display (overrides helperText)
- `helperText`: string - Helper text to display below the input
- `fullWidth`: boolean - Makes input take full width of container
- `size`: 'sm' | 'md' | 'lg' - Size of the input field
- `required`: boolean - Adds required indicator to the label

### Modal

Cyberpunk-styled modal with scanlines and corner decorations.

```tsx
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="System Update"
  size="md"
  closeOnOverlayClick
  closeOnEscape
  showScanlines
  footer={
    <>
      <Button variant="outline">
        Defer
      </Button>
      <Button variant="primary">
        Install
      </Button>
    </>
  }
>
  <p>Critical patch V.2.0.78 is available.</p>
</Modal>
```

**Props:**
- `open`: boolean - Controls modal visibility
- `onClose`: function - Callback when modal is closed
- `title`: string - Modal title text
- `children`: ReactNode - Modal content
- `footer`: ReactNode - Footer content (optional)
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' - Modal size
- `closeOnOverlayClick`: boolean - Close when clicking overlay
- `closeOnEscape`: boolean - Close when pressing Escape key
- `showScanlines`: boolean - Show scanline effect on modal

### Switch

Toggle switch with neon glow effect.

```tsx
<Switch label="Main Power" checked={true} onCheckedChange={(checked) => console.log(checked)} />
<Switch label="Stealth Mode" checked={false} />
```

**Props:**
- `checked`: boolean - Current state of the switch
- `onCheckedChange`: function - Callback when switch state changes
- `label`: string - Label text for the switch
- `disabled`: boolean - Disables the switch
- `size`: 'sm' | 'md' | 'lg' - Size of the switch
- `className`: string - Additional CSS classes

### Checkbox

Cyberpunk-styled checkbox.

```tsx
<Checkbox label="Enable Root Access" checked={true} onCheckedChange={(checked) => console.log(checked)} />
<Checkbox label="Auto-Update Firmware" checked={false} />
```

**Props:**
- `checked`: boolean - Current state of the checkbox
- `onCheckedChange`: function - Callback when checkbox state changes
- `label`: string - Label text for the checkbox
- `disabled`: boolean - Disables the checkbox
- `error`: boolean - Shows error state styling
- `className`: string - Additional CSS classes

### Radio

Radio buttons with custom colors.

```tsx
<Radio label="Low" name="priority" checked={false} onCheckedChange={(checked) => console.log(checked)} />
<Radio label="Med" name="priority" checked={true} />
<Radio label="High" name="priority" checked={false} />
```

**Props:**
- `checked`: boolean - Whether the radio is selected
- `onCheckedChange`: function - Callback when radio selection changes
- `label`: string - Label text for the radio
- `disabled`: boolean - Disables the radio
- `error`: boolean - Shows error state styling
- `name`: string - Group name for radio buttons (required)
- `className`: string - Additional CSS classes

### Badge

Status badges with glow effects.

```tsx
<Badge variant="success" icon="check" pulse>
  Online
</Badge>
<Badge variant="danger" icon="error">
  Critical
</Badge>
<Badge variant="warning" icon="warning">
  Unstable
</Badge>
```

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'danger' - Badge style variant
- `size`: 'sm' | 'md' | 'lg' - Badge size
- `icon`: string - Material icon name to display
- `pulse`: boolean - Adds pulsing animation effect
- `dot`: boolean - Shows only a dot without text
- `children`: ReactNode - Badge content
- `className`: string - Additional CSS classes

### Progress

Progress bars with glow effects.

```tsx
<Progress value={75} color="primary" showLabel striped />
<Progress value={88} color="secondary" striped />
```

**Props:**
- `value`: number - Current progress value (0-100)
- `max`: number - Maximum value (default: 100)
- `color`: 'primary' | 'secondary' - Progress bar color variant
- `showLabel`: boolean - Shows percentage label
- `striped`: boolean - Adds striped pattern
- `className`: string - Additional CSS classes

### Toast

Toast notifications with floating animation.

```tsx
<Toast
  title="CONNECTION_EST"
  message="Successfully linked to Node 44."
  variant="success"
  onClose={() => {}}
  autoClose
  duration={3000}
/>
```

**Props:**
- `id`: string - Unique identifier for the toast
- `title`: string - Toast title
- `message`: string - Toast message content (required)
- `variant`: 'success' | 'error' | 'warning' | 'info' - Toast style variant
- `onClose`: function - Callback when toast is closed
- `autoClose`: boolean - Automatically closes after duration
- `duration`: number - Duration in ms before auto-close (default: 3000)

### Card

Cyberpunk-styled cards with hover glow.

```tsx
<Card variant="default" glow={true} title="Card Title">
  <div className="space-y-4">
    <p className="text-slate-300">Card content goes here</p>
  </div>
</Card>
```

**Props:**
- `variant`: 'default' | 'action' | 'graphic' - Card style variant
- `glow`: boolean - Adds neon glow effect
- `hologram`: boolean - Adds hologram effect on hover
- `image`: string - Image URL for graphic variant
- `title`: string - Card title
- `description`: string - Card description
- `footer`: ReactNode - Footer content
- `children`: ReactNode - Card content
- `className`: string - Additional CSS classes

### Additional Components

The library includes many more components with similar cyberpunk styling:

- **Avatar** - User avatars with status indicators
- **Tag** - Small tag elements for categorization
- **Chip** - Compact elements for input, selection, and actions
- **Divider** - Horizontal or vertical dividers
- **Label** - Accessible labels for form controls
- **IconButton** - Icon-only buttons
- **Select** - Custom styled dropdown selectors
- **Textarea** - Multi-line text inputs
- **Alert** - Alert messages with different severity levels
- **Table** - Data tables with cyberpunk styling
- **Tabs** - Tab navigation components
- **Pagination** - Pagination controls
- **StatCard** - Cards for displaying statistics

## Development

```bash
# Install dependencies
pnpm install

# Start Storybook
pnpm dev

# Run tests
pnpm test

# Build library
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format
```

## Publishing

```bash
# Create a changeset
pnpm changeset

# Update versions
pnpm changeset version

# Publish to npm
pnpm release
```

## License

MIT
