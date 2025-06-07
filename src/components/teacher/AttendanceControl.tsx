import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar,
  Save,
  Eye,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAttendance, useGroups, useUsers } from '@/hooks/useData';

const AttendanceControl: React.FC = () => {
  const { user } = useAuth();
  const { attendance } = useAttendance();
  const { groups } = useGroups();
  const { users } = useUsers();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<any>({});
  const [isViewHistoryOpen, setIsViewHistoryOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Filtrar datos del profesor actual
  const teacherGroups = groups.filter(g => g.teacher_id === user?.id);
  const studentsInGroups = users.filter(u => 
    u.role === 'student' && teacherGroups.some(g => g.students.includes(u.id))
  );

  const getCurrentGroupStudents = () => {
    if (!selectedGroup) return [];
    const group = teacherGroups.find(g => g.id === selectedGroup);
    return studentsInGroups.filter(s => group?.students.includes(s.id));
  };

  const getStudentAttendanceForDate = (studentId: string, date: string) => {
    return attendance.find(a => 
      a.student_id === studentId && 
      a.date === date &&
      a.teacher_id === user?.id
    );
  };

  const getStudentAttendanceHistory = (studentId: string) => {
    return attendance.filter(a => 
      a.student_id === studentId && 
      a.teacher_id === user?.id
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getAttendanceStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => 
      a.date === today && 
      a.teacher_id === user?.id
    );

    const allTeacherAttendance = attendance.filter(a => a.teacher_id === user?.id);
    const totalRecords = allTeacherAttendance.length;
    const presentRecords = allTeacherAttendance.filter(a => a.status === 'present').length;
    const lateRecords = allTeacherAttendance.filter(a => a.status === 'late').length;
    const absentRecords = allTeacherAttendance.filter(a => a.status === 'absent').length;

    return {
      today: {
        total: getCurrentGroupStudents().length,
        present: todayAttendance.filter(a => a.status === 'present').length,
        late: todayAttendance.filter(a => a.status === 'late').length,
        absent: todayAttendance.filter(a => a.status === 'absent').length
      },
      overall: {
        total: totalRecords,
        present: presentRecords,
        late: lateRecords,
        absent: absentRecords,
        attendanceRate: totalRecords > 0 ? ((presentRecords + lateRecords) / totalRecords * 100) : 0
      }
    };
  };

  const handleAttendanceChange = (studentId: string, status: string, time?: string, reason?: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        status,
        time: time || '',
        reason: reason || ''
      }
    }));
  };

  const handleSaveAttendance = () => {
    // En una aplicación real, esto enviaría los datos a la API
    console.log('Guardando asistencia para', selectedDate, attendanceData);
    
    // Simular guardado exitoso
    alert('Asistencia guardada correctamente');
    setAttendanceData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Presente';
      case 'late': return 'Tardanza';
      case 'absent': return 'Ausente';
      default: return 'Sin registrar';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <UserCheck className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      case 'absent': return <UserX className="h-4 w-4" />;
      default: return <UserCheck className="h-4 w-4" />;
    }
  };

  const stats = getAttendanceStats();
  const currentStudents = getCurrentGroupStudents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Control de Asistencia</h2>
        <p className="text-gray-600">Registra y gestiona la asistencia de tus estudiantes</p>
      </div>

      {/* Estadísticas de asistencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estudiantes Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{stats.today.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Presentes</p>
                <p className="text-2xl font-bold text-green-600">{stats.today.present}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tardanzas</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.today.late}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa General</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(stats.overall.attendanceRate)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selección de grupo y fecha */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="group">Grupo</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un grupo" />
                </SelectTrigger>
                <SelectContent>
                  {teacherGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name} - {group.classroom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="date">Fecha</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSaveAttendance}
                disabled={!selectedGroup || Object.keys(attendanceData).length === 0}
              >
                <Save className="mr-2 h-4 w-4" />
                Guardar Asistencia
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de estudiantes para tomar asistencia */}
      {selectedGroup && (
        <Card>
          <CardHeader>
            <CardTitle>
              Lista de Asistencia - {teacherGroups.find(g => g.id === selectedGroup)?.name}
            </CardTitle>
            <CardDescription>
              {new Date(selectedDate).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentStudents.map((student) => {
                const existingAttendance = getStudentAttendanceForDate(student.id, selectedDate);
                const currentStatus = attendanceData[student.id]?.status || existingAttendance?.status || '';
                
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.student_id}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Botones de estado */}
                      <div className="flex space-x-2">
                        <Button
                          variant={currentStatus === 'present' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, 'present', '08:00')}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Presente
                        </Button>
                        <Button
                          variant={currentStatus === 'late' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, 'late', '08:15')}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Tardanza
                        </Button>
                        <Button
                          variant={currentStatus === 'absent' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Ausente
                        </Button>
                      </div>

                      {/* Estado actual */}
                      {currentStatus && (
                        <Badge className={getStatusColor(currentStatus)}>
                          {getStatusIcon(currentStatus)}
                          <span className="ml-1">{getStatusLabel(currentStatus)}</span>
                        </Badge>
                      )}

                      {/* Botón para ver historial */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsViewHistoryOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para historial de asistencia */}
      <Dialog open={isViewHistoryOpen} onOpenChange={setIsViewHistoryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historial de Asistencia</DialogTitle>
            <DialogDescription>
              {selectedStudent?.name} - {selectedStudent?.student_id}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {getStudentAttendanceHistory(selectedStudent.id).filter(a => a.status === 'present').length}
                  </p>
                  <p className="text-sm text-gray-600">Presentes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {getStudentAttendanceHistory(selectedStudent.id).filter(a => a.status === 'late').length}
                  </p>
                  <p className="text-sm text-gray-600">Tardanzas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {getStudentAttendanceHistory(selectedStudent.id).filter(a => a.status === 'absent').length}
                  </p>
                  <p className="text-sm text-gray-600">Ausencias</p>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {getStudentAttendanceHistory(selectedStudent.id).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            {new Date(record.date).toLocaleDateString('es-ES')}
                          </p>
                          {record.arrival_time && (
                            <p className="text-sm text-gray-600">
                              Llegada: {record.arrival_time}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{getStatusLabel(record.status)}</span>
                        </Badge>
                        {record.reason && (
                          <p className="text-xs text-gray-500 mt-1">{record.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewHistoryOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceControl;