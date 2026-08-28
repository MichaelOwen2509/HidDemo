# Tela de Empréstimo Confirmado — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a página `/emprestimo-confirmado` e conectar o botão "Finalizar" em `RulesAndPolices` para redirecionar a ela.

**Architecture:** Thin page em `app/emprestimo-confirmado/page.tsx` que renderiza `LoanConfirmed`, um novo componente no módulo `loans`. O botão "Finalizar" em `RulesAndPolices` recebe `useRouter` para executar o redirecionamento — o componente precisa se tornar Client Component.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Tailwind CSS v4, lucide-react, Vitest + @testing-library/react

---

## File Map

| Ação | Arquivo |
|---|---|
| CREATE | `src/presentation/modules/loans/components/loan-confirmed/LoanConfirmed.tsx` |
| CREATE | `src/presentation/modules/loans/components/loan-confirmed/LoanConfirmed.test.tsx` |
| CREATE | `src/app/emprestimo-confirmado/page.tsx` |
| MODIFY | `src/presentation/modules/books/components/rules-and-policies/rules-and-polices.tsx` |
| CREATE | `src/presentation/modules/books/components/rules-and-policies/rules-and-polices.test.tsx` |

> **Nota sobre testes:** O `vitest.config.mts` inclui apenas `**/*.test.{ts,tsx}`. Usar extensão `.test.tsx` — não `.spec.tsx`.

---

## Task 1: Criar o componente `LoanConfirmed`

**Files:**
- Create: `src/presentation/modules/loans/components/loan-confirmed/LoanConfirmed.test.tsx`
- Create: `src/presentation/modules/loans/components/loan-confirmed/LoanConfirmed.tsx`

- [ ] **Step 1: Escrever o teste falho**

Crie `src/presentation/modules/loans/components/loan-confirmed/LoanConfirmed.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { LoanConfirmed } from './LoanConfirmed'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('@/presentation/shared/components/header/header', () => ({
  default: () => null,
}))

vi.mock('@/presentation/shared/components/layout/footer/footer', () => ({
  Footer: () => null,
}))

describe('LoanConfirmed', () => {
  it('renderiza a mensagem de sucesso', () => {
    render(<LoanConfirmed />)
    expect(screen.getByText('Empréstimo realizado!')).toBeInTheDocument()
    expect(
      screen.getByText('Seus livros foram reservados com sucesso.')
    ).toBeInTheDocument()
  })

  it('navega para / ao clicar em "Voltar ao início"', () => {
    render(<LoanConfirmed />)
    fireEvent.click(screen.getByRole('button', { name: 'Voltar ao início' }))
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

```bash
pnpm test --run -- LoanConfirmed
```

Esperado: FAIL — `Cannot find module './LoanConfirmed'`

- [ ] **Step 3: Implementar `LoanConfirmed`**

Crie `src/presentation/modules/loans/components/loan-confirmed/LoanConfirmed.tsx`:

```tsx
"use client"

import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Header from "@/presentation/shared/components/header/header"
import { Footer } from "@/presentation/shared/components/layout/footer/footer"

