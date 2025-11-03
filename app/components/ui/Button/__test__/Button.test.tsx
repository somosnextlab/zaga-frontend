import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  test("01 - should render without crashing", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test("02 - should render with text content", () => {
    const text = "Test Button";
    render(<Button>{text}</Button>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test("03 - should handle click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("04 - should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  test("05 - should render with default variant", () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole("button", { name: /default button/i });
    expect(button).toHaveClass("bg-primary");
  });

  test("06 - should render with destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveClass("bg-destructive");
  });

  test("07 - should render with outline variant", () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole("button", { name: /outline button/i });
    expect(button).toHaveClass("border");
  });

  test("08 - should render with ghost variant", () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole("button", { name: /ghost button/i });
    expect(button).toHaveClass("hover:bg-accent");
  });

  test("09 - should render with link variant", () => {
    render(<Button variant="link">Link Button</Button>);
    const button = screen.getByRole("button", { name: /link button/i });
    expect(button).toHaveClass("underline-offset-4");
  });

  test("10 - should render with small size", () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole("button", { name: /small button/i });
    expect(button).toHaveClass("h-9");
  });

  test("11 - should render with large size", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button", { name: /large button/i });
    expect(button).toHaveClass("h-11");
  });

  test("12 - should render with icon size", () => {
    render(<Button size="icon">Icon Button</Button>);
    const button = screen.getByRole("button", { name: /icon button/i });
    expect(button).toHaveClass("h-10", "w-10");
  });

  test("13 - should accept and apply custom className", () => {
    const customClass = "custom-class-name";
    render(<Button className={customClass}>Custom Button</Button>);
    const button = screen.getByRole("button", { name: /custom button/i });
    expect(button).toHaveClass(customClass);
  });

  test("14 - should pass through HTML button attributes", () => {
    render(
      <Button type="submit" aria-label="Submit form">
        Submit
      </Button>
    );
    const button = screen.getByRole("button", { name: /submit form/i });
    expect(button).toHaveAttribute("type", "submit");
  });

  test("15 - should render as child when asChild prop is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });
});
