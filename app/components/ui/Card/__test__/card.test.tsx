import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../card";

describe("Card", () => {
  test("01 - should render without crashing", () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  test("02 - should render children correctly", () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("03 - should accept custom className", () => {
    const customClass = "custom-class-name";
    render(<Card className={customClass}>Card Content</Card>);
    const card = screen.getByText("Card Content").closest("div");
    expect(card).toHaveClass(customClass);
  });

  test("04 - should forward ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Card Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("CardHeader", () => {
  test("01 - should render without crashing", () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  test("02 - should accept custom className", () => {
    const customClass = "custom-header-class";
    render(<CardHeader className={customClass}>Header</CardHeader>);
    const header = screen.getByText("Header").closest("div");
    expect(header).toHaveClass(customClass);
  });
});

describe("CardTitle", () => {
  test("01 - should render without crashing", () => {
    render(<CardTitle>Card Title</CardTitle>);
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  test("02 - should render title text", () => {
    const title = "Test Title";
    render(<CardTitle>{title}</CardTitle>);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test("03 - should accept custom className", () => {
    const customClass = "custom-title-class";
    render(<CardTitle className={customClass}>Title</CardTitle>);
    const title = screen.getByText("Title").closest("h3");
    expect(title).toHaveClass(customClass);
  });
});

describe("CardDescription", () => {
  test("01 - should render without crashing", () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  test("02 - should render description text", () => {
    const description = "Test Description";
    render(<CardDescription>{description}</CardDescription>);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  test("03 - should accept custom className", () => {
    const customClass = "custom-description-class";
    render(<CardDescription className={customClass}>Description</CardDescription>);
    const desc = screen.getByText("Description").closest("p");
    expect(desc).toHaveClass(customClass);
  });
});

describe("CardContent", () => {
  test("01 - should render without crashing", () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  test("02 - should render content text", () => {
    const content = "Test Content";
    render(<CardContent>{content}</CardContent>);
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  test("03 - should accept custom className", () => {
    const customClass = "custom-content-class";
    render(<CardContent className={customClass}>Content</CardContent>);
    const content = screen.getByText("Content").closest("div");
    expect(content).toHaveClass(customClass);
  });
});

describe("CardFooter", () => {
  test("01 - should render without crashing", () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  test("02 - should render footer text", () => {
    const footer = "Test Footer";
    render(<CardFooter>{footer}</CardFooter>);
    expect(screen.getByText(footer)).toBeInTheDocument();
  });

  test("03 - should accept custom className", () => {
    const customClass = "custom-footer-class";
    render(<CardFooter className={customClass}>Footer</CardFooter>);
    const footer = screen.getByText("Footer").closest("div");
    expect(footer).toHaveClass(customClass);
  });
});

describe("Card Composition", () => {
  test("01 - should render complete card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});

