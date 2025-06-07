import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  BarChart3,
  Star,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGrades, useGroups } from '@/hooks/useData';

const StudentGrades: React.FC = () => {
  const { user } = useAuth();
  const { grades } = useGrades();
  const { groups } = useGroups();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Datos específicos del estudiante
  const studentGrades = grades.filter(g => g.student_id === user?.id);
  const studentGroup = groups.find(g => g.id === user?.group);

  const filteredGrades = studentGrades.filter(grade => {
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject;
    const matchesPeriod = selectedPeriod === 'all' || grade.period === selectedPeriod;
    const matchesType = selectedType === 'all' || grade.type === selectedType;
    
    return matchesSubject && matchesPeriod && matchesType;
  });

  const getAverageGrade = (subject?: string, period?: string) => {
    let grades = studentGrades;
    if (subject) grades = grades.filter(g => g.subject === subject);
    if (period) grades = grades.filter(g => g.period === period);
    
    if (grades.length === 0) return 0;
    return grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getGradeTrend = (subject: string) => {
    const subjectGrades = studentGrades
      .filter(g => g.subject === subject)
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Prove Yourself': return <Trophy className="h-4 w-4" />;
      case 'Proyecto': return <Target className="h-4 w-4" />;
      case 'Ensayo': return <BookOpen className="h-4 w-4" />;
      case 'Actividad': return <CheckCircle className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Prove Yourself': return 'bg-purple-100 text-purple-800';
      case 'Proyecto': return 'bg-blue-100 text-blue-800';
      case 'Ensayo': return 'bg-green-100 text-green-800';
      case 'Actividad': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAllPeriods = () => {
    const periods = new Set(studentGrades.map(g => g.period));
    return Array.from(periods);
  };

  const getAllTypes = () => {
    const types = new Set(studentGrades.map(g => g.type));
    return Array.from(types);
  };

  const getSubjectStats = (subject: string) => {
    const subjectGrades = studentGrades.filter(g => g.subject === subject);
    const average = getAverageGrade(subject);
    const highest = Math.max(...subjectGrades.map(g => g.grade));
    const lowest = Math.min(...subjectGrades.map(g => g.grade));
    const proveYourself = subjectGrades.filter(g => g.type === 'Prove Yourself');
    const projects = subjectGrades.filter(g => g.type === 'Proyecto');

    return {
      average,
      highest,
      lowest,
      total: subjectGrades.length,
      proveYourself: proveYourself.length,
      proveYourselfAvg: proveYourself.length > 0 ? 
        proveYourself.reduce((sum, g) => sum + g.grade, 0) / proveYourself.length : 0,
      projects: projects.length,
      projectsAvg: projects.length > 0 ? 
        projects.reduce((sum, g) => sum + g.grade, 0) / projects.length : 0
    };
  };

  const overallAverage = getAverageGrade();
  const currentPeriodAverage = getAverageGrade(undefined, 'Tercer Período');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mis Calificaciones</h2>
        <p className="text-gray-600">Seguimiento detallado de mi progreso académico</p>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(overallAverage)}/100</p>
                <p className="text-xs text-gray-500">{studentGrades.length} evaluaciones</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Período Actual</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(currentPeriodAverage)}/100</p>
                <p className="text-xs text-gray-500">Tercer Período</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prove Yourself</p>
                <p className="text-2xl font-bold text-purple-600">
                  {studentGrades.filter(g => g.type === 'Prove Yourself').length}
                </p>
                <p className="text-xs text-gray-500">Evaluaciones realizadas</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mejor Nota</p>
                <p className="text-2xl font-bold text-green-600">
                  {studentGrades.length > 0 ? Math.max(...studentGrades.map(g => g.grade)) : 0}/100
                </p>
                <p className="text-xs text-gray-500">Calificación más alta</p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso por materia */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso por Materia</CardTitle>
          <CardDescription>
            Rendimiento detallado en cada asignatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentGroup?.subjects.map((subject) => {
              const stats = getSubjectStats(subject);
              const trend = getGradeTrend(subject);
              
              return (
                <div key={subject} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{subject}</h4>
                        <p className="text-sm text-gray-600">{stats.total} evaluaciones</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          stats.average >= 90 ? 'text-green-600' :
                          stats.average >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {stats.total > 0 ? Math.round(stats.average) : '--'}/100
                        </p>
                        <div className="w-24">
                          <Progress value={stats.average} className="h-1" />
                        </div>
                      </div>
                      {getTrendIcon(trend)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-green-600">{stats.highest}/100</p>
                      <p className="text-xs text-gray-600">Mejor nota</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-red-600">{stats.lowest}/100</p>
                      <p className="text-xs text-gray-600">Menor nota</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <p className="text-sm font-medium text-purple-600">
                        {stats.proveYourself > 0 ? Math.round(stats.proveYourselfAvg) : '--'}/100
                      </p>
                      <p className="text-xs text-gray-600">Prove Yourself</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-sm font-medium text-blue-600">
                        {stats.projects > 0 ? Math.round(stats.projectsAvg) : '--'}/100
                      </p>
                      <p className="text-xs text-gray-600">Proyectos</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {studentGroup?.subjects.map((subject) => (
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
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {getAllTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
                .map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                        <Badge variant="outline">{grade.subject}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(grade.type)}>
                        {getTypeIcon(grade.type)}
                        <span className="ml-1">{grade.type}</span>
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
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Análisis de rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Rendimiento</CardTitle>
          <CardDescription>
            Insights sobre tu progreso académico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mejores materias */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">🏆 Tus Mejores Materias</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {studentGroup?.subjects
                  .map(subject => ({ subject, avg: getAverageGrade(subject) }))
                  .sort((a, b) => b.avg - a.avg)
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={item.subject} className="text-sm">
                      <span className="font-medium">{index + 1}. {item.subject}</span>
                      <span className="text-green-600 ml-2">{Math.round(item.avg)}/100</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Áreas de mejora */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">📈 Áreas de Mejora</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {studentGroup?.subjects
                  .map(subject => ({ subject, avg: getAverageGrade(subject) }))
                  .sort((a, b) => a.avg - b.avg)
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={item.subject} className="text-sm">
                      <span className="font-medium">{item.subject}</span>
                      <span className="text-yellow-600 ml-2">{Math.round(item.avg)}/100</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Progreso reciente */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">📊 Progreso Reciente</h4>
              <p className="text-sm text-blue-700">
                En el período actual tienes un promedio de <strong>{Math.round(currentPeriodAverage)}/100</strong>
                {currentPeriodAverage > overallAverage ? 
                  ' (¡Mejorando con respecto al promedio general!)' : 
                  ' (Puedes mejorar para superar tu promedio general)'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGrades;