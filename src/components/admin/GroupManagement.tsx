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
  Users,
  BookOpen,
  MapPin,
  Clock,
  UserPlus,
  UserMinus,
  Eye,
  Settings
} from 'lucide-react';
import { useGroups, useUsers, useSchoolConfig } from '@/hooks/useData';

const GroupManagement: React.FC = () => {
  const { groups } = useGroups();
  const { users } = useUsers();
  const { config } = useSchoolConfig();
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    grade: '',
    section: '',
    teacher_id: '',
    classroom: '',
    schedule: '',
    subjects: [] as string[],
    max_students: '30'
  });

  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');
  const availableStudents = students.filter(s => 
    !groups.some(g => g.students.includes(s.id))
  );

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || group.grade === gradeFilter;
    
    return matchesSearch && matchesGrade;
  });

  const getTeacherInfo = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId);
  };

  const getGroupStudents = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    return students.filter(s => group?.students.includes(s.id));
  };

  const handleAddGroup = () => {
    // En una aplicación real, esto haría una petición a la API
    console.log('Nuevo grupo:', newGroup);
    setIsAddGroupOpen(false);
    setNewGroup({
      name: '',
      grade: '',
      section: '',
      teacher_id: '',
      classroom: '',
      schedule: '',
      subjects: [],
      max_students: '30'
    });
  };

  const handleEditGroup = (group: any) => {
    setSelectedGroup(group);
    setNewGroup({
      name: group.name,
      grade: group.grade,
      section: group.section,
      teacher_id: group.teacher_id,
      classroom: group.classroom,
      schedule: group.schedule,
      subjects: group.subjects,
      max_students: group.total_students.toString()
    });
    setIsEditGroupOpen(true);
  };

  const handleManageStudents = (group: any) => {
    setSelectedGroup(group);
    setIsManageStudentsOpen(true);
  };

  const handleUpdateGroup = () => {
    console.log('Actualizar grupo:', selectedGroup?.id, newGroup);
    setIsEditGroupOpen(false);
  };

  const handleSubjectToggle = (subject: string) => {
    setNewGroup(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject) 
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const groupStats = {
    total: groups.length,
    totalStudents: students.length,
    assignedStudents: groups.reduce((sum, g) => sum + g.students.length, 0),
    unassignedStudents: availableStudents.length,
    totalTeachers: teachers.length,
    assignedTeachers: new Set(groups.map(g => g.teacher_id)).size
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Grupos</h2>
          <p className="text-gray-600">Administra grupos, clases y asignaciones</p>
        </div>
        <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Grupo</DialogTitle>
              <DialogDescription>
                Configura un nuevo grupo o clase
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grado</Label>
                  <Select value={newGroup.grade} onValueChange={(value) => setNewGroup({...newGroup, grade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona grado" />
                    </SelectTrigger>
                    <SelectContent>
                      {config?.grade_levels.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="section">Sección</Label>
                  <Select value={newGroup.section} onValueChange={(value) => setNewGroup({...newGroup, section: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sección" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre del Grupo</Label>
                  <Input
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="Ej: 9° Grado A"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="teacher">Profesor Titular</Label>
                  <Select value={newGroup.teacher_id} onValueChange={(value) => setNewGroup({...newGroup, teacher_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona profesor" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="classroom">Aula</Label>
                  <Input
                    value={newGroup.classroom}
                    onChange={(e) => setNewGroup({...newGroup, classroom: e.target.value})}
                    placeholder="Ej: Aula 101"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="schedule">Horario</Label>
                  <Input
                    value={newGroup.schedule}
                    onChange={(e) => setNewGroup({...newGroup, schedule: e.target.value})}
                    placeholder="Ej: 08:00 - 14:00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max_students">Máximo Estudiantes</Label>
                  <Input
                    type="number"
                    value={newGroup.max_students}
                    onChange={(e) => setNewGroup({...newGroup, max_students: e.target.value})}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Materias</Label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {config?.subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={subject}
                        checked={newGroup.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        className="rounded"
                      />
                      <label htmlFor={subject} className="text-sm">{subject}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddGroupOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddGroup}>
                Crear Grupo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{groupStats.total}</p>
              <p className="text-xs text-gray-600">Total Grupos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{groupStats.totalStudents}</p>
              <p className="text-xs text-gray-600">Total Estudiantes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{groupStats.assignedStudents}</p>
              <p className="text-xs text-gray-600">Asignados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{groupStats.unassignedStudents}</p>
              <p className="text-xs text-gray-600">Sin Asignar</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{groupStats.totalTeachers}</p>
              <p className="text-xs text-gray-600">Total Profesores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-600">{groupStats.assignedTeachers}</p>
              <p className="text-xs text-gray-600">Asignados</p>
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
                placeholder="Buscar grupos o profesores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por grado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los grados</SelectItem>
                {config?.grade_levels.map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de grupos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Grupos</CardTitle>
          <CardDescription>
            {filteredGroups.length} grupos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableHead>Profesor Titular</TableHead>
                <TableHead>Estudiantes</TableHead>
                <TableHead>Aula</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Materias</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => {
                const teacher = getTeacherInfo(group.teacher_id);
                const groupStudents = getGroupStudents(group.id);
                
                return (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-gray-600">{group.academic_year}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={teacher?.avatar} />
                          <AvatarFallback>
                            {teacher?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{teacher?.name}</p>
                          <p className="text-sm text-gray-600">{teacher?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="font-medium">{groupStudents.length}</span>
                        <span className="text-gray-500">/{group.total_students}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {group.classroom}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {group.schedule}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {group.subjects.slice(0, 3).map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {group.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{group.subjects.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleManageStudents(group)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
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

      {/* Modal para editar grupo */}
      <Dialog open={isEditGroupOpen} onOpenChange={setIsEditGroupOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Grupo</DialogTitle>
            <DialogDescription>
              Modifica la configuración del grupo
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-grade">Grado</Label>
                <Select value={newGroup.grade} onValueChange={(value) => setNewGroup({...newGroup, grade: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {config?.grade_levels.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-section">Sección</Label>
                <Select value={newGroup.section} onValueChange={(value) => setNewGroup({...newGroup, section: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre del Grupo</Label>
                <Input
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  placeholder="Ej: 9° Grado A"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-teacher">Profesor Titular</Label>
                <Select value={newGroup.teacher_id} onValueChange={(value) => setNewGroup({...newGroup, teacher_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-classroom">Aula</Label>
                <Input
                  value={newGroup.classroom}
                  onChange={(e) => setNewGroup({...newGroup, classroom: e.target.value})}
                  placeholder="Ej: Aula 101"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGroupOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateGroup}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para gestionar estudiantes */}
      <Dialog open={isManageStudentsOpen} onOpenChange={setIsManageStudentsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gestionar Estudiantes</DialogTitle>
            <DialogDescription>
              {selectedGroup?.name} - Asignar y remover estudiantes
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Estudiantes Disponibles</h4>
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {availableStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-gray-600">{student.student_id}</p>
                        </div>
                      </div>
                      <Button size="sm">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Estudiantes Asignados</h4>
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {getGroupStudents(selectedGroup?.id).map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-gray-600">{student.student_id}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageStudentsOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupManagement;