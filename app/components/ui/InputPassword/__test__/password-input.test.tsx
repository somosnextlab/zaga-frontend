import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "../password-input";

describe("PasswordInput", () => {
  test("01 - should render without crashing", () => {
    render(<PasswordInput />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  test("02 - should render password input by default", () => {
    render(<PasswordInput />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  test("03 - should toggle password visibility on button click", async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    const toggleButton = screen.getByRole("button", {
      name: /mostrar contraseña/i,
    });
    const input = document.querySelector('input[type="password"]');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");

    await user.click(toggleButton);

    const textInput = document.querySelector('input[type="text"]');
    expect(textInput).toBeInTheDocument();
  });

  test("04 - should show eye icon when password is hidden", () => {
    render(<PasswordInput />);
    const toggleButton = screen.getByRole("button", {
      name: /mostrar contraseña/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });

  test("05 - should show eye-off icon when password is visible", async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    const toggleButton = screen.getByRole("button", {
      name: /mostrar contraseña/i,
    });

    await user.click(toggleButton);

    const eyeOffButton = screen.getByRole("button", {
      name: /ocultar contraseña/i,
    });
    expect(eyeOffButton).toBeInTheDocument();
  });

  test("06 - should accept and display value", () => {
    const value = "password123";
    render(<PasswordInput value={value} readOnly />);
    const input = document.querySelector('input[type="password"]') as HTMLInputElement;
    expect(input.value).toBe(value);
  });

  test("07 - should handle onChange events", async () => {
    const handleChange = jest.fn();
    render(<PasswordInput onChange={handleChange} />);
    const input = document.querySelector('input[type="password"]') as HTMLInputElement;
    const user = userEvent.setup();
    await user.type(input, "test");
    expect(handleChange).toHaveBeenCalled();
  });

  test("08 - should accept custom className", () => {
    const customClass = "custom-class-name";
    render(<PasswordInput className={customClass} />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toHaveClass(customClass);
  });

  test("09 - should be disabled when disabled prop is true", () => {
    render(<PasswordInput disabled />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeDisabled();
  });

  test("10 - should accept required attribute", () => {
    render(<PasswordInput required />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeRequired();
  });

  test("11 - should accept id attribute", () => {
    const id = "test-password-input";
    render(<PasswordInput id={id} />);
    const input = document.getElementById(id);
    expect(input).toBeInTheDocument();
  });

  test("12 - should hide password toggle when showPasswordToggle is false", () => {
    render(<PasswordInput showPasswordToggle={false} />);
    const toggleButton = screen.queryByRole("button");
    expect(toggleButton).not.toBeInTheDocument();
  });

  test("13 - should forward ref", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

