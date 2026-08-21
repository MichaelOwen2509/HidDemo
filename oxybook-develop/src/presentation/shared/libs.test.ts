import { describe, expect, it } from 'vitest'

// ─── zod ────────────────────────────────────────────────────────────────────

import { z } from 'zod'

describe('zod – schema validation', () => {
  const userSchema = z.object({
    name: z.string().min(2, 'Name must have at least 2 characters'),
    email: z.string().email('Invalid email'),
    age: z.number().int().positive().optional(),
  })

  it('accepts valid data', () => {
    const result = userSchema.safeParse({ name: 'Emanuel', email: 'em@test.com' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = userSchema.safeParse({ name: 'Emanuel', email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email')
    }
  })

  it('rejects name shorter than 2 characters', () => {
    const result = userSchema.safeParse({ name: 'E', email: 'em@test.com' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Name must have at least 2 characters',
      )
    }
  })

  it('optional field can be omitted', () => {
    const result = userSchema.safeParse({ name: 'Emanuel', email: 'em@test.com' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.age).toBeUndefined()
  })

  it('parses and infers types correctly', () => {
    type User = z.infer<typeof userSchema>
    const user: User = { name: 'Emanuel', email: 'em@test.com', age: 25 }
    const parsed = userSchema.parse(user)
    expect(parsed.name).toBe('Emanuel')
    expect(parsed.age).toBe(25)
  })

  it('supports enum schemas', () => {
    const roleSchema = z.enum(['admin', 'user', 'guest'])
    expect(roleSchema.safeParse('admin').success).toBe(true)
    expect(roleSchema.safeParse('superuser').success).toBe(false)
  })

  it('supports default values', () => {
    const schema = z.object({ role: z.string().default('user') })
    const result = schema.parse({})
    expect(result.role).toBe('user')
  })

  it('supports array schemas', () => {
    const schema = z.array(z.string()).min(1)
    expect(schema.safeParse([]).success).toBe(false)
    expect(schema.safeParse(['a', 'b']).success).toBe(true)
  })
})

// ─── date-fns ───────────────────────────────────────────────────────────────

import {
  addDays,
  differenceInDays,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  endOfMonth,
} from 'date-fns'

describe('date-fns – date utilities', () => {
  const baseDate = new Date(2024, 0, 15) // Jan 15 2024

  it('formats a date', () => {
    expect(format(baseDate, 'dd/MM/yyyy')).toBe('15/01/2024')
    expect(format(baseDate, 'yyyy-MM-dd')).toBe('2024-01-15')
  })

  it('adds days to a date', () => {
    const result = addDays(baseDate, 10)
    expect(format(result, 'dd/MM/yyyy')).toBe('25/01/2024')
  })

  it('calculates difference in days', () => {
    const laterDate = new Date(2024, 0, 25)
    expect(differenceInDays(laterDate, baseDate)).toBe(10)
  })

  it('compares dates correctly', () => {
    const earlier = new Date(2024, 0, 10)
    const later = new Date(2024, 0, 20)
    expect(isBefore(earlier, baseDate)).toBe(true)
    expect(isAfter(later, baseDate)).toBe(true)
  })

  it('parses ISO date strings', () => {
    const parsed = parseISO('2024-01-15')
    expect(format(parsed, 'dd/MM/yyyy')).toBe('15/01/2024')
  })

  it('gets start and end of month', () => {
    expect(format(startOfMonth(baseDate), 'dd/MM/yyyy')).toBe('01/01/2024')
    expect(format(endOfMonth(baseDate), 'dd/MM/yyyy')).toBe('31/01/2024')
  })
})

// ─── clsx (standalone) ──────────────────────────────────────────────────────

import { clsx } from 'clsx'

describe('clsx – class name utility', () => {
  it('joins strings', () => {
    expect(clsx('foo', 'bar')).toBe('foo bar')
  })

  it('filters falsy values', () => {
    expect(clsx('foo', false, undefined, null, 0, '')).toBe('foo')
  })

  it('handles object syntax', () => {
    expect(clsx({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('handles array syntax', () => {
    expect(clsx(['foo', 'bar'])).toBe('foo bar')
  })
})

// ─── tailwind-merge (standalone) ────────────────────────────────────────────

import { twMerge } from 'tailwind-merge'

describe('tailwind-merge – conflict resolution', () => {
  it('merges classes without conflicts', () => {
    expect(twMerge('text-sm font-bold')).toBe('text-sm font-bold')
  })

  it('resolves text color conflicts', () => {
    expect(twMerge('text-red-500 text-green-500')).toBe('text-green-500')
  })

  it('resolves padding conflicts', () => {
    expect(twMerge('p-4 p-8')).toBe('p-8')
  })

  it('resolves margin conflicts', () => {
    expect(twMerge('mt-4 mt-8')).toBe('mt-8')
  })

  it('keeps non-conflicting utilities', () => {
    expect(twMerge('flex items-center text-sm text-lg')).toBe(
      'flex items-center text-lg',
    )
  })
})
