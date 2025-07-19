import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { endpoints } from '@/constants/endpoints';

interface EmpresaInfo {
  nombre: string;
  sector: string;
  persona_contacto: string;
  telefono_contacto: string;
  direccion: string;
}

interface ContratacionOnboardingModalProps {
  open: boolean;
  onClose: () => void;
  empresa: EmpresaInfo;
  postulacionId: number; // ID de la postulación contratada
  onSuccess: () => void; // callback para refrescar dashboard o cerrar modal
}

const tiempos = [
  { value: "1 mes", label: "1 Mes" },
  { value: "6 meses", label: "6 Meses" },
  { value: "1 año", label: "1 Año" },
  { value: "indefinido", label: "Indefinido" },
];

export const ContratacionOnboardingModal: React.FC<ContratacionOnboardingModalProps> = ({
  open, onClose, empresa, postulacionId, onSuccess
}) => {
  const [form, setForm] = useState({
    tiempo_contratacion: "",
    salario_mensual: "",
    tipo_sangre: "",
    contacto_emergencia: "",
    telefono_emergencia: "",
    banco: "",
    numero_cuenta: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(endpoints.base +  `/api/contrataciones/`, // Ajusta si tu endpoint es diferente
        {
          postulacion: postulacionId,
          ...form,
        }
      );
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      alert("Error al guardar los datos de contratación");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¡Felicidades, has sido contratado!</DialogTitle>
          <DialogDescription>
            Has sido contratado por <b>{empresa.nombre}</b>. Por favor, completa la siguiente información para formalizar tu contratación.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <div><b>Empresa:</b> {empresa.nombre}</div>
          <div><b>Sector:</b> {empresa.sector}</div>
          <div><b>Contacto:</b> {empresa.persona_contacto} ({empresa.telefono_contacto})</div>
          <div><b>Dirección:</b> {empresa.direccion}</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label>Tiempo de Contratación</label>
            <select
              name="tiempo_contratacion"
              value={form.tiempo_contratacion}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecciona...</option>
              {tiempos.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Salario Mensual</label>
            <Input
              name="salario_mensual"
              type="number"
              value={form.salario_mensual}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Tipo de Sangre</label>
            <Input
              name="tipo_sangre"
              value={form.tipo_sangre}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Contacto de Emergencia</label>
            <Input
              name="contacto_emergencia"
              value={form.contacto_emergencia}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Teléfono de Emergencia</label>
            <Input
              name="telefono_emergencia"
              value={form.telefono_emergencia}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Banco</label>
            <Input
              name="banco"
              value={form.banco}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Número de Cuenta</label>
            <Input
              name="numero_cuenta"
              value={form.numero_cuenta}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar y continuar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};