import type { Meta, StoryObj } from '@storybook/react'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../src/components'

const meta = {
  title: 'Components/Table',
  component: Table,
  subcomponents: { TableHeader, TableBody, TableRow, TableCell, TableHead },
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Simple: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>3</TableCell>
          <TableCell>Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Complex: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell className="text-primary">Active</TableCell>
          <TableCell>Administrator</TableCell>
          <TableCell>2024-01-15</TableCell>
          <TableCell>Edit Delete</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell className="text-primary">Active</TableCell>
          <TableCell>Editor</TableCell>
          <TableCell>2024-01-14</TableCell>
          <TableCell>Edit Delete</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Johnson</TableCell>
          <TableCell className="text-slate-500">Inactive</TableCell>
          <TableCell>Viewer</TableCell>
          <TableCell>2024-01-10</TableCell>
          <TableCell>Edit Delete</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Wide: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Engineering</TableCell>
          <TableCell className="text-primary">Active</TableCell>
          <TableCell>2024-01-01</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>Design</TableCell>
          <TableCell className="text-primary">Active</TableCell>
          <TableCell>2024-01-02</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const SystemData: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Node ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>CPU Usage</TableHead>
          <TableHead>Memory</TableHead>
          <TableHead>Network</TableHead>
          <TableHead>Last Update</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>NODE-001</TableCell>
          <TableCell className="text-primary">Online</TableCell>
          <TableCell>45%</TableCell>
          <TableCell>2.4 GB</TableCell>
          <TableCell>1.2 GB/s</TableCell>
          <TableCell>2s ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>NODE-002</TableCell>
          <TableCell className="text-primary">Online</TableCell>
          <TableCell>62%</TableCell>
          <TableCell>3.1 GB</TableCell>
          <TableCell>2.8 GB/s</TableCell>
          <TableCell>1s ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>NODE-003</TableCell>
          <TableCell className="text-secondary">Error</TableCell>
          <TableCell>N/A</TableCell>
          <TableCell>N/A</TableCell>
          <TableCell>N/A</TableCell>
          <TableCell>5s ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
