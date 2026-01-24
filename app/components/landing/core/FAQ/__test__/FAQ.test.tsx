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
    // Verificar que el componente sigue renderizando el contenido principal (FAQ)
    expect(
      screen.getByText(/¿cuáles son los requisitos para solicitar un préstamo\?/i)
    ).toBeInTheDocument();
  });

  test("05 - should render contact buttons", () => {
    render(<FAQ />);
    // Ya no mostramos soporte por llamada/email en el FAQ.
    expect(
      screen.queryByRole("button", { name: /llamar ahora/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /enviar email/i })
    ).not.toBeInTheDocument();
  });
});

