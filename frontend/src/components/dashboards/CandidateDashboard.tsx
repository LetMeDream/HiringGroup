import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Briefcase, 
  User, 
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { endpoints } from '@/constants/endpoints';

const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estado para las postulaciones reales
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState<boolean>(true);

  // Calcular estadísticas reales basadas en las postulaciones
  const calculateStats = () => {
    const totalApplications = myApplications.length;
    const pendingApplications = myApplications.filter(app => app.estado === 'pendiente').length;
    const reviewedApplications = myApplications.filter(app => app.estado === 'revisado').length;
    const hiredApplications = myApplications.filter(app => app.estado === 'contratado').length;
    
    return [
      {
        title: 'Aplicaciones Enviadas',
        value: applicationsLoading ? '...' : totalApplications.toString(),
        icon: FileText,
        change: '+' + Math.max(0, Math.floor(totalApplications * 0.2)),
        description: 'Total de postulaciones'
      },
      {
        title: 'En Revisión',
        value: applicationsLoading ? '...' : reviewedApplications.toString(),
        icon: Briefcase,
        change: '+' + Math.max(0, Math.floor(reviewedApplications * 0.5)),
        description: 'Aplicaciones siendo evaluadas'
      },
      {
        title: 'Contrataciones',
        value: applicationsLoading ? '...' : hiredApplications.toString(),
        icon: User,
        change: '+' + hiredApplications,
        description: 'Ofertas exitosas'
      },
      {
        title: 'Respuestas Pendientes',
        value: applicationsLoading ? '...' : pendingApplications.toString(),
        icon: Clock,
        change: pendingApplications > 0 ? '+' + pendingApplications : '0',
        description: 'Aplicaciones en espera'
      }
    ];
  };

  const stats = calculateStats();

  // Función para obtener las postulaciones reales del candidato
  const fetchMyApplications = async (): Promise<void> => {
    if (!user) return;
    
    setApplicationsLoading(true);
    try {
      const response = await axios.get(endpoints.base + `api/usuarios/${user.id}/postulaciones/`);
      setMyApplications(response.data || []);
    } catch (error) {
      console.error('Error al obtener postulaciones:', error);
      // Mantener array vacío en caso de error
      setMyApplications([]);
    }
    setApplicationsLoading(false);
  };

  // useEffect para cargar las postulaciones al montar el componente
  useEffect(() => {
    if (user) {
      fetchMyApplications();
    }
  }, [user]);

  const recommendedJobs = [
    {
      company: 'DataCorp',
      position: 'Analista de Datos',
      salary: '$40,000',
      location: 'Caracas',
      posted: '2 días',
      match: '95%'
    },
    {
      company: 'CloudTech',
      position: 'DevOps Engineer',
      salary: '$48,000',
      location: 'Valencia',
      posted: '1 semana',
      match: '88%'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Badge className="bg-warning text-warning-foreground">Pendiente</Badge>;
      case 'revisado':
        return <Badge className="bg-primary text-primary-foreground">En Revisión</Badge>;
      case 'rechazado':
        return <Badge className="bg-destructive text-destructive-foreground">Rechazada</Badge>;
      case 'contratado':
        return <Badge className="bg-success text-success-foreground">Contratado</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">{status || 'Pendiente'}</Badge>;
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Mi Panel de Candidato</h2>
            <p className="text-muted-foreground mt-1">
              Busca ofertas, gestiona aplicaciones y actualiza tu perfil
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Editar Perfil</span>
            </Button>
            <Button
              className="flex items-center space-x-2 bg-gradient-primary"
              onClick={() => navigate('/ofertas')}
            >
              <Search className="w-4 h-4" />
              <span>Buscar Ofertas</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="outline" className="text-success">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Applications */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Mis Aplicaciones</span>
              </CardTitle>
              <CardDescription>
                Estado de tus postulaciones recientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Cargando postulaciones...</p>
                  </div>
                ) : myApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tienes postulaciones aún</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/ofertas')}
                    >
                      Buscar Ofertas
                    </Button>
                  </div>
                ) : (
                  myApplications.map((app, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{app.oferta?.cargo || 'Cargo no especificado'}</h3>
                          <p className="text-sm text-muted-foreground">{app.oferta?.empresa_nombre || 'Empresa no especificada'}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ${app.oferta?.salario || 'No especificado'}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {app.oferta?.ubicacion || 'Ubicación no especificada'}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(app.fecha_postulacion)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(app.estado)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">
                  Ver Todas las Aplicaciones
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Jobs & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>Acciones Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col">
                    <Search className="w-5 h-5 mb-1" />
                    <span className="text-xs">Buscar Ofertas</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <User className="w-5 h-5 mb-1" />
                    <span className="text-xs">Editar CV</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-xs">Mis Aplicaciones</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <AlertCircle className="w-5 h-5 mb-1" />
                    <span className="text-xs">Alertas</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Ofertas Recomendadas</CardTitle>
                <CardDescription>
                  Basadas en tu perfil y experiencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedJobs.map((job, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{job.position}</h4>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                            <span>{job.salary}</span>
                            <span>{job.location}</span>
                            <span>Hace {job.posted}</span>
                          </div>
                        </div>
                        <div className="ml-2 text-right">
                          <Badge className="bg-success text-success-foreground mb-2">
                            {job.match}
                          </Badge>
                          <Button size="sm" className="block">
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateDashboard;