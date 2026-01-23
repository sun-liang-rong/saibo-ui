# Button Component

The Button component is a core element of the Cyberpunk UI library, featuring neon glow effects, clipped corners, and various styling options.

## Basic Usage

```tsx
import { Button } from '@my-org/ui'

function App() {
  return (
    <Button variant="primary" size="md">
      Execute Protocol
    </Button>
  )
}
```

## Variants

The Button component comes with four distinct variants:

### Primary
The primary variant is used for main actions and important calls-to-action.

```tsx
<Button variant="primary">Primary Action</Button>
```

### Secondary
The secondary variant is used for less prominent actions.

```tsx
<Button variant="secondary">Secondary Action</Button>
```

### Outline
The outline variant is used for actions that need to stand out less than primary but more than ghost.

```tsx
<Button variant="outline">Outline Action</Button>
```

### Ghost
The ghost variant is used for subtle actions, often in toolbars or as secondary options.

```tsx
<Button variant="ghost">Ghost Action</Button>
```

## Sizes

Buttons come in three sizes:

- `sm` (small): 30px height - for utility buttons
- `md` (medium): 38px height - standard size
- `lg` (large): 48px height - for prominent actions

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## Icons

Buttons can include Material Icons on either side of the text:

```tsx
<Button icon="bolt" iconPosition="left">Left Icon</Button>
<Button icon="arrow_forward" iconPosition="right">Right Icon</Button>
```

## Loading State

Buttons can show a loading state with a spinner:

```tsx
<Button loading={true}>Loading...</Button>
```

## Full Width

Buttons can take the full width of their container:

```tsx
<Button fullWidth={true}>Full Width Button</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Style variant of the button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the button |
| `loading` | `boolean` | `false` | Shows loading spinner and disables interaction |
| `fullWidth` | `boolean` | `false` | Makes button take full width of container |
| `icon` | `string` | `undefined` | Material icon name to display |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of the icon relative to text |
| `disabled` | `boolean` | `false` | Disables the button and reduces opacity |
| `className` | `string` | `undefined` | Additional CSS classes |

## Styling

Buttons feature:
- Neon glow effects on hover
- Clipped corners for primary, secondary, and outline variants
- Smooth transitions for interactive states
- Cyberpunk-inspired color scheme