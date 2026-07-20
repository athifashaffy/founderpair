import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  test("completes profile setup and opens a recommended match", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /find my cofounder/i }),
    );
    await user.type(screen.getByLabelText(/your name/i), "Avery Chen");
    await user.type(
      screen.getByLabelText(/what do you want to build/i),
      "Full-time engineer building venture-backed climate software",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.clear(screen.getByLabelText(/what do you bring/i));
    await user.type(
      screen.getByLabelText(/what do you bring/i),
      "Engineering, Product",
    );
    await user.clear(screen.getByLabelText(/what do you need/i));
    await user.type(
      screen.getByLabelText(/what do you need/i),
      "Sales, Growth",
    );
    await user.click(
      screen.getByRole("button", { name: /show my matches/i }),
    );

    expect(
      await screen.findByRole("heading", { name: /your strongest matches/i }),
    ).toBeInTheDocument();
    const [viewMatch] = screen.getAllByRole("button", {
      name: /view match/i,
    });
    expect(viewMatch).toBeDefined();
    await user.click(viewMatch!);
    expect(screen.getByText(/what could click/i)).toBeInTheDocument();
    expect(screen.getByText(/worth discussing/i)).toBeInTheDocument();
  });
});
