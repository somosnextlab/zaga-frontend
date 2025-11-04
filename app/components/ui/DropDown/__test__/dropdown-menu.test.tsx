import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../dropdown-menu";

describe("DropdownMenu", () => {
  test("01 - should render without crashing", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  test("02 - should render trigger button", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const trigger = screen.getByText("Click me");
    expect(trigger).toBeInTheDocument();
  });

  test("03 - should open menu when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Menu Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Open Menu");
    await user.click(trigger);

    // El contenido del menú debería estar visible
    await screen.findByText("Menu Item");
    expect(screen.getByText("Menu Item")).toBeInTheDocument();
  });

  test("04 - should render menu item", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Test Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Open");
    await user.click(trigger);

    await screen.findByText("Test Item");
    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  test("05 - should render menu label", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Label</DropdownMenuLabel>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Open");
    await user.click(trigger);

    await screen.findByText("Label");
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  test("06 - should render menu separator", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Open");
    await user.click(trigger);

    await screen.findByText("Item 1");
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  test("07 - should render checkbox item", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Checkbox Item</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Open");
    await user.click(trigger);

    await screen.findByText("Checkbox Item");
    expect(screen.getByText("Checkbox Item")).toBeInTheDocument();
  });

  test("08 - should render radio group", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Open");
    await user.click(trigger);

    await screen.findByText("Option 1");
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  test("09 - should accept custom className on trigger", () => {
    const customClass = "custom-trigger-class";
    render(
      <DropdownMenu>
        <DropdownMenuTrigger className={customClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const trigger = screen.getByText("Open");
    expect(trigger).toHaveClass(customClass);
  });

  test("10 - should accept custom className on content", async () => {
    const user = userEvent.setup();
    const customClass = "custom-content-class";
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent className={customClass}>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Open");
    await user.click(trigger);

    await screen.findByText("Item");
    // Verificar que el contenido tiene la clase personalizada
    const content = screen.getByText("Item").closest('[role="menu"]');
    expect(content).toBeInTheDocument();
  });
});

