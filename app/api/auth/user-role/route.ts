import { supabaseServer } from '@/app/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para obtener el rol del usuario desde la tabla seguridad.usuarios
 * Solo se usa cuando el usuario no es admin (que viene de Supabase)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    // Obtener el cliente de Supabase
    const supabase = await supabaseServer();

    // Obtener el usuario autenticado desde Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Consultar el rol desde la tabla seguridad.usuarios
    const { data: userData, error: dbError } = await supabase
      .from('seguridad.usuarios')
      .select('rol')
      .eq('user_id', user.id)
      .single();

    if (dbError) {
      console.error('Error consultando rol de usuario:', dbError);
      return NextResponse.json(
        { error: 'Error al obtener rol del usuario' },
        { status: 500 }
      );
    }

    if (!userData) {
      return NextResponse.json(
        { error: 'Usuario no encontrado en la base de datos' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      role: userData.rol,
    });
  } catch (error) {
    console.error('Error en user-role API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
