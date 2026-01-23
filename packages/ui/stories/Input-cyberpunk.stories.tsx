import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../src/components'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number'],
      description: 'Input type',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Icon position',
    },
    badge: {
      control: 'text',
      description: 'Badge text',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Input takes full width',
    },
    required: {
      control: 'boolean',
      description: 'Show required asterisk',
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'text',
    label: 'User Identification',
    placeholder: 'ENTER ID...',
    size: 'md',
  },
}

export const WithLabel: Story = {
  args: {
    type: 'text',
    label: 'Username',
    placeholder: 'Enter username...',
  },
}

export const WithHelperText: Story = {
  args: {
    type: 'text',
    label: 'Email Address',
    placeholder: 'user@example.com',
    helperText: 'We will never share your email.',
  },
}

export const ErrorState: Story = {
  args: {
    type: 'text',
    label: 'Password',
    placeholder: '•••••••••',
    error: 'Password must be at least 8 characters',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    label: 'Security Key',
    placeholder: '•••••••••',
  },
}

export const WithIconLeft: Story = {
  args: {
    type: 'text',
    label: 'Search',
    placeholder: 'Search...',
    icon: 'search',
    iconPosition: 'left',
  },
}

export const WithIconRight: Story = {
  args: {
    type: 'text',
    label: 'Email',
    placeholder: 'user@example.com',
    icon: 'email',
    iconPosition: 'right',
  },
}

export const WithBadge: Story = {
  args: {
    type: 'text',
    label: 'API Key',
    placeholder: 'Enter API key...',
    badge: 'REQUIRED',
  },
}

export const Required: Story = {
  args: {
    type: 'text',
    label: 'Full Name',
    placeholder: 'John Doe',
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    type: 'text',
    label: 'Username',
    value: 'johndoe',
    disabled: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  ),
}

export const FullWidth: Story = {
  args: {
    type: 'text',
    label: 'Full Width Input',
    placeholder: 'This input takes full width',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
}

export const AllTypes: Story = {
  render: () => (
    <div className="flex gap-4 flex-col">
      <Input type="text" label="Text" placeholder="Text input" />
      <Input type="email" label="Email" placeholder="user@example.com" />
      <Input type="number" label="Number" placeholder="123" />
      <Input type="password" label="Password" placeholder="•••••••••" />
    </div>
  ),
}
