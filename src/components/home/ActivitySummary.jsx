import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, GraduationCap, CalendarDays, Heart, ChevronRight } from 'lucide-react';

export default function ActivitySummary({ applicationCount, trainingCount, eventCount }) {
  const items = [
    { icon: FileText, label: 'Postulaciones enviadas', count: applicationCount, path: '/applications', color: 'text-accent' },
    { icon: GraduationCap, label: 'Cursos inscritos', count: trainingCount, path: '/trainings', color: 'text-success' },
    { icon: CalendarDays, label: 'Eventos inscritos', count: eventCount, path: '/events', color: 'text-secondary' },
    { icon: Heart, label: 'Ayudas ofrecidas', count: 0, path: '/community', color: 'text-destructive' },
  ];

  return (
    <div>
      <h3 className="font-heading font-bold text-foreground text-base mb-3">Tu actividad</h3>
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {items.map(item => (
          <Link key={item.path} to={item.path} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="flex-1 text-foreground text-sm">{item.label}</span>
            <span className="font-heading font-bold text-foreground text-sm">{item.count}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}