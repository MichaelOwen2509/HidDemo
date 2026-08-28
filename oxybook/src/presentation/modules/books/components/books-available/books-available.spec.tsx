import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { BooksAvailable } from "./books-available";

describe("BooksAvailable Component", () => {
	it("should render correctly", () => {
		render(<BooksAvailable />);
	});
});
