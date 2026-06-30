import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Star, Briefcase, CalendarDays, GraduationCap, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const typeConfig = {
  job: { icon: Briefcase, label: 'Empleo', color: 'bg-accent/10 text-accent', path: '/jobs' },
  event: { icon: CalendarDays, label: 'Evento', color: 'bg-secondary/10 text-secondary', path: '/events' },
  training: { icon: GraduationCap, label: 'Capacitación', color: 'bg-success/10 text-success', path: '/trainings' },
};

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.Favorite.list('-created_date', 100).then(data => {
      setFavorites(data);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (id) => {
    await base44.entities.Favorite.delete(id);
    setFavorites(prev => prev.filter(f => f.id !== id));
    toast({ title: 'Eliminado de favoritos' });
  };

  const filtered = filter === 'all' ? favorites : favorites.filter(f => f.item_type === filter);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Mis favoritos</h1>
      <p className="text-muted-foreground text-sm mb-5">Empleos, eventos y capacitaciones guardados</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'job', label: 'Empleos' },
          { key: 'event', label: 'Eventos' },
          { key: 'training', label: 'Cursos' },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === t.key ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No tienes favoritos guardados</p>
          <p className="text-muted-foreground/60 text-sm mt-1">Guarda empleos, eventos y cursos para verlos aquí</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(fav => {
            const cfg = typeConfig[fav.item_type] || typeConfig.job;
            const Icon = cfg.icon;
            return (
              <div key={fav.id} className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`${cfg.path}/${fav.item_id}`} className="font-heading font-semibold text-foreground text-sm hover:text-accent transition-colors block truncate">
                    {fav.item_title}
                  </Link>
                  {fav.item_company && <p className="text-muted-foreground text-xs truncate">{fav.item_company}</p>}
                  <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${cfg.color}`}>{cfg.label}</span>
                </div>
                <button onClick={() => handleRemove(fav.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}