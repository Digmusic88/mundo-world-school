import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Search, 
  Filter,
  Award,
  TrendingUp,
  TrendingDown,
  Calculator
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGrades, useUsers, useGroups } from '@/hooks/useData';

const GradesManagement: React.FC = () => {
  const { user } = useAuth();
  const { grades } = useGrades();
  const { users } = useUsers();
  const { groups } = useGroups();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({
    student_id: '',
    subject: '',
    grade: '',
    type: 'Actividad',
    description: ''
  });

  // Filtrar datos del profesor actual
  const teacherGroups = groups.filter(g => g.teacher_id === user?.id);
  const studentsInGroups = users.filter(u => 
    u.role === 'student' && teacherGroups.some(g => g.students.includes(u.id))
  );
  const teacherGrades = grades.filter(g => g.teacher_id === user?.id);

  const filteredGrades = teacherGrades.filter(grade => {
    const student = studentsInGroups.find(s => s.id === grade.student_id);
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || grade.subject === subjectFilter;
    const matchesGroup = groupFilter === 'all' || 
                        teacherGroups.some(g => g.id === groupFilter && g.students.includes(grade.student_id));
    
    return matchesSearch && matchesSubject && matchesGroup;
  });

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getAverageBySubject = (subject: string) => {
    const subjectGrades = teacherGrades.filter(g => g.subject === subject);
    if (subjectGrades.length === 0) return 0;
    return subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length;
  };

  const getAverageByStudent = (studentId: string) => {
    const studentGrades = teacherGrades.filter(g => g.student_id === studentId);
    if (studentGrades.length === 0) return 0;
    return studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length;
  };

  const handleAddGrade = () => {
    // En una aplicación real, esto haría una petición a la API
    console.log('Nueva calificación:', newGrade);
    setIsAddGradeOpen(false);
    setNewGrade({
      student_id: '',
      subject: '',
      grade: '',
      type: 'Actividad',
      description: ''
    });
  };

  const subjectStats = user?.subjects?.map(subject => ({
    subject,
    average: getAverageBySubject(subject),
    count: teacherGrades.filter(g => g.subject === subject).length
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Calificaciones</h2>
          <p className="text-gray-600">Administra las calificaciones de tus estudiantes</p>
        </div>
        <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Calificación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Calificación</DialogTitle>
              <DialogDescription>
                Registra una nueva calificación para un estudiante
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="student">Estudiante</Label>
                <Select value={newGrade.student_id} onValueChange={(value) => setNewGrade({...newGrade, student_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentsInGroups.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} - {student.group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Materia</Label>
                <Select value={newGrade.subject} onValueChange={(value) => setNewGrade({...newGrade, subject: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.subjects?.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Evaluación</Label>
                <Select value={newGrade.type} onValueChange={(value) => setNewGrade({...newGrade, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de evaluación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prove Yourself">Prove Yourself</SelectItem>
                    <SelectItem value="Actividad">Actividad</SelectItem>
                    <SelectItem value="Proyecto">Proyecto</SelectItem>
                    <SelectItem value="Ensayo">Ensayo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grade">Calificación (0-100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newGrade.grade}
                  onChange={(e) => setNewGrade({...newGrade, grade: e.target.value})}
                  placeholder="85"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  value={newGrade.description}
                  onChange={(e) => setNewGrade({...newGrade, description: e.target.value})}
                  placeholder="Descripción de la evaluación"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddGradeOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddGrade}>
                Agregar Calificación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas por materia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectStats.map((stat) => (
          <Card key={stat.subject}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.subject}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(stat.average)}/100
                  </p>
                  <p className="text-xs text-gray-500">{stat.count} calificaciones</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  stat.average >= 80 ? 'bg-green-50' : 
                  stat.average >= 70 ? 'bg-yellow-50' : 'bg-red-50'
                }`}>
                  {stat.average >= 80 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por estudiante o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por materia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las materias</SelectItem>
                {user?.subjects?.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los grupos</SelectItem>
                {teacherGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de calificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Calificaciones</CardTitle>
          <CardDescription>
            {filteredGrades.length} calificaciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((grade) => {
                const student = studentsInGroups.find(s => s.id === grade.student_id);
                return (
                  <TableRow key={grade.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student?.avatar} />
                          <AvatarFallback>
                            {student?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student?.name}</p>
                          <p className="text-sm text-gray-600">{student?.group}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{grade.subject}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${
                        grade.type === 'Prove Yourself' ? 'bg-purple-100 text-purple-800' :
                        grade.type === 'Proyecto' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {grade.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(grade.grade)}>
                        {grade.grade}/100
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{grade.description}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(grade.date).toLocaleDateString('es-ES')}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Promedios por estudiante */}
      <Card>
        <CardHeader>
          <CardTitle>Promedios por Estudiante</CardTitle>
          <CardDescription>
            Rendimiento general de tus estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentsInGroups.map((student) => {
              const average = getAverageByStudent(student.id);
              const gradeCount = teacherGrades.filter(g => g.student_id === student.id).length;
              
              return (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.group}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      average >= 90 ? 'text-green-600' :
                      average >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {gradeCount > 0 ? Math.round(average) : 'Sin calificaciones'}
                    </p>
                    <p className="text-xs text-gray-500">{gradeCount} evaluaciones</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradesManagement;