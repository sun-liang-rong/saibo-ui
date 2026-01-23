import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Radio } from '../src/components'

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Radio state',
    },
    name: {
      control: 'text',
      description: 'Form group name (required)',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    checked: false,
    name: 'priority',
    label: 'Low Priority',
  },
}

export const Checked: Story = {
  args: {
    checked: true,
    name: 'priority',
    label: 'Medium Priority',
  },
}

export const WithoutLabel: Story = {
  args: {
    checked: false,
    name: 'group',
  },
}

export const Disabled: Story = {
  args: {
    checked: false,
    name: 'priority',
    label: 'Disabled Option',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    checked: true,
    name: 'priority',
    label: 'Disabled Checked',
    disabled: true,
  },
}

export const Error: Story = {
  args: {
    checked: false,
    name: 'validation',
    label: 'Error State',
    error: true,
  },
}

export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('low')

    return (
      <div className="space-y-3">
        <Radio
          name="priority"
          label="Low Priority"
          checked={selected === 'low'}
          onCheckedChange={() => setSelected('low')}
        />
        <Radio
          name="priority"
          label="Medium Priority"
          checked={selected === 'medium'}
          onCheckedChange={() => setSelected('medium')}
        />
        <Radio
          name="priority"
          label="High Priority"
          checked={selected === 'high'}
          onCheckedChange={() => setSelected('high')}
        />
      </div>
    )
  },
  args: {
    checked: false,
    name: 'priority',
    label: 'Option',
  },
}

export const Interactive: Story = {
  render: () => {
    const [theme, setTheme] = useState('cyberpunk')

    return (
      <div className="space-y-4">
        <p className="text-xs font-mono uppercase tracking-wide text-primary mb-4">Select Theme</p>
        <Radio
          name="theme"
          label="Cyberpunk"
          checked={theme === 'cyberpunk'}
          onCheckedChange={() => setTheme('cyberpunk')}
        />
        <Radio
          name="theme"
          label="Stealth"
          checked={theme === 'stealth'}
          onCheckedChange={() => setTheme('stealth')}
        />
        <Radio
          name="theme"
          label="Classic"
          checked={theme === 'classic'}
          onCheckedChange={() => setTheme('classic')}
        />
      </div>
    )
  },
  args: {
    checked: false,
    name: 'theme',
    label: 'Option',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Radio name="state1" label="Unchecked" checked={false} />
      <Radio name="state2" label="Checked" checked={true} />
      <Radio name="state3" label="Disabled Unchecked" checked={false} disabled />
      <Radio name="state4" label="Disabled Checked" checked={true} disabled />
      <Radio name="state5" label="Error State" checked={false} error />
      <Radio name="state6" label="Error Checked" checked={true} error />
    </div>
  ),
  args: {
    checked: false,
    name: 'group',
    label: 'Radio',
  },
}

export const MultipleGroups: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-mono uppercase tracking-wide text-primary mb-3">
          Priority Level
        </p>
        <div className="space-y-3">
          <Radio name="priority" label="Low" checked={false} />
          <Radio name="priority" label="Medium" checked={true} />
          <Radio name="priority" label="High" checked={false} />
        </div>
      </div>

      <div>
        <p className="text-xs font-mono uppercase tracking-wide text-primary mb-3">Color Scheme</p>
        <div className="space-y-3">
          <Radio name="color" label="Cyan" checked={true} />
          <Radio name="color" label="Magenta" checked={false} />
          <Radio name="color" label="White" checked={false} />
        </div>
      </div>
    </div>
  ),
  args: {
    checked: false,
    name: 'group',
    label: 'Radio',
  },
}
