import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '../src/components'
import { Button } from '../src/components'

const meta = {
  title: 'Cyberpunk Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    glow: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">System Status</h3>
        <p className="text-slate-400">All systems functioning within normal parameters.</p>
        <div className="flex gap-2">
          <Button size="sm">Refresh</Button>
          <Button size="sm" variant="outlined">Details</Button>
        </div>
      </div>
    ),
  },
}

export const Cyber: Story = {
  args: {
    variant: 'graphic',
    size: 'lg',
    glow: true,
    children: (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-primary font-mono">&gt; ACCESS_LEVEL_5</h3>
          <span className="text-xs text-primary/50 animate-pulse">● LIVE</span>
        </div>
        <div className="h-px bg-primary/20 w-full" />
        <p className="text-slate-300 font-mono text-sm">
          Encrypted connection established. Secure channel ready for transmission.
        </p>
        <div className="bg-black/30 p-2 rounded border border-primary/20 font-mono text-xs text-primary">
          $ connect --secure --port=8080
        </div>
        <div className="flex justify-end">
           <Button size="sm" color="secondary" variant="graphic ">TERMINATE</Button>
        </div>
      </div>
    ),
  },
}

export const GlowEffect: Story = {
  args: {
    variant: 'default',
    glow: true,
    children: (
      <div className="space-y-2">
        <h4 className="font-bold text-white">Hover Me</h4>
        <p className="text-sm text-slate-400">This card has a glow effect on hover.</p>
      </div>
    ),
  },
}
