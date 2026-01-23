import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../src/components'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm'],
      description: 'Button size',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Button takes full width',
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
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Execute Protocol',
    variant: 'primary',
    size: 'md',
  },
}

export const Primary: Story = {
  args: {
    children: 'Primary Action',
    variant: 'primary',
    size: 'md',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Action',
    variant: 'secondary',
    size: 'md',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline Action',
    variant: 'outline',
    size: 'md',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost Action',
    variant: 'ghost',
    size: 'md',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button variant="primary" icon="bolt" iconPosition="left">
        Left Icon
      </Button>
      <Button variant="secondary" icon="bolt" iconPosition="right">
        Right Icon
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'primary',
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    disabled: true,
  },
}

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
}
