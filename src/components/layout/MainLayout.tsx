import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Menu, 
  X,
  Home,
  Users,
  BookOpen,
  UserCheck,
  DollarSign,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'users', label: 'Gestión de Usuarios', icon: Users },
          { id: 'groups', label: 'Gestión de Grupos', icon: BookOpen },
          { id: 'attendance', label: 'Control de Asistencia', icon: UserCheck },
          { id: 'finances', label: 'Panel de Finanzas', icon: DollarSign },
          { id: 'statistics', label: 'Estadísticas', icon: BarChart3 },
          { id: 'messages', label: 'Mensajería', icon: MessageSquare },
          { id: 'settings', label: 'Configuración', icon: Settings },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'subjects', label: 'Asignaturas', icon: BookOpen },
          { id: 'groups', label: 'Mis Grupos', icon: Users },
          { id: 'students', label: 'Estudiantes', icon: Users },
          { id: 'activities', label: 'Actividades', icon: BookOpen },
          { id: 'evaluations', label: 'Prove Yourself', icon: BarChart3 },
          { id: 'grades', label: 'Calificaciones', icon: BarChart3 },
          { id: 'attendance', label: 'Asistencia', icon: UserCheck },
          { id: 'messages', label: 'Comunicación', icon: MessageSquare },
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'children', label: 'Mis Hijos', icon: Users },
          { id: 'grades', label: 'Calificaciones', icon: BarChart3 },
          { id: 'attendance', label: 'Asistencia', icon: UserCheck },
          { id: 'messages', label: 'Comunicación', icon: MessageSquare },
          { id: 'schedule', label: 'Horarios', icon: BookOpen },
          { id: 'activities', label: 'Actividades', icon: BookOpen },
          { id: 'finances', label: 'Finanzas', icon: DollarSign },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Mi Dashboard', icon: Home },
          { id: 'grades', label: 'Mis Calificaciones', icon: BarChart3 },
          { id: 'schedule', label: 'Mi Horario', icon: BookOpen },
          { id: 'activities', label: 'Mis Actividades', icon: BookOpen },
          { id: 'attendance', label: 'Mi Asistencia', icon: UserCheck },
          { id: 'messages', label: 'Mensajes', icon: MessageSquare },
          { id: 'resources', label: 'Recursos', icon: BookOpen },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'teacher': return 'Profesor';
      case 'parent': return 'Padre';
      case 'student': return 'Estudiante';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'parent': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-white mr-2" />
            <span className="text-white font-bold text-lg">Mundo World</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Menú de usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>
                        {user?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{user?.name}</div>
                      <Badge className={`text-xs ${getRoleBadgeColor(user?.role || '')}`}>
                        {getRoleLabel(user?.role || '')}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
