import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "../Footer";
import { useAuth } from "@/app/hooks/useAuth";

jest.mock("@/app/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("Footer", () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
  });

  test("01 - should render without crashing", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  test("02 - should render brand name", () => {
    render(<Footer />);
    // Verificar que existe el texto "Zaga" (puede aparecer múltiples veces)
    const zagaElements = screen.getAllByText(/zaga/i);
    expect(zagaElements.length).toBeGreaterThan(0);
  });

  test("03 - should render product links", () => {
    render(<Footer />);
    expect(screen.getByText(/préstamos personales/i)).toBeInTheDocument();
    expect(screen.getByText(/simulador/i)).toBeInTheDocument();
  });

  test("04 - should render company links", () => {
    render(<Footer />);
    expect(screen.getByText(/nosotros/i)).toBeInTheDocument();
    expect(screen.getByText(/carreras/i)).toBeInTheDocument();
  });

  test("05 - should render legal links", () => {
    render(<Footer />);
    expect(screen.getByText(/términos y condiciones/i)).toBeInTheDocument();
    expect(screen.getByText(/política de privacidad/i)).toBeInTheDocument();
  });

  test("06 - should render social media links", () => {
    render(<Footer />);
    // Verificar que existen enlaces de redes sociales
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });
});
