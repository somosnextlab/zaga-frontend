// Mock de window.location para tests
if (typeof window !== 'undefined') {
  // Solo mockear si no existe o si podemos redefinirlo
  if (!window.location || window.location.origin === 'http://localhost:3000') {
    // Mock window.location de forma segura
    try {
      delete window.location;
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000',
          origin: 'http://localhost:3000',
          pathname: '/',
          search: '',
          hash: '',
          assign: jest.fn(),
          replace: jest.fn(),
          reload: jest.fn(),
        },
        writable: true,
        configurable: true,
      });
    } catch {
      // Si no se puede redefinir, solo mockear los métodos necesarios
      if (window.location) {
        window.location.reload = jest.fn();
        window.location.assign = jest.fn();
        window.location.replace = jest.fn();
      }
    }
  }

  // Mock window.matchMedia
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  }
}
