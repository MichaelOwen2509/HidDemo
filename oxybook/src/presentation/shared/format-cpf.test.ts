import { describe, expect, it } from "vitest";
import { formatCpf } from "./format-cpf";

describe("formatCpf", () => {
	it("returns digits unchanged while under 4 digits", () => {
		expect(formatCpf("123")).toBe("123");
	});

	it("adds the first dot after the 3rd digit", () => {
		expect(formatCpf("1234")).toBe("123.4");
	});

	it("adds the second dot after the 6th digit", () => {
		expect(formatCpf("1234567")).toBe("123.456.7");
	});

	it("adds the dash after the 9th digit", () => {
		expect(formatCpf("12345678900")).toBe("123.456.789-00");
	});

	it("ignores non-digit characters typed by the user", () => {
		expect(formatCpf("123.abc456")).toBe("123.456");
	});

	it("truncates input beyond 11 digits", () => {
		expect(formatCpf("123456789001234")).toBe("123.456.789-00");
	});
});
