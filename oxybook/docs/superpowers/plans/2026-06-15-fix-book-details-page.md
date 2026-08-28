# Fix Book Details Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir cinco problemas de semântica, responsividade e robustez na página `src/app/livros/[id]/page.tsx`.

**Architecture:** Todos os fixes são cirúrgicos no arquivo da página — sem novas abstrações, sem novos arquivos. Os testes ficam co-localizados em `src/app/livros/[id]/page.test.tsx` e cobrem comportamento observável (render, href, markup semântico).

**Tech Stack:** Next.js 16 App Router, React, Tailwind CSS v4, Vitest + @testing-library/react

---

## Mapa de arquivos

| Arquivo | Ação |
|---|---|
| `src/app/livros/[id]/page.tsx` | Modificar — todos os 5 fixes |
| `src/app/livros/[id]/page.test.tsx` | Criar — testes por fix |

---

## Task 1: Semântica dos metadados bibliográficos

**Problema:** `InlineInfo` usa `InfoTitle` internamente, que renderiza `<h2>`. Campos como "Edição:", "ISBN:" aparecem como headings no DOM — incorreto semanticamente. Devem ser uma lista de definições (`<dl>/<dt>/<dd>`).

**Files:**
- Modify: `src/app/livros/[id]/page.tsx:148-174` e `207-214`
- Test: `src/app/livros/[id]/page.test.tsx`

- [ ] **Step 1: Criar o arquivo de teste e escrever o teste que falha**

```tsx
// src/app/livros/[id]/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock do next/image e next/link para não exigir contexto Next.js
vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NOT_FOUND"); },
}));

// Mock dos dados para controlar o book usado nos testes
vi.mock("@/data/books", () => ({
  books: [{ id: "1" }],
  getBookById: () => ({
    id: "1",
    title: "Título do Livro",
    author: "Autor Teste",
    description: "Descrição do livro.",
    coverUrl: "/cover.png",
    mainTitle: "Título completo do livro.",
    edition: "1. ed.",
    publisher: "Editora X",
    year: 2025,
    isbn: "9780000000001",
    subjects: "Computação",
    secondaryAuthors: ["Autor, Secundário"],
  }),
}));

import BookDetailsPage from "./page";

async function renderPage() {
  const Component = await BookDetailsPage({ params: Promise.resolve({ id: "1" }) });
  render(Component);
}

describe("BookDetailsPage — semântica dos metadados", () => {
  it("não deve renderizar h2 para labels inline (Edição, ISBN, etc.)", async () => {
    await renderPage();
    const headings = screen.queryAllByRole("heading", { level: 2 });
    // Apenas "Entradas Secundárias/Autor:" e "Título Principal:" devem ser h2
    expect(headings.length).toBeLessThanOrEqual(2);
  });

  it("deve renderizar os metadados em uma dl com dt e dd", async () => {
    await renderPage();
    const dl = document.querySelector("dl");
    expect(dl).not.toBeNull();
    const dts = dl?.querySelectorAll("dt");
    expect(dts?.length).toBeGreaterThanOrEqual(4); // Edição, Publicação, Assuntos, ISBN
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
pnpm test --run src/app/livros/\\[id\\]/page.test.tsx
```

Esperado: FAIL — os `h2` excedentes serão encontrados e não haverá `<dl>`.

- [ ] **Step 3: Refatorar `InlineInfo` e envolver os campos em `<dl>`**

Em `src/app/livros/[id]/page.tsx`, substituir a função `InlineInfo` (linhas 207-213):

```tsx
// ANTES
function InlineInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <InfoTitle>{label}</InfoTitle>
      <p className="text-base text-[#67463599]">{value}</p>
    </div>
  );
}
```

```tsx
// DEPOIS
function InlineInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <dt className="text-xl font-medium leading-[22px] text-[#4E0000CC]">{label}</dt>
      <dd className="text-base text-[#67463599]">{value}</dd>
    </div>
  );
}
```

Ainda em `page.tsx`, envolver os quatro campos `<InlineInfo>` em `<dl>` (linhas 161-173):

```tsx
// ANTES
<div className="flex flex-col gap-[30px]">
  <div className="flex flex-col gap-4">
    <InfoTitle>Título Principal:</InfoTitle>
    <p className="text-base leading-relaxed text-[#67463599]">
      {book.mainTitle}
    </p>
  </div>

  <InlineInfo label="Edição:" value={book.edition} />
  <InlineInfo label="Publicação:" value={publication} />
  <InlineInfo label="Assuntos:" value={book.subjects} />
  <InlineInfo label="ISBN:" value={book.isbn} />
</div>
```

