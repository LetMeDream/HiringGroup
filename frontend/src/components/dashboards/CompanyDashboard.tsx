import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  Eye, 
  Plus, 
  Settings,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Layout from '@/components/Layout';

const CompanyDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Ofertas Activas',
      value: '12',
      icon: Briefcase,
      change: '+3',
      description: 'Ofertas publicadas y disponibles'
    },
    {
      title: 'Candidatos Aplicados',
      value: '186',
      icon: Users,
      change: '+24',
      description: 'Total de aplicaciones recibidas'
    },
    {
      title: 'Vistas del Mes',
      value: '1,247',
      icon: Eye,
      change: '+156',
      description: 'Visualizaciones de ofertas'
    },
    {
      title: 'Contrataciones',
      value: '8',
      icon: CheckCircle,
      change: '+2',
      description: 'Candidatos contratados'
    }
  ];

  const recentOffers = [
    { 
      title: 'Desarrollador Full Stack',
      salary: '$45,000',
      applications: 23,
      status: 'active',
      published: '3 días'
    },
    { 
      title: 'Diseñador UX/UI',
      salary: '$38,000',
      applications: 15,
      status: 'active',
      published: '1 semana'
    },
    { 
      title: 'Project Manager',
      salary: '$52,000',
      applications: 31,
      status: 'inactive',
      published: '2 semanas'
    },
    { 
      title: 'Analista de Datos',
      salary: '$42,000',
      applications: 19,
      status: 'active',
      published: '5 días'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Panel de Empresa</h2>
            <p className="text-muted-foreground mt-1">
              Gestiona tus ofertas laborales y candidatos
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-gradient-primary">
              <Plus className="w-4 h-4" />
              <span>Nueva Oferta</span>
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
                    +{stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span>Acciones Rápidas</span>
              </CardTitle>
              <CardDescription>
                Gestión de ofertas laborales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nueva Oferta
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Candidatos
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Estadísticas
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Job Offers */}
          <div className="lg:col-span-2">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Mis Ofertas Laborales</CardTitle>
                <CardDescription>
                  Estado actual de tus ofertas publicadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOffers.map((offer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-foreground">{offer.title}</h3>
                          <Badge 
                            className={offer.status === 'active' 
                              ? 'bg-success text-success-foreground' 
                              : 'bg-muted text-muted-foreground'
                            }
                          >
                            {offer.status === 'active' ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>Salario: {offer.salary}</span>
                          <span>Aplicaciones: {offer.applications}</span>
                          <span>Publicada hace {offer.published}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        {offer.status === 'active' ? (
                          <Button variant="outline" size="sm">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Ver Todas las Ofertas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDashboard;