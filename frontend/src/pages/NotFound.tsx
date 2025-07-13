import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                404 - Página no encontrada
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                La página que buscas no existe o ha sido movida
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              La URL <code className="bg-muted px-1 py-0.5 rounded text-xs">{location.pathname}</code> no se encuentra disponible.
            </p>
            
            <Link to="/">
              <Button className="w-full bg-gradient-primary">
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
