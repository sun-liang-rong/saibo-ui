import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Toast } from '../src/components'

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'Toast variant',
    },
    title: {
      control: 'text',
      description: 'Toast title',
    },
    message: {
      control: 'text',
      description: 'Toast message',
    },
    autoClose: {
      control: 'boolean',
      description: 'Auto close after duration',
    },
    duration: {
      control: 'number',
      description: 'Auto close duration in ms',
    },
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'info',
    message: 'System notification received.',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'SUCCESS',
    message: 'Operation completed successfully.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'ERROR',
    message: 'Failed to complete operation.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'WARNING',
    message: 'Action may have unexpected results.',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'INFO',
    message: 'New system update available.',
  },
}

export const WithTitle: Story = {
  args: {
    variant: 'success',
    title: 'CONNECTION_EST',
    message: 'Successfully linked to Node 44.',
  },
}

export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    message: 'Simple notification message.',
  },
}

export const AutoClose: Story = {
  args: {
    variant: 'success',
    title: 'AUTO-CLOSING',
    message: 'This toast will close in 3 seconds.',
    autoClose: true,
    duration: 3000,
  },
}

export const WithCustomDuration: Story = {
  args: {
    variant: 'info',
    title: 'CUSTOM DURATION',
    message: 'This toast will close in 5 seconds.',
    autoClose: true,
    duration: 5000,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toast variant="success" title="SUCCESS" message="Success message" />
      <Toast variant="error" title="ERROR" message="Error message" />
      <Toast variant="warning" title="WARNING" message="Warning message" />
      <Toast variant="info" title="INFO" message="Info message" />
    </div>
  ),
  args: {
    variant: 'info',
    message: 'Toast message',
  },
}

export const WithCloseButton: Story = {
  render: () => {
    const [visible, setVisible] = useState(true)

    return (
      <div>
        {visible && (
          <Toast
            variant="info"
            title="CLOSABLE"
            message="Click X to close this toast."
            onClose={() => setVisible(false)}
          />
        )}
        {!visible && (
          <button onClick={() => setVisible(true)} className="text-primary text-xs">
            Show toast again
          </button>
        )}
      </div>
    )
  },
  args: {
    variant: 'info',
    message: 'Toast message',
  },
}

export const ConnectionToast: Story = {
  args: {
    variant: 'success',
    title: 'CONNECTION_EST',
    message: 'Successfully linked to Node 44.',
  },
}

export const ErrorToast: Story = {
  args: {
    variant: 'error',
    title: 'CONNECTION_ERR',
    message: 'Failed to establish connection with Node 42.',
  },
}
