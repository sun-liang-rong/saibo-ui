# Modal Component

The Modal component is a cyberpunk-styled dialog with scanlines, corner decorations, and various sizing options.

## Basic Usage

```tsx
import { Modal, Button } from '@my-org/ui'

function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="System Alert"
      >
        <p>Access to restricted area detected.</p>
      </Modal>
    </>
  )
}
```

## Features

### Titles
Modals can have titles displayed in the header:

```tsx
<Modal open={true} onClose={() => {}} title="System Update">
  <p>New firmware available for installation.</p>
</Modal>
```

### Footers
Modals can include footers for action buttons:

```tsx
<Modal
  open={true}
  onClose={() => {}}
  title="Confirmation"
  footer={
    <>
      <Button variant="outline" onClick={() => {}}>
        Cancel
      </Button>
      <Button variant="primary" onClick={() => {}}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### Sizes
Modals come in five sizes:

- `sm`: Small dialogs (max-width: 24rem)
- `md`: Medium dialogs (max-width: 32rem)
- `lg`: Large dialogs (max-width: 48rem)
- `xl`: Extra-large dialogs (max-width: 64rem)
- `full`: Full-screen dialogs

```tsx
<Modal open={true} onClose={() => {}} size="lg" title="Large Modal">
  <p>This is a large modal dialog.</p>
</Modal>
```

### Scanlines
Modals can show scanline effects for a retro-futuristic feel:

```tsx
<Modal open={true} onClose={() => {}} showScanlines={true}>
  <p>Modal with scanlines effect.</p>
</Modal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls modal visibility |
| `onClose` | `() => void` | `undefined` | Callback when modal is closed |
| `title` | `string` | `undefined` | Modal title text |
| `children` | `ReactNode` | `undefined` | Modal content |
| `footer` | `ReactNode` | `undefined` | Footer content (optional) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `closeOnOverlayClick` | `boolean` | `true` | Close when clicking overlay |
| `closeOnEscape` | `boolean` | `true` | Close when pressing Escape key |
| `showScanlines` | `boolean` | `true` | Show scanline effect on modal |

## Behavior

- Modals trap focus when open
- Clicking the overlay closes the modal (configurable)
- Pressing Escape closes the modal (configurable)
- Body scrolling is disabled when modal is open
- Backdrop blur effect for depth

## Styling

Modals feature:
- Neon glow effects around the border
- Corner decorations with primary color borders
- Scanline overlay for retro-futuristic feel
- Cyberpunk-themed background and text colors
- Smooth entrance/exit animations