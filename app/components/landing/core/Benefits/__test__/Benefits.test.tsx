import React from "react";
import { render, screen } from "@testing-library/react";
import { Benefits } from "../Benefits";

describe("Benefits", () => {
  test("01 - should render without crashing", () => {
    render(<Benefits />);
    expect(screen.getByText(/¿por qué elegir/i)).toBeInTheDocument();
  });

  test("02 - should render benefits title", () => {
    render(<Benefits />);
    expect(screen.getByText(/¿por qué elegir/i)).toBeInTheDocument();
  });

  test("03 - should render benefit items", () => {
    render(<Benefits />);
    expect(screen.getByText(/aprobación inmediata/i)).toBeInTheDocument();
    expect(screen.getByText(/dinero en tu cuenta/i)).toBeInTheDocument();
    expect(screen.getByText(/100% seguro/i)).toBeInTheDocument();
  });

  test("04 - should render all benefit cards", () => {
    render(<Benefits />);
    // Verificar que se renderizan los beneficios principales
    expect(screen.getByText(/tasas competitivas/i)).toBeInTheDocument();
    expect(screen.getByText(/sin comisiones ocultas/i)).toBeInTheDocument();
    expect(screen.getByText(/soporte 24\/7/i)).toBeInTheDocument();
  });
});

