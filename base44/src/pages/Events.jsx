import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, CalendarDays, Bookmark, BookmarkCheck } from 'lucide-react';
import moment from 'moment';
import { useToast } from '@/components/ui/use-toast';
import { SkeletonList } from '@/components/SkeletonCard';

const typeColors = {
  'Feria laboral': 'bg-secondary/10 text-secondary',
  'Taller': 'bg-accent/10 text-accent',
  'Charla': 'bg-success/10 text-success',
  'Campaña social': 'bg-destructive/10 text-destructive',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const [eventData, favData] = await Promise.all([
        base44.entities.Event.list('date', 100),
        base44.entities.Favorite.filter({ item_type: 'event' }),
      ]);
      setEvents(eventData);
      setFavorites(new Set(favData.map(f => f.item_id)));
      setLoading(false);
    };
    load();
  }, []);

  const toggleFav = async (e, ev) => {
    e.preventDefault(); e.stopPropagation();
    if (favorites.has(ev.id)) {
      const favs = await base44.entities.Favorite.filter({ item_id: ev.id, item_type: 'event' });
      if (favs.length > 0) await base44.entities.Favorite.delete(favs[0].id);
      setFavorites(prev => { const s = new Set(prev); s.delete(ev.id); return s; });
      toast({ title: 'Eliminado de favoritos' });
    } else {
      await base44.entities.Favorite.create({ item_type: 'event', item_id: ev.id, item_title: ev.title });
      setFavorites(prev => new Set([...prev, ev.id]));
      toast({ title: '⭐ Guardado en favoritos' });
    }
  };

  const filtered = events.filter(e => {
    const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase());
    const matchType = eventType === 'all' || e.event_type === eventType;
    return matchSearch && matchType;
  });

  return (
    <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Eventos</h1>
      <p className="text-muted-foreground text-sm mb-6">Ferias laborales, talleres y campañas comunitarias</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar evento..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl" />
        </div>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {["Feria laboral", "Taller", "Charla", "Campaña social"].map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <SkeletonList count={4} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No se encontraron eventos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(event => (
            <Link key={event.id} to={`/events/${event.id}`}
              className="flex items-start gap-4 bg-card rounded-xl p-5 border border-border hover:shadow-lg transition-all group">
              <div className="w-16 bg-accent/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 py-3">
                <span className="text-accent text-[11px] font-bold uppercase">{moment(event.date).format('MMM')}</span>
                <span className="text-accent font-heading font-bold text-2xl leading-none">{moment(event.date).format('DD')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-foreground group-hover:text-accent transition-colors">{event.title}</h3>
                {event.event_type && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[event.event_type] || 'bg-muted text-muted-foreground'}`}>{event.event_type}</span>}
                {event.location && <p className="flex items-center gap-1 text-muted-foreground text-xs mt-2"><MapPin className="w-3.5 h-3.5" /> {event.location}</p>}
                {(event.time_start || event.time_end) && (
                  <p className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                    <Clock className="w-3.5 h-3.5" /> {event.time_start}{event.time_end ? ` - ${event.time_end}` : ''}
                  </p>
                )}
                {event.organizer && <p className="text-muted-foreground text-xs mt-1">Organiza: {event.organizer}</p>}
              </div>
              <button onClick={(e) => toggleFav(e, event)} className="p-1 rounded-lg hover:bg-muted transition-colors flex-shrink-0">
                {favorites.has(event.id)
                  ? <BookmarkCheck className="w-5 h-5 text-secondary" />
                  : <Bookmark className="w-5 h-5 text-muted-foreground" />
                }
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}