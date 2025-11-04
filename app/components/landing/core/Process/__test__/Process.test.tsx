import React from "react";
import { render, screen } from "@testing-library/react";
import { Process } from "../Process";

describe("Process", () => {
  test("01 - should render without crashing", () => {
    render(<Process />);
    expect(screen.getByText(/obtén tu préstamo/i)).toBeInTheDocument();
  });

  test("02 - should render process title", () => {
    render(<Process />);
    expect(screen.getByText(/obtén tu préstamo/i)).toBeInTheDocument();
  });

  test("03 - should render process steps", () => {
    render(<Process />);
    const steps = screen.getAllByText(/completa tu solicitud/i);
    expect(steps.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/recibe aprobación/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/recibe tu dinero/i).length).toBeGreaterThan(0);
  });

  test("04 - should render call to action button", () => {
    render(<Process />);
    const buttons = screen.getAllByRole("button");
    const solicitarButton = buttons.find((button) =>
      button.textContent?.toLowerCase().includes("solicitar")
    );
    expect(solicitarButton).toBeDefined();
  });
});

