# Tela de Empréstimo Confirmado

**Data:** 2026-06-10  
**Branch:** `feat/criando-tela-emprestimo-confirmado`

---

## Objetivo

Exibir uma página de sucesso após o usuário clicar em "Finalizar" na página `/emprestimo-livro`, confirmando que o empréstimo foi realizado.

---

## Arquitetura

### Novos arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/app/emprestimo-confirmado/page.tsx` | Wrapper fino — importa e renderiza `LoanConfirmed` |
| `src/presentation/modules/loans/components/loan-confirmed/LoanConfirmed.tsx` | UI da página de confirmação |

### Arquivo modificado

| Arquivo | Mudança |
|---|---|
| `src/presentation/modules/books/components/rules-and-policies/rules-and-polices.tsx` | Botão "Finalizar" recebe `router.push('/emprestimo-confirmado')` via `useRouter` do Next.js |

### Dependências de camada

```
app/emprestimo-confirmado/page.tsx
  └── presentation/modules/loans/components/loan-confirmed/LoanConfirmed.tsx
        └── presentation/shared/components/header/header
        └── presentation/shared/components/layout/footer/footer

presentation/modules/books/components/rules-and-policies/rules-and-polices.tsx
  └── next/navigation (useRouter)
```

---

## UI — `LoanConfirmed`

Layout idêntico ao das outras páginas do projeto: `Header` + `<main>` + `Footer`.

Dentro do `<main>`, conteúdo centralizado:

- Ícone `CheckCircle` (lucide-react) em cor `#4E0000`
- Título: `"Empréstimo realizado!"`
- Subtítulo: `"Seus livros foram reservados com sucesso."`
- Botão primário: `"Voltar ao início"` → `router.push('/')`

Sem estado, sem chamadas de API. Página estática.

---

## Navegação

```
/emprestimo-livro  →  clique em "Finalizar"  →  /emprestimo-confirmado  →  clique em "Voltar ao início"  →  /
```

O botão "Finalizar" em `RulesAndPolices` já existe. A única mudança é adicionar `"use client"` e `useRouter` para executar o redirecionamento ao clicar.

---

## O que não está no escopo

- Passar dados dos livros para a página de confirmação (não solicitado)
- Validar se o checkbox de regras foi marcado antes de redirecionar
- Chamada à API para registrar o empréstimo (sem integração de backend neste momento)
