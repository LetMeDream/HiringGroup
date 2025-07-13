import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Acceso Denegado
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                No tienes permisos para acceder a esta sección
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Tu rol de usuario no tiene los permisos necesarios para ver esta página.
              Por favor, contacta al administrador si crees que esto es un error.
            </p>
            
            <div className="space-y-2">
              <Link to="/dashboard">
                <Button className="w-full bg-gradient-primary">
                  Ir al Dashboard
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnauthorizedPage;