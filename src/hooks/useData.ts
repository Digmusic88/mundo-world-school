import { useState, useEffect } from 'react';
import { User, Group, Grade, Attendance, Activity, Payment, Message, SchoolConfig } from '@/types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/users.json');
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError('Error al cargar usuarios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/groups.json');
        const data = await response.json();
        setGroups(data.groups);
      } catch (err) {
        setError('Error al cargar grupos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return { groups, loading, error };
};

export const useGrades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch('/grades.json');
        const data = await response.json();
        setGrades(data.grades);
      } catch (err) {
        setError('Error al cargar calificaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return { grades, loading, error };
};

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('/attendance.json');
        const data = await response.json();
        setAttendance(data.attendance);
        setStats(data.attendance_stats);
      } catch (err) {
        setError('Error al cargar asistencia');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return { attendance, stats, loading, error };
};

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/activities.json');
        const data = await response.json();
        setActivities(data.activities);
      } catch (err) {
        setError('Error al cargar actividades');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};

export const useFinances = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const response = await fetch('/finances.json');
        const data = await response.json();
        setPayments(data.payments);
        setSummary(data.financial_summary);
      } catch (err) {
        setError('Error al cargar finanzas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinances();
  }, []);

  return { payments, summary, loading, error };
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/messages.json');
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError('Error al cargar mensajes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return { messages, loading, error };
};

export const useSchoolConfig = () => {
  const [config, setConfig] = useState<SchoolConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/school-config.json');
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError('Error al cargar configuración');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};
