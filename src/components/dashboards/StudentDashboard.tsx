import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Award, 
  UserCheck, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Clock,
  Target,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGrades, useAttendance, useActivities, useMessages, useGroups } from '@/hooks/useData';

interface StudentDashboardProps {
  onSectionChange: (section: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onSectionChange }) => {
  const { user } = useAuth();
  const { grades } = useGrades();
  const { attendance } = useAttendance();
  const { activities } = useActivities();
  const { messages } = useMessages();
  const { groups } = useGroups();

  // Datos específicos del estudiante
  const studentGrades = grades.filter(g => g.student_id === user?.id);
  const studentAttendance = attendance.filter(a => a.student_id === user?.id);
  const studentActivities = activities.filter(a => a.students_assigned.includes(user?.id || ''));
  const studentMessages = messages.filter(m => m.to_id === user?.id || m.from_id === user?.id);
  const studentGroup = groups.find(g => g.id === user?.group);

  // Calcular estadísticas
  const averageGrade = studentGrades.length > 0 
    ? studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length 
    : 0;

  const attendanceRate = studentAttendance.length > 0 
    ? (studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100 
    : 100;

  const activeActivities = studentActivities.filter(a => a.status === 'active');
  const completedActivities = studentActivities.filter(a => a.status === 'completed');
  const unreadMessages = studentMessages.filter(m => m.status === 'unread' && m.to_id === user?.id).length;

  const quickActions = [
    {
      title: 'Mis Calificaciones',
      description: 'Ver todas mis notas',
      icon: Award,
      action: () => onSectionChange('grades'),
      color: 'bg-blue-500'
    },
    {
      title: 'Mi Horario',
      description: 'Clases de hoy',
      icon: Calendar,
      action: () => onSectionChange('schedule'),
      color: 'bg-green-500'
    },
    {
      title: 'Mis Actividades',
      description: 'Tareas pendientes',
      icon: BookOpen,
      action: () => onSectionChange('activities'),
      color: 'bg-purple-500',
      notification: activeActivities.length > 0 ? activeActivities.length : undefined
    },
    {
      title: 'Mensajes',
      description: 'Comunicación',
      icon: MessageSquare,
      action: () => onSectionChange('messages'),
      color: 'bg-orange-500',
      notification: unreadMessages > 0 ? unreadMessages : undefined
    }
  ];

  const statsCards = [
    {
      title: 'Promedio General',
      value: Math.round(averageGrade).toString(),
      description: 'Calificación promedio',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      suffix: '/100'
    },
    {
      title: 'Asistencia',
      value: Math.round(attendanceRate).toString(),
      description: 'Porcentaje de asistencia',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      suffix: '%'
    },
    {
      title: 'Actividades Activas',
      value: activeActivities.length.toString(),
      description: 'Tareas pendientes',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Evaluaciones',
      value: studentGrades.filter(g => g.type === 'Prove Yourself').length.toString(),
      description: 'Prove Yourself realizados',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentGrades = studentGrades
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const upcomingActivities = activeActivities
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 4);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido/a, {user?.name} - {user?.grade} Grado {user?.group}
        </p>
        {studentGroup && (
          <p className="text-sm text-gray-500">
            Aula: {studentGroup.classroom} • Horario: {studentGroup.schedule}
          </p>
        )}
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
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}{stat.suffix}
                    </p>
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
            Herramientas para tu día académico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow relative">
                  <CardContent className="p-4" onClick={action.action}>
                    <div className="text-center">
                      <div className={`p-3 rounded-lg ${action.color} mx-auto w-fit mb-3 relative`}>
                        <Icon className="h-6 w-6 text-white" />
                        {action.notification && (
                          <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                            {action.notification}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Progreso académico */}
      <Card>
        <CardHeader>
          <CardTitle>Mi Progreso Académico</CardTitle>
          <CardDescription>
            Rendimiento por materia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentGroup?.subjects.map((subject) => {
              const subjectGrades = studentGrades.filter(g => g.subject === subject);
              const average = subjectGrades.length > 0 
                ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
                : 0;
              
              return (
                <div key={subject}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{subject}</span>
                    <span className={`text-sm font-bold ${getGradeColor(average)}`}>
                      {Math.round(average)}/100
                    </span>
                  </div>
                  <Progress value={average} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    {subjectGrades.length} evaluaciones registradas
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calificaciones recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Calificaciones Recientes</CardTitle>
            <CardDescription>
              Mis últimas evaluaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{grade.subject}</h4>
                    <p className="text-sm text-gray-600">{grade.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(grade.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getGradeColor(grade.grade)}`}>
                      {grade.grade}/100
                    </p>
                    <Badge className={getGradeBadgeColor(grade.grade)}>
                      {grade.type}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentGrades.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay calificaciones registradas
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onSectionChange('grades')}
            >
              Ver Todas las Calificaciones
            </Button>
          </CardContent>
        </Card>

        {/* Actividades pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Actividades Pendientes</CardTitle>
            <CardDescription>
              Tareas por entregar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingActivities.map((activity) => {
                const isOverdue = new Date(activity.due_date) < new Date();
                const daysUntilDue = Math.ceil((new Date(activity.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={activity.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <Badge className={`${
                        isOverdue 
                          ? 'bg-red-100 text-red-800' 
                          : daysUntilDue <= 2
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.subject}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {isOverdue ? (
                          <span className="text-red-600 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Vencida
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {daysUntilDue === 0 ? 'Vence hoy' : 
                             daysUntilDue === 1 ? 'Vence mañana' : 
                             `${daysUntilDue} días restantes`}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.max_points} puntos
                      </p>
                    </div>
                  </div>
                );
              })}
              {upcomingActivities.length === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500">¡No tienes actividades pendientes!</p>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onSectionChange('activities')}
            >
              Ver Todas las Actividades
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de asistencia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mi Asistencia</CardTitle>
            <CardDescription>
              Registro de los últimos 7 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentAttendance
                .slice(-7)
                .reverse()
                .map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium text-sm">
                        {new Date(record.date).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </p>
                      {record.arrival_time && (
                        <p className="text-xs text-gray-500">
                          Llegada: {record.arrival_time}
                        </p>
                      )}
                    </div>
                    <Badge className={`${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status === 'present' ? 'Presente' :
                       record.status === 'late' ? 'Tardanza' : 'Ausente'}
                    </Badge>
                  </div>
                ))}
              {studentAttendance.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay registros de asistencia
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onSectionChange('attendance')}
            >
              Ver Historial Completo
            </Button>
          </CardContent>
        </Card>

        {/* Próximos eventos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Actividades y fechas importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-blue-900">Reunión de Padres</p>
                    <p className="text-sm text-blue-700">Viernes 14 de Junio</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-green-900">Período de Evaluaciones</p>
                    <p className="text-sm text-green-700">15-20 de Junio</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <p className="font-medium text-purple-900">Fin del Período</p>
                    <p className="text-sm text-purple-700">30 de Junio</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
