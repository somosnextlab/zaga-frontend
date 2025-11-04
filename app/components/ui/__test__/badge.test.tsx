import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  test("01 - should render without crashing", () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  test("02 - should render with text content", () => {
    const text = "Test Badge";
    render(<Badge>{text}</Badge>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test("03 - should render with default variant", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
  });

  test("04 - should render with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = screen.getByText("Secondary Badge");
    expect(badge).toBeInTheDocument();
  });

  test("05 - should render with destructive variant", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badge = screen.getByText("Destructive Badge");
    expect(badge).toBeInTheDocument();
  });

  test("06 - should render with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badge = screen.getByText("Outline Badge");
    expect(badge).toBeInTheDocument();
  });

  test("07 - should accept custom className", () => {
    const customClass = "custom-class-name";
    render(<Badge className={customClass}>Custom Badge</Badge>);
    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass(customClass);
  });

  test("08 - should accept id attribute", () => {
    const id = "test-badge";
    render(<Badge id={id}>Test Badge</Badge>);
    const badge = document.getElementById(id);
    expect(badge).toBeInTheDocument();
  });

  test("09 - should render children correctly", () => {
    render(
      <Badge>
        <span>Nested</span> Badge
      </Badge>
    );
    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });
});

