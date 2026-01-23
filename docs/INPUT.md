# Input Component

The Input component is a cyberpunk-styled text input with icons, labels, and validation states.

## Basic Usage

```tsx
import { Input } from '@my-org/ui'

function App() {
  return (
    <Input
      label="User Identification"
      placeholder="Enter your ID..."
      icon="person"
    />
  )
}
```

## Features

### Labels
Inputs can have associated labels:

```tsx
<Input label="Username" placeholder="Enter username" />
```

### Icons
Inputs can include Material Icons on either side:

```tsx
<Input icon="person" iconPosition="left" placeholder="Username" />
<Input icon="lock" iconPosition="right" type="password" placeholder="Password" />
```

### Validation States
Inputs support error and helper text:

```tsx
<Input 
  label="Email" 
  error="Invalid email address" 
  placeholder="user@example.com" 
/>
<Input 
  label="Password" 
  helperText="Must be at least 8 characters" 
  type="password" 
  placeholder="••••••••" 
/>
```

### Badges
Inputs can display badges for additional information:

```tsx
<Input 
  label="Security Token" 
  badge="REQUIRED" 
  placeholder="Enter token" 
/>
```

### Password Visibility Toggle
Password inputs automatically include a visibility toggle:

```tsx
<Input 
  label="Password" 
  type="password" 
  placeholder="••••••••" 
/>
```

## Sizes

Inputs come in three sizes:

- `sm` (small): 32px height
- `md` (medium): 40px height
- `lg` (large): 48px height

```tsx
<Input size="sm" placeholder="Small input" />
<Input size="md" placeholder="Medium input" />
<Input size="lg" placeholder="Large input" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Label text for the input field |
| `type` | `'text' \| 'password' \| 'email' \| 'number'` | `'text'` | Input type attribute |
| `placeholder` | `string` | `undefined` | Placeholder text when input is empty |
| `icon` | `string` | `undefined` | Material icon name to display |
| `iconPosition` | `'left' \| 'right'` | `'right'` | Position of the icon relative to text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the input field |
| `badge` | `string` | `undefined` | Additional badge text to display |
| `error` | `string` | `undefined` | Error message to display (overrides helperText) |
| `helperText` | `string` | `undefined` | Helper text to display below the input |
| `fullWidth` | `boolean` | `false` | Makes input take full width of container |
| `required` | `boolean` | `false` | Adds required indicator to the label |
| `disabled` | `boolean` | `false` | Disables the input field |

## Styling

Inputs feature:
- Neon glow effects on focus
- Cyberpunk-themed borders and backgrounds
- Scanline effects for retro-futuristic feel
- Smooth transitions for interactive states
- Password visibility toggle for password fields