import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '../src/components'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'text',
      description: 'Error message',
    },
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
    },
    showCharCount: {
      control: 'boolean',
      description: 'Show character count',
    },
    rows: {
      control: 'number',
      description: 'Number of rows',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Textarea takes full width',
    },
    required: {
      control: 'boolean',
      description: 'Show required asterisk',
    },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
    rows: 4,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Share your thoughts...',
    helperText: 'Your feedback helps us improve.',
  },
}

export const ErrorState: Story = {
  args: {
    label: 'Comment',
    placeholder: 'Enter comment...',
    error: 'Comment must be at least 10 characters',
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Add your notes...',
    icon: 'edit_note',
  },
}

export const CharacterCount: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    maxLength: 200,
    showCharCount: true,
  },
}

export const CharacterCountWithLimit: Story = {
  args: {
    label: 'Short Description',
    placeholder: 'Enter a short description...',
    maxLength: 100,
    showCharCount: true,
    value: 'This is a sample text that demonstrates the character counter feature.',
  },
}

export const Required: Story = {
  args: {
    label: 'Terms and Conditions',
    placeholder: 'Enter terms...',
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Read-only Text',
    value: 'This text cannot be edited.',
    disabled: true,
  },
}

export const CustomRows: Story = {
  render: () => (
    <div className="flex gap-4 flex-col">
      <Textarea label="2 Rows" rows={2} placeholder="Small textarea..." />
      <Textarea label="4 Rows" rows={4} placeholder="Medium textarea..." />
      <Textarea label="8 Rows" rows={8} placeholder="Large textarea..." />
    </div>
  ),
}

export const FullWidth: Story = {
  args: {
    label: 'Full Width Textarea',
    placeholder: 'This textarea takes full width',
    fullWidth: true,
    rows: 6,
  },
  parameters: {
    layout: 'padded',
  },
}

export const CompleteForm: Story = {
  args: {
    label: 'Project Description',
    placeholder: 'Describe your project in detail...',
    helperText: 'Minimum 50 characters',
    maxLength: 500,
    showCharCount: true,
    required: true,
    rows: 8,
  },
}
