import { render, screen, fireEvent } from "@testing-library/react";
import TutorComponent from "@/components/tutor";

//Mock necessary providers/hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock("@/context/UserProvider", () => ({
  useAuth: () => ({
    user: {
      id: "123",
      name: "Test User",
      email: "test@example.com",
      role: "tutor",
    },
    loading: false,
  }),
}));

jest.mock("@/context/ApplicantProvider", () => ({
  useApplicant: () => ({
    addApplicant: jest.fn(),
    applicants: [],
  }),
}));

describe("TutorComponent", () => {
  //Test 4: Ensure all sections render correctly
  it("renders all form sections and the submit button", () => {
    render(<TutorComponent />);

    expect(screen.getByText(/Apply for Roles/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Course/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Role/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Availability/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Skills/i)).toBeInTheDocument();
    expect(screen.getByText(/Academic Credentials/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Submit Application/i })
    ).toBeInTheDocument();
  });

  //Test 5: Submitting empty form shows validation errors
  it("shows validation errors if fields are empty", async () => {
    render(<TutorComponent />);

    const submitButton = screen.getByRole("button", {
      name: /Submit Application/i,
    });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Please select your course/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Please select a role/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Please select your availability/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Skills must be at least 10 characters/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Credentials must be at least 10 characters/i)
    ).toBeInTheDocument();
  });
});
