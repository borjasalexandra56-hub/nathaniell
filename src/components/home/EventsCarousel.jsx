import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Calendar, Star } from 'lucide-react';
import moment from 'moment';
import { SkeletonList } from '@/components/SkeletonCard';

const dateBg = ['bg-[#F57C21]', 'bg-[#183D7C]', 'bg-[#0FA36B]', 'bg-rose-500', 'bg-violet-600'];

export default function EventsCarousel({ events, loading }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-heading font-bold text-foreground">Eventos próximos</span>
        <Link to="/events" className="text-xs text-[#183D7C] dark:text-blue-400 font-semibold flex items-center gap-0.5">
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? <SkeletonList count={1} /> : events.length === 0 ? null : (
        <div className="-mx-4 sm:mx-0">
          <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory px-4 sm:px-0"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {events.slice(0, 5).map((ev, idx) => (
              <Link key={ev.id} to={`/events/${ev.id}`}
                className="snap-start flex-shrink-0 bg-card border border-border rounded-2xl overflow-hidden active:scale-[0.98] transition-transform duration-150"
                style={{ width: 'clamp(130px, 38vw, 165px)' }}>

                {/* Image */}
                <div className="relative" style={{ height: 'clamp(72px, 20vw, 90px)' }}>
                  {ev.image_url
                    ? <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                    : <div className={`w-full h-full flex items-center justify-center ${dateBg[idx % dateBg.length]}`}>
                        <Calendar className="w-6 h-6 text-white/50" />
                      </div>
                  }
                  {/* Star bookmark */}
                  <button className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/30 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </button>
                </div>

                <div className="p-2">
                  {/* Date row */}
                  <div className="flex items-center gap-1 mb-1">
                    <span className={`text-[9px] font-extrabold text-white px-1.5 py-0.5 rounded-md ${dateBg[idx % dateBg.length]}`}>
                      {moment(ev.date).format('DD MMM').toUpperCase()}
                    </span>
                  </div>
                  <p className="font-heading font-bold text-foreground text-[11px] line-clamp-2 leading-snug mb-1">{ev.title}</p>
                  {ev.location && (
                    <div className="flex items-center gap-0.5 text-muted-foreground text-[9px]">
                      <MapPin className="w-2 h-2 flex-shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                  {ev.time_start && (
                    <div className="flex items-center gap-0.5 text-muted-foreground text-[9px] mt-0.5">
                      <Clock className="w-2 h-2 flex-shrink-0" />
                      {ev.time_start}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}