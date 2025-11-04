// Jest setup file para configurar el entorno de testing
// Este archivo solo se usa en el entorno de Jest, no en el build de producción
import "@testing-library/jest-dom";
import React from "react";

// Declarar tipos globales de Jest para que TypeScript reconozca jest en este archivo
declare const jest: {
  mock: (module: string, factory: () => unknown) => void;
  fn: () => jest.Mock;
};

// Mock de Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock de Next.js Link
jest.mock("next/link", () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return React.createElement("a", { href }, children);
  };
});

// Mock de ResizeObserver para componentes que lo usan (como Slider de Radix UI)
global.ResizeObserver = class ResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).cb = cb;
  }
  observe() {
    // No-op
  }
  unobserve() {
    // No-op
  }
  disconnect() {
    // No-op
  }
} as unknown as typeof ResizeObserver;
