import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '../src/components'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Avatar image source',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Avatar size',
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
      description: 'Avatar shape',
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'hologram', 'corrupted'],
      description: 'Avatar status indicator',
    },
    fallback: {
      control: 'text',
      description: 'Fallback text when no image',
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
    shape: 'circle',
  },
}

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    size: 'md',
    shape: 'circle',
  },
}

export const WithFallback: Story = {
  args: {
    fallback: 'JD',
    size: 'md',
    shape: 'circle',
  },
}

export const Small: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=2',
    size: 'sm',
    shape: 'circle',
  },
}

export const Medium: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    size: 'md',
    shape: 'circle',
  },
}

export const Large: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=4',
    size: 'lg',
    shape: 'circle',
  },
}

export const Circle: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=5',
    shape: 'circle',
  },
}

export const Square: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=6',
    shape: 'square',
  },
}

export const Online: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=7',
    status: 'online',
  },
}

export const Offline: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=8',
    status: 'offline',
  },
}

export const Away: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=9',
    status: 'away',
  },
}

export const Hologram: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=10',
    status: 'hologram',
  },
}

export const Corrupted: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=11',
    status: 'corrupted',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar src="https://i.pravatar.cc/150?img=12" size="sm" />
      <Avatar src="https://i.pravatar.cc/150?img=13" size="md" />
      <Avatar src="https://i.pravatar.cc/150?img=14" size="lg" />
    </div>
  ),
  args: {
    size: 'md',
    shape: 'circle',
  },
}

export const AllShapes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar src="https://i.pravatar.cc/150?img=15" shape="circle" />
      <Avatar src="https://i.pravatar.cc/150?img=16" shape="square" />
    </div>
  ),
  args: {
    size: 'md',
    shape: 'circle',
  },
}

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar src="https://i.pravatar.cc/150?img=17" status="online" />
      <Avatar src="https://i.pravatar.cc/150?img=18" status="offline" />
      <Avatar src="https://i.pravatar.cc/150?img=19" status="away" />
      <Avatar src="https://i.pravatar.cc/150?img=20" status="hologram" />
      <Avatar src="https://i.pravatar.cc/150?img=21" status="corrupted" />
    </div>
  ),
  args: {
    size: 'md',
    shape: 'circle',
  },
}

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-4">
      <Avatar src="https://i.pravatar.cc/150?img=22" size="md" shape="circle" status="online" />
      <Avatar src="https://i.pravatar.cc/150?img=23" size="md" shape="circle" status="online" />
      <Avatar src="https://i.pravatar.cc/150?img=24" size="md" shape="circle" status="away" />
      <Avatar src="https://i.pravatar.cc/150?img=25" size="md" shape="circle" status="offline" />
      <Avatar fallback="+5" size="md" shape="circle" />
    </div>
  ),
  args: {
    size: 'md',
    shape: 'circle',
  },
}
