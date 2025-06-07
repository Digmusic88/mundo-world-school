import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  MessageSquare,
  AlertTriangle,
  Calendar,
  BookOpen,
  Settings
} from 'lucide-react';
import { useUsers, useAttendance, useFinances, useMessages, useSchoolConfig } from '@/hooks/useData';

interface AdminDashboardProps {
  onSectionChange: (section: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSectionChange }) => {
  const { users } = useUsers();
  const { stats: attendanceStats } = useAttendance();
  const { summary: financialSummary } = useFinances();
  const { messages } = useMessages();
  const { config } = useSchoolConfig();

  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const parents = users.filter(u => u.role === 'parent');
  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  const quickActions = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar estudiantes, profesores y padres',
      icon: Users,
      action: () => onSectionChange('users'),
      color: 'bg-blue-500'
    },
    {
      title: 'Grupos y Clases',
      description: 'Gestionar grupos académicos',
      icon: BookOpen,
      action: () => onSectionChange('groups'),
      color: 'bg-green-500'
    },
    {
      title: 'Control de Asistencia',
      description: 'Revisar asistencia diaria',
      icon: UserCheck,
      action: () => onSectionChange('attendance'),
      color: 'bg-yellow-500'
    },
    {
      title: 'Panel de Finanzas',
      description: 'Gestionar pagos y cuotas',
      icon: DollarSign,
      action: () => onSectionChange('finances'),
      color: 'bg-purple-500'
    },
    {
      title: 'Estadísticas',
      description: 'Ver métricas del centro',
      icon: TrendingUp,
      action: () => onSectionChange('statistics'),
      color: 'bg-orange-500'
    },
    {
      title: 'Mensajería',
      description: 'Comunicación institucional',
      icon: MessageSquare,
      action: () => onSectionChange('messages'),
      color: 'bg-pink-500'
    }
  ];

  const statsCards = [
    {
      title: 'Total Estudiantes',
      value: students.length.toString(),
      description: 'Estudiantes activos',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Profesores',
      value: teachers.length.toString(),
      description: 'Profesores activos',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Asistencia Hoy',
      value: attendanceStats ? `${attendanceStats.present_today}/${attendanceStats.total_students}` : '0/0',
      description: `${attendanceStats?.attendance_rate || 0}% de asistencia`,
      icon: UserCheck,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Ingresos del Mes',
      value: financialSummary ? `€${financialSummary.collected.toLocaleString()}` : '€0',
      description: `€${financialSummary?.pending.toLocaleString() || 0} pendientes`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentActivities = [
    {
      title: 'Nuevo estudiante registrado',
      description: 'Pablo Rodríguez se ha inscrito en 9° Grado A',
      time: 'Hace 2 horas',
      type: 'user'
    },
    {
      title: 'Pago recibido',
      description: 'Ana Rodríguez pagó la matrícula del tercer período',
      time: 'Hace 4 horas',
      type: 'payment'
    },
    {
      title: 'Mensaje importante',
      description: 'Reunión de padres programada para el viernes',
      time: 'Hace 6 horas',
      type: 'message'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Administración</h1>
        <p className="text-gray-600 mt-2">
          Gestión integral del {config?.school.name} - Período {config?.school.current_period}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acceso directo a las funciones principales del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={action.action}>
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas actividades en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen financiero */}
        <Card>
          <CardHeader>
            <CardTitle>Estado Financiero</CardTitle>
            <CardDescription>
              Resumen de ingresos y pagos pendientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Pagos Recaudados</span>
                  <span className="text-sm text-gray-600">
                    €{financialSummary?.collected.toLocaleString() || 0}
                  </span>
                </div>
                <Progress 
                  value={financialSummary ? (financialSummary.collected / financialSummary.total_revenue) * 100 : 0} 
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">RECAUDADO</p>
                  <p className="text-lg font-bold text-green-700">
                    €{financialSummary?.collected.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-orange-600 font-medium">PENDIENTE</p>
                  <p className="text-lg font-bold text-orange-700">
                    €{financialSummary?.pending.toLocaleString() || 0}
                  </p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onSectionChange('finances')}
              >
                Ver Detalles Financieros
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            Alertas y Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">Pagos Vencidos</p>
                <p className="text-sm text-yellow-600">
                  {financialSummary?.overdue ? 1 : 0} pagos requieren atención inmediata
                </p>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {financialSummary?.overdue ? 1 : 0}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Mensajes No Leídos</p>
                <p className="text-sm text-blue-600">
                  Tienes {unreadMessages} mensajes pendientes de respuesta
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {unreadMessages}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
