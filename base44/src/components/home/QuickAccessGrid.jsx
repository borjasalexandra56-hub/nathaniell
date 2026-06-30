import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, CalendarDays, Recycle, Heart, FileText, Star, Bell } from 'lucide-react';

const links = [
  { path: '/jobs',          icon: Briefcase,     label: 'Empleos',        bg: 'bg-[#183D7C]' },
  { path: '/trainings',     icon: GraduationCap, label: 'Capacitaciones', bg: 'bg-[#0FA36B]' },
  { path: '/events',        icon: CalendarDays,  label: 'Eventos',        bg: 'bg-[#F57C21]' },
  { path: '/recycling',     icon: Recycle,       label: 'Reciclaje',      bg: 'bg-teal-600' },
  { path: '/community',     icon: Heart,         label: 'Comunidad',      bg: 'bg-rose-500' },
  { path: '/applications',  icon: FileText,      label: 'Postulaciones',  bg: 'bg-violet-600' },
  { path: '/favorites',     icon: Star,          label: 'Favoritos',      bg: 'bg-amber-500' },
  { path: '/notifications', icon: Bell,          label: 'Alertas',        bg: 'bg-pink-500' },
];

export default function QuickAccessGrid() {
  return (
    <div>
      <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wide mb-2">Accesos rápidos</p>
      <div className="grid grid-cols-4 gap-1.5">
        {links.map(item => (
          <Link key={item.path} to={item.path}
            className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl bg-card border border-border active:scale-95 transition-transform duration-150">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.bg}`}>
              <item.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-[9px] font-semibold text-foreground text-center leading-tight">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}