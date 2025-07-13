import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building, 
  Briefcase, 
  TrendingUp, 
  UserCheck, 
  FileText,
  Settings,
  Database
} from 'lucide-react';
import Layout from '@/components/Layout';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Usuarios',
      value: '1,245',
      icon: Users,
      change: '+12.5%',
      description: 'Usuarios activos en el sistema'
    },
    {
      title: 'Empresas Registradas',
      value: '87',
      icon: Building,
      change: '+3.2%',
      description: 'Empresas clientes activas'
    },
    {
      title: 'Ofertas Activas',
      value: '342',
      icon: Briefcase,
      change: '+8.1%',
      description: 'Ofertas laborales disponibles'
    },
    {
      title: 'Contrataciones del Mes',
      value: '45',
      icon: UserCheck,
      change: '+15.3%',
      description: 'Nuevas contrataciones'
    }
  ];

  const recentActivities = [
    { action: 'Nueva empresa registrada', company: 'TechCorp SA', time: '2 horas' },
    { action: 'Candidato contratado', company: 'InnovateLabs', time: '4 horas' },
    { action: 'Nueva oferta publicada', company: 'StartupXYZ', time: '6 horas' },
    { action: 'Usuario registrado', company: 'Candidato freelance', time: '8 horas' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Panel de Administración</h2>
            <p className="text-muted-foreground mt-1">
              Gestiona todo el sistema de Hiring Group desde aquí
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-gradient-primary">
              <FileText className="w-4 h-4" />
              <span>Generar Reporte</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Management */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-primary" />
                  <span>Gestión del Sistema</span>
                </CardTitle>
                <CardDescription>
                  Acciones administrativas principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="w-6 h-6 mb-2" />
                    <span>Gestionar Usuarios</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Building className="w-6 h-6 mb-2" />
                    <span>Gestionar Empresas</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Briefcase className="w-6 h-6 mb-2" />
                    <span>Ofertas Laborales</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <span>Reportes y Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.company}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Hace {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;