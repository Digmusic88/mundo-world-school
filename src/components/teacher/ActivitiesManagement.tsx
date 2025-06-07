import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities, useGroups, useUsers } from '@/hooks/useData';

const ActivitiesManagement: React.FC = () => {
  const { user } = useAuth();
  const { activities } = useActivities();
  const { groups } = useGroups();
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isViewActivityOpen, setIsViewActivityOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    subject: '',
    group: '',
    type: 'Tarea',
    due_date: '',
    max_points: '100',
    materials: ''
  });

  // Filtrar datos del profesor actual
  const teacherGroups = groups.filter(g => g.teacher_id === user?.id);
  const teacherActivities = activities.filter(a => a.teacher_id === user?.id);
  const studentsInGroups = users.filter(u => 
    u.role === 'student' && teacherGroups.some(g => g.students.includes(u.id))
  );

  const filteredActivities = teacherActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || activity.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'completed': return 'Completada';
      case 'overdue': return 'Vencida';
      default: return status;
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

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddActivity = () => {
    // En una aplicación real, esto haría una petición a la API
    console.log('Nueva actividad:', newActivity);
    setIsAddActivityOpen(false);
    setNewActivity({
      title: '',
      description: '',
      subject: '',
      group: '',
      type: 'Tarea',
      due_date: '',
      max_points: '100',
      materials: ''
    });
  };

  const handleViewActivity = (activity: any) => {
    setSelectedActivity(activity);
    setIsViewActivityOpen(true);
  };

  const activityStats = {
    total: teacherActivities.length,
    active: teacherActivities.filter(a => a.status === 'active').length,
    completed: teacherActivities.filter(a => a.status === 'completed').length,
    overdue: teacherActivities.filter(a => {
      const today = new Date();
      const due = new Date(a.due_date);
      return due < today && a.status === 'active';
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Actividades</h2>
          <p className="text-gray-600">Administra tareas, proyectos y evaluaciones</p>
        </div>
        <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Actividad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Actividad</DialogTitle>
              <DialogDescription>
                Crea una nueva actividad para tus estudiantes
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                    placeholder="Ej: Proyecto de Energías Renovables"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newActivity.type} onValueChange={(value) => setNewActivity({...newActivity, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de actividad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tarea">Tarea</SelectItem>
                      <SelectItem value="Proyecto">Proyecto</SelectItem>
                      <SelectItem value="Ensayo">Ensayo</SelectItem>
                      <SelectItem value="Prove Yourself">Prove Yourself</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Materia</Label>
                  <Select value={newActivity.subject} onValueChange={(value) => setNewActivity({...newActivity, subject: value})}>
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
                  <Label htmlFor="group">Grupo</Label>
                  <Select value={newActivity.group} onValueChange={(value) => setNewActivity({...newActivity, group: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  placeholder="Describe la actividad detalladamente..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="due_date">Fecha de Entrega</Label>
                  <Input
                    type="date"
                    value={newActivity.due_date}
                    onChange={(e) => setNewActivity({...newActivity, due_date: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max_points">Puntuación Máxima</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={newActivity.max_points}
                    onChange={(e) => setNewActivity({...newActivity, max_points: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="materials">Materiales Necesarios</Label>
                <Textarea
                  value={newActivity.materials}
                  onChange={(e) => setNewActivity({...newActivity, materials: e.target.value})}
                  placeholder="Lista los materiales que necesitarán los estudiantes..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddActivity}>
                Crear Actividad
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-blue-600">{activityStats.active}</p>
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

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="overdue">Vencidas</SelectItem>
              </SelectContent>
            </Select>
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
          </div>
        </CardContent>
      </Card>

      {/* Tabla de actividades */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Actividades</CardTitle>
          <CardDescription>
            {filteredActivities.length} actividades encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actividad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => {
                const daysUntilDue = getDaysUntilDue(activity.due_date);
                const isOverdue = daysUntilDue < 0 && activity.status === 'active';
                
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {activity.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.subject}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        {activity.group}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(isOverdue ? 'overdue' : activity.status)}>
                        {getStatusLabel(isOverdue ? 'overdue' : activity.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        <div>
                          <p className="text-sm">
                            {new Date(activity.due_date).toLocaleDateString('es-ES')}
                          </p>
                          <p className={`text-xs ${
                            daysUntilDue < 0 ? 'text-red-600' :
                            daysUntilDue <= 2 ? 'text-yellow-600' :
                            'text-gray-500'
                          }`}>
                            {daysUntilDue < 0 ? `Vencida hace ${Math.abs(daysUntilDue)} días` :
                             daysUntilDue === 0 ? 'Vence hoy' :
                             daysUntilDue === 1 ? 'Vence mañana' :
                             `${daysUntilDue} días restantes`}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{activity.max_points} pts</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewActivity(activity)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para ver detalles de actividad */}
      <Dialog open={isViewActivityOpen} onOpenChange={setIsViewActivityOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedActivity?.title}</DialogTitle>
            <DialogDescription>
              Detalles de la actividad
            </DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Tipo</Label>
                  <Badge className={getTypeColor(selectedActivity.type)}>
                    {selectedActivity.type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Materia</Label>
                  <p>{selectedActivity.subject}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Descripción</Label>
                <p className="mt-1">{selectedActivity.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Fecha de entrega</Label>
                  <p>{new Date(selectedActivity.due_date).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Puntuación máxima</Label>
                  <p>{selectedActivity.max_points} puntos</p>
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
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Estudiantes asignados</Label>
                <p className="text-sm text-gray-600">
                  {selectedActivity.students_assigned?.length || 0} estudiantes
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewActivityOpen(false)}>
              Cerrar
            </Button>
            <Button>
              Editar Actividad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivitiesManagement;