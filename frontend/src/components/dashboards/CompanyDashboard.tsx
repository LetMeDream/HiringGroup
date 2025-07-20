import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { endpoints } from '@/constants/endpoints';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

// Subcomponente: Modal para crear oferta laboral
const CreateOfferModal = ({ open, onOpenChange, onOfferCreated }) => {
  const form = useForm({
    defaultValues: {
      profesion: '',
      cargo: '',
      descripcion: '',
      salario: '',
      activa: true,
      estado: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const { empresa, user } = useAuth(); // Asegúrate de que esto devuelva un objeto con el id

  const onSubmit = async (values) => {
    setLoading(true);
    try {
        const data = { ...values, usuario: user.id }; // Asegúrate de que empresa.id exista
        const res = await axios.post(endpoints.base + 'api/ofertas/', data);
        setLoading(false);
        onOpenChange(false);
        form.reset();
        // Llamar al callback para actualizar la lista de ofertas
        if (onOfferCreated) {
          onOfferCreated();
        }
    } catch (e) {
        setLoading(false);
        // Manejo de error aquí
    }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nueva Oferta Laboral</DialogTitle>
          <DialogDescription>Completa los campos para publicar una nueva oferta.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="profesion" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Profesión</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Ingeniería de Software" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="cargo" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Desarrollador Full Stack" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="descripcion" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe la posición y requisitos..." {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="salario" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Salario</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="Ej: 45000" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="activa" control={form.control} render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel>Oferta Activa</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="estado" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abierta">Abierta</SelectItem>
                      <SelectItem value="Cerrada">Cerrada</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Oferta'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const CompanyDashboard: React.FC = () => {
  const { empresa, user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [stats, setStats] = useState({
    ofertas_activas: 0,
    total_postulaciones: 0,
    contrataciones: 0,
    vistas_estimadas: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Definir fetchOffers fuera de useEffect para poder llamarlo desde un botón
  const fetchOffers = async () => {
    setOffersLoading(true);
    try {
      const res = await axios.get(endpoints.base + `api/ofertas/${user.id}/`);
      setOffers(res.data);
    } catch (e) {
      // Manejo de error
    }
    setOffersLoading(false);
  };

  // Función para obtener estadísticas reales de la empresa
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await axios.get(endpoints.base + `api/empresas/${user.id}/stats/`);
      setStats(res.data);
    } catch (e) {
      console.error('Error al obtener estadísticas:', e);
      // Mantener valores por defecto en caso de error
    }
    setStatsLoading(false);
  };

  useEffect(() => {
    if (empresa) {
      fetchOffers();
      fetchStats();
    }
  }, [empresa]);

 
  // Función para manejar cuando se crea una nueva oferta
  const handleOfferCreated = (newOffer) => {
    setOffers((prev) => [newOffer, ...prev]);
    // También actualizar las estadísticas para reflejar la nueva oferta
    fetchStats();
  };

  // Función para cambiar el estado de una oferta
  const toggleOfferStatus = async (offerId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Abierta' ? 'Cerrada' : 'Abierta';
      
      // Primero obtener los datos actuales de la oferta
      const currentOffer = offers.find(offer => offer.id === offerId);
      if (!currentOffer) {
        console.error('Oferta no encontrada');
        return;
      }
      
      // Usar PUT con todos los datos de la oferta
      const response = await axios.put(endpoints.base + `api/ofertas/${offerId}/`, {
        ...currentOffer,
        estado: newStatus
      });
      
      // Actualizar la lista local de ofertas
      setOffers(prevOffers => 
        prevOffers.map(offer => 
          offer.id === offerId 
            ? { ...offer, estado: newStatus }
            : offer
        )
      );
    } catch (error) {
      console.error('Error al cambiar estado de la oferta:', error);
      // Si PUT tampoco funciona, intentar con POST a un endpoint específico
      try {
        const newStatus = currentStatus === 'Abierta' ? 'Cerrada' : 'Abierta';
        await axios.post(endpoints.base + `api/ofertas-viewset/${offerId}/toggle_estado/`, {
          estado: newStatus
        });
        
        // Actualizar la lista local de ofertas
        setOffers(prevOffers => 
          prevOffers.map(offer => 
            offer.id === offerId 
              ? { ...offer, estado: newStatus }
              : offer
          )
        );
      } catch (secondError) {
        console.error('Error en segundo intento:', secondError);
        alert('No se pudo cambiar el estado de la oferta. Verifique la configuración del API.');
      }
    }
  };

  const statsData = [
    {
      title: 'Ofertas Activas',
      value: statsLoading ? '...' : stats.ofertas_activas.toString(),
      icon: Briefcase,
      change: '+' + (stats.ofertas_activas > 0 ? Math.floor(stats.ofertas_activas * 0.2) : 0),
      description: 'Ofertas publicadas y disponibles'
    },
    {
      title: 'Candidatos Aplicados',
      value: statsLoading ? '...' : stats.total_postulaciones.toString(),
      icon: Users,
      change: '+' + (stats.total_postulaciones > 0 ? Math.floor(stats.total_postulaciones * 0.15) : 0),
      description: 'Total de aplicaciones recibidas'
    },
    {
      title: 'Vistas del Mes',
      value: statsLoading ? '...' : stats.vistas_estimadas.toLocaleString(),
      icon: Eye,
      change: '+' + (stats.vistas_estimadas > 0 ? Math.floor(stats.vistas_estimadas * 0.1) : 0),
      description: 'Visualizaciones de ofertas'
    },
    {
      title: 'Contrataciones',
      value: statsLoading ? '...' : stats.contrataciones.toString(),
      icon: CheckCircle,
      change: '+' + (stats.contrataciones > 0 ? Math.floor(stats.contrataciones * 0.25) : 0),
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
      <CreateOfferModal open={showCreateModal} onOpenChange={setShowCreateModal} onOfferCreated={() => { fetchOffers(); fetchStats(); }} />
      <div className="space-y-6">
        {/* <div className="flex justify-end">
          <Button variant="outline" onClick={fetchOffers}>
            Refrescar Ofertas
          </Button>
        </div> */}
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
            <Button className="flex items-center space-x-2 bg-gradient-primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              <span>Nueva Oferta</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
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
                <Button className="w-full justify-start" variant="outline" onClick={() => setShowCreateModal(true)}>
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
                  {offers.map((offer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-foreground">{offer.cargo || offer.title || 'Sin título'}</h3>
                          <Badge 
                            className={offer.activa || offer.status === 'active' 
                              ? 'bg-success text-success-foreground' 
                              : 'bg-muted text-muted-foreground'
                            }
                          >
                            {offer.activa || offer.status === 'active' ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>Profesión: {offer.profesion || 'No especificada'}</span>
                          <span>Salario: ${offer.salario || offer.salary || 'No especificado'}</span>
                          <div className="flex items-center space-x-2">
                            <span>Estado:</span>
                            <Badge 
                              className={offer.estado === 'Abierta' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                              }
                              variant="outline"
                            >
                              {offer.estado || 'Sin estado'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Configurar">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleOfferStatus(offer.id, offer.estado)}
                          className={offer.estado === 'Abierta' 
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          }
                          title={offer.estado === 'Abierta' ? 'Cerrar oferta' : 'Abrir oferta'}
                        >
                          {offer.estado === 'Abierta' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </Button>
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