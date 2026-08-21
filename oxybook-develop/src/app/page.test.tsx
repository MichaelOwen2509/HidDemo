import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Home from './page'

// next/image renders as a standard <img> in test environments
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('Home page', () => {
  it('renders the heading', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /to get started/i }),
    ).toBeInTheDocument()
  })

  it('renders the Next.js logo image', () => {
    render(<Home />)
    expect(screen.getByAltText('Next.js logo')).toBeInTheDocument()
  })

  it('renders the Deploy Now link', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: /deploy now/i })).toBeInTheDocument()
  })

  it('renders the Documentation link', () => {
    render(<Home />)
    expect(
      screen.getByRole('link', { name: /documentation/i }),
    ).toBeInTheDocument()
  })

  it('renders the Templates link', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: /templates/i })).toBeInTheDocument()
  })

  it('Deploy Now link opens in a new tab', () => {
    render(<Home />)
    const link = screen.getByRole('link', { name: /deploy now/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
