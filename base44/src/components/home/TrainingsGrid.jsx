import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Clock, ArrowRight, Bookmark, Monitor, Users, Laptop } from 'lucide-react';
import { SkeletonList } from '@/components/SkeletonCard';

const badgeColors = {
  'Popular':    'bg-[#F57C21] text-white',
  'Nuevo':      'bg-[#183D7C] text-white',
  'Gratis':     'bg-[#0FA36B] text-white',
  'Certificado':'bg-violet-600 text-white',
  'Premium':    'bg-amber-500 text-white',
};

const cardGrads = [
  'from-[#183D7C] to-blue-900',
  'from-[#0FA36B] to-teal-800',
  'from-[#F57C21] to-orange-800',
  'from-violet-600 to-violet-900',
];

const modalityIcons = { 'Virtual': Monitor, 'Presencial': Users, 'Híbrido': Laptop };

export default function TrainingsGrid({ trainings, loading }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-heading font-bold text-foreground">Capacitaciones destacadas</span>
        <Link to="/trainings" className="text-xs text-[#183D7C] dark:text-blue-400 font-semibold flex items-center gap-0.5">
          Ver todas <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? <SkeletonList count={1} /> : trainings.length === 0 ? null : (
        <div className="space-y-2">
          {trainings.slice(0, 3).map((t, idx) => {
            const ModalityIcon = modalityIcons[t.modality] || Monitor;
            return (
              <Link key={t.id} to={`/trainings/${t.id}`}
                className="flex items-center gap-3 bg-card border border-border rounded-2xl p-2.5 active:scale-[0.99] transition-transform duration-150 hover:shadow-sm">

                {/* Thumbnail */}
                <div className="flex-shrink-0 rounded-xl overflow-hidden w-16 h-14">
                  {t.image_url
                    ? <img src={t.image_url} alt={t.title} className="w-full h-full object-cover" />
                    : <div className={`w-full h-full bg-gradient-to-br ${cardGrads[idx % cardGrads.length]} flex items-center justify-center`}>
                        <GraduationCap className="w-5 h-5 text-white/50" />
                      </div>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-foreground text-xs line-clamp-2 leading-snug mb-0.5">{t.title}</p>
                  {t.instructor && (
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#183D7C] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[6px] font-bold">✓</span>
                      </div>
                      <p className="text-muted-foreground text-[10px] truncate">{t.instructor}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px]">
                    <span className="flex items-center gap-0.5">
                      <ModalityIcon className="w-2.5 h-2.5" />{t.modality || 'Virtual'}
                    </span>
                    {t.duration_hours && (
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />{t.duration_hours} horas
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${t.price ? 'bg-[#183D7C]/10 text-[#183D7C] dark:text-blue-300' : 'bg-[#0FA36B]/10 text-[#0FA36B]'}`}>
                    {t.price ? `S/ ${t.price}` : 'Gratis'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}