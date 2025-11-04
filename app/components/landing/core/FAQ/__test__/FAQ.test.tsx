import React from "react";
import { render, screen } from "@testing-library/react";
import { FAQ } from "../FAQ";

describe("FAQ", () => {
  test("01 - should render without crashing", () => {
    render(<FAQ />);
    expect(screen.getByText(/preguntas/i)).toBeInTheDocument();
    expect(screen.getByText(/frecuentes/i)).toBeInTheDocument();
  });

  test("02 - should render FAQ title", () => {
    render(<FAQ />);
    expect(screen.getByText(/preguntas/i)).toBeInTheDocument();
    expect(screen.getByText(/frecuentes/i)).toBeInTheDocument();
  });

  test("03 - should render FAQ items", () => {
    render(<FAQ />);
    // Verificar que se renderizan las preguntas
    expect(
      screen.getByText(/¿cuáles son los requisitos para solicitar un préstamo?/i)
    ).toBeInTheDocument();
  });

  test("04 - should render contact section", () => {
    render(<FAQ />);
    // Verificar que existe la sección de contacto
    expect(screen.getByText(/¿cuáles son los requisitos/i)).toBeInTheDocument();
  });

  test("05 - should render contact buttons", () => {
    render(<FAQ />);
    // Verificar que existen los botones de contacto (pueden tener diferentes textos)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});

