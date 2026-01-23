import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '../src/components'

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'required', 'meta'],
      description: 'Label variant',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'standard',
    children: 'Username',
  },
}

export const Standard: Story = {
  args: {
    variant: 'standard',
    children: 'Username',
  },
}

export const Required: Story = {
  args: {
    variant: 'required',
    children: 'Password',
  },
}

export const Meta: Story = {
  args: {
    variant: 'meta',
    children: 'META INFORMATION',
  },
}

export const Error: Story = {
  args: {
    variant: 'standard',
    error: true,
    children: 'Email Address',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div>
        <Label variant="standard">Standard Label</Label>
        <input className="w-full bg-surface-border text-white px-3 py-2 mt-1" />
      </div>
      <div>
        <Label variant="required">Required Field</Label>
        <input className="w-full bg-surface-border text-white px-3 py-2 mt-1" />
      </div>
      <div>
        <Label variant="meta">Meta Information</Label>
        <input className="w-full bg-surface-border text-white px-3 py-2 mt-1" />
      </div>
      <div>
        <Label variant="standard" error>
          Email Address
        </Label>
        <input className="w-full bg-surface-border text-white px-3 py-2 mt-1" />
      </div>
    </div>
  ),
  args: {
    variant: 'standard',
    children: 'Label',
  },
}

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-96">
      <div>
        <Label variant="required">Full Name</Label>
        <input
          className="w-full bg-surface-border text-white px-4 py-3 mt-1 font-mono"
          placeholder="Enter name..."
        />
      </div>
      <div>
        <Label variant="required">Email</Label>
        <input
          className="w-full bg-surface-border text-white px-4 py-3 mt-1 font-mono"
          placeholder="Enter email..."
        />
      </div>
      <div>
        <Label variant="standard">Bio</Label>
        <textarea
          className="w-full bg-surface-border text-white px-4 py-3 mt-1 font-mono"
          rows={3}
          placeholder="Enter bio..."
        />
      </div>
    </form>
  ),
  args: {
    variant: 'standard',
    children: 'Label',
  },
}
