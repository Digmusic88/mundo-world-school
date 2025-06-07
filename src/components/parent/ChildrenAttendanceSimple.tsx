import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAttendance, useUsers, useGroups } from '@/hooks/useData';

const ChildrenAttendance: React.FC = () => {
  const { user } = useAuth();
  const { attendance } = useAttendance();
  const { users } = useUsers();
  const { groups } = useGroups();
  const [selectedChild, setSelectedChild] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());

  // Obtener hijos del padre
  const children = useMemo(() => {
    return users.filter(u => 
      u.role === 'student' && 
      u.parent_id === user?.id
    );
  }, [users, user]);

  // Filtrar registros de asistencia por hijos y período
  const filteredAttendance = useMemo(() => {
    let records = attendance.filter(record => 
      children.some(child => child.id === record.student_id)
    );

    if (selectedChild !== 'all') {
      records = records.filter(record => record.student_id === selectedChild);
    }

    // Filtrar por mes
    records = records.filter(record => {
      const date = new Date(record.date);
      return date.getMonth() === parseInt(selectedMonth);
    });

    return records;
  }, [attendance, children, selectedChild, selectedMonth]);

  // Calcular estadísticas por hijo
  const childrenStats = useMemo(() => {
    return children.map(child => {
      const childRecords = filteredAttendance.filter(r => r.student_id === child.id);
      const totalDays = childRecords.length;
      const presentDays = childRecords.filter(r => r.status === 'present').length;
      const absentDays = childRecords.filter(r => r.status === 'absent').length;
      const lateDays = childRecords.filter(r => r.status === 'late').length;
      const excusedDays = childRecords.filter(r => r.status === 'excused').length;
      
      const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
      
      // Obtener información del grupo
      const childGroup = groups.find(g => g.students.includes(child.id));
      
      return {
        ...child,
        group: childGroup,
        stats: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          excusedDays,
          attendanceRate: Math.round(attendanceRate * 10) / 10
        },
        records: childRecords
      };
    });
  }, [children, filteredAttendance, groups]);

  // Estadísticas generales
  const overallStats = useMemo(() => {
    const totalRecords = filteredAttendance.length;
    const presentCount = filteredAttendance.filter(r => r.status === 'present').length;
    const absentCount = filteredAttendance.filter(r => r.status === 'absent').length;
    const lateCount = filteredAttendance.filter(r => r.status === 'late').length;
    const excusedCount = filteredAttendance.filter(r => r.status === 'excused').length;
    
    const overallRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
    
    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      overallRate: Math.round(overallRate * 10) / 10
    };
  }, [filteredAttendance]);

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Asistencia de mis Hijos</h2>
          <p className="text-gray-600">Seguimiento detallado de la asistencia escolar</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Descargar Reporte
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar hijo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los hijos</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa General</p>
                <p className={`text-2xl font-bold ${getAttendanceColor(overallStats.overallRate)}`}>
                  {overallStats.overallRate}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Días Presentes</p>
                <p className="text-2xl font-bold text-green-600">{overallStats.presentCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ausencias</p>
                <p className="text-2xl font-bold text-red-600">{overallStats.absentCount}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tardanzas</p>
                <p className="text-2xl font-bold text-yellow-600">{overallStats.lateCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vista por hijo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {childrenStats.map((childData) => (
          <Card key={childData.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={childData.avatar} />
                    <AvatarFallback>
                      {childData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{childData.name}</CardTitle>
                    <CardDescription>
                      {childData.group?.name} • {childData.student_id}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getAttendanceColor(childData.stats.attendanceRate)}`}>
                    {childData.stats.attendanceRate}%
                  </div>
                  <div className="text-sm text-gray-600">Asistencia</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Barra de progreso */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Meta: 95%</span>
                    <span>{childData.stats.attendanceRate}%</span>
                  </div>
                  <Progress 
                    value={childData.stats.attendanceRate} 
                    className="h-2"
                  />
                </div>
                
                {/* Estadísticas detalladas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-xl font-bold text-green-600">{childData.stats.presentDays}</div>
                    <div className="text-xs text-gray-600">Presentes</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <div className="text-xl font-bold text-red-600">{childData.stats.absentDays}</div>
                    <div className="text-xs text-gray-600">Ausencias</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="text-xl font-bold text-yellow-600">{childData.stats.lateDays}</div>
                    <div className="text-xs text-gray-600">Tardanzas</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-xl font-bold text-blue-600">{childData.stats.excusedDays}</div>
                    <div className="text-xs text-gray-600">Justificados</div>
                  </div>
                </div>

                {/* Alertas */}
                {childData.stats.attendanceRate < 85 && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700">
                      Asistencia por debajo del mínimo requerido (85%)
                    </span>
                  </div>
                )}
                
                {childData.stats.lateDays > 3 && (
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-700">
                      Muchas tardanzas este período ({childData.stats.lateDays})
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChildrenAttendance;
