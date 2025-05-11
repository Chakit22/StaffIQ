// Import testing library extensions for Jest
import "@testing-library/jest-dom";

// Mock Next.js' router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/",
  }),
}));

// Suppress React 18+ warnings about act() during tests
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};
