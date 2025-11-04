import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../checkbox";

describe("Checkbox", () => {
  test("01 - should render without crashing", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("02 - should be unchecked by default", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("03 - should be checked when checked prop is true", () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("04 - should toggle checked state on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test("05 - should call onChange when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  test("06 - should be disabled when disabled prop is true", () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  test("07 - should not toggle when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Checkbox disabled onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
    await user.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });

  test("08 - should accept custom className", () => {
    const customClass = "custom-class-name";
    render(<Checkbox className={customClass} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass(customClass);
  });

  test("09 - should accept id attribute", () => {
    const id = "test-checkbox";
    render(<Checkbox id={id} />);
    const checkbox = document.getElementById(id);
    expect(checkbox).toBeInTheDocument();
  });

  test("10 - should accept aria-label", () => {
    const ariaLabel = "Accept terms and conditions";
    render(<Checkbox aria-label={ariaLabel} />);
    const checkbox = screen.getByLabelText(ariaLabel);
    expect(checkbox).toBeInTheDocument();
  });

  test("11 - should forward ref", () => {
    const ref = React.createRef<
      React.ElementRef<typeof import("@radix-ui/react-checkbox").Root>
    >();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});

