import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  FileText, 
  Briefcase, 
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Building
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { endpoints } from '@/constants/endpoints';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface Aplicacion {
  id: number;
  estado: string;
  fecha_postulacion: string;
  oferta: {
    id: number;
    cargo: string;
    profesion: string;
    descripcion: string;
    salario: number | string;
    empresa_nombre: string;
    ubicacion: string;
    fecha_publicacion: string;
  };
}

const MisAplicacionesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; aplicacion: Aplicacion | null }>({
    open: false,
    aplicacion: null
  });

  // Función para obtener las aplicaciones del usuario
  const fetchAplicaciones = async (): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get(endpoints.base + `api/usuarios/${user.id}/postulaciones/`);
      setAplicaciones(response.data || []);
    } catch (error) {
      console.error('Error al obtener aplicaciones:', error);
      setAplicaciones([]);
    }
    setLoading(false);
  };

  // Función para cancelar una aplicación
  const cancelarAplicacion = async (aplicacionId: number): Promise<void> => {
    try {
      await axios.delete(endpoints.base + `api/postulaciones/${aplicacionId}/`);
      
      // Actualizar la lista local removiendo la aplicación cancelada
      setAplicaciones(prev => prev.filter(app => app.id !== aplicacionId));
      
      // Cerrar el diálogo
      setCancelDialog({ open: false, aplicacion: null });
      
      alert('Aplicación cancelada exitosamente');
    } catch (error: any) {
      console.error('Error al cancelar aplicación:', error);
      alert(error.response?.data?.error || 'Error al cancelar la aplicación');
    }
  };

  // useEffect para cargar las aplicaciones al montar el componente
  useEffect(() => {
    if (user) {
      fetchAplicaciones();
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>;
      case 'revisado':
        return <Badge className="bg-blue-500 text-white">En Revisión</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-500 text-white">Rechazada</Badge>;
      case 'contratado':
        return <Badge className="bg-green-500 text-white">Contratado</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="w-4 h-4" />;
      case 'revisado':
        return <AlertCircle className="w-4 h-4" />;
      case 'rechazado':
        return <XCircle className="w-4 h-4" />;
      case 'contratado':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const openCancelDialog = (aplicacion: Aplicacion) => {
    setCancelDialog({ open: true, aplicacion });
  };

  const closeCancelDialog = () => {
    setCancelDialog({ open: false, aplicacion: null });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Mis Aplicaciones</h2>
              <p className="text-muted-foreground mt-1">
                Gestiona todas tus postulaciones y su estado actual
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{loading ? '...' : aplicaciones.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : aplicaciones.filter(app => app.estado === 'pendiente').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En Revisión</p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : aplicaciones.filter(app => app.estado === 'revisado').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contratado</p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : aplicaciones.filter(app => app.estado === 'contratado').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de aplicaciones */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span>Todas mis Aplicaciones</span>
            </CardTitle>
            <CardDescription>
              Historial completo de tus postulaciones con opciones de gestión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Cargando aplicaciones...</p>
                </div>
              ) : aplicaciones.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tienes aplicaciones aún</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/ofertas')}
                  >
                    Buscar Ofertas
                  </Button>
                </div>
              ) : (
                aplicaciones.map((app) => (
                  <div key={app.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getStatusIcon(app.estado)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-lg">
                              {app.oferta?.cargo || 'Cargo no especificado'}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Building className="w-4 h-4 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                {app.oferta?.empresa_nombre || 'Empresa no especificada'}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-6 mt-3 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>${app.oferta?.salario || 'No especificado'}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{app.oferta?.ubicacion || 'Ubicación no especificada'}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Aplicado: {formatDate(app.fecha_postulacion)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        {getStatusBadge(app.estado)}
                        {(app.estado === 'pendiente' || app.estado === 'revisado') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCancelDialog(app)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmación para cancelar aplicación */}
      <Dialog open={cancelDialog.open} onOpenChange={closeCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Aplicación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar tu aplicación para el puesto de{' '}
              <strong>{cancelDialog.aplicacion?.oferta?.cargo}</strong> en{' '}
              <strong>{cancelDialog.aplicacion?.oferta?.empresa_nombre}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. Si cancelas tu aplicación, tendrás que volver a postularte 
              si cambias de opinión.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={closeCancelDialog}>
                No, mantener aplicación
              </Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => {
                if (cancelDialog.aplicacion) {
                  cancelarAplicacion(cancelDialog.aplicacion.id);
                }
              }}
            >
              Sí, cancelar aplicación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MisAplicacionesDashboard;
