// Mock de la API para tests
export const mockApiPost = jest.fn();
export const mockParseApiResponse = jest.fn();

// Mock por defecto para la API
jest.mock('@/lib/api', () => ({
  apiPost: mockApiPost,
  parseApiResponse: mockParseApiResponse,
}));
