export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
  phone?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  created_at: string;
  last_login: string;
  // Campos específicos por rol
  subjects?: string[];
  groups?: string[];
  children?: string[];
  group?: string;
  grade?: string;
  parent_id?: string;
  birth_date?: string;
  student_id?: string;
}

export interface Group {
  id: string;
  name: string;
  grade: string;
  section: string;
  teacher_id: string;
  teacher_name: string;
  students: string[];
  subjects: string[];
  total_students: number;
  classroom: string;
  schedule: string;
  academic_year: string;
}

export interface Grade {
  id: string;
  student_id: string;
  student_name: string;
  subject: string;
  teacher_id: string;
  grade: number;
  max_grade: number;
  type: 'Prove Yourself' | 'Actividad' | 'Proyecto' | 'Ensayo';
  description: string;
  date: string;
  period: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  student_name: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  arrival_time?: string;
  departure_time?: string;
  reason?: string;
  justified?: boolean;
  subject?: string;
  teacher_id?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  subject: string;
  teacher_id: string;
  teacher_name: string;
  group: string;
  type: 'Proyecto' | 'Tarea' | 'Ensayo' | 'Prove Yourself';
  due_date: string;
  assigned_date: string;
  status: 'active' | 'completed' | 'overdue';
  max_points: number;
  students_assigned: string[];
  materials: string[];
}

export interface Payment {
  id: string;
  student_id: string;
  student_name: string;
  parent_id: string;
  parent_name: string;
  concept: string;
  amount: number;
  currency: string;
  due_date: string;
  paid_date: string | null;
  status: 'paid' | 'pending' | 'overdue';
  payment_method: string | null;
  academic_year: string;
}

export interface Message {
  id: string;
  from_id: string;
  from_name: string;
  from_role: string;
  to_id: string;
  to_name: string;
  to_role: string;
  subject: string;
  content: string;
  date: string;
  status: 'sent' | 'read' | 'unread';
  priority: 'low' | 'normal' | 'high';
  thread_id: string;
}

export interface SchoolConfig {
  school: {
    name: string;
    slogan: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    academic_year: string;
    current_period: string;
    director: string;
    vice_director: string;
    founded: string;
    students_count: number;
    teachers_count: number;
    staff_count: number;
  };
  academic_periods: Array<{
    id: string;
    name: string;
    start_date: string;
    end_date: string;
  }>;
  subjects: string[];
  grade_levels: string[];
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  presentToday: number;
  attendanceRate: number;
  totalRevenue: number;
  pendingPayments: number;
  activeActivities: number;
  unreadMessages: number;
}
