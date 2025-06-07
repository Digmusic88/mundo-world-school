import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Award,
  Clock,
  UserCheck,
  UserX,
  Target,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import { useUsers, useGroups, useGrades, useAttendance, useFinances, useActivities, useMessages } from '@/hooks/useData';

const StatisticsPanel: React.FC = () => {
  const { users } = useUsers();
  const { groups } = useGroups();
  const { grades } = useGrades();
  const { attendance } = useAttendance();
  const { finances } = useFinances();
  const { activities } = useActivities();
  const { messages } = useMessages();
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Calcular estadísticas generales
  const generalStats = useMemo(() => {
    const safeUsers = users || [];
    const safeGroups = groups || [];
    const totalUsers = safeUsers.length;
    const students = safeUsers.filter(u => u.role === 'student');
    const teachers = safeUsers.filter(u => u.role === 'teacher');
    const parents = safeUsers.filter(u => u.role === 'parent');
    const admins = safeUsers.filter(u => u.role === 'admin');

    return {
      totalUsers,
      students: students.length,
      teachers: teachers.length,
      parents: parents.length,
      admins: admins.length,
      totalGroups: safeGroups.length,
      activeGroups: safeGroups.filter(g => g.active).length
    };
  }, [users, groups]);

  // Calcular estadísticas académicas
  const academicStats = useMemo(() => {
    const safeGrades = grades || [];
    const totalGrades = safeGrades.length;
    const averageGrade = totalGrades > 0 ? safeGrades.reduce((sum, g) => sum + (g.points || 0), 0) / totalGrades : 0;
    
    const excellent = safeGrades.filter(g => (g.points || 0) >= 90).length;
    const good = safeGrades.filter(g => (g.points || 0) >= 80 && (g.points || 0) < 90).length;
    const satisfactory = safeGrades.filter(g => (g.points || 0) >= 70 && (g.points || 0) < 80).length;
    const needsImprovement = safeGrades.filter(g => (g.points || 0) < 70).length;

    return {
      totalGrades,
      averageGrade: Math.round(averageGrade * 10) / 10,
      distribution: {
        excellent,
        good,
        satisfactory,
        needsImprovement
      }
    };
  }, [grades]);

  // Calcular estadísticas de asistencia
  const attendanceStats = useMemo(() => {
    const safeAttendance = attendance || [];
    const totalRecords = safeAttendance.length;
    const presentRecords = safeAttendance.filter(a => a.status === 'present').length;
    const absentRecords = safeAttendance.filter(a => a.status === 'absent').length;
    const lateRecords = safeAttendance.filter(a => a.status === 'late').length;
    
    const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

    return {
      totalRecords,
      presentRecords,
      absentRecords,
      lateRecords,
      attendanceRate: Math.round(attendanceRate * 10) / 10
    };
  }, [attendance]);

  // Calcular estadísticas financieras
  const financialStats = useMemo(() => {
    const safeFinances = finances || [];
    const totalAmount = safeFinances.reduce((sum, f) => sum + (f.amount || 0), 0);
    const paidAmount = safeFinances.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0);
    const pendingAmount = safeFinances.filter(f => f.status === 'pending').reduce((sum, f) => sum + (f.amount || 0), 0);
    
    const collectionRate = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
    
    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      collectionRate: Math.round(collectionRate * 10) / 10,
      totalTransactions: safeFinances.length
    };
  }, [finances]);

  // Calcular estadísticas de actividades
  const activityStats = useMemo(() => {
    const safeActivities = activities || [];
    const totalActivities = safeActivities.length;
    const activeActivities = safeActivities.filter(a => a.status === 'active').length;
    const completedActivities = safeActivities.filter(a => a.status === 'completed').length;

    return {
      totalActivities,
      activeActivities,
      completedActivities,
      completionRate: totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0
    };
  }, [activities]);

  // Calcular estadísticas de comunicación
  const communicationStats = useMemo(() => {
    const safeMessages = messages || [];
    const totalMessages = safeMessages.length;
    const readMessages = safeMessages.filter(m => m.read).length;
    const unreadMessages = safeMessages.filter(m => !m.read).length;
    
    return {
      totalMessages,
      readMessages,
      unreadMessages,
      readRate: totalMessages > 0 ? (readMessages / totalMessages) * 100 : 0
    };
  }, [messages]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Estadísticas</h2>
          <p className="text-gray-600">Métricas y análisis del centro educativo</p>
        </div>
        <div className="flex space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Período Actual</SelectItem>
              <SelectItem value="semester">Este Semestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
              <SelectItem value="all">Histórico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-3xl font-bold text-blue-600">{generalStats.totalUsers}</p>
                <p className="text-xs text-gray-500">+12% vs mes anterior</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-3xl font-bold text-green-600">{academicStats.averageGrade}</p>
                <p className="text-xs text-gray-500">+3.2% vs período anterior</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Asistencia</p>
                <p className="text-3xl font-bold text-purple-600">{attendanceStats.attendanceRate}%</p>
                <p className="text-xs text-gray-500">-1.5% vs mes anterior</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recaudación</p>
                <p className="text-3xl font-bold text-orange-600">{financialStats.collectionRate}%</p>
                <p className="text-xs text-gray-500">+5.8% vs mes anterior</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Distribución de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Estudiantes</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="h-full bg-blue-600 rounded" style={{width: `${(generalStats.students/generalStats.totalUsers)*100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium">{generalStats.students}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Profesores</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="h-full bg-green-600 rounded" style={{width: `${(generalStats.teachers/generalStats.totalUsers)*100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium">{generalStats.teachers}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Padres</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="h-full bg-purple-600 rounded" style={{width: `${(generalStats.parents/generalStats.totalUsers)*100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium">{generalStats.parents}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Rendimiento Académico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Excelente (90+)</span>
                <span className="text-sm font-medium">{academicStats.distribution.excellent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bueno (80-89)</span>
                <span className="text-sm font-medium">{academicStats.distribution.good}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Satisfactorio (70-79)</span>
                <span className="text-sm font-medium">{academicStats.distribution.satisfactory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Necesita mejora (&lt;70)</span>
                <span className="text-sm font-medium">{academicStats.distribution.needsImprovement}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Grupos Activos</span>
                <Badge variant="outline">{generalStats.activeGroups}/{generalStats.totalGroups}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Actividades Completadas</span>
                <Badge variant="outline">{activityStats.completedActivities}/{activityStats.totalActivities}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mensajes No Leídos</span>
                <Badge variant="outline">{communicationStats.unreadMessages}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Transacciones</span>
                <Badge variant="outline">{financialStats.totalTransactions} registros</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">€{financialStats.paidAmount}</div>
              <div className="text-sm text-gray-600">Recaudado</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">€{financialStats.pendingAmount}</div>
              <div className="text-sm text-gray-600">Pendiente</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{communicationStats.totalMessages}</div>
              <div className="text-sm text-gray-600">Total Mensajes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{activityStats.completionRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Tasa de Completitud</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPanel;
