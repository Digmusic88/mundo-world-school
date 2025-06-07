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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Send, 
  Search, 
  Plus,
  MessageCircle,
  UserCheck,
  Clock,
  Eye,
  EyeOff,
  Star,
  Archive,
  Reply,
  Forward,
  Trash2,
  Users,
  User,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages, useUsers } from '@/hooks/useData';

const MessagingSystem: React.FC = () => {
  const { user } = useAuth();
  const { messages } = useMessages();
  const { users } = useUsers();
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newMessage, setNewMessage] = useState({
    recipient_id: '',
    subject: '',
    body: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
    type: 'personal' as 'personal' | 'announcement' | 'notification'
  });

  // Filtrar mensajes según el rol del usuario
  const userMessages = messages.filter(msg => 
    msg.sender_id === user?.id || 
    msg.recipient_id === user?.id ||
    (msg.type === 'announcement' && canReceiveAnnouncements())
  );

  const inboxMessages = userMessages.filter(msg => 
    msg.recipient_id === user?.id || msg.type === 'announcement'
  );
  const sentMessages = userMessages.filter(msg => msg.sender_id === user?.id);
  const starredMessages = userMessages.filter(msg => msg.starred);
  const archivedMessages = userMessages.filter(msg => msg.archived);

  function canReceiveAnnouncements() {
    // Los anuncios pueden ser enviados a diferentes grupos según el rol
    return true; // Simplificado, en un sistema real tendría lógica más compleja
  }

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
    }\n  };\n\n  const filteredMessages = (messageList: any[]) => {\n    return messageList.filter(message => {\n      const matchesSearch = \n        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||\n        message.body.toLowerCase().includes(searchTerm.toLowerCase()) ||\n        message.sender_name.toLowerCase().includes(searchTerm.toLowerCase());\n      \n      const matchesFilter = filterStatus === 'all' || \n        (filterStatus === 'unread' && !message.read) ||\n        (filterStatus === 'read' && message.read) ||\n        (filterStatus === 'priority' && message.priority === 'high');\n      \n      return matchesSearch && matchesFilter;\n    });\n  };\n\n  const handleSendMessage = () => {\n    // En una aplicación real, esto enviaría el mensaje a la API\n    console.log('Enviando mensaje:', newMessage);\n    alert('Mensaje enviado correctamente');\n    setIsComposeOpen(false);\n    setNewMessage({\n      recipient_id: '',\n      subject: '',\n      body: '',\n      priority: 'normal',\n      type: 'personal'\n    });\n  };\n\n  const handleMarkAsRead = (messageId: string) => {\n    console.log('Marcar como leído:', messageId);\n    // En una aplicación real, actualizaría el estado del mensaje\n  };\n\n  const handleStarMessage = (messageId: string) => {\n    console.log('Destacar mensaje:', messageId);\n  };\n\n  const handleArchiveMessage = (messageId: string) => {\n    console.log('Archivar mensaje:', messageId);\n  };\n\n  const handleDeleteMessage = (messageId: string) => {\n    console.log('Eliminar mensaje:', messageId);\n  };\n\n  const getMessageStats = () => {\n    return {\n      total: inboxMessages.length,\n      unread: inboxMessages.filter(m => !m.read).length,\n      starred: starredMessages.length,\n      archived: archivedMessages.length\n    };\n  };\n\n  const getPriorityColor = (priority: string) => {\n    switch (priority) {\n      case 'high': return 'bg-red-100 text-red-800';\n      case 'normal': return 'bg-blue-100 text-blue-800';\n      case 'low': return 'bg-gray-100 text-gray-800';\n      default: return 'bg-gray-100 text-gray-800';\n    }\n  };\n\n  const getTypeColor = (type: string) => {\n    switch (type) {\n      case 'announcement': return 'bg-purple-100 text-purple-800';\n      case 'notification': return 'bg-yellow-100 text-yellow-800';\n      case 'personal': return 'bg-green-100 text-green-800';\n      default: return 'bg-gray-100 text-gray-800';\n    }\n  };\n\n  const formatTimestamp = (timestamp: string) => {\n    const date = new Date(timestamp);\n    const now = new Date();\n    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;\n    \n    if (diffHours < 24) {\n      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });\n    } else {\n      return date.toLocaleDateString('es-ES');\n    }\n  };\n\n  const stats = getMessageStats();\n\n  const MessageList: React.FC<{ messages: any[] }> = ({ messages }) => (\n    <div className=\"space-y-2\">\n      {filteredMessages(messages).map((message) => (\n        <Card \n          key={message.id} \n          className={`cursor-pointer transition-colors ${\n            !message.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'\n          }`}\n          onClick={() => setSelectedMessage(message)}\n        >\n          <CardContent className=\"p-4\">\n            <div className=\"flex items-start justify-between\">\n              <div className=\"flex items-start space-x-3 flex-1\">\n                <Avatar className=\"h-10 w-10\">\n                  <AvatarImage src={message.sender_avatar} />\n                  <AvatarFallback>\n                    {message.sender_name.split(' ').map((n: string) => n[0]).join('')}\n                  </AvatarFallback>\n                </Avatar>\n                <div className=\"flex-1 min-w-0\">\n                  <div className=\"flex items-center space-x-2 mb-1\">\n                    <h4 className={`font-medium truncate ${\n                      !message.read ? 'text-gray-900' : 'text-gray-700'\n                    }`}>\n                      {message.sender_name}\n                    </h4>\n                    <Badge className={getPriorityColor(message.priority)}>\n                      {message.priority}\n                    </Badge>\n                    <Badge className={getTypeColor(message.type)}>\n                      {message.type}\n                    </Badge>\n                  </div>\n                  <p className={`font-medium truncate mb-1 ${\n                    !message.read ? 'text-gray-900' : 'text-gray-700'\n                  }`}>\n                    {message.subject}\n                  </p>\n                  <p className=\"text-sm text-gray-600 truncate\">\n                    {message.body}\n                  </p>\n                </div>\n              </div>\n              <div className=\"flex items-center space-x-2 ml-4\">\n                {message.starred && <Star className=\"h-4 w-4 text-yellow-500 fill-current\" />}\n                {!message.read && <div className=\"w-2 h-2 bg-blue-600 rounded-full\" />}\n                <span className=\"text-xs text-gray-500\">\n                  {formatTimestamp(message.timestamp)}\n                </span>\n              </div>\n            </div>\n          </CardContent>\n        </Card>\n      ))}\n    </div>\n  );\n\n  return (\n    <div className=\"space-y-6\">\n      {/* Header */}\n      <div className=\"flex justify-between items-center\">\n        <div>\n          <h2 className=\"text-2xl font-bold text-gray-900\">Sistema de Mensajería</h2>\n          <p className=\"text-gray-600\">Comunicación directa con profesores, padres y administración</p>\n        </div>\n        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>\n          <DialogTrigger asChild>\n            <Button>\n              <Plus className=\"mr-2 h-4 w-4\" />\n              Nuevo Mensaje\n            </Button>\n          </DialogTrigger>\n          <DialogContent className=\"max-w-2xl\">\n            <DialogHeader>\n              <DialogTitle>Redactar Mensaje</DialogTitle>\n              <DialogDescription>\n                Envía un mensaje a otros usuarios del sistema\n              </DialogDescription>\n            </DialogHeader>\n            <div className=\"grid gap-4 py-4\">\n              <div className=\"grid gap-2\">\n                <Label htmlFor=\"recipient\">Destinatario</Label>\n                <Select value={newMessage.recipient_id} onValueChange={(value) => setNewMessage({...newMessage, recipient_id: value})}>\n                  <SelectTrigger>\n                    <SelectValue placeholder=\"Selecciona un destinatario\" />\n                  </SelectTrigger>\n                  <SelectContent>\n                    {getAvailableRecipients().map((recipient) => (\n                      <SelectItem key={recipient.id} value={recipient.id}>\n                        <div className=\"flex items-center space-x-2\">\n                          <Avatar className=\"h-6 w-6\">\n                            <AvatarImage src={recipient.avatar} />\n                            <AvatarFallback>\n                              {recipient.name.split(' ').map(n => n[0]).join('')}\n                            </AvatarFallback>\n                          </Avatar>\n                          <span>{recipient.name}</span>\n                          <Badge variant=\"outline\">{recipient.role}</Badge>\n                        </div>\n                      </SelectItem>\n                    ))}\n                  </SelectContent>\n                </Select>\n              </div>\n              \n              <div className=\"grid grid-cols-2 gap-4\">\n                <div className=\"grid gap-2\">\n                  <Label htmlFor=\"priority\">Prioridad</Label>\n                  <Select value={newMessage.priority} onValueChange={(value: any) => setNewMessage({...newMessage, priority: value})}>\n                    <SelectTrigger>\n                      <SelectValue />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectItem value=\"low\">Baja</SelectItem>\n                      <SelectItem value=\"normal\">Normal</SelectItem>\n                      <SelectItem value=\"high\">Alta</SelectItem>\n                    </SelectContent>\n                  </Select>\n                </div>\n                <div className=\"grid gap-2\">\n                  <Label htmlFor=\"type\">Tipo</Label>\n                  <Select value={newMessage.type} onValueChange={(value: any) => setNewMessage({...newMessage, type: value})}>\n                    <SelectTrigger>\n                      <SelectValue />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectItem value=\"personal\">Personal</SelectItem>\n                      {user?.role === 'admin' && <SelectItem value=\"announcement\">Anuncio</SelectItem>}\n                      <SelectItem value=\"notification\">Notificación</SelectItem>\n                    </SelectContent>\n                  </Select>\n                </div>\n              </div>\n              \n              <div className=\"grid gap-2\">\n                <Label htmlFor=\"subject\">Asunto</Label>\n                <Input\n                  value={newMessage.subject}\n                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}\n                  placeholder=\"Escribe el asunto del mensaje\"\n                />\n              </div>\n              \n              <div className=\"grid gap-2\">\n                <Label htmlFor=\"body\">Mensaje</Label>\n                <Textarea\n                  value={newMessage.body}\n                  onChange={(e) => setNewMessage({...newMessage, body: e.target.value})}\n                  placeholder=\"Escribe tu mensaje aquí...\"\n                  rows={6}\n                />\n              </div>\n            </div>\n            <DialogFooter>\n              <Button variant=\"outline\" onClick={() => setIsComposeOpen(false)}>\n                Cancelar\n              </Button>\n              <Button onClick={handleSendMessage} disabled={!newMessage.recipient_id || !newMessage.subject || !newMessage.body}>\n                <Send className=\"mr-2 h-4 w-4\" />\n                Enviar Mensaje\n              </Button>\n            </DialogFooter>\n          </DialogContent>\n        </Dialog>\n      </div>\n\n      {/* Estadísticas */}\n      <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">\n        <Card>\n          <CardContent className=\"p-4 text-center\">\n            <MessageCircle className=\"h-8 w-8 text-blue-600 mx-auto mb-2\" />\n            <p className=\"text-2xl font-bold text-gray-900\">{stats.total}</p>\n            <p className=\"text-sm text-gray-600\">Total</p>\n          </CardContent>\n        </Card>\n        <Card>\n          <CardContent className=\"p-4 text-center\">\n            <Eye className=\"h-8 w-8 text-green-600 mx-auto mb-2\" />\n            <p className=\"text-2xl font-bold text-gray-900\">{stats.unread}</p>\n            <p className=\"text-sm text-gray-600\">No leídos</p>\n          </CardContent>\n        </Card>\n        <Card>\n          <CardContent className=\"p-4 text-center\">\n            <Star className=\"h-8 w-8 text-yellow-600 mx-auto mb-2\" />\n            <p className=\"text-2xl font-bold text-gray-900\">{stats.starred}</p>\n            <p className=\"text-sm text-gray-600\">Destacados</p>\n          </CardContent>\n        </Card>\n        <Card>\n          <CardContent className=\"p-4 text-center\">\n            <Archive className=\"h-8 w-8 text-gray-600 mx-auto mb-2\" />\n            <p className=\"text-2xl font-bold text-gray-900\">{stats.archived}</p>\n            <p className=\"text-sm text-gray-600\">Archivados</p>\n          </CardContent>\n        </Card>\n      </div>\n\n      {/* Filtros */}\n      <Card>\n        <CardContent className=\"p-4\">\n          <div className=\"flex flex-col md:flex-row gap-4\">\n            <div className=\"relative flex-1\">\n              <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4\" />\n              <Input\n                placeholder=\"Buscar mensajes...\"\n                value={searchTerm}\n                onChange={(e) => setSearchTerm(e.target.value)}\n                className=\"pl-10\"\n              />\n            </div>\n            <Select value={filterStatus} onValueChange={setFilterStatus}>\n              <SelectTrigger className=\"w-full md:w-48\">\n                <SelectValue placeholder=\"Filtrar mensajes\" />\n              </SelectTrigger>\n              <SelectContent>\n                <SelectItem value=\"all\">Todos</SelectItem>\n                <SelectItem value=\"unread\">No leídos</SelectItem>\n                <SelectItem value=\"read\">Leídos</SelectItem>\n                <SelectItem value=\"priority\">Alta prioridad</SelectItem>\n              </SelectContent>\n            </Select>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* Tabs de mensajes */}\n      <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">\n        <div className=\"lg:col-span-2\">\n          <Tabs value={activeTab} onValueChange={setActiveTab}>\n            <TabsList className=\"grid w-full grid-cols-4\">\n              <TabsTrigger value=\"inbox\">Recibidos ({stats.total})</TabsTrigger>\n              <TabsTrigger value=\"sent\">Enviados</TabsTrigger>\n              <TabsTrigger value=\"starred\">Destacados</TabsTrigger>\n              <TabsTrigger value=\"archived\">Archivados</TabsTrigger>\n            </TabsList>\n            \n            <TabsContent value=\"inbox\" className=\"mt-4\">\n              <MessageList messages={inboxMessages} />\n            </TabsContent>\n            \n            <TabsContent value=\"sent\" className=\"mt-4\">\n              <MessageList messages={sentMessages} />\n            </TabsContent>\n            \n            <TabsContent value=\"starred\" className=\"mt-4\">\n              <MessageList messages={starredMessages} />\n            </TabsContent>\n            \n            <TabsContent value=\"archived\" className=\"mt-4\">\n              <MessageList messages={archivedMessages} />\n            </TabsContent>\n          </Tabs>\n        </div>\n\n        {/* Panel de mensaje seleccionado */}\n        <div>\n          {selectedMessage ? (\n            <Card>\n              <CardHeader>\n                <div className=\"flex items-start justify-between\">\n                  <div className=\"flex items-center space-x-3\">\n                    <Avatar className=\"h-10 w-10\">\n                      <AvatarImage src={selectedMessage.sender_avatar} />\n                      <AvatarFallback>\n                        {selectedMessage.sender_name.split(' ').map((n: string) => n[0]).join('')}\n                      </AvatarFallback>\n                    </Avatar>\n                    <div>\n                      <h4 className=\"font-medium\">{selectedMessage.sender_name}</h4>\n                      <p className=\"text-sm text-gray-600\">{selectedMessage.sender_email}</p>\n                    </div>\n                  </div>\n                  <div className=\"flex space-x-1\">\n                    <Button variant=\"outline\" size=\"sm\" onClick={() => handleStarMessage(selectedMessage.id)}>\n                      <Star className=\"h-4 w-4\" />\n                    </Button>\n                    <Button variant=\"outline\" size=\"sm\" onClick={() => handleArchiveMessage(selectedMessage.id)}>\n                      <Archive className=\"h-4 w-4\" />\n                    </Button>\n                    <Button variant=\"outline\" size=\"sm\" onClick={() => handleDeleteMessage(selectedMessage.id)}>\n                      <Trash2 className=\"h-4 w-4\" />\n                    </Button>\n                  </div>\n                </div>\n                <div className=\"space-y-2\">\n                  <CardTitle className=\"text-lg\">{selectedMessage.subject}</CardTitle>\n                  <div className=\"flex items-center space-x-2\">\n                    <Badge className={getPriorityColor(selectedMessage.priority)}>\n                      {selectedMessage.priority}\n                    </Badge>\n                    <Badge className={getTypeColor(selectedMessage.type)}>\n                      {selectedMessage.type}\n                    </Badge>\n                    <span className=\"text-sm text-gray-500\">\n                      {new Date(selectedMessage.timestamp).toLocaleString('es-ES')}\n                    </span>\n                  </div>\n                </div>\n              </CardHeader>\n              <CardContent>\n                <div className=\"prose prose-sm max-w-none\">\n                  <p className=\"whitespace-pre-wrap\">{selectedMessage.body}</p>\n                </div>\n                <div className=\"flex space-x-2 mt-4\">\n                  <Button size=\"sm\">\n                    <Reply className=\"mr-2 h-4 w-4\" />\n                    Responder\n                  </Button>\n                  <Button variant=\"outline\" size=\"sm\">\n                    <Forward className=\"mr-2 h-4 w-4\" />\n                    Reenviar\n                  </Button>\n                </div>\n              </CardContent>\n            </Card>\n          ) : (\n            <Card>\n              <CardContent className=\"p-8 text-center\">\n                <MessageCircle className=\"h-12 w-12 text-gray-400 mx-auto mb-4\" />\n                <p className=\"text-gray-600\">Selecciona un mensaje para ver su contenido</p>\n              </CardContent>\n            </Card>\n          )}\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default MessagingSystem;"