```tsx
// DEPOIS
<div className="flex flex-col gap-[30px]">
  <div className="flex flex-col gap-4">
    <InfoTitle>Título Principal:</InfoTitle>
    <p className="text-base leading-relaxed text-[#67463599]">
      {book.mainTitle}
    </p>
  </div>

  <dl className="flex flex-col gap-[30px]">
    <InlineInfo label="Edição:" value={book.edition} />
    <InlineInfo label="Publicação:" value={publication} />
    <InlineInfo label="Assuntos:" value={book.subjects} />
    <InlineInfo label="ISBN:" value={book.isbn} />
  </dl>
</div>
```

- [ ] **Step 4: Rodar os testes para confirmar que passam**

```bash
pnpm test --run src/app/livros/\\[id\\]/page.test.tsx
```

Esperado: PASS nos dois testes de semântica.

- [ ] **Step 5: Commit**

```bash
git add src/app/livros/[id]/page.tsx src/app/livros/[id]/page.test.tsx
git commit -m "fix: corrigir semântica dos metadados bibliográficos com dl/dt/dd"
```

---

## Task 2: Link do CTA com ID do livro

**Problema:** O botão "Adicionar ao carrinho" aponta sempre para `/emprestimo-livro` sem incluir o ID do livro atual.

**Files:**
- Modify: `src/app/livros/[id]/page.tsx:131-135`
- Test: `src/app/livros/[id]/page.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

Adicionar ao `page.test.tsx`:

```tsx
describe("BookDetailsPage — link do CTA", () => {
  it("deve incluir o id do livro no href do botão de carrinho", async () => {
    await renderPage();
    const link = screen.getByRole("link", { name: /adicionar ao carrinho/i });
    expect(link).toHaveAttribute("href", "/emprestimo-livro/1");
  });
});
```

- [ ] **Step 2: Rodar para confirmar que falha**

```bash
pnpm test --run src/app/livros/\\[id\\]/page.test.tsx
```

Esperado: FAIL — href atual é `/emprestimo-livro` (sem o ID).

- [ ] **Step 3: Corrigir o href**

Em `src/app/livros/[id]/page.tsx`, linha 132:

```tsx
// ANTES
href="/emprestimo-livro"
```

```tsx
// DEPOIS
href={`/emprestimo-livro/${book.id}`}
```

- [ ] **Step 4: Rodar os testes**

```bash
pnpm test --run src/app/livros/\\[id\\]/page.test.tsx
```

Esperado: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/livros/[id]/page.tsx src/app/livros/[id]/page.test.tsx
git commit -m "fix: incluir id do livro no href do link de emprestimo"
```

---

## Task 3: Capa do livro responsiva

**Problema:** O container da capa usa dimensões absolutas `h-[556px] w-[359px]` sem adaptação para telas menores. Em telas estreitas, a capa pode vazar lateralmente.

**Files:**
- Modify: `src/app/livros/[id]/page.tsx:82`

- [ ] **Step 1: Substituir as dimensões fixas por aspect-ratio + max-width**

Em `src/app/livros/[id]/page.tsx`, linha 82:

```tsx
// ANTES
<div className="relative h-[556px] w-[359px] overflow-hidden rounded-sm shadow-[-10px_10px_70px_rgba(0,0,0,0.20)]">
```

```tsx
// DEPOIS
<div className="relative aspect-[359/556] w-full max-w-[359px] overflow-hidden rounded-sm shadow-[-10px_10px_70px_rgba(0,0,0,0.20)]">
```

`aspect-[359/556]` mantém a proporção original. `w-full max-w-[359px]` permite que o container encolha em telas menores sem vazar.

- [ ] **Step 2: Verificar visualmente no dev server**

```bash
pnpm dev
```

Abrir `http://localhost:3000/livros/1` e redimensionar a janela para verificar que a capa se adapta sem vazar.

- [ ] **Step 3: Commit**

```bash
git add src/app/livros/[id]/page.tsx
git commit -m "fix: tornar container da capa do livro responsivo com aspect-ratio"
```

---

## Task 4: Estabilizar o overlap do card com min-height

**Problema:** O card branco usa `mt-[-242px]` calculado manualmente. Se o título do livro quebrar mais linhas, a coluna de informações fica mais alta que o esperado e o card pode não cobrir a área correta.

**Causa raiz:** O cálculo de -242px assume implicitamente que a altura da primeira seção é determinada pela capa (556px), mas a coluna da direita pode crescer além disso com títulos longos.

**Fix:** Garantir que a coluna de informações tenha `lg:min-h-[556px]`, igualando a altura mínima da capa. Isso torna o `mt-[-242px]` estável independente do tamanho do título.

**Files:**
- Modify: `src/app/livros/[id]/page.tsx:94`

- [ ] **Step 1: Adicionar `lg:min-h-[556px]` na coluna de informações**

Em `src/app/livros/[id]/page.tsx`, linha 94:

