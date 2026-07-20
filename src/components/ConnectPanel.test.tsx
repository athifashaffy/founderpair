import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { buildFallbackExplanation } from "../domain/explanations";
import { scoreProfiles } from "../domain/scoring";
import { candidate, seeker } from "../domain/testFixtures";
import type { MatchResult } from "../domain/types";
import { ConnectPanel } from "./ConnectPanel";

const match: MatchResult = {
  profile: candidate,
  scores: scoreProfiles(seeker, candidate),
  band: "Strong fit",
  explanation: buildFallbackExplanation(
    seeker,
    candidate,
    scoreProfiles(seeker, candidate),
  ),
};

describe("ConnectPanel", () => {
  beforeEach(() => localStorage.clear());

  test("persists a saved introduction on this device", async () => {
    const user = userEvent.setup();
    const firstRender = render(
      <ConnectPanel seeker={seeker} match={match} onBack={vi.fn()} />,
    );
    const introduction = screen.getByLabelText(/your introduction/i);
    await user.clear(introduction);
    await user.type(introduction, "A specific first message");
    await user.click(screen.getByRole("button", { name: /save introduction/i }));

    firstRender.unmount();
    render(<ConnectPanel seeker={seeker} match={match} onBack={vi.fn()} />);

    expect(screen.getByLabelText(/your introduction/i)).toHaveValue(
      "A specific first message",
    );
    expect(screen.getByText(/saved on this device/i)).toBeInTheDocument();
  });
});
