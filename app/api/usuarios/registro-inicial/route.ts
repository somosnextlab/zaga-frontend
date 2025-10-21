import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para registrar un usuario en el backend
 * Se ejecuta después de que el usuario se registra en Supabase Auth
 */
export async function POST(request: NextRequest) {
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
    
    if (!backendUrl) {
      console.error('NEXT_PUBLIC_BACKEND_URL no está configurado');
      return NextResponse.json(
        { error: 'Configuración del backend no disponible' },
        { status: 500 }
      );
    }

    const response = await fetch(`${backendUrl}/usuarios/registro-inicial`, {
      method: 'POST',
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

      if (response.status === 409) {
        // Usuario ya registrado, considerar como éxito
        return NextResponse.json({
          success: true,
          message: 'Usuario ya registrado en el sistema'
        });
      }

      return NextResponse.json(
        { error: 'Error del servidor backend' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Validar la estructura de la respuesta
    if (!data.success) {
      console.error('Respuesta inválida del backend:', data);
      return NextResponse.json(
        { error: 'Respuesta inválida del servidor' },
        { status: 500 }
      );
    }

    // Retornar la respuesta del backend
    return NextResponse.json({
      success: data.success,
      message: data.message || 'Usuario registrado exitosamente en el sistema',
      data: data.data
    });

  } catch (error) {
    console.error('Error en registro inicial:', error);

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
