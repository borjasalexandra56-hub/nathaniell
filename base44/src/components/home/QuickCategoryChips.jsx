import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, CalendarDays, Recycle, Heart } from 'lucide-react';

const categories = [
  { path: '/jobs',      icon: Briefcase,     label: 'Empleos',     bg: 'bg-blue-50 dark:bg-blue-950/40',    iconColor: 'text-[#183D7C] dark:text-blue-400' },
  { path: '/trainings', icon: GraduationCap, label: 'Cursos',      bg: 'bg-emerald-50 dark:bg-emerald-950/40', iconColor: 'text-[#0FA36B]' },
  { path: '/events',    icon: CalendarDays,  label: 'Eventos',     bg: 'bg-orange-50 dark:bg-orange-950/40', iconColor: 'text-[#F57C21]' },
  { path: '/recycling', icon: Recycle,       label: 'Reciclaje',   bg: 'bg-teal-50 dark:bg-teal-950/40',   iconColor: 'text-teal-600 dark:text-teal-400' },
  { path: '/community', icon: Heart,         label: 'Comunidad',   bg: 'bg-rose-50 dark:bg-rose-950/40',   iconColor: 'text-rose-500' },
];

export default function QuickCategoryChips() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-heading font-bold text-foreground">Accesos rápidos</span>
        <Link to="/jobs" className="text-xs text-[#183D7C] dark:text-blue-400 font-semibold">Ver todos</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {categories.map(({ path, icon: Icon, label, bg, iconColor }) => (
          <Link key={path} to={path}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl border border-border/50 active:scale-95 transition-transform duration-150 ${bg}`}>
            <div className="w-10 h-10 rounded-xl bg-white/70 dark:bg-black/20 flex items-center justify-center">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <span className="text-[10px] font-semibold text-foreground whitespace-nowrap">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}