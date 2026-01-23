import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Select, SelectOption } from '../src/components'
const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Select size',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Select takes full width',
    },
    required: {
      control: 'boolean',
      description: 'Show required asterisk',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const options: SelectOption[] = [
  { value: 'cyberpunk', label: 'Cyberpunk Theme' },
  { value: 'stealth', label: 'Stealth Mode' },
  { value: 'classic', label: 'Classic UI' },
]

const optionsWithIcons: SelectOption[] = [
  { value: 'cpu', label: 'CPU Monitor', icon: 'memory' },
  { value: 'memory', label: 'Memory Usage', icon: 'storage' },
  { value: 'network', label: 'Network Status', icon: 'wifi' },
]

const optionsWithDisabled: SelectOption[] = [
  { value: 'admin', label: 'Admin Access' },
  { value: 'mod', label: 'Moderator Access' },
  { value: 'user', label: 'User Access' },
  { value: 'guest', label: 'Guest Access', disabled: true },
]

export const Default: Story = {
  args: {
    label: 'System Theme',
    placeholder: 'Select theme...',
    options,
    size: 'md',
  },
}

export const WithValue: Story = {
  args: {
    label: 'System Theme',
    placeholder: 'Select theme...',
    options,
    value: 'cyberpunk',
    size: 'md',
  },
}

export const WithIcons: Story = {
  args: {
    label: 'Monitor Module',
    placeholder: 'Select module...',
    options: optionsWithIcons,
    size: 'md',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Access Level',
    placeholder: 'Select level...',
    options: optionsWithDisabled,
    helperText: 'Choose your access permission level',
  },
}

export const ErrorState: Story = {
  args: {
    label: 'Access Level',
    placeholder: 'Select level...',
    options: optionsWithDisabled,
    error: 'Invalid access level selected',
  },
}

export const Required: Story = {
  args: {
    label: 'Default Language',
    placeholder: 'Select language...',
    options,
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'System Theme',
    placeholder: 'Select theme...',
    options,
    value: 'cyberpunk',
    disabled: true,
  },
}

export const Small: Story = {
  args: {
    label: 'Theme',
    placeholder: 'Select...',
    options,
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    label: 'System Configuration',
    placeholder: 'Select configuration...',
    options,
    size: 'lg',
  },
}

export const FullWidth: Story = {
  args: {
    label: 'System Theme',
    placeholder: 'Select theme...',
    options,
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
}

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState('cyberpunk')

    return (
      <div className="space-y-6 w-96">
        <Select
          label="System Theme"
          placeholder="Select theme..."
          options={options}
          value={selected}
          onValueChange={setSelected}
        />
        <p className="text-xs font-mono text-slate-400">Selected: {selected}</p>
      </div>
    )
  },
  args: {
    label: 'System Theme',
    placeholder: 'Select theme...',
    options,
    value: 'cyberpunk',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <Select label="Small" placeholder="Select..." options={options} size="sm" />
      <Select label="Medium" placeholder="Select..." options={options} size="md" />
      <Select label="Large" placeholder="Select..." options={options} size="lg" />
    </div>
  ),
  args: {
    label: 'Select',
    placeholder: 'Select...',
    options,
  },
}
