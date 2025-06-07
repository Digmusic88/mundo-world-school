import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Send, 
  Search, 
  Plus,
  MessageCircle,
  UserCheck,
  Clock,
  Eye,
  Star,
  Archive,
  Reply,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages, useUsers } from '@/hooks/useData';

const MessagingSystem: React.FC = () => {
  const { user } = useAuth();
  const { messages } = useMessages();
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient_id: '',
    subject: '',
    body: '',
    priority: 'normal' as 'low' | 'normal' | 'high'
  });

  // Filtrar mensajes según el rol del usuario
  const userMessages = messages.filter(msg => 
    msg.sender_id === user?.id || 
    msg.recipient_id === user?.id ||
    msg.type === 'announcement'
  );

  const inboxMessages = userMessages.filter(msg => 
    msg.recipient_id === user?.id || msg.type === 'announcement'
  );
  const sentMessages = userMessages.filter(msg => msg.sender_id === user?.id);

  const getAvailableRecipients = () => {
    // Filtrar usuarios disponibles según el rol
    switch (user?.role) {
      case 'admin':
        return users.filter(u => u.id !== user.id); // Admin puede contactar a todos
      case 'teacher':
        return users.filter(u => 
          u.id !== user.id && 
          (u.role === 'admin' || u.role === 'parent' || u.role === 'student')
        );
      case 'parent':
        return users.filter(u => 
          u.id !== user.id && 
          (u.role === 'admin' || u.role === 'teacher')
        );
      case 'student':
        return users.filter(u => 
          u.id !== user.id && 
          (u.role === 'admin' || u.role === 'teacher')
        );
      default:
        return [];
    }
  };

  const filteredMessages = (messageList: any[]) => {
    return messageList.filter(message => {
      const matchesSearch = 
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.sender_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  };

  const handleSendMessage = () => {
    console.log('Enviando mensaje:', newMessage);
    alert('Mensaje enviado correctamente');
    setIsComposeOpen(false);
    setNewMessage({
      recipient_id: '',
      subject: '',
      body: '',
      priority: 'normal'
    });
  };

  const getMessageStats = () => {
    return {
      total: inboxMessages.length,
      unread: inboxMessages.filter(m => !m.read).length,
      sent: sentMessages.length
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-purple-100 text-purple-800';
      case 'notification': return 'bg-yellow-100 text-yellow-800';
      case 'personal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-ES');
    }
  };

  const stats = getMessageStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Mensajería</h2>
          <p className="text-gray-600">Comunicación directa con profesores, padres y administración</p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Mensaje
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Redactar Mensaje</DialogTitle>
              <DialogDescription>
                Envía un mensaje a otros usuarios del sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">Destinatario</Label>
                <Select value={newMessage.recipient_id} onValueChange={(value) => setNewMessage({...newMessage, recipient_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un destinatario" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableRecipients().map((recipient) => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        {recipient.name} ({recipient.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select value={newMessage.priority} onValueChange={(value: any) => setNewMessage({...newMessage, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Escribe el asunto del mensaje"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="body">Mensaje</Label>
                <Textarea
                  value={newMessage.body}
                  onChange={(e) => setNewMessage({...newMessage, body: e.target.value})}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSendMessage} disabled={!newMessage.recipient_id || !newMessage.subject || !newMessage.body}>
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensaje
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Recibidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
            <p className="text-sm text-gray-600">No leídos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Send className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
            <p className="text-sm text-gray-600">Enviados</p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar mensajes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de mensajes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mensajes recibidos */}
        <Card>
          <CardHeader>
            <CardTitle>Mensajes Recibidos ({stats.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMessages(inboxMessages).map((message) => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer transition-colors ${
                    !message.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender_avatar} />
                          <AvatarFallback>
                            {message.sender_name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-medium truncate text-sm ${
                              !message.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {message.sender_name}
                            </h4>
                            <Badge className={getPriorityColor(message.priority)} variant="outline">
                              {message.priority}
                            </Badge>
                          </div>
                          <p className={`font-medium truncate mb-1 text-sm ${
                            !message.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {message.body}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!message.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mensaje seleccionado */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle del Mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedMessage.sender_avatar} />
                    <AvatarFallback>
                      {selectedMessage.sender_name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{selectedMessage.sender_name}</h4>
                    <p className="text-sm text-gray-600">{selectedMessage.sender_email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedMessage.subject}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge className={getPriorityColor(selectedMessage.priority)}>
                      {selectedMessage.priority}
                    </Badge>
                    <Badge className={getTypeColor(selectedMessage.type)}>
                      {selectedMessage.type}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(selectedMessage.timestamp).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.body}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm">
                    <Reply className="mr-2 h-4 w-4" />
                    Responder
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="mr-2 h-4 w-4" />
                    Destacar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="mr-2 h-4 w-4" />
                    Archivar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Selecciona un mensaje para ver su contenido</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagingSystem;