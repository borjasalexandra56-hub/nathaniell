import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, GraduationCap, CalendarDays, TrendingUp } from 'lucide-react';

const items = [
  { icon: FileText,       key: 'applications', label: 'Postulaciones', path: '/applications', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40' },
  { icon: GraduationCap,  key: 'trainings',    label: 'Cursos',        path: '/trainings',    color: 'text-[#0FA36B]',                       bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { icon: CalendarDays,   key: 'events',       label: 'Eventos',       path: '/events',       color: 'text-[#F57C21]',                       bg: 'bg-orange-50 dark:bg-orange-950/40' },
  { icon: TrendingUp,     key: null,           label: 'Actividad',     path: '/profile',      color: 'text-[#183D7C] dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-950/40' },
];

export default function ActivitySummaryBar({ applications, trainings, events }) {
  const counts = { applications: applications.length, trainings: trainings.length, events: events.length };

  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wide mb-2">Tu actividad</p>
      <div className="grid grid-cols-4 gap-1.5">
        {items.map(({ icon: Icon, key, label, path, color, bg }) => (
          <Link key={path} to={path}
            className={`${bg} rounded-lg p-2 text-center flex flex-col items-center gap-0.5 active:opacity-70 transition-opacity`}>
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            <p className={`font-heading font-extrabold text-sm leading-none ${color}`}>
              {key ? counts[key] : '–'}
            </p>
            <p className="text-muted-foreground text-[8px] leading-tight text-center">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}