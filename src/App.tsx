import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/components/auth/LoginPage';
import MainLayout from '@/components/layout/MainLayout';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import ParentDashboard from '@/components/dashboards/ParentDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import UserManagement from '@/components/admin/UserManagement';
import GroupManagement from '@/components/admin/GroupManagement';
import StatisticsPanel from '@/components/admin/StatisticsPanelSimple';
import GradesManagement from '@/components/teacher/GradesManagement';
import ActivitiesManagement from '@/components/teacher/ActivitiesManagement';
import AttendanceControl from '@/components/teacher/AttendanceControl';
import ChildrenGrades from '@/components/parent/ChildrenGrades';
import ChildrenAttendance from '@/components/parent/ChildrenAttendanceSimple';
import FinancialPanel from '@/components/parent/FinancialPanel';
import StudentGrades from '@/components/student/StudentGrades';
import StudentActivities from '@/components/student/StudentActivities';
import MessagingSystem from '@/components/messaging/MessagingSystemSimple';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Construction } from 'lucide-react';

// Componente temporal para secciones en desarrollo
const UnderDevelopment: React.FC<{ sectionName: string }> = ({ sectionName }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Card className="max-w-md">
      <CardHeader className="text-center">
        <Construction className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <CardTitle>En Desarrollo</CardTitle>
        <CardDescription>
          La sección "{sectionName}" está siendo desarrollada
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Badge variant="secondary">Próximamente</Badge>
        <p className="text-sm text-gray-500 mt-4">
          Esta funcionalidad estará disponible en una próxima actualización
        </p>
      </CardContent>
    </Card>
  </div>
);

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    // Contenido para Administradores
    if (user.role === 'admin') {
      switch (activeSection) {
        case 'dashboard':
          return <AdminDashboard onSectionChange={setActiveSection} />;
        case 'users':
          return <UserManagement />;
        case 'groups':
          return <GroupManagement />;
        case 'attendance':
          return <UnderDevelopment sectionName="Control de Asistencia" />;
        case 'finances':
          return <UnderDevelopment sectionName="Panel de Finanzas" />;
        case 'statistics':
          return <StatisticsPanel />;
        case 'messages':
          return <MessagingSystem />;
        case 'settings':
          return <UnderDevelopment sectionName="Configuración" />;
        default:
          return <AdminDashboard onSectionChange={setActiveSection} />;
      }
    }

    // Contenido para Profesores
    if (user.role === 'teacher') {
      switch (activeSection) {
        case 'dashboard':
          return <TeacherDashboard onSectionChange={setActiveSection} />;
        case 'subjects':
          return <UnderDevelopment sectionName="Asignaturas" />;
        case 'groups':
          return <UnderDevelopment sectionName="Mis Grupos" />;
        case 'students':
          return <UnderDevelopment sectionName="Estudiantes" />;
        case 'activities':
          return <ActivitiesManagement />;
        case 'evaluations':
          return <UnderDevelopment sectionName="Prove Yourself" />;
        case 'grades':
          return <GradesManagement />;
        case 'attendance':
          return <AttendanceControl />;
        case 'messages':
          return <MessagingSystem />;
        default:
          return <TeacherDashboard onSectionChange={setActiveSection} />;
      }
    }

    // Contenido para Padres
    if (user.role === 'parent') {
      switch (activeSection) {
        case 'dashboard':
          return <ParentDashboard onSectionChange={setActiveSection} />;
        case 'children':
          return <UnderDevelopment sectionName="Mis Hijos" />;
        case 'grades':
          return <ChildrenGrades />;
        case 'attendance':
          return <ChildrenAttendance />;
        case 'messages':
          return <MessagingSystem />;
        case 'schedule':
          return <UnderDevelopment sectionName="Horarios" />;
        case 'activities':
          return <UnderDevelopment sectionName="Actividades" />;
        case 'finances':
          return <FinancialPanel />;
        default:
          return <ParentDashboard onSectionChange={setActiveSection} />;
      }
    }

    // Contenido para Estudiantes
    if (user.role === 'student') {
      switch (activeSection) {
        case 'dashboard':
          return <StudentDashboard onSectionChange={setActiveSection} />;
        case 'grades':
          return <StudentGrades />;
        case 'schedule':
          return <UnderDevelopment sectionName="Mi Horario" />;
        case 'activities':
          return <StudentActivities />;
        case 'attendance':
          return <UnderDevelopment sectionName="Mi Asistencia" />;
        case 'messages':
          return <MessagingSystem />;
        case 'resources':
          return <UnderDevelopment sectionName="Recursos" />;
        default:
          return <StudentDashboard onSectionChange={setActiveSection} />;
      }
    }

    return <UnderDevelopment sectionName="Contenido" />;
  };

  return (
    <MainLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <AppContent />
          <Toaster />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
