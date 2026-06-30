import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, XCircle, Users, AlertCircle, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

const statusConfig = {
  'En revisión': { icon: Clock, color: 'text-secondary bg-secondary/10', dot: 'bg-secondary', label: 'En revisión' },
  'Entrevista': { icon: Users, color: 'text-accent bg-accent/10', dot: 'bg-accent', label: 'Entrevista' },
  'Aprobado': { icon: CheckCircle, color: 'text-success bg-success/10', dot: 'bg-success', label: 'Aprobado' },
  'Rechazado': { icon: XCircle, color: 'text-destructive bg-destructive/10', dot: 'bg-destructive', label: 'Rechazado' },
  'Cancelado': { icon: AlertCircle, color: 'text-muted-foreground bg-muted', dot: 'bg-muted-foreground', label: 'Cancelado' },
};

const statusOrder = ['En revisión', 'Entrevista', 'Aprobado', 'Rechazado', 'Cancelado'];

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.JobApplication.list('-created_date', 100).then(data => {
      setApplications(data);
      setLoading(false);
    });
  }, []);

  const handleCancel = async (id) => {
    await base44.entities.JobApplication.update(id, { status: 'Cancelado' });
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelado' } : a));
    toast({ title: 'Postulación cancelada', description: 'La postulación fue cancelada exitosamente.' });
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Mis postulaciones</h1>
      <p className="text-muted-foreground text-sm mb-5">Seguimiento de tus aplicaciones a empleos</p>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: 'Total', value: applications.length, color: 'text-foreground' },
          { label: 'En revisión', value: applications.filter(a => a.status === 'En revisión').length, color: 'text-secondary' },
          { label: 'Entrevista', value: applications.filter(a => a.status === 'Entrevista').length, color: 'text-accent' },
          { label: 'Aprobados', value: applications.filter(a => a.status === 'Aprobado').length, color: 'text-success' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
            <p className={`font-heading font-bold text-xl ${s.color}`}>{s.value}</p>
            <p className="text-muted-foreground text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
          Todos
        </button>
        {statusOrder.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Aún no tienes postulaciones</p>
          <Link to="/jobs" className="text-accent text-sm mt-2 inline-block font-medium">Explorar empleos →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const cfg = statusConfig[app.status] || statusConfig['En revisión'];
            const Icon = cfg.icon;
            const canCancel = app.status === 'En revisión';
            return (
              <div key={app.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${app.job_id}`}>
                      <p className="font-heading font-semibold text-foreground text-sm hover:text-accent transition-colors">{app.job_title}</p>
                    </Link>
                    <p className="text-muted-foreground text-xs">{app.company_name}</p>
                    <p className="text-muted-foreground text-[11px] mt-1">{moment(app.created_date).format('DD MMM YYYY')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    {canCancel && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Cancelar postulación?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción cancelará tu postulación a <strong>{app.job_title}</strong>. No podrás deshacerla.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No, mantener</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancel(app.id)} className="bg-destructive hover:bg-destructive/90">
                              Sí, cancelar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}