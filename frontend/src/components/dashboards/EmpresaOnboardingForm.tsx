
import React, { useState } from 'react';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
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

const EmpresaOnboardingForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserFormData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Paso 1: Formulario de usuario
  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors }
  } = useForm<UserFormData>({
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

  // Paso 2: Formulario de empresa
  const {
    register: registerEmpresa,
    handleSubmit: handleSubmitEmpresa,
    formState: { errors: empresaErrors }
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema)
  });

  // Al enviar el primer paso
  const onUserSubmit = (data: UserFormData) => {
    setUserData(data);
    setStep(2);
  };

  // Al enviar el segundo paso
  const onEmpresaSubmit = (empresaData: EmpresaFormData) => {
    if (userData) {
      onSubmit({ ...userData, ...empresaData });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-1">
      <div className="w-full max-w-sm">
        {/* Stepper visual */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4">
            {/* Paso 1 */}
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
            {/* Línea entre pasos */}
            <span className="w-8 h-0.5 bg-muted-foreground rounded-full" />
            {/* Paso 2 */}
            <button
              type="button"
              className={classNames('flex flex-col items-center focus:outline-none', {
                'text-primary font-bold': step === 2,
                'text-muted-foreground': step !== 2,
                'opacity-50 cursor-not-allowed': !userData
              })}
              onClick={() => userData && setStep(2)}
              aria-current={step === 2 ? 'step' : undefined}
            >
              <span className={classNames('w-8 h-8 flex items-center justify-center rounded-full border-2', {
                'border-primary bg-primary text-white': step === 2,
                 // 'border-muted-foreground bg-background': step !== 2
              })}>2</span>
              <span className="mt-1 text-xs">Empresa</span>
            </button>
          </div>
        </div>
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
              <form onSubmit={handleSubmitUser(onUserSubmit)} className="space-y-3" autoComplete="off">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Correo electrónico" {...registerUser('email')} className={classNames({ 'border-destructive': userErrors.email })} />
                  {userErrors.email && <p className="text-sm text-destructive">{userErrors.email.message}</p>}
                </div>
                <div className="space-y-1 relative">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    {...registerUser('password')}
                    className={classNames({ 'border-destructive': userErrors.password, 'pr-10': true })}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    style={{ top: '50%' }}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {userErrors.password && <p className="text-sm text-destructive">{userErrors.password.message}</p>}
                </div>
                <div className="space-y-1 relative">
                  <Label htmlFor="password2">Repite la contraseña</Label>
                  <Input
                    id="password2"
                    type={showPassword2 ? 'text' : 'password'}
                    placeholder="Repite la contraseña"
                    {...registerUser('password2')}
                    className={classNames({ 'border-destructive': userErrors.password2, 'pr-10': true })}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    style={{ top: '50%' }}
                    onClick={() => setShowPassword2((v) => !v)}
                  >
                    {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {userErrors.password2 && <p className="text-sm text-destructive">{userErrors.password2.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" type="text" placeholder="Nombre" {...registerUser('nombre')} className={classNames({ 'border-destructive': userErrors.nombre })} />
                  {userErrors.nombre && <p className="text-sm text-destructive">{userErrors.nombre.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" type="text" placeholder="Apellido" {...registerUser('apellido')} className={classNames({ 'border-destructive': userErrors.apellido })} />
                  {userErrors.apellido && <p className="text-sm text-destructive">{userErrors.apellido.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" type="text" placeholder="Teléfono" {...registerUser('telefono')} className={classNames({ 'border-destructive': userErrors.telefono })} />
                  {userErrors.telefono && <p className="text-sm text-destructive">{userErrors.telefono.message}</p>}
                </div>
                <div className="space-y-1" style={{ display: 'none' }}>
                  <Label htmlFor="role">Rol</Label>
                  <select
                    id="role"
                    {...registerUser('role')}
                    className={classNames('w-full rounded-md border px-3 py-2', { 'border-destructive': userErrors.role })}
                    defaultValue="EMPRESA"
                  >
                    <option value="EMPRESA">Empresa</option>
                  </select>
                  {userErrors.role && <p className="text-sm text-destructive">{userErrors.role.message}</p>}
                </div>
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? 'Cargando...' : 'Siguiente'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitEmpresa(onEmpresaSubmit)} className="space-y-4" autoComplete="off">
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Input id="sector" type="text" placeholder="Sector de la empresa" {...registerEmpresa('sector')} className={classNames({ 'border-destructive': empresaErrors.sector })} />
                  {empresaErrors.sector && <p className="text-sm text-destructive">{empresaErrors.sector.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" type="text" placeholder="Nombre de la empresa" {...registerEmpresa('nombre')} className={classNames({ 'border-destructive': empresaErrors.nombre })} />
                  {empresaErrors.nombre && <p className="text-sm text-destructive">{empresaErrors.nombre.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" type="text" placeholder="Dirección de la empresa" {...registerEmpresa('direccion')} className={classNames({ 'border-destructive': empresaErrors.direccion })} />
                  {empresaErrors.direccion && <p className="text-sm text-destructive">{empresaErrors.direccion.message}</p>}
                </div>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar y Finalizar'}
                </Button>
                <Button type="button" className="w-full mt-2" variant="outline" onClick={() => setStep(1)}>
                  Volver
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresaOnboardingForm;
