import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from '../src/components'

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger', 'outline'],
      description: 'Tag variant',
    },
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'info',
    children: 'Cyberpunk',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Information',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Completed',
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
    children: 'Critical',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Optional',
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'info',
    icon: 'bolt',
    children: 'Active',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap items-center">
      <Tag variant="info">Info</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="danger">Danger</Tag>
      <Tag variant="outline">Outline</Tag>
    </div>
  ),
  args: {
    variant: 'info',
    children: 'Tag',
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap items-center">
      <Tag variant="info" icon="star">
        Featured
      </Tag>
      <Tag variant="success" icon="check">
        Verified
      </Tag>
      <Tag variant="warning" icon="schedule">
        Scheduled
      </Tag>
      <Tag variant="danger" icon="error">
        Error
      </Tag>
    </div>
  ),
  args: {
    variant: 'info',
    children: 'Tag',
  },
}

export const TagCloud: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap items-center">
      <Tag variant="info">React</Tag>
      <Tag variant="success">TypeScript</Tag>
      <Tag variant="warning">Vite</Tag>
      <Tag variant="danger">Storybook</Tag>
      <Tag variant="outline">Tailwind</Tag>
      <Tag variant="info">Cyberpunk</Tag>
    </div>
  ),
  args: {
    variant: 'info',
    children: 'Tag',
  },
}
