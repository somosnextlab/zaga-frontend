'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, parseApiResponse } from '@/lib/api';
import { getUserRole } from '@/app/lib/utils/auth';
import { supabaseClient } from '@/lib/supabaseClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Prestamo {
  id: string;
  monto: number;
  fecha_creacion: string;
  estado: string;
  cliente_id?: string;
  cliente_nombre?: string;
  tasa_interes?: number;
  plazo_meses?: number;
}

interface PrestamosResponse {
  prestamos: Prestamo[];
  total: number;
}

export default function PrestamosPage() {
  const router = useRouter();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const supabase = supabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const role = getUserRole(user);
        setUserRole(role);
        const response = await apiGet('/prestamos');
        const data = await parseApiResponse<PrestamosResponse>(response);

        setPrestamos(data.prestamos || []);
      } catch (err) {
        console.error('Error loading prestamos:', err);
        setError(
          'Error al cargar los préstamos. Por favor, inténtalo de nuevo.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      const { supabaseClient } = await import('@/lib/supabaseClient');
      const supabase = supabaseClient();
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getEstadoBadge = (estado: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

    switch (estado.toLowerCase()) {
      case 'activo':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pendiente':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'finalizado':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'cancelado':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando préstamos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Préstamos</h1>
              <p className="mt-1 text-sm text-gray-500">
                {userRole === 'admin'
                  ? 'Vista de administrador - Todos los préstamos'
                  : 'Tus préstamos'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {userRole && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userRole === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {userRole === 'admin' ? 'Admin' : 'Cliente'}
                </span>
              )}
              <Button variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Préstamos</CardTitle>
            <CardDescription>
              {prestamos.length} préstamo{prestamos.length !== 1 ? 's' : ''}{' '}
              encontrado{prestamos.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prestamos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No se encontraron préstamos
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {userRole === 'admin'
                    ? 'No hay préstamos registrados en el sistema'
                    : 'No tienes préstamos registrados'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      {userRole === 'admin' && <TableHead>Cliente</TableHead>}
                      <TableHead>Tasa</TableHead>
                      <TableHead>Plazo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prestamos.map(prestamo => (
                      <TableRow key={prestamo.id}>
                        <TableCell className="font-mono text-sm">
                          {prestamo.id}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(prestamo.monto)}
                        </TableCell>
                        <TableCell>
                          {formatDate(prestamo.fecha_creacion)}
                        </TableCell>
                        <TableCell>
                          <span className={getEstadoBadge(prestamo.estado)}>
                            {prestamo.estado}
                          </span>
                        </TableCell>
                        {userRole === 'admin' && (
                          <TableCell>
                            {prestamo.cliente_nombre ||
                              prestamo.cliente_id ||
                              'N/A'}
                          </TableCell>
                        )}
                        <TableCell>
                          {prestamo.tasa_interes
                            ? `${prestamo.tasa_interes}%`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {prestamo.plazo_meses
                            ? `${prestamo.plazo_meses} meses`
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
