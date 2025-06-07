import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  BookOpen,
  Target,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers, useGrades, useGroups } from '@/hooks/useData';

const ChildrenGrades: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUsers();
  const { grades } = useGrades();
  const { groups } = useGroups();
  const [selectedChild, setSelectedChild] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Obtener información de los hijos
  const children = users.filter(u => user?.children?.includes(u.id));
  
  // Calificaciones de los hijos
  const childrenGrades = grades.filter(g => 
    children.some(child => child.id === g.student_id)
  );

  const filteredGrades = childrenGrades.filter(grade => {
    const matchesChild = selectedChild === 'all' || grade.student_id === selectedChild;
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject;
    const matchesPeriod = selectedPeriod === 'all' || grade.period === selectedPeriod;
    
    return matchesChild && matchesSubject && matchesPeriod;
  });

  const getChildInfo = (childId: string) => {
    return children.find(c => c.id === childId);
  };

  const getChildGroup = (childId: string) => {
    const child = getChildInfo(childId);
    return groups.find(g => g.id === child?.group);
  };

  const getAverageGrade = (studentId: string, subject?: string) => {
    let studentGrades = childrenGrades.filter(g => g.student_id === studentId);
    if (subject) {
      studentGrades = studentGrades.filter(g => g.subject === subject);
    }
    if (studentGrades.length === 0) return 0;
    return studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length;
  };

  const getSubjectAverage = (subject: string) => {
    const subjectGrades = childrenGrades.filter(g => g.subject === subject);
    if (subjectGrades.length === 0) return 0;
    return subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getGradeTrend = (studentId: string, subject: string) => {
    const subjectGrades = childrenGrades
      .filter(g => g.student_id === studentId && g.subject === subject)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (subjectGrades.length < 2) return 'stable';
    
    const recent = subjectGrades.slice(-2);
    const difference = recent[1].grade - recent[0].grade;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAllSubjects = () => {
    const subjects = new Set(childrenGrades.map(g => g.subject));
    return Array.from(subjects);
  };

  const getAllPeriods = () => {
    const periods = new Set(childrenGrades.map(g => g.period));
    return Array.from(periods);
  };

  const getChildStats = (childId: string) => {
    const childGrades = childrenGrades.filter(g => g.student_id === childId);
    const average = getAverageGrade(childId);
    const totalEvaluations = childGrades.length;
    const proveYourself = childGrades.filter(g => g.type === 'Prove Yourself').length;
    const projects = childGrades.filter(g => g.type === 'Proyecto').length;

    return {
      average,
      totalEvaluations,
      proveYourself,
      projects
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Calificaciones de mis Hijos</h2>
        <p className="text-gray-600">Seguimiento detallado del progreso académico</p>
      </div>

      {/* Resumen por hijo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => {
          const stats = getChildStats(child.id);
          const group = getChildGroup(child.id);
          
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
                    <CardDescription>
                      {child.grade} - {group?.name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Promedio General</span>
                      <span className={`text-sm font-bold ${
                        stats.average >= 90 ? 'text-green-600' :
                        stats.average >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(stats.average)}/100
                      </span>
                    </div>
                    <Progress value={stats.average} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="font-bold text-blue-600">{stats.totalEvaluations}</p>
                      <p className="text-gray-600">Total</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="font-bold text-purple-600">{stats.proveYourself}</p>
                      <p className="text-gray-600">Prove Yourself</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="font-bold text-green-600">{stats.projects}</p>
                      <p className="text-gray-600">Proyectos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {getAllSubjects().map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los períodos</SelectItem>
                  {getAllPeriods().map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promedios por materia */}
      {selectedChild !== 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>Progreso por Materia</CardTitle>
            <CardDescription>
              {getChildInfo(selectedChild)?.name} - Rendimiento detallado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getChildGroup(selectedChild)?.subjects.map((subject) => {
                const average = getAverageGrade(selectedChild, subject);
                const trend = getGradeTrend(selectedChild, subject);
                const subjectGrades = childrenGrades.filter(g => 
                  g.student_id === selectedChild && g.subject === subject
                ).length;
                
                return (
                  <div key={subject} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{subject}</p>
                        <p className="text-sm text-gray-600">{subjectGrades} evaluaciones</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          average >= 90 ? 'text-green-600' :
                          average >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {subjectGrades > 0 ? Math.round(average) : '--'}/100
                        </p>
                        <div className="w-24">
                          <Progress value={average} className="h-1" />
                        </div>
                      </div>
                      {getTrendIcon(trend)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de calificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Calificaciones</CardTitle>
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
                <TableHead>Descripción</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Período</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((grade) => {
                  const child = getChildInfo(grade.student_id);
                  return (
                    <TableRow key={grade.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={child?.avatar} />
                            <AvatarFallback>
                              {child?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{child?.name}</p>
                            <p className="text-sm text-gray-600">{child?.group}</p>
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
                          grade.type === 'Ensayo' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {grade.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{grade.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(grade.grade)}>
                          <Award className="h-3 w-3 mr-1" />
                          {grade.grade}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm">
                            {new Date(grade.date).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{grade.period}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Estadísticas comparativas */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis Comparativo</CardTitle>
          <CardDescription>
            Rendimiento por materia de todos los hijos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getAllSubjects().map((subject) => (
              <div key={subject} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center">
                    <Target className="h-4 w-4 mr-2 text-blue-600" />
                    {subject}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Promedio general: {Math.round(getSubjectAverage(subject))}/100
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {children.map((child) => {
                    const average = getAverageGrade(child.id, subject);
                    const gradeCount = childrenGrades.filter(g => 
                      g.student_id === child.id && g.subject === subject
                    ).length;
                    
                    if (gradeCount === 0) return null;
                    
                    return (
                      <div key={child.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{child.name}</span>
                        <div className="text-right">
                          <span className={`text-sm font-bold ${
                            average >= 90 ? 'text-green-600' :
                            average >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {Math.round(average)}/100
                          </span>
                          <p className="text-xs text-gray-500">{gradeCount} eval.</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildrenGrades;