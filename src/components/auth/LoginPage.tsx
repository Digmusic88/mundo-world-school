import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
    }
    
    setIsLoading(false);
  };

  // Usuarios de ejemplo para mostrar en la interfaz
  const exampleUsers = [
    { email: 'carlos.mendoza@mundoworld.edu', role: 'Administrador', name: 'Dr. Carlos Mendoza' },
    { email: 'maria.garcia@mundoworld.edu', role: 'Profesor', name: 'Prof. María García' },
    { email: 'ana.rodriguez@email.com', role: 'Padre', name: 'Ana Rodríguez' },
    { email: 'pablo.rodriguez@mundoworld.edu', role: 'Estudiante', name: 'Pablo Rodríguez' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Panel izquierdo - Información del colegio */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-6">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mundo World School</h1>
              <p className="text-gray-600">Educación de calidad para el futuro</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Sistema de Gestión Escolar</h2>
            <p className="text-gray-600">
              Accede a tu panel personalizado para gestionar todas las actividades académicas 
              y administrativas de manera eficiente.
            </p>
          </div>

          {/* Usuarios de ejemplo */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Usuarios de Demostración:</h3>
            <div className="space-y-2 text-sm">
              {exampleUsers.map((user, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium text-blue-600">{user.role}:</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Contraseña: cualquier texto (demo)
            </p>
          </div>
        </div>

        {/* Panel derecho - Formulario de login */}
        <div>
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu.email@mundoworld.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-center">
              <p className="text-sm text-gray-600">
                ¿Problemas para acceder? Contacta al administrador
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
