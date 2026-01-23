import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../components/Modal'

describe('Modal', () => {
  it('does not render when open is false', () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when open is true', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when overlay is clicked', () => {
    const handleClose = vi.fn()
    const { container } = render(
      <Modal open={true} onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    )
    const overlay = container.firstChild as HTMLElement
    fireEvent.click(overlay)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal open={true} onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    )
    fireEvent.click(screen.getByText('Modal content'))
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(
      <Modal open={true} onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose on Escape when closeOnEscape is false', () => {
    const handleClose = vi.fn()
    render(
      <Modal open={true} onClose={handleClose} closeOnEscape={false}>
        <p>Modal content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('renders title when provided', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <Modal open={true} onClose={vi.fn()} footer={<button>Footer</button>}>
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
