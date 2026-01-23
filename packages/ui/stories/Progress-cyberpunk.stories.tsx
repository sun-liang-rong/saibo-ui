import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from '../src/components'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Progress value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Progress color',
    },
    striped: {
      control: 'boolean',
      description: 'Striped pattern',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show percentage label',
    },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 50,
    max: 100,
    color: 'primary',
    striped: false,
    showLabel: false,
  },
}

export const Primary: Story = {
  args: {
    value: 65,
    color: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    value: 80,
    color: 'secondary',
  },
}

export const Striped: Story = {
  args: {
    value: 75,
    color: 'primary',
    striped: true,
  },
}

export const WithLabel: Story = {
  args: {
    value: 45,
    color: 'primary',
    showLabel: true,
  },
}

export const Zero: Story = {
  args: {
    value: 0,
    color: 'primary',
  },
}

export const Half: Story = {
  args: {
    value: 50,
    color: 'primary',
  },
}

export const Full: Story = {
  args: {
    value: 100,
    color: 'primary',
  },
}

export const CustomMax: Story = {
  args: {
    value: 750,
    max: 1000,
    color: 'primary',
    showLabel: true,
  },
}

export const AllColors: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Progress value={25} color="primary" />
      <Progress value={50} color="secondary" />
    </div>
  ),
  args: {
    value: 50,
    color: 'primary',
  },
}

export const AllStripes: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Progress value={33} color="primary" striped />
      <Progress value={66} color="secondary" striped />
    </div>
  ),
  args: {
    value: 50,
    color: 'primary',
    striped: true,
  },
}

export const AllWithLabels: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Progress value={25} color="primary" showLabel />
      <Progress value={50} color="secondary" showLabel />
      <Progress value={75} color="primary" striped showLabel />
    </div>
  ),
  args: {
    value: 50,
    color: 'primary',
    showLabel: true,
  },
}

export const CompleteProgress: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Progress value={10} color="primary" striped showLabel />
      <Progress value={25} color="secondary" striped showLabel />
      <Progress value={50} color="primary" striped showLabel />
      <Progress value={75} color="secondary" striped showLabel />
      <Progress value={90} color="primary" striped showLabel />
      <Progress value={100} color="secondary" striped showLabel />
    </div>
  ),
  args: {
    value: 50,
    color: 'primary',
    striped: true,
    showLabel: true,
  },
}
