import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Briefcase, MapPin, DollarSign, Eye, Calendar, Building, FileText } from 'lucide-react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { endpoints } from '@/constants/endpoints';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateDashboard from '@/components/dashboards/CandidateDashboard';
import { useAuth } from '@/contexts/AuthContext';

interface OfertaEmpresa {
  id: number;
  profesion: string;
  cargo: string;
  descripcion: string;
  salario: number | string;
  activa: boolean;
  estado: string;
  empresa_nombre?: string;
  ubicacion?: string;
  fecha_publicacion?: string;
}

const OfertasCandidateDashboard: React.FC = () => {
  const [ofertas, setOfertas] = useState<OfertaEmpresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOferta, setSelectedOferta] = useState<OfertaEmpresa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // Función para obtener las ofertas y las postulaciones del usuario
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Obtener todas las ofertas
        const ofertasRes = await axios.get(endpoints.base + endpoints.ofertasTodas);
        
        // Obtener las postulaciones del usuario actual
        const postulacionesRes = await axios.get(endpoints.base + `api/usuarios/${user.id}/postulaciones/`);
        
        const todasOfertas = ofertasRes.data || [];
        const misPostulaciones = postulacionesRes.data || [];
        
        // Obtener IDs de ofertas a las que ya se postuló
        const ofertasPostuladas = misPostulaciones.map((postulacion: any) => postulacion.oferta?.id).filter(Boolean);
        
        // Filtrar ofertas: mostrar solo las que NO están en las postulaciones del usuario
        const ofertasDisponibles = todasOfertas.filter((oferta: OfertaEmpresa) => 
          !ofertasPostuladas.includes(oferta.id)
        );
        
        setOfertas(ofertasDisponibles);
        setMyApplications(misPostulaciones);
        
        console.log('Ofertas disponibles (sin postular):', ofertasDisponibles);
        console.log('Mis postulaciones:', misPostulaciones);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setOfertas([]);
        setMyApplications([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handlePostularme = async (ofertaId: number) => {
    const email = user.email

    try {
      await axios.post(
        endpoints.base + 'api/postular/',
        { oferta_id: ofertaId, email }
      );
      alert('¡Te has postulado exitosamente!');
      
      // Refrescar la lista de ofertas para ocultar la oferta a la que se acaba de postular
      if (user) {
        try {
          // Obtener todas las ofertas
          const ofertasRes = await axios.get(endpoints.base + endpoints.ofertasTodas);
          
          // Obtener las postulaciones actualizadas del usuario
          const postulacionesRes = await axios.get(endpoints.base + `api/usuarios/${user.id}/postulaciones/`);
          
          const todasOfertas = ofertasRes.data || [];
          const misPostulaciones = postulacionesRes.data || [];
          
          // Obtener IDs de ofertas a las que ya se postuló
          const ofertasPostuladas = misPostulaciones.map((postulacion: any) => postulacion.oferta?.id).filter(Boolean);
          
          // Filtrar ofertas: mostrar solo las que NO están en las postulaciones del usuario
          const ofertasDisponibles = todasOfertas.filter((oferta: OfertaEmpresa) => 
            !ofertasPostuladas.includes(oferta.id)
          );
          
          setOfertas(ofertasDisponibles);
          setMyApplications(misPostulaciones);
        } catch (refreshError) {
          console.error('Error al refrescar ofertas:', refreshError);
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al postularte');
    }
  };

  const handleVerDetalle = (oferta: OfertaEmpresa) => {
    setSelectedOferta(oferta);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOferta(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (error) {
      return dateString; // Return original if formatting fails
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Ofertas de Empresas</h2>
            <p className="text-muted-foreground mt-1">
              Visualiza y postúlate a las ofertas creadas por empresas registradas
            </p>
          </div>
        </div>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span>Ofertas Disponibles</span>
            </CardTitle>
            <CardDescription>
              Todas las ofertas publicadas por empresas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando ofertas...</div>
            ) : ofertas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay ofertas disponibles en este momento.
              </div>
            ) : (
              <div className="space-y-4">
                {ofertas.map((oferta) => (
                  <div key={oferta.id} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{oferta.cargo}</h3>
                      <p className="text-sm text-muted-foreground">{oferta.empresa_nombre || 'Empresa'}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {oferta.salario}
                        </span>
                        {oferta.ubicacion && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {oferta.ubicacion}
                          </span>
                        )}
                        {oferta.fecha_publicacion && (
                          <span>
                            Publicada: {formatDate(oferta.fecha_publicacion)}
                          </span>
                        )}
                        <Badge className={oferta.activa ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                          {oferta.activa ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs">{oferta.descripcion}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                      <Button size="sm" className="mb-2" onClick={() => handleVerDetalle(oferta)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalle
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePostularme(oferta.id)}
                      >
                        Postularme
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal para mostrar detalles de la oferta */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span>{selectedOferta?.cargo}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedOferta?.empresa_nombre || 'Empresa'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOferta && (
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Salario:</span>
                    <span className="text-sm">${selectedOferta.salario}</span>
                  </div>
                  
                  {selectedOferta.ubicacion && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Ubicación:</span>
                      <span className="text-sm">{selectedOferta.ubicacion}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Profesión:</span>
                    <span className="text-sm">{selectedOferta.profesion}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {selectedOferta.fecha_publicacion && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Publicada:</span>
                      <span className="text-sm">{formatDate(selectedOferta.fecha_publicacion)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge className={selectedOferta.activa ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                      {selectedOferta.activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Descripción */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Descripción del puesto:</span>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedOferta.descripcion || 'No hay descripción disponible.'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={closeModal}>
                Cerrar
              </Button>
            </DialogClose>
            {selectedOferta && (
              <Button 
                onClick={() => {
                  handlePostularme(selectedOferta.id);
                  closeModal();
                }}
                className="bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                Postularme
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default OfertasCandidateDashboard;