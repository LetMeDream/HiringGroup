
import React, { useState } from 'react';
import classNames from 'classnames';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import * as z from 'zod';

// Paso 1: Schema para datos de usuario

const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password2: z.string().min(6, 'Repite la contraseña'),
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  telefono: z.string().min(6, 'El teléfono es requerido'),
  role: z.enum(['ADMIN', 'HIRING_GROUP', 'EMPRESA', 'POSTULANTE', 'CONTRATADO'])
}).refine((data) => data.password === data.password2, {
  message: 'Las contraseñas no coinciden',
  path: ['password2'],
});

type UserFormData = z.infer<typeof userSchema>;

// Paso 2: Schema para datos de empresa
const empresaSchema = z.object({
  sector: z.string().min(2, 'El sector es requerido'),
  nombre: z.string().min(2, 'El nombre es requerido'),
  direccion: z.string().min(2, 'La dirección es requerida'),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

interface Props {
  onSubmit: (data: UserFormData & EmpresaFormData) => void;
  loading?: boolean;
}

// Stepper visual
const Stepper: React.FC<{ step: number; canGoStep2: boolean; setStep: (s: number) => void }> = ({ step, canGoStep2, setStep }) => (
  <div className="flex justify-center mb-6">
    <div className="flex items-center gap-4">
      <button
        type="button"
        className={classNames('flex flex-col items-center focus:outline-none', {
          'text-primary font-bold': step === 1,
          'text-muted-foreground': step !== 1
        })}
        onClick={() => setStep(1)}
        disabled={step === 1}
        aria-current={step === 1 ? 'step' : undefined}
      >
        <span className={classNames('w-8 h-8 flex items-center justify-center rounded-full border-2', {
          'border-primary bg-primary text-white': step === 1,
          'border-muted-foreground bg-background': step !== 1
        })}>1</span>
        <span className="mt-1 text-xs">Cuenta</span>
      </button>
      <span className="w-8 h-0.5 bg-muted-foreground rounded-full" />
      <button
        type="button"
        className={classNames('flex flex-col items-center focus:outline-none', {
          'text-primary font-bold': step === 2,
          'text-muted-foreground': step !== 2,
          'opacity-50 cursor-not-allowed': !canGoStep2
        })}
        onClick={() => canGoStep2 && setStep(2)}
        aria-current={step === 2 ? 'step' : undefined}
      >
        <span className={classNames('w-8 h-8 flex items-center justify-center rounded-full border-2', {
          'border-primary bg-primary text-white': step === 2,
        })}>2</span>
        <span className="mt-1 text-xs">Empresa</span>
      </button>
    </div>
  </div>
);

// Primer paso: formulario de usuario
const UserStepForm: React.FC<{
  onSubmit: (data: UserFormData) => void;
  loading?: boolean;
}> = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const methods = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: 'demo@empresa.com',
      password: '123456',
      password2: '123456',
      nombre: 'Empresa Demo',
      apellido: 'Demo',
      telefono: '123456789',
      role: 'EMPRESA',
    }
  });
  const { register, handleSubmit, formState: { errors } } = methods;
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" autoComplete="off">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Correo electrónico" {...register('email')} className={classNames({ 'border-destructive': errors.email })} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1 relative">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            {...register('password')}
            className={classNames({ 'border-destructive': errors.password, 'pr-10': true })}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 text-muted-foreground"
            style={{ top: '50%' }}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-1 relative">
          <Label htmlFor="password2">Repite la contraseña</Label>
          <Input
            id="password2"
            type={showPassword2 ? 'text' : 'password'}
            placeholder="Repite la contraseña"
            {...register('password2')}
            className={classNames({ 'border-destructive': errors.password2, 'pr-10': true })}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 text-muted-foreground"
            style={{ top: '50%' }}
            onClick={() => setShowPassword2((v) => !v)}
          >
            {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password2 && <p className="text-sm text-destructive">{errors.password2.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" type="text" placeholder="Nombre" {...register('nombre')} className={classNames({ 'border-destructive': errors.nombre })} />
          {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="apellido">Apellido</Label>
          <Input id="apellido" type="text" placeholder="Apellido" {...register('apellido')} className={classNames({ 'border-destructive': errors.apellido })} />
          {errors.apellido && <p className="text-sm text-destructive">{errors.apellido.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" type="text" placeholder="Teléfono" {...register('telefono')} className={classNames({ 'border-destructive': errors.telefono })} />
          {errors.telefono && <p className="text-sm text-destructive">{errors.telefono.message}</p>}
        </div>
        <div className="space-y-1" style={{ display: 'none' }}>
          <Label htmlFor="role">Rol</Label>
          <select
            id="role"
            {...register('role')}
            className={classNames('w-full rounded-md border px-3 py-2', { 'border-destructive': errors.role })}
            defaultValue="EMPRESA"
          >
            <option value="EMPRESA">Empresa</option>
          </select>
          {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
        </div>
        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? 'Cargando...' : 'Siguiente'}
        </Button>
      </form>
    </FormProvider>
  );
};

// Segundo paso: formulario de empresa
const EmpresaStepForm: React.FC<{
  onSubmit: (data: EmpresaFormData) => void;
  loading?: boolean;
  onBack: () => void;
}> = ({ onSubmit, loading, onBack }) => {
  const methods = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema)
  });
  const { register, handleSubmit, formState: { errors } } = methods;
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
        <div className="space-y-2">
          <Label htmlFor="sector">Sector</Label>
          <Input id="sector" type="text" placeholder="Sector de la empresa" {...register('sector')} className={classNames({ 'border-destructive': errors.sector })} />
          {errors.sector && <p className="text-sm text-destructive">{errors.sector.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" type="text" placeholder="Nombre de la empresa" {...register('nombre')} className={classNames({ 'border-destructive': errors.nombre })} />
          {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" type="text" placeholder="Dirección de la empresa" {...register('direccion')} className={classNames({ 'border-destructive': errors.direccion })} />
          {errors.direccion && <p className="text-sm text-destructive">{errors.direccion.message}</p>}
        </div>
        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar y Finalizar'}
        </Button>
        <Button type="button" className="w-full mt-2" variant="outline" onClick={onBack}>
          Volver
        </Button>
      </form>
    </FormProvider>
  );
};

const EmpresaOnboardingForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserFormData | null>(null);

  const handleUserStep = (data: UserFormData) => {
    setUserData(data);
    setStep(2);
  };
  const handleEmpresaStep = (empresaData: EmpresaFormData) => {
    if (userData) {
      onSubmit({ ...userData, ...empresaData });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-1">
      <div className="w-full max-w-sm">
        <Stepper step={step} canGoStep2={!!userData} setStep={setStep} />
        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">🏢</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {step === 1 ? 'Crea tu cuenta' : 'Completa los datos de tu empresa'}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {step === 1
                  ? 'Ingresa tus datos personales para continuar'
                  : 'Ingresa la información básica de tu empresa'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <UserStepForm onSubmit={handleUserStep} loading={loading} />
            ) : (
              <EmpresaStepForm onSubmit={handleEmpresaStep} loading={loading} onBack={() => setStep(1)} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresaOnboardingForm;
