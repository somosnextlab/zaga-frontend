import React from "react";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

// Mock de LoanSimulator
jest.mock("../../LoanSimulator/LoanSimulator", () => ({
  LoanSimulator: () => <div data-testid="loan-simulator">Loan Simulator</div>,
}));

describe("HeroSection", () => {
  test("01 - should render without crashing", () => {
    render(<HeroSection />);
    // Verificar que el componente se renderiza (puede ser una section o div)
    const section = screen.getByText(/100% en línea/i);
    expect(section).toBeInTheDocument();
  });

  test("02 - should render loan simulator", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("loan-simulator")).toBeInTheDocument();
  });

  test("03 - should render call to action button", () => {
    render(<HeroSection />);
    const cta = screen.getByRole("link", { name: /solicitar prestamo/i });
    expect(cta).toBeInTheDocument();
  });
});

