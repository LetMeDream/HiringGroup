import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, DollarSign, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { endpoints } from '@/constants/endpoints';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateDashboard from '@/components/dashboards/CandidateDashboard';

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

  useEffect(() => {
    // Aquí se hace la petición para obtener las ofertas creadas por empresas
    const fetchOfertas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(endpoints.base + 'api/ofertas/');
        console.log(res.data); // <-- Agrega esto para depurar
        setOfertas(res.data);
      } catch (error) {
        setOfertas([]);
      }
      setLoading(false);
    };

    fetchOfertas();
  }, []);

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
                            Publicada: {oferta.fecha_publicacion}
                          </span>
                        )}
                        <Badge className={oferta.activa ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                          {oferta.activa ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs">{oferta.descripcion}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                      <Button size="sm" className="mb-2">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalle
                      </Button>
                      <Button size="sm" variant="outline">
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
    </Layout>
  );
};

export default OfertasCandidateDashboard;