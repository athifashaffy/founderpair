import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { seeker } from "../domain/testFixtures";
import { ProfileWizard } from "./ProfileWizard";

describe("ProfileWizard", () => {
  beforeEach(() => localStorage.clear());

  test("restores an in-progress edit to a completed profile", async () => {
    const user = userEvent.setup();
    const firstRender = render(
      <ProfileWizard
        initialProfile={seeker}
        onCancel={vi.fn()}
        onComplete={vi.fn()}
      />,
    );
    const name = screen.getByLabelText(/your name/i);
    await user.clear(name);
    await user.type(name, "Avery Updated");
    firstRender.unmount();

    render(
      <ProfileWizard
        initialProfile={seeker}
        onCancel={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/your name/i)).toHaveValue("Avery Updated");
  });
});
