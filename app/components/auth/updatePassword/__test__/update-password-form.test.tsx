import React from "react";
import { render, screen } from "@testing-library/react";
import { UpdatePasswordForm } from "../UpdatePasswordForm";

describe("UpdatePasswordForm", () => {
  test("01 - should render without crashing", () => {
    render(<UpdatePasswordForm />);
    expect(
      screen.getByText(/actualización de contraseña en mantenimiento/i)
    ).toBeInTheDocument();
  });
});

