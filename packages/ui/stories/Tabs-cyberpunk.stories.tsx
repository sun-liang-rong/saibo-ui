import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../src/components'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { TabsList, TabsTrigger, TabsContent },
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">Overview Tab</h3>
          <p>System overview and statistics display here.</p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">Settings Tab</h3>
          <p>System configuration and preferences.</p>
        </div>
      </TabsContent>
      <TabsContent value="advanced">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">Advanced Tab</h3>
          <p>Advanced system options and diagnostics.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('overview')
    return (
      <div>
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="p-4 text-white">
              <h3 className="text-lg font-bold mb-2">Overview Tab</h3>
              <p>Selected: {value}</p>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="p-4 text-white">
              <h3 className="text-lg font-bold mb-2">Settings Tab</h3>
              <p>Selected: {value}</p>
            </div>
          </TabsContent>
          <TabsContent value="advanced">
            <div className="p-4 text-white">
              <h3 className="text-lg font-bold mb-2">Advanced Tab</h3>
              <p>Selected: {value}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  },
}

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4 text-white">Content for Tab 1</div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4 text-white">Content for Tab 2</div>
      </TabsContent>
    </Tabs>
  ),
}

export const FourTabs: Story = {
  render: () => (
    <Tabs defaultValue="dashboard">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">Dashboard</h3>
          <p>System dashboard and real-time monitoring.</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">Analytics</h3>
          <p>Data analysis and performance metrics.</p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">Reports</h3>
          <p>Generated reports and documentation.</p>
        </div>
      </TabsContent>
      <TabsContent value="logs">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">Logs</h3>
          <p>System logs and event history.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const WithForms: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-primary mb-2 block">Username</label>
            <input
              className="w-full bg-surface-border text-white px-4 py-2 font-mono"
              defaultValue="johndoe"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-primary mb-2 block">Email</label>
            <input
              className="w-full bg-surface-border text-white px-4 py-2 font-mono"
              defaultValue="john@example.com"
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-primary mb-2 block">
              Current Password
            </label>
            <input
              type="password"
              className="w-full bg-surface-border text-white px-4 py-2 font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-primary mb-2 block">
              New Password
            </label>
            <input
              type="password"
              className="w-full bg-surface-border text-white px-4 py-2 font-mono"
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="p-4">
          <p className="text-white">Notification preferences here...</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const SystemTabs: Story = {
  render: () => (
    <Tabs defaultValue="monitor">
      <TabsList>
        <TabsTrigger value="monitor">Monitor</TabsTrigger>
        <TabsTrigger value="configure">Configure</TabsTrigger>
        <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
      </TabsList>
      <TabsContent value="monitor">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">/// SYSTEM MONITOR</h3>
          <p className="text-slate-400 mb-4">Real-time system performance monitoring</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>CPU Usage:</span>
              <span className="text-primary">45%</span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className="text-primary">62%</span>
            </div>
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="text-primary">Active</span>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="configure">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">/// CONFIGURE</h3>
          <p className="text-slate-400">System configuration and parameters</p>
        </div>
      </TabsContent>
      <TabsContent value="diagnostics">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2">/// DIAGNOSTICS</h3>
          <p className="text-slate-400">System diagnostics and troubleshooting</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}
