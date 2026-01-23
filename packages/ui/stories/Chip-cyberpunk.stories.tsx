import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Chip } from '../src/components'

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'deletable'],
      description: 'Chip variant',
    },
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'React',
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'default',
    icon: 'code',
    children: 'TypeScript',
  },
}

export const Deletable: Story = {
  args: {
    variant: 'deletable',
    children: 'Tag to delete',
  },
}

export const DeletableWithIcon: Story = {
  args: {
    variant: 'deletable',
    icon: 'label',
    children: 'Category',
  },
}

export const ChipGroup: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap items-center">
      <Chip variant="default" icon="bolt">
        React
      </Chip>
      <Chip variant="default" icon="code">
        TypeScript
      </Chip>
      <Chip variant="default" icon="layers">
        Tailwind
      </Chip>
      <Chip variant="default" icon="book">
        Vite
      </Chip>
    </div>
  ),
  args: {
    variant: 'default',
    children: 'Chip',
  },
}

export const Interactive: Story = {
  render: () => {
    const [chips, setChips] = useState([
      { id: 1, label: 'React', icon: 'bolt' },
      { id: 2, label: 'TypeScript', icon: 'code' },
      { id: 3, label: 'Tailwind', icon: 'layers' },
      { id: 4, label: 'Vite', icon: 'book' },
    ])

    const handleDelete = (id: number) => {
      setChips(prev => prev.filter(chip => chip.id !== id))
    }

    return (
      <div>
        <div className="flex gap-2 flex-wrap items-center mb-4">
          {chips.map(chip => (
            <Chip
              key={chip.id}
              variant="deletable"
              icon={chip.icon}
              onDelete={() => handleDelete(chip.id)}
            >
              {chip.label}
            </Chip>
          ))}
        </div>
        <p className="text-xs font-mono text-slate-400">
          Click X to remove chips. Remaining: {chips.length}
        </p>
      </div>
    )
  },
  args: {
    variant: 'default',
    children: 'Chip',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Chip variant="default">Default Chip</Chip>
      <Chip variant="deletable">Deletable Chip</Chip>
    </div>
  ),
  args: {
    variant: 'default',
    children: 'Chip',
  },
}

export const TechStack: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap items-center">
      <Chip variant="deletable" icon="javascript">
        JavaScript
      </Chip>
      <Chip variant="deletable" icon="react">
        React
      </Chip>
      <Chip variant="deletable" icon="language">
        TypeScript
      </Chip>
      <Chip variant="deletable" icon="css">
        CSS
      </Chip>
      <Chip variant="deletable" icon="html">
        HTML
      </Chip>
    </div>
  ),
  args: {
    variant: 'deletable',
    children: 'Chip',
  },
}
