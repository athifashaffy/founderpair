import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Landing } from "./Landing";

describe("Landing", () => {
  test("explains the matching loop and its safeguards", () => {
    render(<Landing onStart={vi.fn()} onDemo={vi.fn()} />);

    expect(screen.getAllByText(/skills that complement/i)).not.toHaveLength(0);
    expect(screen.getByText(/reasons, not roulette/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your profile stays on this device/i),
    ).toBeInTheDocument();
  });
});
