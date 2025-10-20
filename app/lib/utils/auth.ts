/**
 * Utilidades de autenticación para Zaga Frontend
 */

import { supabaseClient } from '../supabase/client';

/**
 * Obtiene el rol del usuario actual
 */
export const getUserRole = async (): Promise<string | null> => {
  try {
    const supabase = supabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Obtener el rol del usuario desde los metadatos
    const role = user.user_metadata?.role || user.app_metadata?.role;
    return role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const supabase = supabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = async () => {
  try {
    const supabase = supabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
