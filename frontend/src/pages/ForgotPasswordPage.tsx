import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/schemas/auth';

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      toast({
        title: "Correo enviado",
        description: "Se ha enviado un enlace de recuperación a tu correo electrónico.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el correo. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-elegant border-0">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-success-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Correo enviado
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  ¿No recibiste el correo? Revisa tu carpeta de spam o{' '}
                  <button 
                    onClick={() => setEmailSent(false)}
                    className="text-primary hover:text-primary-hover font-medium transition-colors"
                  >
                    inténtalo de nuevo
                  </button>
                </div>
                
                <Link 
                  to="/login"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Volver al inicio de sesión
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                ¿Olvidaste tu contraseña?
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Ingresa tu correo electrónico para recibir un enlace de recuperación
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-primary-hover transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </Button>
            </form>

            <div className="mt-6">
              <Link 
                to="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;