export function LoanConfirmed() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 flex flex-col items-center justify-center gap-6">
        <CheckCircle size={64} className="text-[#4E0000]" />

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl text-[#4E0000CC]">Empréstimo realizado!</h1>
          <p className="text-lg text-[#67463599]">
            Seus livros foram reservados com sucesso.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-xl bg-[#4E0000] text-white font-semibold py-4 px-8 text-base hover:bg-[#3a0000] transition-colors"
        >
          Voltar ao início
        </button>
      </main>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

```bash
pnpm test --run -- LoanConfirmed
```

Esperado: PASS — 2 testes passando

- [ ] **Step 5: Commit**

```bash
git add src/presentation/modules/loans/components/loan-confirmed/
git commit -m "feat: cria componente LoanConfirmed com teste"
```

---

## Task 2: Criar a página `/emprestimo-confirmado`

**Files:**
- Create: `src/app/emprestimo-confirmado/page.tsx`

- [ ] **Step 1: Criar o arquivo da página**

Crie `src/app/emprestimo-confirmado/page.tsx`:

```tsx
import { LoanConfirmed } from "@/presentation/modules/loans/components/loan-confirmed/LoanConfirmed"

export default function EmprestimoConfirmadoPage() {
  return <LoanConfirmed />
}
```

- [ ] **Step 2: Verificar a rota no navegador**

```bash
pnpm dev
```

Acesse `http://localhost:3000/emprestimo-confirmado` e confirme que a página exibe o ícone de check, o título "Empréstimo realizado!" e o botão "Voltar ao início".

- [ ] **Step 3: Commit**

```bash
git add src/app/emprestimo-confirmado/page.tsx
git commit -m "feat: adiciona rota /emprestimo-confirmado"
```

---

## Task 3: Conectar o botão "Finalizar" em `RulesAndPolices`

**Files:**
- Create: `src/presentation/modules/books/components/rules-and-policies/rules-and-polices.test.tsx`
- Modify: `src/presentation/modules/books/components/rules-and-policies/rules-and-polices.tsx`

- [ ] **Step 1: Escrever o teste falho**

Crie `src/presentation/modules/books/components/rules-and-policies/rules-and-polices.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { RulesAndPolices } from './rules-and-polices'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('RulesAndPolices', () => {
  it('navega para /emprestimo-confirmado ao clicar em "Finalizar"', () => {
    render(<RulesAndPolices />)
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar' }))
    expect(mockPush).toHaveBeenCalledWith('/emprestimo-confirmado')
  })
})
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

```bash
pnpm test --run -- rules-and-polices
```

Esperado: FAIL — o botão não chama `router.push` (componente ainda não é Client Component)

- [ ] **Step 3: Modificar `RulesAndPolices`**

Substitua o conteúdo de `src/presentation/modules/books/components/rules-and-policies/rules-and-polices.tsx`:

```tsx
"use client"

import { Ban, Clock, DollarSign, Lock, TriangleAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { RuleItem } from "./rule-item"

export function RulesAndPolices() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="rounded-xl border border-[#E8D5C4] bg-white p-5 flex flex-col gap-5">
        <span className="flex items-center justify-center w-10 h-10 rounded-b-lg bg-[#4E0000] text-white absolute top-0">
          <Lock size={18} />
        </span>

        <h2 className="text-lg font-semibold text-[#4E0000] mt-8">
          Regras e Políticas da Biblioteca
        </h2>

        <ul className="flex flex-col gap-4">
          <RuleItem
            icon={<DollarSign size={18} />}
            title="Multa por atraso"
            description="R$ 2,00 por dia de atraso em cada livro"
          />
          <RuleItem
            icon={<Clock size={18} />}
            title="Prazo máximo"
            description="O empréstimo pode ser renovado por mais 7 dias, se não houver reserva"
          />
          <RuleItem
            icon={<Ban size={18} />}
            title="Bloqueio de conta"
            description="Atrasos recorrentes podem resultar em bloqueio temporário"
          />
        </ul>

        <p className="text-sm text-[#4E0000]/60">
          <span className="font-semibold text-[#4E0000]">Dica OxyBooks:</span>{" "}
          Devolva no prazo e ajude a manter nosso acervo disponível para todos!
        </p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 shrink-0 accent-[#4E0000]"
        />
        <span className="text-sm text-[#4E0000CC]">
          Li e concordo com as regras de empréstimo e políticas do{" "}
          <span className="font-semibold text-[#4E0000]">OxyBooks</span>
        </span>
      </label>

      <div className="flex items-center gap-3 rounded-lg bg-[#F59E0B1F] p-4">
        <TriangleAlert size={33} className="text-[#F59E0B] shrink-0 mt-0.5" />
        <p className="text-sm text-[#F59E0B]">
          <span className="font-semibold">Aviso de responsabilidade:</span> Ao
          confirmar, você se compromete a cuidar dos livros e devolvê-los no
          prazo estabelecido.
        </p>
      </div>

      <button
        type="button"
        onClick={() => router.push("/emprestimo-confirmado")}
        className="w-full rounded-xl bg-[#4E0000] text-white font-semibold py-4 text-base hover:bg-[#3a0000] transition-colors"
      >
        Finalizar
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

```bash
pnpm test --run -- rules-and-polices
```

Esperado: PASS — 1 teste passando

- [ ] **Step 5: Verificar o fluxo completo no navegador**

Com `pnpm dev` rodando, acesse `http://localhost:3000/emprestimo-livro`, clique em "Finalizar" e confirme o redirecionamento para `/emprestimo-confirmado`.

- [ ] **Step 6: Commit**

```bash
git add src/presentation/modules/books/components/rules-and-policies/
git commit -m "feat: conecta botão Finalizar ao redirecionamento para emprestimo-confirmado"
```
