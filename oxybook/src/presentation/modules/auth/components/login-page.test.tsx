import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockUser } from "@/business/domains/auth/mock-user";
import { LoginPage } from "./login-page";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

describe("LoginPage", () => {
	beforeEach(() => {
		mockPush.mockClear();
	});

	it("aplica a máscara de CPF enquanto o usuário digita", () => {
		render(<LoginPage />);

		const cpfInput = screen.getByLabelText("CPF") as HTMLInputElement;
		fireEvent.change(cpfInput, { target: { value: "12345678900" } });

		expect(cpfInput.value).toBe("123.456.789-00");
	});

	it("redireciona para /emprestimo-livro ao enviar as credenciais corretas", async () => {
		render(<LoginPage />);

		fireEvent.change(screen.getByLabelText("CPF"), {
			target: { value: mockUser.cpf },
		});
		fireEvent.change(screen.getByLabelText("Senha"), {
			target: { value: mockUser.password },
		});
		fireEvent.click(screen.getByRole("button", { name: /fazer login/i }));

		await waitFor(() =>
			expect(mockPush).toHaveBeenCalledWith("/emprestimo-livro"),
		);
	});

	it("exibe uma mensagem de erro quando as credenciais estão incorretas", async () => {
		render(<LoginPage />);

		fireEvent.change(screen.getByLabelText("CPF"), {
			target: { value: mockUser.cpf },
		});
		fireEvent.change(screen.getByLabelText("Senha"), {
			target: { value: "senha-errada" },
		});
		fireEvent.click(screen.getByRole("button", { name: /fazer login/i }));

		expect(await screen.findAllByText("CPF ou senha inválidos")).toHaveLength(
			2,
		);
		expect(mockPush).not.toHaveBeenCalled();
	});
});
