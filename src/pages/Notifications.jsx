import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Bell, Briefcase, GraduationCap, CalendarDays, MessageCircle, FileText, Heart, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';

const typeIcons = {
  job: { icon: Briefcase, color: 'bg-accent/10 text-accent' },
  training: { icon: GraduationCap, color: 'bg-success/10 text-success' },
  event: { icon: CalendarDays, color: 'bg-secondary/10 text-secondary' },
  application: { icon: FileText, color: 'bg-primary/10 text-primary' },
  message: { icon: MessageCircle, color: 'bg-chart-2/10 text-chart-2' },
  community: { icon: Heart, color: 'bg-destructive/10 text-destructive' },
  system: { icon: Bell, color: 'bg-muted text-muted-foreground' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Notification.list('-created_date', 50).then(data => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => base44.entities.Notification.update(n.id, { read: true })));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = async (id) => {
    await base44.entities.Notification.update(id, { read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    await base44.entities.Notification.delete(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-foreground">Notificaciones</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-accent text-xs gap-1 rounded-xl">
            <CheckCheck className="w-4 h-4" /> Marcar todas leídas
          </Button>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-6">{unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}</p>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No tienes notificaciones</p>
          <p className="text-muted-foreground/60 text-sm mt-1">Te avisaremos cuando haya algo nuevo para ti</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => {
            const cfg = typeIcons[notif.type] || typeIcons.system;
            const Icon = cfg.icon;
            const Wrapper = notif.link ? Link : 'div';
            const wrapperProps = notif.link ? { to: notif.link } : {};
            return (
              <Wrapper key={notif.id} {...wrapperProps}
                onClick={() => !notif.read && markRead(notif.id)}
                className={`flex items-start gap-3 rounded-xl p-4 border transition-all cursor-pointer hover:shadow-sm ${notif.read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-heading ${notif.read ? 'font-medium text-foreground' : 'font-semibold text-foreground'}`}>{notif.title}</p>
                  {notif.message && <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{notif.message}</p>}
                  <p className="text-muted-foreground text-[10px] mt-1">{moment(notif.created_date).fromNow()}</p>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  {!notif.read && <div className="w-2 h-2 bg-accent rounded-full" />}
                  <button onClick={(e) => deleteNotif(notif.id, e)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Wrapper>
            );
          })}
        </div>
      )}
    </div>
  );
}