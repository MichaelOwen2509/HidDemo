import { render, screen, fireEvent } from "@testing-library/react";
import { RulesAndPolices } from "./rules-and-polices";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

describe("RulesAndPolices", () => {
	beforeEach(() => {
		mockPush.mockClear();
	});

	it('navega para /emprestimo-confirmado ao clicar em "Finalizar"', () => {
		render(<RulesAndPolices />);
		fireEvent.click(screen.getByRole("button", { name: "Finalizar" }));
		expect(mockPush).toHaveBeenCalledWith("/emprestimo-confirmado");
	});
});
