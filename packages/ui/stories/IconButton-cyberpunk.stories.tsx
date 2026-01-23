import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from '../src/components'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Icon button size',
    },
    shape: {
      control: 'select',
      options: ['rounded', 'circle'],
      description: 'Button shape',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary'],
      description: 'Button variant',
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'home',
    size: 'md',
    shape: 'rounded',
    variant: 'default',
  },
}

export const Small: Story = {
  args: {
    icon: 'settings',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    icon: 'search',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    icon: 'favorite',
    size: 'lg',
  },
}

export const Rounded: Story = {
  args: {
    icon: 'add',
    shape: 'rounded',
  },
}

export const Circle: Story = {
  args: {
    icon: 'delete',
    shape: 'circle',
  },
}

export const Primary: Story = {
  args: {
    icon: 'bolt',
    variant: 'primary',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <IconButton icon="star" size="sm" />
      <IconButton icon="star" size="md" />
      <IconButton icon="star" size="lg" />
    </div>
  ),
  args: {
    icon: 'star',
    size: 'md',
  },
}

export const AllShapes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <IconButton icon="check" shape="rounded" />
      <IconButton icon="close" shape="circle" />
    </div>
  ),
  args: {
    icon: 'check',
    shape: 'rounded',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <IconButton icon="edit" variant="default" />
      <IconButton icon="done" variant="primary" />
    </div>
  ),
  args: {
    icon: 'edit',
    variant: 'default',
  },
}

export const CommonIcons: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <IconButton icon="home" variant="primary" />
      <IconButton icon="search" variant="primary" />
      <IconButton icon="settings" variant="primary" />
      <IconButton icon="notifications" variant="primary" />
      <IconButton icon="menu" variant="primary" />
    </div>
  ),
  args: {
    icon: 'home',
    variant: 'primary',
  },
}

export const ActionButtons: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <IconButton icon="edit" variant="primary" size="md" />
      <IconButton icon="delete" variant="default" size="md" />
      <IconButton icon="favorite" variant="primary" size="md" />
      <IconButton icon="share" variant="default" size="md" />
    </div>
  ),
  args: {
    icon: 'edit',
    variant: 'primary',
    size: 'md',
  },
}