```tsx
// ANTES
<div className="z-10 flex w-full max-w-[538px] flex-col gap-5 lg:pt-0">
```

```tsx
// DEPOIS
<div className="z-10 flex w-full max-w-[538px] flex-col gap-5 lg:min-h-[556px] lg:pt-0">
```

- [ ] **Step 2: Verificar visualmente com título longo**

No arquivo `src/data/books.ts`, temporariamente editar o `title` do livro id "1" para um título muito longo (3+ linhas) e verificar que o card branco continua se posicionando corretamente.

Reverter a mudança no `books.ts` após verificar.

- [ ] **Step 3: Commit**

```bash
git add src/app/livros/[id]/page.tsx
git commit -m "fix: estabilizar overlap do card com min-height na coluna de info"
```

---

## Task 5: Renderização condicional de coautores

**Problema:** A seção "Entradas Secundárias/Autor:" é sempre renderizada mesmo quando `secondaryAuthors` é um array vazio, exibindo um título sem conteúdo abaixo.

**Files:**
- Modify: `src/app/livros/[id]/page.tsx:149-159`
- Test: `src/app/livros/[id]/page.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

Adicionar ao `page.test.tsx`:

```tsx
describe("BookDetailsPage — coautores", () => {
  it("não deve renderizar seção de coautores quando o array está vazio", async () => {
    // Sobrescrever o mock para retornar array vazio
    const { getBookById } = await import("@/data/books");
    vi.mocked(getBookById).mockReturnValueOnce({
      id: "1",
      title: "Título do Livro",
      author: "Autor Teste",
      description: "Descrição.",
      coverUrl: "/cover.png",
      mainTitle: "Título completo.",
      edition: "1. ed.",
      publisher: "Editora X",
      year: 2025,
      isbn: "9780000000001",
      subjects: "Computação",
      secondaryAuthors: [],
    });

    await renderPage();
    expect(screen.queryByText("Entradas Secundárias/Autor:")).not.toBeInTheDocument();
  });

  it("deve renderizar seção de coautores quando há autores", async () => {
    await renderPage();
    expect(screen.getByText("Entradas Secundárias/Autor:")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar para confirmar que o teste de array vazio falha**

```bash
pnpm test --run src/app/livros/\\[id\\]/page.test.tsx
```

Esperado: FAIL — "Entradas Secundárias/Autor:" é encontrado mesmo com array vazio.

- [ ] **Step 3: Adicionar renderização condicional**

Em `src/app/livros/[id]/page.tsx`, linhas 149-159:

```tsx
// ANTES
<div className="flex flex-col gap-4 lg:pt-[122px]">
  <InfoTitle>Entradas Secundárias/Autor:</InfoTitle>
  <div className="flex flex-col gap-1 text-base text-[#67463599]">
    {book.secondaryAuthors.map((author) => (
      <p key={author}>
        <span className="underline">{author}</span>
        <span className="text-[#674635CC] ml-2">coautor</span>
      </p>
    ))}
  </div>
</div>
```

```tsx
// DEPOIS
{book.secondaryAuthors.length > 0 && (
  <div className="flex flex-col gap-4 lg:pt-[122px]">
    <InfoTitle>Entradas Secundárias/Autor:</InfoTitle>
    <div className="flex flex-col gap-1 text-base text-[#67463599]">
      {book.secondaryAuthors.map((author) => (
        <p key={author}>
          <span className="underline">{author}</span>
          <span className="ml-2 text-[#674635CC]">coautor</span>
        </p>
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 4: Rodar todos os testes**

```bash
pnpm test --run src/app/livros/\\[id\\]/page.test.tsx
```

Esperado: todos os testes PASS.

- [ ] **Step 5: Rodar typecheck para garantir que não há erros de tipo**

```bash
pnpm typecheck
```

Esperado: sem erros.

- [ ] **Step 6: Commit final**

```bash
git add src/app/livros/[id]/page.tsx src/app/livros/[id]/page.test.tsx
git commit -m "fix: ocultar secao de coautores quando lista estiver vazia"
```

---

## Self-Review

### Spec coverage

| Problema identificado | Task que cobre |
|---|---|
| Semântica incorreta (h2 como labels) | Task 1 |
| Link CTA hardcoded sem ID | Task 2 |
| Capa com tamanho fixo em mobile | Task 3 |
| Overlap frágil com título longo | Task 4 |
| Seção de coautores sempre renderiza | Task 5 |

### Checklist de placeholders

- Nenhum "TBD" ou "TODO" encontrado
- Todo código está completo com before/after
- Comandos incluem saída esperada
- Tipos e props são consistentes entre tasks

### Consistência de tipos

- `InlineInfo` recebe `{ label: string; value: string }` — consistente em todas as tasks
- O mock do `getBookById` inclui todos os campos usados no componente
