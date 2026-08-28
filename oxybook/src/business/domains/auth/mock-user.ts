export const mockUser = {
	name: "Maria Souza",
	email: "maria.souza@ceuma.edu.br",
	cpf: "123.456.789-00",
	password: "Senha@123",
};

function onlyDigits(value: string): string {
	return value.replace(/\D/g, "");
}

export function authenticateMockUser(cpf: string, password: string): boolean {
	return (
		onlyDigits(cpf) === onlyDigits(mockUser.cpf) &&
		password === mockUser.password
	);
}
