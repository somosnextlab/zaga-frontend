
import { render, screen } from "@testing-library/react";
import TermsPage from "../page";

describe("/terms (lectura pública)", () => {
  test.skip("debería renderizar título y CTA a WhatsApp", () => {
    render(<TermsPage />);

    expect(
      screen.getByRole("heading", { name: /términos y condiciones/i })
    ).toBeInTheDocument();

    const whatsappCta = screen.getByRole("link", {
      name: /Continuar en WhatsAppp/i,
    });
    expect(whatsappCta).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/")
    );
  });

  test.skip("debería mostrar link secundario para volver al inicio", () => {
    render(<TermsPage />);

    const backLink = screen.getByRole("link", { name: /volver al inicio/i });
    expect(backLink).toHaveAttribute("href", "/");
  });
});

