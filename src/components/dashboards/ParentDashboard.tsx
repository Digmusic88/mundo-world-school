import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Award, 
  UserCheck, 
  MessageSquare,
  Calendar,
  DollarSign,
  BookOpen,
  TrendingUp,
  Eye,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers, useGrades, useAttendance, useFinances, useMessages, useActivities } from '@/hooks/useData';

interface ParentDashboardProps {
  onSectionChange: (section: string) => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onSectionChange }) => {
  const { user } = useAuth();
  const { users } = useUsers();
  const { grades } = useGrades();
  const { attendance } = useAttendance();
  const { payments } = useFinances();
  const { messages } = useMessages();
  const { activities } = useActivities();

  // Obtener información de los hijos
  const children = users.filter(u => user?.children?.includes(u.id));
  
  // Calificaciones de los hijos
  const childrenGrades = grades.filter(g => 
    children.some(child => child.id === g.student_id)
  );
  
  // Asistencia de los hijos
  const childrenAttendance = attendance.filter(a => 
    children.some(child => child.id === a.student_id)
  );

  // Pagos del padre
  const parentPayments = payments.filter(p => p.parent_id === user?.id);
  const pendingPayments = parentPayments.filter(p => p.status === 'pending');

  // Mensajes del padre
  const parentMessages = messages.filter(m => 
    m.to_id === user?.id || m.from_id === user?.id
  );
  const unreadMessages = parentMessages.filter(m => 
    m.status === 'unread' && m.to_id === user?.id
  ).length;

  // Actividades de los hijos
  const childrenActivities = activities.filter(a =>
    a.students_assigned.some(studentId => 
      children.some(child => child.id === studentId)
    )
  );

  const quickActions = [
    {
      title: 'Ver Calificaciones',
      description: 'Notas y evaluaciones',
      icon: Award,
      action: () => onSectionChange('grades'),
      color: 'bg-blue-500'
    },
    {
      title: 'Revisar Asistencia',
      description: 'Control de presencia',
      icon: UserCheck,
      action: () => onSectionChange('attendance'),
      color: 'bg-green-500'
    },
    {
      title: 'Mensajes',
      description: 'Comunicación con profesores',
      icon: MessageSquare,
      action: () => onSectionChange('messages'),
      color: 'bg-purple-500',
      notification: unreadMessages > 0 ? unreadMessages : undefined
    },
    {
      title: 'Estado Financiero',
      description: 'Pagos y cuotas',
      icon: DollarSign,
      action: () => onSectionChange('finances'),
      color: 'bg-orange-500',
      notification: pendingPayments.length > 0 ? pendingPayments.length : undefined
    }
  ];

  const getAverageGrade = (studentId: string) => {
    const studentGrades = childrenGrades.filter(g => g.student_id === studentId);
    if (studentGrades.length === 0) return 0;
    return studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length;
  };

  const getAttendanceRate = (studentId: string) => {
    const studentAttendance = childrenAttendance.filter(a => a.student_id === studentId);
    if (studentAttendance.length === 0) return 100;
    const presentDays = studentAttendance.filter(a => a.status === 'present').length;
    return (presentDays / studentAttendance.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Padres</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido/a, {user?.name} - Seguimiento académico de sus hijos
        </p>
      </div>

      {/* Resumen de hijos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => {
          const averageGrade = getAverageGrade(child.id);
          const attendanceRate = getAttendanceRate(child.id);
          const childActivities = childrenActivities.filter(a => 
            a.students_assigned.includes(child.id)
          );

          return (
            <Card key={child.id}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={child.avatar} />
                    <AvatarFallback>
                      {child.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                    <CardDescription>{child.grade} - Grupo {child.group}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Promedio General</span>
                      <span className="text-sm text-gray-600">{Math.round(averageGrade)}/100</span>
                    </div>
                    <Progress value={averageGrade} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Asistencia</span>
                      <span className="text-sm text-gray-600">{Math.round(attendanceRate)}%</span>
                    </div>
                    <Progress value={attendanceRate} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-lg font-bold text-blue-600">{childrenGrades.filter(g => g.student_id === child.id).length}</p>
                      <p className="text-xs text-gray-600">Calificaciones</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-lg font-bold text-green-600">{childActivities.filter(a => a.status === 'active').length}</p>
                      <p className="text-xs text-gray-600">Actividades</p>
                    </div>
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
            Herramientas para el seguimiento académico
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calificaciones recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Calificaciones Recientes</CardTitle>
            <CardDescription>
              Últimas evaluaciones de sus hijos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {childrenGrades
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((grade) => {
                  const child = children.find(c => c.id === grade.student_id);
                  return (
                    <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{child?.name}</h4>
                        <p className="text-sm text-gray-600">{grade.subject} - {grade.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(grade.date).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{grade.grade}/100</p>
                        <Badge className={`${
                          grade.grade >= 90 ? 'bg-green-100 text-green-800' :
                          grade.grade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {grade.type}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              {childrenGrades.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay calificaciones registradas
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estado financiero */}
        <Card>
          <CardHeader>
            <CardTitle>Estado Financiero</CardTitle>
            <CardDescription>
              Resumen de pagos y cuotas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">PAGADO</p>
                  <p className="text-lg font-bold text-green-700">
                    €{parentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-orange-600 font-medium">PENDIENTE</p>
                  <p className="text-lg font-bold text-orange-700">
                    €{pendingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Pagos Pendientes</h4>
                {pendingPayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">{payment.concept}</p>
                      <p className="text-xs text-gray-500">{payment.student_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">€{payment.amount}</p>
                      <p className="text-xs text-red-600">
                        Vence: {new Date(payment.due_date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
                {pendingPayments.length === 0 && (
                  <p className="text-sm text-gray-500">No hay pagos pendientes</p>
                )}
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

      {/* Actividades y comunicaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividades Activas</CardTitle>
            <CardDescription>
              Tareas y proyectos en curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {childrenActivities
                .filter(a => a.status === 'active')
                .slice(0, 4)
                .map((activity) => {
                  const assignedChildren = activity.students_assigned.filter(id => 
                    children.some(child => child.id === id)
                  );
                  
                  return (
                    <div key={activity.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.subject} - {activity.group}</p>
                          <p className="text-xs text-gray-500">
                            Para: {assignedChildren.map(id => 
                              children.find(c => c.id === id)?.name
                            ).join(', ')}
                          </p>
                        </div>
                        <Badge className={`${
                          new Date(activity.due_date) < new Date() 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Vence: {new Date(activity.due_date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  );
                })}
              {childrenActivities.filter(a => a.status === 'active').length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay actividades activas
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comunicaciones</CardTitle>
            <CardDescription>
              Mensajes recientes con profesores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {parentMessages
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 4)
                .map((message) => (
                  <div key={message.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{message.subject}</h4>
                      <Badge className={`${
                        message.status === 'unread' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.status === 'unread' ? 'Nuevo' : 'Leído'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {message.from_id === user?.id ? 'Para: ' : 'De: '}
                      {message.from_id === user?.id ? message.to_name : message.from_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                ))}
              {parentMessages.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay mensajes
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onSectionChange('messages')}
            >
              Ver Todos los Mensajes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;
