import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import moment from 'moment';

export default function UpcomingEvents({ events }) {
  if (!events?.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-bold text-foreground text-base">Próximos eventos</h3>
        <Link to="/events" className="text-accent text-xs font-semibold">Ver todos</Link>
      </div>
      <div className="space-y-3">
        {events.slice(0, 3).map(event => (
          <Link key={event.id} to={`/events/${event.id}`}
            className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all">
            <div className="w-12 h-14 bg-accent/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-accent text-[10px] font-bold uppercase">{moment(event.date).format('MMM')}</span>
              <span className="text-accent font-heading font-bold text-lg leading-none">{moment(event.date).format('DD')}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-semibold text-foreground text-sm">{event.title}</p>
              {event.location && (
                <span className="flex items-center gap-1 text-muted-foreground text-[11px] mt-1">
                  <MapPin className="w-3 h-3" /> {event.location}
                </span>
              )}
              {(event.time_start || event.time_end) && (
                <span className="flex items-center gap-1 text-muted-foreground text-[11px] mt-0.5">
                  <Clock className="w-3 h-3" /> {event.time_start}{event.time_end ? ` - ${event.time_end}` : ''}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}