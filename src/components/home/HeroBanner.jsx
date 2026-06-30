import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CalendarDays, GraduationCap, FileText } from 'lucide-react';

const stats = [
  { icon: Briefcase,    label: 'Empleos',      path: '/jobs',          key: 'jobs' },
  { icon: CalendarDays, label: 'Eventos',       path: '/events',        key: 'events' },
  { icon: GraduationCap,label: 'Cursos',        path: '/trainings',     key: 'trainings' },
  { icon: FileText,     label: 'Aplicaciones',  path: '/applications',  key: 'applications' },
];

export default function HeroBanner({ jobs, events, trainings, applications, loading }) {
  const counts = { jobs: jobs.length, events: events.length, trainings: trainings.length, applications: applications.length };

  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#183D7C] to-[#0d2a5c] p-3">
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
      <div className="relative z-10">
        {/* 2×2 stat grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {stats.map(({ icon: Icon, label, path, key }) => (
            <Link key={path} to={path}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 active:bg-white/20 rounded-lg px-2.5 py-2 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-extrabold text-white text-base leading-none">
                  {loading ? '–' : counts[key]}
                </p>
                <p className="text-white/55 text-[10px] leading-tight truncate">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}