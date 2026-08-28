import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tips } from "./tips";

describe("Tips", () => {
	it("renderiza o título principal", () => {
		render(<Tips />);
		expect(
			screen.getByRole("heading", { name: /dicas para pesquisar/i }),
		).toBeInTheDocument();
	});

	it("renderiza as três dicas", () => {
		render(<Tips />);
		expect(screen.getAllByRole("article")).toHaveLength(3);
	});

	it("renderiza o link de explorar", () => {
		render(<Tips />);
		expect(
			screen.getByRole("link", { name: /explore mais/i }),
		).toBeInTheDocument();
	});
});
