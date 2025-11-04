import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../accordion";

describe("Accordion", () => {
  test("01 - should render without crashing", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("Item 1")).toBeDefined();
  });

  test("02 - should render accordion item", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("Trigger")).toBeDefined();
  });

  test("03 - should render accordion trigger", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Click me</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByText("Click me");
    expect(trigger).toBeDefined();
  });

  test("04 - should toggle content when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Toggle</AccordionTrigger>
          <AccordionContent>Hidden Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText("Toggle");
    await user.click(trigger);

    // El contenido debería estar visible después del click
    expect(screen.getByText("Hidden Content")).toBeDefined();
  });

  test("05 - should accept custom className on AccordionTrigger", () => {
    const customClass = "custom-trigger-class";
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className={customClass}>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByText("Trigger");
    expect(trigger).toHaveClass(customClass);
  });
});
