import { render, screen, fireEvent } from "@testing-library/react";
import { LoanConfirmed } from "./LoanConfirmed";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/presentation/shared/components/header/header", () => ({
	default: () => null,
}));

describe("LoanConfirmed", () => {
	beforeEach(() => {
		mockPush.mockClear();
	});

	it("renderiza a mensagem de confirmação", () => {
		render(<LoanConfirmed />);
		expect(screen.getByText("Empréstimo confirmado!")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Seus livros já estão reservados. Fique atento ao prazo de devolução para evitar multas.",
			),
		).toBeInTheDocument();
	});

	it("renderiza os dois botões de ação", () => {
		render(<LoanConfirmed />);
		expect(
			screen.getByRole("button", { name: /Voltar para a biblioteca/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Baixar comprovante/i }),
		).toBeInTheDocument();
	});

	it('navega para / ao clicar em "Voltar para a biblioteca"', () => {
		render(<LoanConfirmed />);
		fireEvent.click(
			screen.getByRole("button", { name: /Voltar para a biblioteca/i }),
		);
		expect(mockPush).toHaveBeenCalledWith("/");
	});
});
