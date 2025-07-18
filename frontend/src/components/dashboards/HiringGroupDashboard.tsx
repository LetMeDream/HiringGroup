import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  UserCheck, 
  DollarSign, 
  FileText, 
  UserPlus,
  Calculator,
  TrendingUp,
  Users
} from 'lucide-react';
import Layout from '@/components/Layout';
import EmpresaOnboardingForm from './EmpresaOnboardingForm';
import { endpoints } from '@/constants/endpoints';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useStore } from '@/store/store';

const HiringGroupDashboard: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [loading, setLoading] = useState(false) 
  const { setEmpresa, user } = useAuth()
  const { usuarioEmpresa } = useStore();
  
  const stats = [
    {
      title: 'Empresas Gestionadas',
      value: '87',
      icon: Building,
      change: '+5.2%',
      description: 'Empresas clientes activas'
    },
    {
      title: 'Contrataciones Mes',
      value: '45',
      icon: UserCheck,
      change: '+12.8%',
      description: 'Nuevas contrataciones realizadas'
    },
    {
      title: 'Ingresos Generados',
      value: '$24,500',
      icon: DollarSign,
      change: '+8.3%',
      description: 'Comisiones del mes actual'
    },
    {
      title: 'Nóminas Procesadas',
      value: '23',
      icon: FileText,
      change: '+2.1%',
      description: 'Nóminas del mes'
    }
  ];

  const pendingTasks = [
    { task: 'Procesar nómina de TechCorp SA', priority: 'high', deadline: 'Hoy' },
    { task: 'Revisar contratación en InnovateLabs', priority: 'medium', deadline: '2 días' },
    { task: 'Crear perfil empresa StartupXYZ', priority: 'medium', deadline: '3 días' },
    { task: 'Generar reporte mensual', priority: 'low', deadline: '1 semana' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const showOnboardingForm = () => {
    setShowOnboarding(true);
  }

   // Simulación de guardado, reemplazar con llamada real a API
  const handleEmpresaSubmit = async (data: { sector: string; nombre: string; direccion: string }) => {
    setLoading(true);
    const fullUrl = endpoints.base + endpoints.completarEmpresa(usuarioEmpresa.id);
    try {
      const res = await axios.patch(fullUrl, data);
      if (res.status === 200 && res.data) {
        setTimeout(() => {
          setLoading(false);
          setShowOnboarding(false);
          setEmpresa(res.data.nombre);
        }, 500);
      } else {
        setLoading(false);
        console.error('Error al crear la empresa:', res);
      }
    } catch (error) {
      console.error('Error en la petición de empresa:', error);
      setTimeout(() => setLoading(false), 250);
    }
  };


  if (showOnboarding) {
    return <EmpresaOnboardingForm onSubmitEmpresa={handleEmpresaSubmit} loading={loading} />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Hiring Group Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              Gestiona empresas, contrataciones y nóminas
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Procesar Nómina</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-gradient-primary" onClick={showOnboardingForm}>
              <UserPlus className="w-4 h-4" />
              <span>Nueva Empresa</span>
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
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Gestión Principal</span>
                </CardTitle>
                <CardDescription>
                  Funciones principales de Hiring Group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Building className="w-6 h-6 mb-2" />
                    <span>Perfil de Empresas</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <UserCheck className="w-6 h-6 mb-2" />
                    <span>Contrataciones</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calculator className="w-6 h-6 mb-2" />
                    <span>Nómina Mensual</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <span>Reportes</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    <span>Corrida de Nómina</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DollarSign className="w-6 h-6 mb-2" />
                    <span>Data Básica</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Tasks */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Tareas Pendientes</CardTitle>
              <CardDescription>
                Actividades que requieren atención
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.task}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority === 'high' ? 'Alta' : 
                           item.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {item.deadline}
                        </p>
                      </div>
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

export default HiringGroupDashboard;