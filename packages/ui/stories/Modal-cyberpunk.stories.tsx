import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button, Modal } from '../src/components'

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Modal visibility',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Modal size',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Close when clicking overlay',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close when pressing Escape',
    },
    showScanlines: {
      control: 'boolean',
      description: 'Show scanline effect',
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    title: 'System Notification',
    size: 'md',
    closeOnOverlayClick: true,
    closeOnEscape: true,
    showScanlines: true,
    children: <p>Critical patch V.2.0.78 is available for installation.</p>,
  },
}

export const WithFooter: Story = {
  args: {
    open: true,
    title: 'Confirm Action',
    size: 'md',
    children: (
      <p className="text-slate-300">
        Are you sure you want to proceed with this action? This cannot be undone.
      </p>
    ),
    footer: (
      <>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="secondary" size="sm">
          Confirm
        </Button>
      </>
    ),
  },
}

export const Small: Story = {
  args: {
    open: true,
    title: 'Quick Alert',
    size: 'sm',
    children: <p>This is a small modal dialog.</p>,
  },
}

export const Large: Story = {
  args: {
    open: true,
    title: 'Detailed Information',
    size: 'lg',
    children: (
      <div className="space-y-4">
        <p>This is a larger modal with more content.</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li>Feature item one</li>
          <li>Feature item two</li>
          <li>Feature item three</li>
        </ul>
      </div>
    ),
  },
}

export const ExtraLarge: Story = {
  args: {
    open: true,
    title: 'Full Documentation',
    size: 'xl',
    children: (
      <div className="space-y-4">
        <p>This is an extra large modal for extensive content.</p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
      </div>
    ),
  },
}

export const FullWidth: Story = {
  args: {
    open: true,
    title: 'Full Screen Modal',
    size: 'full',
    children: (
      <div className="space-y-4">
        <p>This modal takes up the full available screen space.</p>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
      </div>
    ),
  },
}

export const WithoutScanlines: Story = {
  args: {
    open: true,
    title: 'Clean Modal',
    size: 'md',
    showScanlines: false,
    children: <p>This modal has no scanline effect.</p>,
  },
}

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Interactive Modal"
          size="md"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)} size="sm">
                Close
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)} size="sm">
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-slate-300">
            Click the buttons below to interact with the modal. You can also press Escape or click
            the overlay to close it.
          </p>
        </Modal>
      </div>
    )
  },
  args: {
    open: false,
    title: 'Interactive Modal',
    size: 'md',
    closeOnOverlayClick: true,
    closeOnEscape: true,
    showScanlines: true,
    children: (
      <p className="text-slate-300">
        Click the buttons below to interact with the modal. You can also press Escape or click the
        overlay to close it.
      </p>
    ),
  },
}

export const WithForm: Story = {
  args: {
    open: true,
    title: 'System Configuration',
    size: 'lg',
    children: (
      <form className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-primary mb-2">
            System Name
          </label>
          <input
            type="text"
            className="w-full bg-panel-dark/60 border-2 border-surface-border text-white px-4 py-3 font-mono placeholder:text-slate-600 rounded-none focus:border-accent-magenta"
            placeholder="Enter system name..."
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-primary mb-2">
            Description
          </label>
          <textarea
            className="w-full bg-panel-dark/60 border-2 border-surface-border text-white px-4 py-3 font-mono placeholder:text-slate-600 rounded-none focus:border-accent-magenta resize-none"
            rows={3}
            placeholder="Enter description..."
          />
        </div>
      </form>
    ),
    footer: (
      <>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Save Changes
        </Button>
      </>
    ),
  },
}
