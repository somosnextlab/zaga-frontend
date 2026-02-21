import React from "react";
import { render, screen } from "@testing-library/react";
import { ForgotPasswordForm } from "../ForgotPasswordForm";

describe("ForgotPasswordForm", () => {
  test("01 - should render without crashing", () => {
    render(<ForgotPasswordForm />);
    expect(
      screen.getByText(/recuperación de contraseña en mantenimiento/i)
    ).toBeInTheDocument();
  });

  test("02 - should show maintenance description", () => {
    render(<ForgotPasswordForm />);
    expect(
      screen.getByText(/temporalmente deshabilitada/i)
    ).toBeInTheDocument();
  });
});
