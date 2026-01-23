import type { Meta, StoryObj } from '@storybook/react'
import { StatCard } from '../src/components'

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Stat card label',
    },
    value: {
      control: 'text',
      description: 'Stat card value',
    },
    trend: {
      control: 'text',
      description: 'Trend text',
    },
    trendDirection: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
      description: 'Trend direction',
    },
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
    progress: {
      control: 'number',
      description: 'Progress value (0-100)',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Color theme',
    },
  },
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Total Users',
    value: '12,458',
    color: 'primary',
  },
}

export const Primary: Story = {
  args: {
    label: 'System Status',
    value: 'Active',
    color: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Error Count',
    value: '23',
    color: 'secondary',
  },
}

export const WithTrendUp: Story = {
  args: {
    label: 'Active Users',
    value: '8,492',
    trend: '+12.5%',
    trendDirection: 'up',
    color: 'primary',
  },
}

export const WithTrendDown: Story = {
  args: {
    label: 'CPU Usage',
    value: '67%',
    trend: '-5.3%',
    trendDirection: 'down',
    color: 'secondary',
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Storage',
    value: '458 GB',
    icon: 'storage',
    color: 'primary',
  },
}

export const WithProgress: Story = {
  args: {
    label: 'Memory Usage',
    value: '8.2 GB',
    progress: 75,
    color: 'primary',
  },
}

export const Complete: Story = {
  args: {
    label: 'Network Traffic',
    value: '2.4 GB/s',
    trend: '+8.2%',
    trendDirection: 'up',
    icon: 'wifi',
    progress: 62,
    color: 'primary',
  },
}

export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
      <StatCard label="Primary Metric" value="1,234" color="primary" />
      <StatCard label="Secondary Metric" value="5,678" color="secondary" />
    </div>
  ),
  args: {
    label: 'Stat',
    value: '0',
    color: 'primary',
  },
}

export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl">
      <StatCard
        label="Total Users"
        value="12,458"
        trend="+12.5%"
        trendDirection="up"
        icon="person"
        progress={85}
        color="primary"
      />
      <StatCard
        label="Revenue"
        value="$48,392"
        trend="+8.2%"
        trendDirection="up"
        icon="payments"
        progress={72}
        color="primary"
      />
      <StatCard
        label="Active Sessions"
        value="1,245"
        trend="-3.1%"
        trendDirection="down"
        icon="devices"
        progress={45}
        color="primary"
      />
      <StatCard
        label="Error Rate"
        value="0.02%"
        trend="-0.01%"
        trendDirection="up"
        icon="error"
        progress={15}
        color="secondary"
      />
    </div>
  ),
  args: {
    label: 'Stat',
    value: '0',
    color: 'primary',
  },
}
