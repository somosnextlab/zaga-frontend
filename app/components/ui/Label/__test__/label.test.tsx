import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "../label";

describe("Label", () => {
  test("01 - should render without crashing", () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  test("02 - should render with text content", () => {
    const text = "Email Address";
    render(<Label>{text}</Label>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test("03 - should accept htmlFor attribute", () => {
    const htmlFor = "test-input";
    render(<Label htmlFor={htmlFor}>Test Label</Label>);
    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", htmlFor);
  });

  test("04 - should accept custom className", () => {
    const customClass = "custom-class-name";
    render(<Label className={customClass}>Test Label</Label>);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass(customClass);
  });

  test("05 - should accept id attribute", () => {
    const id = "test-label";
    render(<Label id={id}>Test Label</Label>);
    const label = document.getElementById(id);
    expect(label).toBeInTheDocument();
  });

  test("06 - should forward ref", () => {
    const ref = React.createRef<
      React.ElementRef<typeof import("@radix-ui/react-label").Root>
    >();
    render(<Label ref={ref}>Test Label</Label>);
    expect(ref.current).toBeTruthy();
  });

  test("07 - should render children correctly", () => {
    render(
      <Label>
        <span>Nested</span> Label
      </Label>
    );
    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(screen.getByText("Label")).toBeInTheDocument();
  });
});

