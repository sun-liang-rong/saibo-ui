import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination } from '../src/components'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'Current active page',
    },
    totalPages: {
      control: 'number',
      description: 'Total number of pages',
    },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-white text-xs">Current page: {page}</p>
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
      </div>
    )
  },
}

export const Page1: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div className="flex flex-col items-center gap-4">
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
      </div>
    )
  },
}

export const Page3: Story = {
  render: () => {
    const [page, setPage] = useState(3)
    return (
      <div className="flex flex-col items-center gap-4">
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
      </div>
    )
  },
}

export const FivePages: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div className="flex flex-col items-center gap-4">
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
      </div>
    )
  },
}

export const TenPages: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div className="flex flex-col items-center gap-4">
        <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
      </div>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(3)
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-white text-xs font-mono">System Report /// Page {page} of 8</div>
        <Pagination currentPage={page} totalPages={8} onPageChange={setPage} />
      </div>
    )
  },
}
