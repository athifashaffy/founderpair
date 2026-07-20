import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "./App";

describe("App", () => {
  test("renders the FoundPair promise", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /find the cofounder who completes the picture/i,
      }),
    ).toBeInTheDocument();
  });
});
