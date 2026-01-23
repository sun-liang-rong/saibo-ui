import type { Meta, StoryObj } from '@storybook/react'
import { Alert, Button } from '../src/components'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Alert title',
    },
    message: {
      control: 'text',
      description: 'Alert message',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Alert variant',
    },
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'SYSTEM ALERT',
    message: 'A critical system update is available for installation.',
    variant: 'primary',
    icon: 'warning',
  },
}

export const Primary: Story = {
  args: {
    title: 'SYSTEM NOTIFICATION',
    message: 'Important information regarding your system configuration.',
    variant: 'primary',
    icon: 'info',
  },
}

export const Secondary: Story = {
  args: {
    title: 'WARNING',
    message: 'This action may result in unexpected system behavior.',
    variant: 'secondary',
    icon: 'warning',
  },
}

export const WithActions: Story = {
  args: {
    title: 'UPDATE AVAILABLE',
    message: 'A new version of the system firmware is ready to install.',
    variant: 'primary',
    icon: 'system_update',
    actions: (
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          Later
        </Button>
        <Button size="sm" variant="primary">
          Install Now
        </Button>
      </div>
    ),
  },
}

export const SystemAlert: Story = {
  args: {
    title: 'CRITICAL ALERT',
    message: 'System resources are critically low. Immediate action required.',
    variant: 'secondary',
    icon: 'error',
  },
}

export const InfoAlert: Story = {
  args: {
    title: 'INFORMATION',
    message: 'The system is operating within normal parameters.',
    variant: 'primary',
    icon: 'info',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert
        title="PRIMARY ALERT"
        message="Primary variant alert message with icon."
        variant="primary"
        icon="info"
      />
      <Alert
        title="SECONDARY ALERT"
        message="Secondary variant alert message with icon."
        variant="secondary"
        icon="warning"
      />
    </div>
  ),
  args: {
    title: 'Alert',
    message: 'Alert message',
    variant: 'primary',
    icon: 'info',
  },
}

export const WithDifferentIcons: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert
        title="SUCCESS"
        message="Operation completed successfully."
        variant="primary"
        icon="check_circle"
      />
      <Alert
        title="ERROR"
        message="An error occurred during execution."
        variant="secondary"
        icon="error"
      />
      <Alert
        title="WARNING"
        message="This operation is potentially dangerous."
        variant="secondary"
        icon="warning"
      />
    </div>
  ),
  args: {
    title: 'Alert',
    message: 'Alert message',
    variant: 'primary',
    icon: 'info',
  },
}

export const ComplexAlert: Story = {
  args: {
    title: 'FIRMWARE UPDATE',
    message: 'Version 2.4.1 includes security patches and performance improvements.',
    variant: 'primary',
    icon: 'system_update',
    actions: (
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          View Details
        </Button>
        <Button size="sm" variant="primary">
          Update Now
        </Button>
      </div>
    ),
  },
}
