import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input", () => {
  test("01 - should render without crashing", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  test("02 - should render with correct type", () => {
    render(<Input type="email" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
  });

  test("03 - should render with placeholder", () => {
    const placeholder = "Enter your email";
    render(<Input placeholder={placeholder} />);
    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();
  });

  test("04 - should accept and display value", () => {
    const value = "test@example.com";
    render(<Input value={value} readOnly />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe(value);
  });

  test("05 - should handle onChange events", async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    const user = userEvent.setup();
    await user.type(input, "test");
    expect(handleChange).toHaveBeenCalled();
  });

  test("06 - should accept custom className", () => {
    const customClass = "custom-class-name";
    render(<Input className={customClass} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(customClass);
  });

  test("07 - should be disabled when disabled prop is true", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  test("08 - should accept required attribute", () => {
    render(<Input required />);
    const input = screen.getByRole("textbox");
    expect(input).toBeRequired();
  });

  test("09 - should accept id attribute", () => {
    const id = "test-input";
    render(<Input id={id} />);
    const input = document.getElementById(id);
    expect(input).toBeInTheDocument();
  });

  test("10 - should forward ref", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

