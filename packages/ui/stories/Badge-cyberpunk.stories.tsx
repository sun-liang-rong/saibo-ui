import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../src/components'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
      description: 'Badge variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
    pulse: {
      control: 'boolean',
      description: 'Pulse animation',
    },
    dot: {
      control: 'boolean',
      description: 'Show dot indicator',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'info',
    size: 'md',
    children: 'Online',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Active',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Pending',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Error',
  },
}

export const Small: Story = {
  args: {
    variant: 'info',
    size: 'sm',
    children: 'SM',
  },
}

export const Medium: Story = {
  args: {
    variant: 'success',
    size: 'md',
    children: 'MD',
  },
}

export const Large: Story = {
  args: {
    variant: 'warning',
    size: 'lg',
    children: 'LG',
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'info',
    icon: 'check_circle',
    children: 'Connected',
  },
}

export const Pulse: Story = {
  args: {
    variant: 'success',
    pulse: true,
    children: 'Live',
  },
}

export const Dot: Story = {
  args: {
    variant: 'info',
    dot: true,
    children: 'New',
  },
}

export const DotPulse: Story = {
  args: {
    variant: 'danger',
    dot: true,
    pulse: true,
    children: 'Alert',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap items-center">
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
  args: {
    variant: 'info',
    children: 'Badge',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-3 items-center">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  args: {
    variant: 'info',
    children: 'Badge',
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap items-center">
      <Badge variant="info" icon="info">
        Info
      </Badge>
      <Badge variant="success" icon="check">
        Success
      </Badge>
      <Badge variant="warning" icon="warning">
        Warning
      </Badge>
      <Badge variant="danger" icon="error">
        Danger
      </Badge>
    </div>
  ),
  args: {
    variant: 'info',
    children: 'Badge',
  },
}
