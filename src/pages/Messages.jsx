import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Search, ArrowLeft } from 'lucide-react';
import moment from 'moment';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    const allMsgs = await base44.entities.Message.list('-created_date', 200);
    // Group by conversation_id
    const convMap = {};
    allMsgs.forEach(msg => {
      if (!convMap[msg.conversation_id]) {
        convMap[msg.conversation_id] = { id: msg.conversation_id, lastMsg: msg, messages: [] };
      }
      convMap[msg.conversation_id].messages.push(msg);
      if (new Date(msg.created_date) > new Date(convMap[msg.conversation_id].lastMsg.created_date)) {
        convMap[msg.conversation_id].lastMsg = msg;
      }
    });
    const convList = Object.values(convMap).sort((a, b) => new Date(b.lastMsg.created_date) - new Date(a.lastMsg.created_date));
    setConversations(convList);
    setLoading(false);
  };

  const openConv = async (convId) => {
    setActiveConvId(convId);
    const conv = conversations.find(c => c.id === convId);
    if (conv) setMessages(conv.messages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConvId) return;
    setSending(true);
    const msg = await base44.entities.Message.create({
      conversation_id: activeConvId,
      sender_id: user.id,
      sender_name: user.full_name || 'Usuario',
      content: newMessage.trim(),
    });
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setSending(false);
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="h-[calc(100vh-8rem)] flex overflow-hidden">
      {/* Conversation list */}
      <div className={`${activeConvId ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 border-r border-border bg-card`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-xl font-bold text-foreground">Mensajes</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar conversación..." className="pl-10 rounded-xl h-9 text-sm" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-6 h-6 border-4 border-accent/20 border-t-accent rounded-full animate-spin" /></div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium">Sin mensajes aún</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Inicia una conversación con una empresa o vecino</p>
            </div>
          ) : (
            conversations.map(conv => (
              <button key={conv.id} onClick={() => openConv(conv.id)}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition-colors border-b border-border/50 ${activeConvId === conv.id ? 'bg-muted/70' : ''}`}>
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{conv.id}</p>
                  <p className="text-muted-foreground text-xs truncate">{conv.lastMsg.content}</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5">{moment(conv.lastMsg.created_date).fromNow()}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat panel */}
      {activeConvId ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-card flex items-center gap-3">
            <button onClick={() => setActiveConvId(null)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="font-heading font-semibold text-foreground text-sm">Conversación</p>
              <p className="text-muted-foreground text-xs">{messages.length} mensajes</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">Inicia la conversación</p>
              </div>
            ) : (
              messages.map(msg => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${isMe ? 'bg-accent text-white rounded-br-sm' : 'bg-card border border-border rounded-bl-sm'}`}>
                      {!isMe && <p className="text-xs font-medium text-muted-foreground mb-1">{msg.sender_name}</p>}
                      <p className={`text-sm ${isMe ? 'text-white' : 'text-foreground'}`}>{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-muted-foreground'}`}>{moment(msg.created_date).format('HH:mm')}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Escribe un mensaje..."
                className="rounded-xl flex-1"
              />
              <Button onClick={sendMessage} disabled={sending || !newMessage.trim()} className="rounded-xl bg-accent hover:bg-accent/90 text-white w-11 h-9 p-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Selecciona una conversación</p>
            <p className="text-muted-foreground/60 text-sm mt-1">o inicia una nueva</p>
          </div>
        </div>
      )}
    </div>
  );
}