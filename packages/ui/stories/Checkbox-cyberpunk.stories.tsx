import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from '../src/components'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Checkbox state',
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
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    checked: false,
    label: 'Enable Root Access',
  },
}

export const Checked: Story = {
  args: {
    checked: true,
    label: 'Enable Root Access',
  },
}

export const WithoutLabel: Story = {
  args: {
    checked: false,
  },
}

export const Disabled: Story = {
  args: {
    checked: false,
    label: 'Disabled Option',
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

export const Error: Story = {
  args: {
    checked: false,
    label: 'Validation Error',
    error: true,
  },
}

export const ErrorChecked: Story = {
  args: {
    checked: true,
    label: 'Error State',
    error: true,
  },
}

export const Interactive: Story = {
  render: () => {
    const [checkboxes, setCheckboxes] = useState({
      terms: false,
      privacy: false,
      newsletter: true,
      updates: false,
    })

    const handleToggle = (key: keyof typeof checkboxes) => {
      setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
      <div className="space-y-4">
        <Checkbox
          checked={checkboxes.terms}
          onCheckedChange={() => handleToggle('terms')}
          label="I agree to the Terms of Service"
        />
        <Checkbox
          checked={checkboxes.privacy}
          onCheckedChange={() => handleToggle('privacy')}
          label="I accept the Privacy Policy"
        />
        <Checkbox
          checked={checkboxes.newsletter}
          onCheckedChange={() => handleToggle('newsletter')}
          label="Subscribe to newsletter"
        />
        <Checkbox
          checked={checkboxes.updates}
          onCheckedChange={() => handleToggle('updates')}
          label="Receive product updates"
        />
      </div>
    )
  },
  args: {
    checked: false,
    label: 'Checkbox',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox checked={false} label="Unchecked" />
      <Checkbox checked={true} label="Checked" />
      <Checkbox checked={false} label="Disabled Unchecked" disabled />
      <Checkbox checked={true} label="Disabled Checked" disabled />
      <Checkbox checked={false} label="Error State" error />
      <Checkbox checked={true} label="Error Checked" error />
    </div>
  ),
  args: {
    checked: false,
    label: 'Checkbox',
  },
}

export const WithoutLabels: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <Checkbox checked={false} />
      <Checkbox checked={true} />
      <Checkbox checked={false} disabled />
      <Checkbox checked={true} disabled />
    </div>
  ),
  args: {
    checked: false,
    label: 'Checkbox',
  },
}
