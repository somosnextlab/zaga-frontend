// Mock de la API para tests
export const mockApiPost = jest.fn();
export const mockParseApiResponse = jest.fn();

// Mock de fetch global para tests
global.fetch = jest.fn();
