import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star } from 'lucide-react';

const badgeColors = {
  'Popular': 'bg-destructive text-white',
  'Nuevo': 'bg-accent text-white',
  'Gratis': 'bg-success text-white',
  'Certificado': 'bg-secondary text-white',
};

export default function RecommendedTrainings({ trainings }) {
  if (!trainings?.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-bold text-foreground text-base">Capacitaciones recomendadas</h3>
        <Link to="/trainings" className="text-accent text-xs font-semibold">Ver todas</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {trainings.slice(0, 4).map(t => (
          <Link key={t.id} to={`/trainings/${t.id}`}
            className="flex-shrink-0 w-52 bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all">
            <div className="h-28 bg-gradient-to-br from-accent/20 to-accent/5 relative flex items-center justify-center">
              {t.image_url ? (
                <img src={t.image_url} alt={t.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-accent/40 font-heading font-bold text-3xl">{t.category?.[0]}</span>
              )}
              {t.badge && (
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColors[t.badge] || 'bg-muted text-foreground'}`}>
                  {t.badge}
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="font-heading font-semibold text-foreground text-sm line-clamp-2">{t.title}</p>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground text-[11px]">
                {t.duration_hours && <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {t.duration_hours}h</span>}
                {t.modality && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {t.modality}</span>}
                {t.rating && <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-secondary text-secondary" /> {t.rating}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}