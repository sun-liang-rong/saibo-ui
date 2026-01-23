import type { Meta, StoryObj } from '@storybook/react'
import { Switch, Checkbox, Radio, Badge, Progress, Card, Button } from '../src/components'

const meta = {
  title: 'Cyberpunk Dashboard',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Dashboard: Story = {
  render: () => (
    <div className="bg-background-dark min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card glow>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">
                CPU LOAD
              </span>
              <span className="material-symbols-outlined text-primary/50">memory</span>
            </div>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">84%</span>
              <span className="text-sm font-medium text-primary">+12%</span>
            </div>
            <Progress value={84} color="primary" />
          </Card>
        </div>

        {/* Form Controls */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card variant="cyber">
            <div className="mb-6 border-b border-surface-border pb-4">
              <h3 className="font-display text-xl font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">toggle_on</span>
                State Controls
              </h3>
            </div>
            <div className="space-y-4">
              <Switch label="Main Power" color="primary" defaultChecked />
              <Switch label="Stealth Mode" color="secondary" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
}
