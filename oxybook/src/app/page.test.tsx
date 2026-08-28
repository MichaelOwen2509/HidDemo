import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("next/image", () => ({
	default: ({
		fill: _fill,
		priority: _priority,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement> & {
		fill?: boolean;
		priority?: boolean;
	}) => {
		// biome-ignore lint/performance/noImgElement: next/image is mocked as a plain image in tests.
		return <img {...props} alt={props.alt ?? ""} />;
	},
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

describe("Home page", () => {
	it("renders the book sections", () => {
		render(<Home />);

		expect(
			screen.getByRole("heading", { name: /novas aquisições/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /livros disponíveis/i }),
		).toBeInTheDocument();
	});

	it("renders search controls", () => {
		render(<Home />);

		expect(screen.getByPlaceholderText("Leis...")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /ver todos/i })).toHaveAttribute(
			"href",
			"/busca",
		);
	});
});
