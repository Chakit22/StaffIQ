import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../index";

//Mock next/router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("HomePage", () => {
  //Test 1: Basic welcome message render (already exists — not changed)
  it("renders the welcome message", () => {
    render(<HomePage />);
    expect(
      screen.getByText((_, element) =>
        element?.textContent === "Welcome to TeachTeam"
      )
    ).toBeInTheDocument();
  });

  //Test 2: Subtitle or supporting message renders (conditional render test)
  it("renders a supporting subtitle or description", () => {
    render(<HomePage />);
    const subtitle = screen.getByText(
      /smart solutions for structured academic staffing/i
    ); // Replace with your actual text if different
    expect(subtitle).toBeInTheDocument();
  });

  //Test 3: Accessibility check — keyboard navigation works for buttons
  it("allows keyboard navigation and focus on Sign In and Sign Up buttons", async () => {
    render(<HomePage />);
    const user = userEvent.setup();

    const signInButton = screen.getByRole("button", { name: /Sign In/i });
    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });

    //Tab to Sign In
    await user.tab();
    expect(signInButton).toHaveFocus();

    //Tab to Sign Up
    await user.tab();
    expect(signUpButton).toHaveFocus();
  });
});
