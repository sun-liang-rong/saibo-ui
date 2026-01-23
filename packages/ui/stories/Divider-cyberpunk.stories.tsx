import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from '../src/components'

const meta = {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation',
    },
    dividerStyle: {
      control: 'select',
      options: ['minimal', 'junction', 'gradient', 'labeled', 'cross'],
      description: 'Divider style',
    },
    label: {
      control: 'text',
      description: 'Label text (for labeled style)',
    },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    dividerStyle: 'minimal',
  },
}

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <p className="text-white">Content above</p>
      <Divider />
      <p className="text-white">Content below</p>
    </div>
  ),
  args: {
    orientation: 'horizontal',
    dividerStyle: 'minimal',
  },
}

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-4 h-32 items-center">
      <div className="flex-1 text-white">Left content</div>
      <Divider orientation="vertical" />
      <div className="flex-1 text-white">Right content</div>
    </div>
  ),
  args: {
    orientation: 'vertical',
    dividerStyle: 'minimal',
  },
}

export const Minimal: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <p className="text-white">Content above</p>
      <Divider dividerStyle="minimal" />
      <p className="text-white">Content below</p>
    </div>
  ),
  args: {
    orientation: 'horizontal',
    dividerStyle: 'minimal',
  },
}

export const Junction: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <p className="text-white">Content above</p>
      <Divider dividerStyle="junction" />
      <p className="text-white">Content below</p>
    </div>
  ),
  args: {
    orientation: 'horizontal',
    dividerStyle: 'junction',
  },
}

export const Gradient: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <p className="text-white">Content above</p>
      <Divider dividerStyle="gradient" />
      <p className="text-white">Content below</p>
    </div>
  ),
  args: {
    orientation: 'horizontal',
    dividerStyle: 'gradient',
  },
}

export const Labeled: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <p className="text-white">Content above</p>
      <Divider dividerStyle="labeled" label="SECTION" />
      <p className="text-white">Content below</p>
    </div>
  ),
  args: {
    orientation: 'horizontal',
    dividerStyle: 'labeled',
    label: 'SECTION',
  },
}

export const Cross: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <p className="text-white">Content above</p>
      <Divider dividerStyle="cross" />
      <p className="text-white">Content below</p>
    </div>
  ),
  args: {
    orientation: 'horizontal',
    dividerStyle: 'cross',
  },
}

export const AllStyles: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <p className="text-white text-xs mb-2">MINIMAL</p>
        <Divider dividerStyle="minimal" />
      </div>
      <div>
        <p className="text-white text-xs mb-2">JUNCTION</p>
        <Divider dividerStyle="junction" />
      </div>
      <div>
        <p className="text-white text-xs mb-2">GRADIENT</p>
        <Divider dividerStyle="gradient" />
      </div>
      <div>
        <p className="text-white text-xs mb-2">CROSS</p>
        <Divider dividerStyle="cross" />
      </div>
    </div>
  ),
  args: {
    orientation: 'horizontal',
    dividerStyle: 'minimal',
  },
}
