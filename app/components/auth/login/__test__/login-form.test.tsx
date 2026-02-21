import React from "react";
import { render, screen } from "@testing-library/react";
import { LoginForm } from "../LoginForm";
import { UserProvider } from "@/app/context/UserContext/UserContextContext";

describe("LoginForm", () => {
  const renderWithProvider = () => {
    return render(
      <UserProvider>
        <LoginForm />
      </UserProvider>
    );
  };

  test("01 - should render without crashing", () => {
    renderWithProvider();
    expect(
      screen.getByText(/inicio de sesión en mantenimiento/i)
    ).toBeInTheDocument();
  });

  test("02 - should show maintenance description", () => {
    renderWithProvider();
    expect(
      screen.getByText(/temporalmente deshabilitado/i)
    ).toBeInTheDocument();
  });
});
