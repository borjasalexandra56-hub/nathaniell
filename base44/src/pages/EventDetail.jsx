import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, CalendarDays, User, Bookmark, BookmarkCheck, Share2, CheckCircle } from 'lucide-react';
import moment from 'moment';
import { useToast } from '@/components/ui/use-toast';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favId, setFavId] = useState(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [data, favs] = await Promise.all([
        base44.entities.Event.get(id),
        base44.entities.Favorite.filter({ item_id: id, item_type: 'event' }),
      ]);
      setEvent(data);
      if (favs.length > 0) { setIsFav(true); setFavId(favs[0].id); }
      setLoading(false);
    };
    load();
  }, [id]);

  const toggleFav = async () => {
    if (isFav && favId) {
      await base44.entities.Favorite.delete(favId);
      setIsFav(false); setFavId(null);
      toast({ title: 'Eliminado de favoritos' });
    } else {
      const fav = await base44.entities.Favorite.create({ item_type: 'event', item_id: id, item_title: event.title });
      setIsFav(true); setFavId(fav.id);
      toast({ title: '⭐ Guardado en favoritos' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Enlace copiado' });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" /></div>;

  if (!event) return (
    <div className="text-center py-20 px-4">
      <p className="text-muted-foreground">Evento no encontrado</p>
      <Link to="/events" className="text-accent text-sm mt-2 inline-block">Volver</Link>
    </div>
  );

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-6 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center">
          {event.image_url ? <img src={event.image_url} alt="" className="w-full h-full object-cover" /> : <CalendarDays className="w-16 h-16 text-secondary/30" />}
        </div>
        <div className="p-6 lg:p-8">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="font-display text-xl font-bold text-foreground">{event.title}</h1>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={toggleFav} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                {isFav ? <BookmarkCheck className="w-5 h-5 text-secondary" /> : <Bookmark className="w-5 h-5 text-muted-foreground" />}
              </button>
              <button onClick={handleShare} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <Share2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            {event.event_type && <span className="bg-secondary/10 text-secondary text-xs font-medium px-3 py-1 rounded-full">{event.event_type}</span>}
            <span className="flex items-center gap-1 text-muted-foreground text-xs"><CalendarDays className="w-3.5 h-3.5" /> {moment(event.date).format('DD MMMM YYYY')}</span>
            {(event.time_start || event.time_end) && <span className="flex items-center gap-1 text-muted-foreground text-xs"><Clock className="w-3.5 h-3.5" /> {event.time_start}{event.time_end ? ` - ${event.time_end}` : ''}</span>}
            {event.location && <span className="flex items-center gap-1 text-muted-foreground text-xs"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>}
            {event.organizer && <span className="flex items-center gap-1 text-muted-foreground text-xs"><User className="w-3.5 h-3.5" /> {event.organizer}</span>}
          </div>
          {event.description && (
            <div className="mb-6">
              <h3 className="font-heading font-semibold text-foreground mb-2">Descripción</h3>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{event.description}</p>
            </div>
          )}
          {registered ? (
            <div className="flex items-center gap-3 bg-success/10 text-success rounded-xl p-4 border border-success/20">
              <CheckCircle className="w-5 h-5" />
              <p className="font-heading font-semibold">¡Ya estás inscrito en este evento!</p>
            </div>
          ) : (
            <Button onClick={() => { setRegistered(true); toast({ title: '🎉 ¡Inscripción exitosa!', description: `Te inscribiste en ${event.title}` }); }}
              className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-heading font-semibold rounded-xl text-base">
              Inscribirme al evento
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}