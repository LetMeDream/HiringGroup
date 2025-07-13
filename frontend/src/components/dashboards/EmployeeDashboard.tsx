import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  FileText, 
  Eye, 
  Download, 
  Calendar,
  Building,
  User,
  Clock,
  TrendingUp
} from 'lucide-react';
import Layout from '@/components/Layout';

const EmployeeDashboard: React.FC = () => {
  const employeeInfo = {
    employeeId: 'EMP-2023-0145',
    position: 'Desarrollador Full Stack',
    company: 'TechCorp SA',
    startDate: '2023-06-15',
    contractType: 'Indefinido',
    monthlySalary: 42000
  };

  const stats = [
    {
      title: 'Salario Mensual',
      value: `$${employeeInfo.monthlySalary.toLocaleString()}`,
      icon: DollarSign,
      change: '+5.2%',
      description: 'Salario actual'
    },
    {
      title: 'Recibos Disponibles',
      value: '12',
      icon: FileText,
      change: '+1',
      description: 'Recibos de pago'
    },
    {
      title: 'Días Trabajados',
      value: '156',
      icon: Calendar,
      change: '+20',
      description: 'Este año'
    },
    {
      title: 'Tiempo en Empresa',
      value: '6 meses',
      icon: Clock,
      change: '',
      description: 'Desde el ingreso'
    }
  ];

  const paySlips = [
    { 
      month: 'Diciembre 2023',
      grossSalary: 42000,
      inces: 210,
      ivss: 420,
      netSalary: 41370,
      date: '2023-12-30'
    },
    { 
      month: 'Noviembre 2023',
      grossSalary: 42000,
      inces: 210,
      ivss: 420,
      netSalary: 41370,
      date: '2023-11-30'
    },
    { 
      month: 'Octubre 2023',
      grossSalary: 42000,
      inces: 210,
      ivss: 420,
      netSalary: 41370,
      date: '2023-10-31'
    }
  ];

  const availableActions = [
    {
      title: 'Ver Recibos de Pago',
      description: 'Consulta todos tus recibos',
      icon: FileText,
      action: 'view-payslips'
    },
    {
      title: 'Solicitar Constancia',
      description: 'Constancia de trabajo',
      icon: Download,
      action: 'work-certificate'
    },
    {
      title: 'Ver Ofertas Laborales',
      description: 'Solo visualización',
      icon: Eye,
      action: 'view-jobs'
    },
    {
      title: 'Información Personal',
      description: 'Datos de contacto',
      icon: User,
      action: 'personal-info'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Panel de Empleado</h2>
            <p className="text-muted-foreground mt-1">
              Gestiona tus recibos de pago y consulta información laboral
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Constancia</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-gradient-primary">
              <FileText className="w-4 h-4" />
              <span>Ver Recibos</span>
            </Button>
          </div>
        </div>

        {/* Employee Info Card */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-primary" />
              <span>Información Laboral</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID Empleado</p>
                <p className="text-lg font-semibold text-foreground">{employeeInfo.employeeId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cargo</p>
                <p className="text-lg font-semibold text-foreground">{employeeInfo.position}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                <p className="text-lg font-semibold text-foreground">{employeeInfo.company}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Ingreso</p>
                <p className="text-lg font-semibold text-foreground">{employeeInfo.startDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de Contrato</p>
                <p className="text-lg font-semibold text-foreground">{employeeInfo.contractType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Salario</p>
                <p className="text-lg font-semibold text-foreground">
                  ${employeeInfo.monthlySalary.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                {stat.change && (
                  <div className="mt-3">
                    <Badge variant="outline" className="text-success">
                      {stat.change}
                    </Badge>
                  </div>
                )}
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
                <User className="w-5 h-5 text-primary" />
                <span>Acciones Disponibles</span>
              </CardTitle>
              <CardDescription>
                Funciones para empleados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableActions.map((action, index) => (
                  <Button key={index} variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-5 h-5 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Pay Slips */}
          <div className="lg:col-span-2">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Recibos de Pago Recientes</span>
                </CardTitle>
                <CardDescription>
                  Tus últimos recibos de pago disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paySlips.map((slip, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{slip.month}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Salario Bruto</p>
                              <p className="font-medium">${slip.grossSalary.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">INCES (0.5%)</p>
                              <p className="font-medium text-destructive">-${slip.inces}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">IVSS (1%)</p>
                              <p className="font-medium text-destructive">-${slip.ivss}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Salario Neto</p>
                              <p className="font-medium text-success">${slip.netSalary.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Ver Todos los Recibos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notice */}
        <Card className="shadow-card border-0 bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-foreground">
                  <strong>Nota:</strong> Como empleado contratado, puedes visualizar ofertas laborales pero no puedes aplicar a nuevas posiciones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;