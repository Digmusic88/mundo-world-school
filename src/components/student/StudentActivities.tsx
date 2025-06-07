import React, { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  FileText,
  Upload,
  Eye,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/hooks/useData';

const StudentActivities: React.FC = () => {
  const { user } = useAuth();
  const { activities } = useActivities();
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submission, setSubmission] = useState({
    text: '',
    files: ''
  });

  // Actividades del estudiante
  const studentActivities = activities.filter(a => 
    a.students_assigned.includes(user?.id || '')
  );

  const filteredActivities = studentActivities.filter(activity => {
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || activity.subject === subjectFilter;
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    
    return matchesStatus && matchesSubject && matchesType;
  });

  const getStatusColor = (status: string, dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const isOverdue = due < today && status === 'active';
    
    if (isOverdue) return 'bg-red-100 text-red-800 border-red-200';
    
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string, dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const isOverdue = due < today && status === 'active';
    
    if (isOverdue) return 'Vencida';
    
    switch (status) {
      case 'active': return 'Pendiente';
      case 'completed': return 'Entregada';
      case 'overdue': return 'Vencida';
      default: return status;
    }
  };

  const getStatusIcon = (status: string, dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const isOverdue = due < today && status === 'active';
    
    if (isOverdue) return <AlertCircle className="h-4 w-4" />;
    
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Prove Yourself': return 'bg-purple-100 text-purple-800';
      case 'Proyecto': return 'bg-blue-100 text-blue-800';
      case 'Ensayo': return 'bg-green-100 text-green-800';
      case 'Tarea': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Prove Yourself': return <Trophy className="h-4 w-4" />;
      case 'Proyecto': return <Target className="h-4 w-4" />;
      case 'Ensayo': return <FileText className="h-4 w-4" />;
      case 'Tarea': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyLevel = (dueDate: string, status: string) => {
    if (status === 'completed') return 'completed';
    
    const daysUntilDue = getDaysUntilDue(dueDate);
    
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue === 0) return 'due-today';
    if (daysUntilDue <= 2) return 'urgent';
    if (daysUntilDue <= 7) return 'soon';
    return 'normal';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return 'border-l-red-500 bg-red-50';
      case 'due-today': return 'border-l-orange-500 bg-orange-50';
      case 'urgent': return 'border-l-yellow-500 bg-yellow-50';
      case 'soon': return 'border-l-blue-500 bg-blue-50';
      case 'completed': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const getAllSubjects = () => {
    const subjects = new Set(studentActivities.map(a => a.subject));
    return Array.from(subjects);
  };

  const getAllTypes = () => {
    const types = new Set(studentActivities.map(a => a.type));
    return Array.from(types);
  };

  const handleViewActivity = (activity: any) => {
    setSelectedActivity(activity);
    setIsDetailOpen(true);
  };

  const handleSubmitActivity = (activity: any) => {
    setSelectedActivity(activity);
    setIsSubmitOpen(true);
  };

  const handleSubmit = () => {
    // En una aplicación real, esto enviaría la entrega
    console.log('Entrega de actividad:', selectedActivity?.id, submission);
    alert('Actividad entregada correctamente');
    setIsSubmitOpen(false);
    setSubmission({ text: '', files: '' });
  };

  const activityStats = {
    total: studentActivities.length,
    pending: studentActivities.filter(a => a.status === 'active').length,
    completed: studentActivities.filter(a => a.status === 'completed').length,
    overdue: studentActivities.filter(a => {
      const today = new Date();
      const due = new Date(a.due_date);
      return due < today && a.status === 'active';
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mis Actividades</h2>
        <p className="text-gray-600">Gestiona tus tareas, proyectos y evaluaciones</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{activityStats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-blue-600">{activityStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{activityStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{activityStats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Pendientes</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
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

      {/* Lista de actividades */}
      <div className="space-y-4">
        {filteredActivities
          .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
          .map((activity) => {
            const daysUntilDue = getDaysUntilDue(activity.due_date);
            const urgency = getUrgencyLevel(activity.due_date, activity.status);
            
            return (
              <Card key={activity.id} className={`border-l-4 ${getUrgencyColor(urgency)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className={getTypeColor(activity.type)}>
                          {getTypeIcon(activity.type)}
                          <span className="ml-1">{activity.type}</span>
                        </Badge>
                        <Badge variant="outline">{activity.subject}</Badge>
                        <Badge className={getStatusColor(activity.status, activity.due_date)}>
                          {getStatusIcon(activity.status, activity.due_date)}
                          <span className="ml-1">{getStatusLabel(activity.status, activity.due_date)}</span>
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {activity.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>
                            {new Date(activity.due_date).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{activity.max_points} puntos</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="font-medium">{activity.teacher_name}</span>
                        </div>
                        <div className={`flex items-center ${
                          daysUntilDue < 0 ? 'text-red-600' :
                          daysUntilDue <= 2 ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="font-medium">
                            {daysUntilDue < 0 ? `Vencida hace ${Math.abs(daysUntilDue)} días` :
                             daysUntilDue === 0 ? 'Vence hoy' :
                             daysUntilDue === 1 ? 'Vence mañana' :
                             `${daysUntilDue} días restantes`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewActivity(activity)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                      {activity.status === 'active' && (
                        <Button 
                          size="sm"
                          onClick={() => handleSubmitActivity(activity)}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Entregar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Modal de detalles de actividad */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedActivity?.title}</DialogTitle>
            <DialogDescription>
              {selectedActivity?.subject} • {selectedActivity?.teacher_name}
            </DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Badge className={getTypeColor(selectedActivity.type)}>
                  {getTypeIcon(selectedActivity.type)}
                  <span className="ml-1">{selectedActivity.type}</span>
                </Badge>
                <Badge className={getStatusColor(selectedActivity.status, selectedActivity.due_date)}>
                  {getStatusIcon(selectedActivity.status, selectedActivity.due_date)}
                  <span className="ml-1">{getStatusLabel(selectedActivity.status, selectedActivity.due_date)}</span>
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Descripción</Label>
                <p className="mt-1">{selectedActivity.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Fecha de entrega</Label>
                  <p className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    {new Date(selectedActivity.due_date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Puntuación máxima</Label>
                  <p className="flex items-center mt-1">
                    <Target className="h-4 w-4 mr-1 text-gray-500" />
                    {selectedActivity.max_points} puntos
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Materiales necesarios</Label>
                <div className="mt-1">
                  {selectedActivity.materials?.map((material: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-1">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Cerrar
            </Button>
            {selectedActivity?.status === 'active' && (
              <Button onClick={() => {
                setIsDetailOpen(false);
                handleSubmitActivity(selectedActivity);
              }}>
                <Upload className="mr-2 h-4 w-4" />
                Entregar Actividad
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de entrega de actividad */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Entregar Actividad</DialogTitle>
            <DialogDescription>
              {selectedActivity?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="submission-text">Respuesta/Comentarios</Label>
              <Textarea
                id="submission-text"
                value={submission.text}
                onChange={(e) => setSubmission({...submission, text: e.target.value})}
                placeholder="Escribe tu respuesta o comentarios sobre la actividad..."
                rows={6}
              />
            </div>
            
            <div>
              <Label htmlFor="files">Archivos (opcional)</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={(e) => setSubmission({...submission, files: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes adjuntar documentos, imágenes o cualquier archivo relevante
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!submission.text.trim()}>
              <Upload className="mr-2 h-4 w-4" />
              Entregar Actividad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentActivities;