import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn (clsx + tailwind-merge)', () => {
  it('returns a single class unchanged', () => {
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  it('merges multiple classes', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold')
  })

  it('resolves tailwind conflicts – last value wins', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    expect(cn('p-4', 'p-8')).toBe('p-8')
    expect(cn('mx-2', 'mx-4')).toBe('mx-4')
  })

  it('ignores falsy values', () => {
    expect(cn('text-sm', false, undefined, null, '')).toBe('text-sm')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe(
      'base active',
    )
  })

  it('handles object syntax from clsx', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe(
      'text-red-500',
    )
  })

  it('handles array syntax from clsx', () => {
    expect(cn(['text-sm', 'font-medium'])).toBe('text-sm font-medium')
  })

  it('returns empty string when no valid classes', () => {
    expect(cn(false, undefined, null)).toBe('')
  })

  it('merges padding shorthand and side-specific correctly', () => {
    // tailwind-merge: px-4 overrides the horizontal padding from p-4
    expect(cn('p-4', 'px-6')).toBe('p-4 px-6')
  })
})
