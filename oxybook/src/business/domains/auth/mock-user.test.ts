import { describe, expect, it } from "vitest";
import { authenticateMockUser, mockUser } from "./mock-user";

describe("authenticateMockUser", () => {
	it("returns true when cpf and password match the mock user", () => {
		expect(authenticateMockUser(mockUser.cpf, mockUser.password)).toBe(true);
	});

	it("returns true when cpf is provided without formatting", () => {
		const rawCpf = mockUser.cpf.replace(/\D/g, "");
		expect(authenticateMockUser(rawCpf, mockUser.password)).toBe(true);
	});

	it("returns false when password does not match", () => {
		expect(authenticateMockUser(mockUser.cpf, "wrong-password")).toBe(false);
	});

	it("returns false when cpf does not match", () => {
		expect(authenticateMockUser("000.000.000-00", mockUser.password)).toBe(
			false,
		);
	});
});
