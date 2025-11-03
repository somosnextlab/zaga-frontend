// Jest setup file para configurar el entorno de testing
import '@testing-library/jest-dom';
import React from 'react';

// Mock de Next.js router
// @ts-expect-error - jest está disponible en tiempo de ejecución en el entorno de Jest
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      // @ts-expect-error - jest.fn está disponible en tiempo de ejecución
      push: jest.fn(),
      // @ts-expect-error - jest.fn está disponible en tiempo de ejecución
      replace: jest.fn(),
      // @ts-expect-error - jest.fn está disponible en tiempo de ejecución
      prefetch: jest.fn(),
      // @ts-expect-error - jest.fn está disponible en tiempo de ejecución
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock de Next.js Link
// @ts-expect-error - jest está disponible en tiempo de ejecución en el entorno de Jest
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return React.createElement('a', { href }, children);
  };
});

