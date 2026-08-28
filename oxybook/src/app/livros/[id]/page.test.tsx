import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock do next/image e next/link para não exigir contexto Next.js
vi.mock("next/image", () => ({
	default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}));
vi.mock("next/link", () => ({
	default: ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => <a href={href}>{children}</a>,
}));
vi.mock("next/navigation", () => ({
	notFound: () => {
		throw new Error("NOT_FOUND");
	},
}));

// Mock dos dados para controlar o book usado nos testes
vi.mock("@/data/books", () => ({
	books: [{ id: "1" }],
	getBookById: vi.fn(() => ({
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
	})),
}));

import BookDetailsPage from "./page";

async function renderPage() {
	const Component = await BookDetailsPage({
		params: Promise.resolve({ id: "1" }),
	});
	render(Component);
}

describe("BookDetailsPage — link do CTA", () => {
	it("deve incluir o id do livro no href do botão de carrinho", async () => {
		await renderPage();
		const link = screen.getByRole("link", { name: /adicionar ao carrinho/i });
		expect(link).toHaveAttribute("href", "/emprestimo-livro/1");
	});
});

describe("BookDetailsPage — semântica dos metadados", () => {
	it("não deve renderizar h2 para labels inline (Edição, ISBN, etc.)", async () => {
		await renderPage();
		const headings = screen.queryAllByRole("heading", { level: 2 });
		// Apenas "Entradas Secundárias/Autor:" e "Título Principal:" devem ser h2
		expect(headings.length).toEqual(2);
	});

	it("deve renderizar os metadados em uma dl com dt e dd", async () => {
		await renderPage();
		const terms = screen.getAllByRole("term"); // <dt> elements
		expect(terms.length).toBeGreaterThanOrEqual(4); // Edição, Publicação, Assuntos, ISBN
	});
});

describe("BookDetailsPage — coautores", () => {
	it("não deve renderizar seção de coautores quando o array está vazio", async () => {
		const { getBookById } = await import("@/data/books");
		vi.mocked(getBookById).mockReturnValueOnce({
			id: "1",
			slug: "livro-teste",
			title: "Título do Livro",
			author: "Autor Teste",
			description: "Descrição.",
			coverUrl: "/cover.png",
			mainTitle: "Título completo.",
			edition: "1. ed.",
			category: "Computação",
			publisher: "Editora X",
			year: 2025,
			pages: 200,
			isbn: "9780000000001",
			subjects: "Computação",
			secondaryAuthors: [],
			availableCopies: 3,
			totalCopies: 5,
			location: "Estante A1",
		});

		await renderPage();
		expect(
			screen.queryByText("Entradas Secundárias/Autor:"),
		).not.toBeInTheDocument();
	});

	it("deve renderizar seção de coautores quando há autores", async () => {
		await renderPage();
		expect(screen.getByText("Entradas Secundárias/Autor:")).toBeInTheDocument();
	});
});
