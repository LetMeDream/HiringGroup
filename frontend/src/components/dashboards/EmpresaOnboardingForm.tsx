import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import * as z from 'zod';

const empresaSchema = z.object({
  sector: z.string().min(2, 'El sector es requerido'),
  nombre: z.string().min(2, 'El nombre es requerido'),
  direccion: z.string().min(2, 'La dirección es requerida'),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

interface Props {
  onSubmit: (data: EmpresaFormData) => void;
  loading?: boolean;
}

const EmpresaOnboardingForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema)
  });

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">🏢</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Completa los datos de tu empresa
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Ingresa la información básica para continuar
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input id="sector" type="text" placeholder="Sector de la empresa" {...register('sector')} className={errors.sector ? 'border-destructive' : ''} />
                {errors.sector && <p className="text-sm text-destructive">{errors.sector.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" type="text" placeholder="Nombre de la empresa" {...register('nombre')} className={errors.nombre ? 'border-destructive' : ''} />
                {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" type="text" placeholder="Dirección de la empresa" {...register('direccion')} className={errors.direccion ? 'border-destructive' : ''} />
                {errors.direccion && <p className="text-sm text-destructive">{errors.direccion.message}</p>}
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar y Continuar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresaOnboardingForm;
