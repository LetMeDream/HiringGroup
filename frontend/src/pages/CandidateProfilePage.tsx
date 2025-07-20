import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Plus, 
  Trash2, 
  Calendar,
  Building,
  Save,
  ArrowLeft
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { endpoints } from '@/constants/endpoints';

interface ExperienciaLaboral {
  id?: number;
  empresa: string;
  cargo: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface InformacionPersonal {
  id?: number;
  profesion: string;
  universidad: string;
  pais: string;
}

interface ProfileData {
  informacion_personal: InformacionPersonal[];
  experiencias: ExperienciaLaboral[];
}

const CandidateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [existingExperiences, setExistingExperiences] = useState<ExperienciaLaboral[]>([]);
  const [existingInfoPersonal, setExistingInfoPersonal] = useState<InformacionPersonal[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    informacion_personal: [],
    experiencias: []
  });

  // Load existing profile data when component mounts
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user) return;
      
      setLoadingProfile(true);
      try {
        const response = await axios.get(endpoints.base + `api/candidato-profile/${user.id}/`);
        const existingProfile = response.data;
        
        // Keep profile fields blank for user to fill out
        setProfileData({
          informacion_personal: [], // Start with empty array for new personal info
          experiencias: [] // Start with empty array for new experiences
        });
        
        // Store existing experiences separately to display them
        setExistingExperiences(existingProfile.experiencias || []);
      } catch (error) {
        console.log('No existing profile found or error loading profile:', error);
        // If no profile exists, keep default empty state
      }
      setLoadingProfile(false);
    };

    loadExistingProfile();
  }, [user]);

  const addInformacionPersonal = () => {
    setProfileData(prev => ({
      ...prev,
      informacion_personal: [
        ...prev.informacion_personal,
        {
          profesion: '',
          universidad: '',
          pais: ''
        }
      ]
    }));
  };

  const removeInformacionPersonal = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      informacion_personal: prev.informacion_personal.filter((_, i) => i !== index)
    }));
  };

  const updateInformacionPersonal = (index: number, field: keyof InformacionPersonal, value: string) => {
    setProfileData(prev => ({
      ...prev,
      informacion_personal: prev.informacion_personal.map((info, i) => 
        i === index ? { ...info, [field]: value } : info
      )
    }));
  };

  const addExperiencia = () => {
    setProfileData(prev => ({
      ...prev,
      experiencias: [
        ...prev.experiencias,
        {
          empresa: '',
          cargo: '',
          fecha_inicio: '',
          fecha_fin: ''
        }
      ]
    }));
  };

  const removeExperiencia = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      experiencias: prev.experiencias.filter((_, i) => i !== index)
    }));
  };

  const updateExperiencia = (index: number, field: keyof ExperienciaLaboral, value: string) => {
    setProfileData(prev => ({
      ...prev,
      experiencias: prev.experiencias.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Filtrar solo las nuevas experiencias válidas (que tengan empresa y cargo)
      const nuevasExperienciasValidas = profileData.experiencias.filter(
        exp => exp.empresa.trim() && exp.cargo.trim()
      );

      // Filtrar solo la nueva información personal válida
      const nuevaInfoPersonalValida = profileData.informacion_personal.filter(
        info => info.profesion.trim() && info.universidad.trim() && info.pais.trim()
      );

      // Crear/actualizar el perfil del candidato (mantener estructura básica)
      const profilePayload = {
        usuario_id: user.id,
        profesion: 'Múltiples profesiones', // Valor por defecto
        universidad: 'Múltiples universidades', // Valor por defecto
        pais: 'Múltiples países', // Valor por defecto
        experiencias: nuevasExperienciasValidas.map(exp => ({
          empresa: exp.empresa,
          cargo: exp.cargo,
          fecha_inicio: exp.fecha_inicio,
          fecha_fin: exp.fecha_fin || null
        }))
      };

      await axios.post(endpoints.base + 'api/candidato-profile/', profilePayload);

      // Guardar cada entrada de información personal por separado
      for (const info of nuevaInfoPersonalValida) {
        await axios.post(endpoints.base + 'api/informacion-personal/', {
          candidato_profile: user.id,
          profesion: info.profesion,
          universidad: info.universidad,
          pais: info.pais
        });
      }

      let mensaje = '¡Perfil actualizado exitosamente!';
      if (nuevaInfoPersonalValida.length > 0) {
        mensaje += ` Se agregaron ${nuevaInfoPersonalValida.length} nueva(s) entrada(s) de información personal.`;
      }
      if (nuevasExperienciasValidas.length > 0) {
        mensaje += ` Se agregaron ${nuevasExperienciasValidas.length} nueva(s) experiencia(s) laboral(es).`;
      }
      alert(mensaje);
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      alert(error.response?.data?.error || 'Error al actualizar el perfil');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Registro de Datos Importantes</h2>
            <p className="text-muted-foreground mt-1">
              Completa tu perfil profesional para mejorar tus oportunidades laborales
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal Múltiple */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Información Profesional</span>
                  </CardTitle>
                  <CardDescription>
                    Agrega múltiples entradas de tu información profesional
                  </CardDescription>
                </div>
                <Button type="button" onClick={addInformacionPersonal} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Información
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {profileData.informacion_personal.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No has agregado información profesional aún</p>
                  <p className="text-sm">Haz clic en "Agregar Información" para comenzar</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {profileData.informacion_personal.map((info, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Información {index + 1}</Badge>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeInformacionPersonal(index)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`profesion-${index}`}>Profesión *</Label>
                          <Input
                            id={`profesion-${index}`}
                            type="text"
                            placeholder="Ej: Ingeniero en Sistemas"
                            value={info.profesion}
                            onChange={(e) => updateInformacionPersonal(index, 'profesion', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`universidad-${index}`}>Universidad de Egreso *</Label>
                          <Input
                            id={`universidad-${index}`}
                            type="text"
                            placeholder="Ej: Universidad Central de Venezuela"
                            value={info.universidad}
                            onChange={(e) => updateInformacionPersonal(index, 'universidad', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`pais-${index}`}>País *</Label>
                          <Input
                            id={`pais-${index}`}
                            type="text"
                            placeholder="Ej: Venezuela"
                            value={info.pais}
                            onChange={(e) => updateInformacionPersonal(index, 'pais', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experiencias Laborales */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <span>Experiencias Laborales</span>
                  </CardTitle>
                  <CardDescription>
                    Agrega tus experiencias laborales previas
                  </CardDescription>
                </div>
                <Button type="button" onClick={addExperiencia} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Experiencia
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingProfile ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Cargando experiencias existentes...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Existing Experiences */}
                  {existingExperiences.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-4 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Experiencias Laborales Registradas ({existingExperiences.length})
                      </h4>
                      <div className="space-y-4">
                        {existingExperiences.map((experiencia, index) => (
                          <div key={`existing-${index}`} className="p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary">Registrada</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Empresa:</span> {experiencia.empresa}
                              </div>
                              <div>
                                <span className="font-medium">Cargo:</span> {experiencia.cargo}
                              </div>
                              <div>
                                <span className="font-medium">Inicio:</span> {experiencia.fecha_inicio}
                              </div>
                              <div>
                                <span className="font-medium">Fin:</span> {experiencia.fecha_fin || 'Actual'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* New Experiences Being Added */}
                  {profileData.experiencias.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-4 flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevas Experiencias a Agregar ({profileData.experiencias.length})
                      </h4>
                      <div className="space-y-6">
                        {profileData.experiencias.map((experiencia, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Experiencia {index + 1}</Badge>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeExperiencia(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`empresa-${index}`}>Empresa *</Label>
                          <Input
                            id={`empresa-${index}`}
                            type="text"
                            placeholder="Nombre de la empresa"
                            value={experiencia.empresa}
                            onChange={(e) => updateExperiencia(index, 'empresa', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`cargo-${index}`}>Cargo *</Label>
                          <Input
                            id={`cargo-${index}`}
                            type="text"
                            placeholder="Cargo ocupado"
                            value={experiencia.cargo}
                            onChange={(e) => updateExperiencia(index, 'cargo', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`fecha-inicio-${index}`}>Fecha de Inicio *</Label>
                          <Input
                            id={`fecha-inicio-${index}`}
                            type="date"
                            value={experiencia.fecha_inicio}
                            onChange={(e) => updateExperiencia(index, 'fecha_inicio', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`fecha-fin-${index}`}>Fecha de Finalización</Label>
                          <Input
                            id={`fecha-fin-${index}`}
                            type="date"
                            value={experiencia.fecha_fin}
                            onChange={(e) => updateExperiencia(index, 'fecha_fin', e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Deja vacío si aún trabajas aquí
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Message when no experiences at all */}
                  {existingExperiences.length === 0 && profileData.experiencias.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No tienes experiencias laborales registradas</p>
                      <p className="text-sm">Haz clic en "Agregar Experiencia" para agregar tu primera experiencia</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Perfil
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CandidateProfilePage;
