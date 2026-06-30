import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import moment from 'moment';

export default function RecentActivity({ applications }) {
  if (!applications || applications.length === 0) return null;

  const recent = applications.slice(0, 3);

  const statusColor = {
    'En revisión': 'text-amber-600 dark:text-amber-400',
    'Entrevista':  'text-blue-600 dark:text-blue-400',
    'Aprobado':    'text-emerald-600 dark:text-emerald-400',
    'Rechazado':   'text-red-500',
    'Cancelado':   'text-muted-foreground',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-heading font-bold text-foreground">Actividad reciente</span>
        <Link to="/applications" className="text-xs text-[#183D7C] dark:text-blue-400 font-semibold">Ver todo</Link>
      </div>

      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {recent.map(app => (
          <Link key={app.id} to="/applications"
            className="flex items-center gap-3 px-3 py-2.5 active:bg-muted/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#183D7C]/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-[#183D7C] dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                Postulaste a {app.job_title}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {app.company_name} · {moment(app.created_date).fromNow()}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`text-[10px] font-semibold ${statusColor[app.status] || 'text-muted-foreground'}`}>
                {app.status || 'En revisión'}
              </span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}