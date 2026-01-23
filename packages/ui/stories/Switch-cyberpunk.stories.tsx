import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from '../src/components'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Switch state',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Switch size',
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    checked: false,
    label: 'Main Power',
    size: 'md',
  },
}

export const Checked: Story = {
  args: {
    checked: true,
    label: 'Main Power',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    checked: false,
    label: 'Small Switch',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    checked: false,
    label: 'Medium Switch',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    checked: false,
    label: 'Large Switch',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    checked: false,
    label: 'Disabled Switch',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    checked: true,
    label: 'Disabled Checked',
    disabled: true,
  },
}

export const WithoutLabel: Story = {
  args: {
    checked: false,
    size: 'md',
  },
}

export const Interactive: Story = {
  render: () => {
    const [switchStates, setSwitchStates] = useState({
      power: false,
      stealth: false,
      autoUpdate: true,
      notifications: false,
    })

    const handleToggle = (key: keyof typeof switchStates) => {
      setSwitchStates(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
      <div className="space-y-4">
        <Switch
          checked={switchStates.power}
          onCheckedChange={() => handleToggle('power')}
          label="Main Power"
          size="md"
        />
        <Switch
          checked={switchStates.stealth}
          onCheckedChange={() => handleToggle('stealth')}
          label="Stealth Mode"
          size="md"
        />
        <Switch
          checked={switchStates.autoUpdate}
          onCheckedChange={() => handleToggle('autoUpdate')}
          label="Auto-Update Firmware"
          size="md"
        />
        <Switch
          checked={switchStates.notifications}
          onCheckedChange={() => handleToggle('notifications')}
          label="Notifications"
          size="md"
        />
      </div>
    )
  },
  args: {
    checked: false,
    label: 'Main Power',
    size: 'md',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <Switch checked={false} label="Small" size="sm" />
      <Switch checked={false} label="Medium" size="md" />
      <Switch checked={false} label="Large" size="lg" />
    </div>
  ),
  args: {
    checked: false,
    label: 'Switch',
    size: 'md',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch checked={false} label="Unchecked" size="md" />
      <Switch checked={true} label="Checked" size="md" />
      <Switch checked={false} label="Disabled Unchecked" size="md" disabled />
      <Switch checked={true} label="Disabled Checked" size="md" disabled />
    </div>
  ),
  args: {
    checked: false,
    label: 'Switch',
    size: 'md',
  },
}
