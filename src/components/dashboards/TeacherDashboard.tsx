import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  Award, 
  MessageSquare,
  Calendar,
  TrendingUp,
  UserCheck,
  Plus,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGroups, useGrades, useActivities, useAttendance, useUsers } from '@/hooks/useData';

interface TeacherDashboardProps {
  onSectionChange: (section: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onSectionChange }) => {
  const { user } = useAuth();
  const { groups } = useGroups();
  const { grades } = useGrades();
  const { activities } = useActivities();
  const { attendance } = useAttendance();
  const { users } = useUsers();

  // Filtrar datos del profesor actual
  const teacherGroups = groups.filter(g => g.teacher_id === user?.id);
  const teacherGrades = grades.filter(g => g.teacher_id === user?.id);
  const teacherActivities = activities.filter(a => a.teacher_id === user?.id);
  
  const studentsInGroups = users.filter(u => 
    u.role === 'student' && teacherGroups.some(g => g.students.includes(u.id))
  );

  const todayAttendance = attendance.filter(a => 
    a.date === '2025-06-07' && a.teacher_id === user?.id
  );

  const quickActions = [
    {
      title: 'Crear Actividad',
      description: 'Nueva tarea o proyecto',
      icon: Plus,
      action: () => onSectionChange('activities'),
      color: 'bg-blue-500'
    },
    {
      title: 'Registrar Calificaciones',
      description: 'Evaluar trabajos',
      icon: Award,
      action: () => onSectionChange('grades'),
      color: 'bg-green-500'
    },
    {
      title: 'Tomar Asistencia',
      description: 'Registro diario',
      icon: UserCheck,
      action: () => onSectionChange('attendance'),
      color: 'bg-yellow-500'
    },
    {
      title: 'Ver Mis Grupos',
      description: 'Gestionar clases',
      icon: Users,
      action: () => onSectionChange('groups'),
      color: 'bg-purple-500'
    }
  ];

  const statsCards = [
    {
      title: 'Mis Grupos',
      value: teacherGroups.length.toString(),
      description: user?.subjects?.join(', ') || 'Materias asignadas',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Estudiantes',
      value: studentsInGroups.length.toString(),
      description: 'Estudiantes bajo mi tutela',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Actividades Activas',
      value: teacherActivities.filter(a => a.status === 'active').length.toString(),
      description: 'Tareas pendientes de evaluación',
      icon: ClipboardList,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Calificaciones Hoy',
      value: teacherGrades.filter(g => g.date === '2025-06-07').length.toString(),
      description: 'Evaluaciones registradas hoy',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentActivities = [
    {
      title: 'Nuevo "Prove Yourself" programado',
      description: 'Álgebra Lineal para 9° Grado A',
      time: 'Hace 1 hora',
      type: 'evaluation'
    },
    {
      title: 'Calificación registrada',
      description: 'Pablo Rodríguez - Matemáticas: 85/100',
      time: 'Hace 2 horas',
      type: 'grade'
    },
    {
      title: 'Asistencia tomada',
      description: 'Grupo 10B - 26 de 26 estudiantes presentes',
      time: 'Hace 4 horas',
      type: 'attendance'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard del Profesor</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido/a, {user?.name} - Gestiona tus clases y estudiantes
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
            Herramientas para la gestión diaria de tus clases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={action.action}>
                    <div className="text-center">
                      <div className={`p-3 rounded-lg ${action.color} mx-auto w-fit mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis Grupos */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Grupos</CardTitle>
            <CardDescription>
              Clases asignadas este período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teacherGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.classroom} • {group.schedule}</p>
                    <p className="text-xs text-gray-500">{group.total_students} estudiantes</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onSectionChange('groups')}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {teacherGroups.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No tienes grupos asignados
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actividades Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Actividades Recientes</CardTitle>
            <CardDescription>
              Últimas actividades en tus clases
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
      </div>

      {/* Actividades pendientes y próximas evaluaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividades Pendientes</CardTitle>
            <CardDescription>
              Tareas por evaluar o próximas a vencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherActivities
                .filter(a => a.status === 'active')
                .slice(0, 5)
                .map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.group} • {activity.subject}</p>
                    <p className="text-xs text-gray-500">
                      Vence: {new Date(activity.due_date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <Badge className={`${
                    new Date(activity.due_date) < new Date() 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
              {teacherActivities.filter(a => a.status === 'active').length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay actividades pendientes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rendimiento de los estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento General</CardTitle>
            <CardDescription>
              Promedio de calificaciones por materia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user?.subjects?.map((subject) => {
                const subjectGrades = teacherGrades.filter(g => g.subject === subject);
                const average = subjectGrades.length > 0 
                  ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
                  : 0;
                
                return (
                  <div key={subject}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{subject}</span>
                      <span className="text-sm text-gray-600">{Math.round(average)}/100</span>
                    </div>
                    <Progress value={average} className="h-2" />
                  </div>
                );
              })}
              {(!user?.subjects || user.subjects.length === 0) && (
                <p className="text-center text-gray-500 py-4">
                  No tienes materias asignadas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
