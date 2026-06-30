import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, CalendarDays, Recycle, Heart, ArrowRight } from 'lucide-react';

const items = [
  { path: '/jobs', icon: Briefcase, label: 'Empleos', desc: 'Encuentra oportunidades laborales cerca de ti', color: 'bg-accent/10 text-accent' },
  { path: '/trainings', icon: GraduationCap, label: 'Capacitaciones', desc: 'Mejora tus habilidades y crece profesionalmente', color: 'bg-success/10 text-success' },
  { path: '/events', icon: CalendarDays, label: 'Eventos', desc: 'Participa en ferias, talleres y más', color: 'bg-secondary/10 text-secondary' },
  { path: '/recycling', icon: Recycle, label: 'Reciclaje', desc: 'Únete a programas y cuida tu comunidad', color: 'bg-chart-3/10 text-chart-3' },
  { path: '/community', icon: Heart, label: 'Apoyo comunitario', desc: 'Ofrece o solicita ayuda en tu comunidad', color: 'bg-destructive/10 text-destructive' },
];

export default function QuickAccess() {
  return (
    <div>
      <h3 className="font-heading font-bold text-foreground text-base mb-3">Accesos rápidos</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.map(item => (
          <Link key={item.path} to={item.path}
            className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="font-heading font-semibold text-foreground text-sm">{item.label}</p>
            <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-2">{item.desc}</p>
            <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}