import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Briefcase, Plus, Trash2, Save, Edit } from 'lucide-react';
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
  profesion: string;
  universidad: string;
  pais: string;
}

const EditProfileDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    profesion: '',
    universidad: '',
    pais: ''
  });
  const [experiencias, setExperiencias] = useState<ExperienciaLaboral[]>([]);
  const [informacionPersonal, setInformacionPersonal] = useState<InformacionPersonal[]>([]);
  const [editingExperience, setEditingExperience] = useState<number | null>(null);
  const [editingInfoPersonal, setEditingInfoPersonal] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      loadExistingProfile();
    }
  }, [user]);

  const loadExistingProfile = async () => {
    try {
      setLoadingProfile(true);
      
      // Load candidate profile
      const profileResponse = await axios.get(endpoints.base + `api/candidato-profile/${user.id}/`);
      const existingProfile = profileResponse.data;
      
      setProfileData({
        profesion: existingProfile.profesion || '',
        universidad: existingProfile.universidad || '',
        pais: existingProfile.pais || ''
      });
      
      // Load existing experiences
      if (existingProfile.experiencias && existingProfile.experiencias.length > 0) {
        setExperiencias(existingProfile.experiencias);
      }
      
      // Load existing personal information
      try {
        const infoPersonalResponse = await axios.get(endpoints.base + `api/candidato-profile/${user.id}/informacion-personal/`);
        if (infoPersonalResponse.data && infoPersonalResponse.data.length > 0) {
          setInformacionPersonal(infoPersonalResponse.data);
        }
      } catch (infoError) {
        console.log('No existing personal information found');
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      // If profile doesn't exist, keep empty state
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const payload = {
        usuario_id: user.id,
        ...profileData
      };
      
      await axios.post(endpoints.base + 'api/candidato-profile/', payload);
      
      alert('Perfil actualizado exitosamente');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExperience = async (index: number) => {
    if (!user) return;
    
    try {
      const experiencia = experiencias[index];
      
      if (experiencia.id) {
        // Update existing experience
        await axios.put(endpoints.base + `api/experiencias/${experiencia.id}/update/`, experiencia);
      } else {
        // Create new experience
        const payload = {
          ...experiencia,
          candidato_profile: user.id
        };
        const response = await axios.post(endpoints.base + 'api/experiencias/', payload);
        
        // Update local state with the new ID
        const updatedExperiencias = [...experiencias];
        updatedExperiencias[index] = { ...experiencia, id: response.data.id };
        setExperiencias(updatedExperiencias);
      }
      
      setEditingExperience(null);
      alert('Experiencia guardada exitosamente');
      
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Error al guardar la experiencia');
    }
  };

  const handleDeleteExperience = async (index: number) => {
    if (!user) return;
    
    const experiencia = experiencias[index];
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
      try {
        if (experiencia.id) {
          await axios.delete(endpoints.base + `api/experiencias/${experiencia.id}/delete/`);
        }
        
        const updatedExperiencias = experiencias.filter((_, i) => i !== index);
        setExperiencias(updatedExperiencias);
        
        alert('Experiencia eliminada exitosamente');
        
      } catch (error) {
        console.error('Error deleting experience:', error);
        alert('Error al eliminar la experiencia');
      }
    }
  };

  const addNewExperience = () => {
    const newExperience: ExperienciaLaboral = {
      empresa: '',
      cargo: '',
      fecha_inicio: '',
      fecha_fin: ''
    };
    setExperiencias([...experiencias, newExperience]);
    setEditingExperience(experiencias.length);
  };

  const updateExperiencia = (index: number, field: keyof ExperienciaLaboral, value: string) => {
    const updatedExperiencias = [...experiencias];
    updatedExperiencias[index] = { ...updatedExperiencias[index], [field]: value };
    setExperiencias(updatedExperiencias);
  };

  // Funciones para manejar información personal
  const handleSaveInfoPersonal = async (index: number) => {
    if (!user) return;
    
    try {
      const info = informacionPersonal[index];
      
      if (info.id) {
        // Update existing personal info
        await axios.put(endpoints.base + `api/informacion-personal/${info.id}/update/`, info);
      } else {
        // Create new personal info
        const payload = {
          ...info,
          candidato_profile: user.id
        };
        const response = await axios.post(endpoints.base + 'api/informacion-personal/', payload);
        
        // Update local state with the new ID
        const updatedInfoPersonal = [...informacionPersonal];
        updatedInfoPersonal[index] = { ...info, id: response.data.id };
        setInformacionPersonal(updatedInfoPersonal);
      }
      
      setEditingInfoPersonal(null);
      alert('Información personal guardada exitosamente');
      
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('Error al guardar la información personal');
    }
  };

  const handleDeleteInfoPersonal = async (index: number) => {
    if (!user) return;
    
    const info = informacionPersonal[index];
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta información personal?')) {
      try {
        if (info.id) {
          await axios.delete(endpoints.base + `api/informacion-personal/${info.id}/delete/`);
        }
        
        const updatedInfoPersonal = informacionPersonal.filter((_, i) => i !== index);
        setInformacionPersonal(updatedInfoPersonal);
        
        alert('Información personal eliminada exitosamente');
        
      } catch (error) {
        console.error('Error deleting personal info:', error);
        alert('Error al eliminar la información personal');
      }
    }
  };

  const addNewInfoPersonal = () => {
    const newInfo: InformacionPersonal = {
      profesion: '',
      universidad: '',
      pais: ''
    };
    setInformacionPersonal([...informacionPersonal, newInfo]);
    setEditingInfoPersonal(informacionPersonal.length);
  };

  const updateInfoPersonal = (index: number, field: keyof InformacionPersonal, value: string) => {
    const updatedInfoPersonal = [...informacionPersonal];
    updatedInfoPersonal[index] = { ...updatedInfoPersonal[index], [field]: value };
    setInformacionPersonal(updatedInfoPersonal);
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Dashboard</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Mi Perfil</h1>
              <p className="text-gray-600">Modifica tu información profesional y experiencias</p>
            </div>
          </div>
        </div>

        {/* Multiple Personal Information */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Información Profesional</span>
                </CardTitle>
                <CardDescription>
                  Edita, agrega o elimina tu información profesional
                </CardDescription>
              </div>

            </div>
          </CardHeader>
          <CardContent>
            {informacionPersonal.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tienes información profesional registrada</p>
                <p className="text-sm">Haz clic en "Agregar Información" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-6">
                {informacionPersonal.map((info, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={editingInfoPersonal === index ? "default" : "outline"}>
                        {editingInfoPersonal === index ? "Editando" : `Información ${index + 1}`}
                      </Badge>
                      <div className="flex space-x-2">
                        {editingInfoPersonal === index ? (
                          <>
                            <Button size="sm" onClick={() => handleSaveInfoPersonal(index)}>
                              <Save className="w-4 h-4 mr-1" />
                              Guardar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingInfoPersonal(null)}>
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setEditingInfoPersonal(index)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteInfoPersonal(index)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {editingInfoPersonal === index ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`profesion-${index}`}>Profesión *</Label>
                          <Input
                            id={`profesion-${index}`}
                            type="text"
                            placeholder="Ej: Ingeniero en Sistemas"
                            value={info.profesion}
                            onChange={(e) => updateInfoPersonal(index, 'profesion', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`universidad-${index}`}>Universidad *</Label>
                          <Input
                            id={`universidad-${index}`}
                            type="text"
                            placeholder="Ej: Universidad Central de Venezuela"
                            value={info.universidad}
                            onChange={(e) => updateInfoPersonal(index, 'universidad', e.target.value)}
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
                            onChange={(e) => updateInfoPersonal(index, 'pais', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Profesión:</span> {info.profesion}
                        </div>
                        <div>
                          <span className="font-medium">Universidad:</span> {info.universidad}
                        </div>
                        <div>
                          <span className="font-medium">País:</span> {info.pais}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Experiences */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>Experiencias Laborales</span>
                </CardTitle>
                <CardDescription>
                  Edita, agrega o elimina tus experiencias laborales
                </CardDescription>
              </div>

            </div>
          </CardHeader>
          <CardContent>
            {experiencias.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tienes experiencias laborales registradas</p>
                <p className="text-sm">Haz clic en "Agregar Experiencia" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-6">
                {experiencias.map((experiencia, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={editingExperience === index ? "default" : "outline"}>
                        {editingExperience === index ? "Editando" : `Experiencia ${index + 1}`}
                      </Badge>
                      <div className="flex space-x-2">
                        {editingExperience === index ? (
                          <>
                            <Button size="sm" onClick={() => handleSaveExperience(index)}>
                              <Save className="w-4 h-4 mr-1" />
                              Guardar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingExperience(null)}>
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setEditingExperience(index)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteExperience(index)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {editingExperience === index ? (
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
                            placeholder="Tu cargo en la empresa"
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
                    ) : (
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
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfileDashboard;
