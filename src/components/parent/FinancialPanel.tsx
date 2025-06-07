import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { 
  DollarSign, 
  CreditCard, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinances, useUsers } from '@/hooks/useData';

const FinancialPanel: React.FC = () => {
  const { user } = useAuth();
  const { payments, summary } = useFinances();
  const { users } = useUsers();
  const [statusFilter, setStatusFilter] = useState('all');
  const [studentFilter, setStudentFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isPaymentDetailOpen, setIsPaymentDetailOpen] = useState(false);

  // Obtener información de los hijos
  const children = users.filter(u => user?.children?.includes(u.id));
  
  // Pagos del padre
  const parentPayments = payments.filter(p => p.parent_id === user?.id);

  const filteredPayments = parentPayments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesStudent = studentFilter === 'all' || payment.student_id === studentFilter;
    
    return matchesStatus && matchesStudent;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencido';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getChildInfo = (childId: string) => {
    return children.find(c => c.id === childId);
  };

  const calculateStats = () => {
    const totalAmount = parentPayments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = parentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = parentPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const overdueAmount = parentPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

    return {
      total: totalAmount,
      paid: paidAmount,
      pending: pendingAmount,
      overdue: overdueAmount,
      paymentRate: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0
    };
  };

  const getPaymentsByMonth = () => {
    const monthlyData = parentPayments.reduce((acc, payment) => {
      const date = new Date(payment.due_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, paid: 0, pending: 0, overdue: 0 };
      }
      
      acc[monthKey].total += payment.amount;
      acc[monthKey][payment.status] += payment.amount;
      
      return acc;
    }, {} as any);

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    })).sort((a, b) => a.month.localeCompare(b.month));
  };

  const handlePaymentDetail = (payment: any) => {
    setSelectedPayment(payment);
    setIsPaymentDetailOpen(true);
  };

  const handlePayNow = (payment: any) => {
    // En una aplicación real, esto redirigiría al sistema de pagos
    alert(`Redirigiendo al sistema de pagos para: ${payment.concept} - €${payment.amount}`);
  };

  const stats = calculateStats();
  const monthlyPayments = getPaymentsByMonth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Estado Financiero</h2>
        <p className="text-gray-600">Gestiona los pagos y cuotas escolares</p>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.total.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Año académico</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pagado</p>
                <p className="text-2xl font-bold text-green-600">€{stats.paid.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{Math.round(stats.paymentRate)}% del total</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendiente</p>
                <p className="text-2xl font-bold text-yellow-600">€{stats.pending.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Por pagar</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencido</p>
                <p className="text-2xl font-bold text-red-600">€{stats.overdue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Requiere atención</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen por hijo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Estudiante</CardTitle>
          <CardDescription>
            Estado financiero de cada hijo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => {
              const childPayments = parentPayments.filter(p => p.student_id === child.id);
              const childTotal = childPayments.reduce((sum, p) => sum + p.amount, 0);
              const childPaid = childPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
              const childPending = childPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
              
              return (
                <div key={child.id} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback>
                        {child.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{child.name}</p>
                      <p className="text-sm text-gray-600">{child.grade} - {child.group}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-medium">€{childTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Pagado:</span>
                      <span className="font-medium text-green-600">€{childPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-600">Pendiente:</span>
                      <span className="font-medium text-yellow-600">€{childPending.toLocaleString()}</span>
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="paid">Pagados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="overdue">Vencidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={studentFilter} onValueChange={setStudentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estudiante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estudiantes</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Descargar Reporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de pagos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            {filteredPayments.length} pagos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments
                .sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())
                .map((payment) => {
                  const child = getChildInfo(payment.student_id);
                  const daysUntilDue = getDaysUntilDue(payment.due_date);
                  const isOverdue = daysUntilDue < 0 && payment.status === 'pending';
                  
                  return (
                    <TableRow key={payment.id}>
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
                            <p className="text-sm text-gray-600">{child?.grade}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{payment.concept}</p>
                        <p className="text-sm text-gray-600">{payment.academic_year}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-lg">€{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{payment.currency}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <div>
                            <p className="text-sm">
                              {new Date(payment.due_date).toLocaleDateString('es-ES')}
                            </p>
                            {payment.status === 'pending' && (
                              <p className={`text-xs ${
                                isOverdue ? 'text-red-600' :
                                daysUntilDue <= 7 ? 'text-yellow-600' :
                                'text-gray-500'
                              }`}>
                                {isOverdue ? `Vencido hace ${Math.abs(daysUntilDue)} días` :
                                 daysUntilDue === 0 ? 'Vence hoy' :
                                 daysUntilDue === 1 ? 'Vence mañana' :
                                 `${daysUntilDue} días restantes`}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(isOverdue ? 'overdue' : payment.status)}>
                          {getStatusIcon(isOverdue ? 'overdue' : payment.status)}
                          <span className="ml-1">
                            {getStatusLabel(isOverdue ? 'overdue' : payment.status)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.paid_date ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            <span className="text-sm">
                              {new Date(payment.paid_date).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePaymentDetail(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handlePayNow(payment)}
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pagar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Histórico mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Mensual</CardTitle>
          <CardDescription>
            Pagos por mes del año académico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyPayments.map((monthData) => (
              <div key={monthData.month} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">
                    {new Date(`${monthData.month}-01`).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: €{monthData.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-green-600">€{monthData.paid.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Pagado</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-yellow-600">€{monthData.pending.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Pendiente</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-red-600">€{monthData.overdue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Vencido</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles de pago */}
      <Dialog open={isPaymentDetailOpen} onOpenChange={setIsPaymentDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Pago</DialogTitle>
            <DialogDescription>
              Información completa del pago
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estudiante</p>
                  <p>{selectedPayment.student_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Monto</p>
                  <p className="text-lg font-bold">€{selectedPayment.amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Concepto</p>
                <p>{selectedPayment.concept}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fecha Vencimiento</p>
                  <p>{new Date(selectedPayment.due_date).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <Badge className={getStatusColor(selectedPayment.status)}>
                    {getStatusIcon(selectedPayment.status)}
                    <span className="ml-1">{getStatusLabel(selectedPayment.status)}</span>
                  </Badge>
                </div>
              </div>
              
              {selectedPayment.paid_date && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Fecha de Pago</p>
                  <p>{new Date(selectedPayment.paid_date).toLocaleDateString('es-ES')}</p>
                </div>
              )}
              
              {selectedPayment.payment_method && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Método de Pago</p>
                  <p>{selectedPayment.payment_method}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDetailOpen(false)}>
              Cerrar
            </Button>
            {selectedPayment?.status === 'pending' && (
              <Button onClick={() => handlePayNow(selectedPayment)}>
                <CreditCard className="mr-2 h-4 w-4" />
                Pagar Ahora
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialPanel;