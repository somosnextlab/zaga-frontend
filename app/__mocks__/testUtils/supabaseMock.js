// Mock de Supabase para tests
export const mockSupabaseAuth = {
  signUp: jest.fn(),
  signInWithPassword: jest.fn(),
  signOut: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  onAuthStateChange: jest.fn(),
};

export const mockSupabaseClient = () => ({
  auth: mockSupabaseAuth,
});

// Mock por defecto para Supabase
jest.mock('@/lib/supabase/client', () => ({
  supabaseClient: mockSupabaseClient,
}));
