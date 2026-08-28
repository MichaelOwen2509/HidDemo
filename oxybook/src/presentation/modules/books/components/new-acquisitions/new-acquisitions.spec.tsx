import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { NewAcquisitions } from "./new-acquisitions";

describe("NewAcquisitions Component", () => {
	it("should render correctly", () => {
		render(<NewAcquisitions />);
	});
});
