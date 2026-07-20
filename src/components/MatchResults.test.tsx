import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { demoProfile } from "../data/demoProfile";
import { MatchResults } from "./MatchResults";

describe("MatchResults", () => {
  test("explains how to recover when hard constraints exclude everyone", () => {
    render(
      <MatchResults
        seeker={demoProfile}
        matches={[]}
        onEdit={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /constraints are doing their job/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /review constraints/i }),
    ).toBeInTheDocument();
  });
});
