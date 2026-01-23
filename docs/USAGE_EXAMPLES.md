# Usage Examples & Best Practices

This guide provides practical examples and best practices for using the Cyberpunk UI library effectively.

## Getting Started

### Installation

```bash
npm install @my-org/ui
```

### Basic Setup

Import the styles in your main application file:

```tsx
// App.tsx or main entry point
import '@my-org/ui/style.css'

function App() {
  return (
    <div className="bg-background-dark text-white">
      {/* Your app content */}
    </div>
  )
}
```

## Common Patterns

### Form Layout

Create cohesive forms using the cyberpunk-styled components:

```tsx
import { Input, Button, Checkbox, Select } from '@my-org/ui'

function LoginForm() {
  return (
    <div className="space-y-6 max-w-md">
      <Input
        label="Username"
        placeholder="Enter your username"
        icon="person"
        fullWidth
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        icon="lock"
        fullWidth
      />
      <div className="flex items-center justify-between">
        <Checkbox label="Remember me" />
        <a href="#" className="text-primary text-sm hover:underline">Forgot password?</a>
      </div>
      <Button variant="primary" fullWidth>Log In</Button>
    </div>
  )
}
```

### Modal Dialogs

Use modals for important confirmations or detailed information:

```tsx
import { Modal, Button, Input } from '@my-org/ui'

function SettingsModal({ isOpen, onClose }) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="System Configuration"
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onClose}>Save Settings</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input label="Server Address" placeholder="192.168.1.1" fullWidth />
        <Input label="Port" placeholder="8080" fullWidth />
        <Input label="API Key" placeholder="••••••••••••" fullWidth />
      </div>
    </Modal>
  )
}
```

### Status Indicators

Use badges and progress bars to communicate system status:

```tsx
import { Badge, Progress, Card } from '@my-org/ui'

function SystemStatus() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card variant="default" glow>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">CPU Usage</h3>
            <Badge variant="success" pulse>Online</Badge>
          </div>
          <Progress value={45} variant="primary" showLabel />
        </div>
      </Card>
      
      <Card variant="default" glow>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Memory</h3>
            <Badge variant="warning">Warning</Badge>
          </div>
          <Progress value={78} variant="secondary" showLabel />
        </div>
      </Card>
      
      <Card variant="default" glow>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Network</h3>
            <Badge variant="success">Connected</Badge>
          </div>
          <Progress value={23} variant="primary" showLabel />
        </div>
      </Card>
    </div>
  )
}
```

## Best Practices

### 1. Consistent Variant Usage

Maintain consistency in how you use component variants:

- Use `primary` for the most important actions on a screen
- Use `secondary` for less important but still significant actions
- Use `outline` for actions that are important but shouldn't dominate the UI
- Use `ghost` for subtle actions like icons or secondary navigation

### 2. Appropriate Sizing

Choose the right size for your components:

- Use `sm` for utility buttons or when space is limited
- Use `md` for standard interface elements
- Use `lg` for important calls-to-action or in hero sections

### 3. Accessibility

Always consider accessibility when building interfaces:

```tsx
// Good: Using proper labels and ARIA attributes
<Input 
  label="Email Address" 
  aria-describedby="email-help"
  placeholder="user@example.com" 
/>
<p id="email-help" className="text-sm text-slate-400">Enter your registered email address</p>

// Good: Providing accessible names for icon buttons
<Button icon="delete" aria-label="Delete item" />

// Good: Using semantic HTML with components
<form onSubmit={handleSubmit}>
  <Input label="Name" name="name" required />
  <Button type="submit">Submit</Button>
</form>
```

### 4. Responsive Design

Make sure your components work well on all screen sizes:

```tsx
// Use fullWidth property for responsive layouts
<div className="space-y-4">
  <Input label="Name" fullWidth />
  <Input label="Email" fullWidth />
  <Button variant="primary" fullWidth>Submit</Button>
</div>

// Use responsive grid systems
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card glow>Content 1</Card>
  <Card glow>Content 2</Card>
  <Card glow>Content 3</Card>
</div>
```

### 5. State Management

Handle component states appropriately:

```tsx
import { useState } from 'react'
import { Button, Input, Switch } from '@my-org/ui'

function UserProfileForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notifications: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Submit form data
      await submitForm(formData)
    } catch (err) {
      setErrors({ submit: 'Failed to save profile' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        error={errors.name}
        fullWidth
      />
      <Input
        label="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        error={errors.email}
        fullWidth
      />
      <div className="flex items-center gap-3">
        <Switch
          checked={formData.notifications}
          onCheckedChange={(checked) => setFormData({...formData, notifications: checked})}
          label="Enable Notifications"
        />
      </div>
      <Button 
        variant="primary" 
        type="submit" 
        loading={isLoading}
        fullWidth
      >
        Save Profile
      </Button>
      {errors.submit && <p className="text-danger-magenta text-sm">{errors.submit}</p>}
    </form>
  )
}
```

## Theming

The Cyberpunk UI library uses CSS variables that you can customize:

```css
/* Custom theme example */
:root {
  --primary: #00ffaa; /* Change primary color */
  --secondary: #ff5500; /* Change secondary color */
  --background-dark: #0a0a0a; /* Darker background */
}
```

## Performance Tips

1. **Import only what you need**:
   ```tsx
   // Good: Import specific components
   import { Button, Input } from '@my-org/ui'
   
   // Avoid: Importing everything
   import * as UI from '@my-org/ui'
   ```

2. **Use React.memo** for components that render lists of UI elements:
   ```tsx
   const MemoizedButton = React.memo(Button)
   ```

3. **Lazy load modals** that aren't always visible:
   ```tsx
   const LazyModal = lazy(() => import('./ModalComponent'))
   ```

Following these practices will help you create consistent, accessible, and visually appealing interfaces using the Cyberpunk UI library.