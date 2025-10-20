import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para obtener el rol del usuario desde el backend
 * Reemplaza la consulta directa a Supabase por una llamada al backend
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Llamar al endpoint del backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/usuarios/rol-usuario`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error del backend:', response.status, response.statusText);

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Token de autorización inválido' },
          { status: 401 }
        );
      }

      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Error del servidor backend' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Validar la estructura de la respuesta
    if (!data.success || !data.role) {
      console.error('Respuesta inválida del backend:', data);
      return NextResponse.json(
        { error: 'Respuesta inválida del servidor' },
        { status: 500 }
      );
    }

    // Retornar la respuesta del backend
    return NextResponse.json({
      success: data.success,
      role: data.role,
    });
  } catch (error) {
    console.error('Error en rol-usuarios API:', error);

    // Manejar errores de conexión al backend
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Error de conexión con el servidor backend' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
