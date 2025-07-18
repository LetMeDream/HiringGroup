import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import axios from 'axios';
import { endpoints } from '@/constants/endpoints';

interface Oferta {
  id: number;
  cargo: string;
  empresa_nombre: string;
}

interface Postulacion {
  id: number;
  postulante_nombre: string;
  postulante_email: string;
  estado: string;
  fecha_postulacion: string;
}

const ContratacionesOnHiringDashboard: React.FC = () => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Traer todas las ofertas
    const fetchOfertas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(endpoints.base + 'api/ofertas/');
        setOfertas(res.data);
      } catch {
        setOfertas([]);
      }
      setLoading(false);
    };
    fetchOfertas();
  }, []);

  const handleVerPostulaciones = async (oferta: Oferta) => {
    setSelectedOferta(oferta);
    setLoading(true);
    try {
      const res = await axios.get(endpoints.base + `api/ofertas/${oferta.id}/postulaciones/`);
      setPostulaciones(res.data);
    } catch {
      setPostulaciones([]);
    }
    setLoading(false);
  };

  const handleContratar = async (postulacionId: number) => {
    if (!window.confirm('¿Seguro que deseas contratar a este candidato?')) return;
    try {
      await axios.post(endpoints.base + `api/postulaciones/${postulacionId}/contratar/`);
      alert('Candidato contratado y oferta cerrada.');
      // Refresca postulaciones y ofertas
      setSelectedOferta(null);
      // Opcional: puedes volver a cargar las ofertas aquí
    } catch (e) {
      alert('Error al contratar');
    }
  };

  const handleRechazar = async (postulacionId: number) => {
    if (!window.confirm('¿Seguro que deseas rechazar a este candidato?')) return;
    try {
      await axios.post(endpoints.base + `api/postulaciones/${postulacionId}/rechazar/`);
      alert('Candidato rechazado.');
      // Refresca postulaciones
      if (selectedOferta) handleVerPostulaciones(selectedOferta);
    } catch (e) {
      alert('Error al rechazar');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ofertas Publicadas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div>Cargando...</div>}
            {!selectedOferta ? (
              <div className="space-y-2">
                {ofertas.map(oferta => (
                  <div key={oferta.id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <span className="font-semibold">{oferta.cargo}</span> - {oferta.empresa_nombre}
                    </div>
                    <Button size="sm" onClick={() => handleVerPostulaciones(oferta)}>
                      Ver postulados
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <Button variant="outline" size="sm" onClick={() => setSelectedOferta(null)}>
                  Volver a ofertas
                </Button>
                <h3 className="mt-4 mb-2 font-bold">Postulados para: {selectedOferta.cargo}</h3>
                {postulaciones.length === 0 ? (
                  <div>No hay postulados para esta oferta.</div>
                ) : (
                  <ul>
                    {postulaciones.map(post => (
                      <li key={post.id} className="border-b py-2">
                        <div><b>Nombre:</b> {post.postulante_nombre}</div>
                        <div><b>Email:</b> {post.postulante_email}</div>
                        <div><b>Estado:</b> {post.estado}</div>
                        <div><b>Fecha:</b> {post.fecha_postulacion}</div>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" onClick={() => handleContratar(post.id)}>
                            Contratar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRechazar(post.id)}>
                            Rechazar
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ContratacionesOnHiringDashboard;