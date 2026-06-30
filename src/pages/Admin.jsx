import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Briefcase, GraduationCap, CalendarDays, FileText, TrendingUp, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { SkeletonList } from '@/components/SkeletonCard';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="font-heading font-bold text-2xl text-foreground">{value}</p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  </div>
);

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, trainings: 0, events: 0, applications: 0, users: 0, community: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (user?.role !== 'admin') return;
    const load = async () => {
      const [jobs, trainings, events, apps, community] = await Promise.all([
        base44.entities.Job.list('-created_date', 100),
        base44.entities.Training.list('-created_date', 100),
        base44.entities.Event.list('-created_date', 100),
        base44.entities.JobApplication.list('-created_date', 20),
        base44.entities.CommunitySupport.list('-created_date', 100),
      ]);
      setStats({
        jobs: jobs.length,
        trainings: trainings.length,
        events: events.length,
        applications: apps.length,
        community: community.length,
      });
      setRecentJobs(jobs.slice(0, 10));
      setRecentApps(apps.slice(0, 10));
      setLoading(false);
    };
    load();
  }, []);

  // Only admins
  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  const tabs = [
    { key: 'overview', label: 'Resumen' },
    { key: 'jobs', label: 'Empleos' },
    { key: 'applications', label: 'Postulaciones' },
  ];

  const statusColors = {
    'En revisión': 'bg-secondary/10 text-secondary',
    'Entrevista': 'bg-accent/10 text-accent',
    'Aprobado': 'bg-success/10 text-success',
    'Rechazado': 'bg-destructive/10 text-destructive',
    'Cancelado': 'bg-muted text-muted-foreground',
    'active': 'bg-success/10 text-success',
    'closed': 'bg-destructive/10 text-destructive',
    'draft': 'bg-muted text-muted-foreground',
  };

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Panel Administrativo</h1>
          <p className="text-muted-foreground text-sm">Gestión de Ciudad Activa</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border pb-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-t-xl text-sm font-medium transition-colors ${tab === t.key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonList count={4} />
      ) : tab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={Briefcase} label="Empleos publicados" value={stats.jobs} color="bg-accent/10 text-accent" />
            <StatCard icon={FileText} label="Postulaciones" value={stats.applications} color="bg-primary/10 text-primary" />
            <StatCard icon={GraduationCap} label="Capacitaciones" value={stats.trainings} color="bg-success/10 text-success" />
            <StatCard icon={CalendarDays} label="Eventos" value={stats.events} color="bg-secondary/10 text-secondary" />
            <StatCard icon={Building2} label="Apoyo comunitario" value={stats.community} color="bg-destructive/10 text-destructive" />
            <StatCard icon={TrendingUp} label="Plataforma activa" value="✅" color="bg-chart-3/10 text-chart-3" />
          </div>

          {/* Recent jobs mini-table */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="font-heading font-semibold text-foreground mb-4">Empleos recientes</h2>
            <div className="space-y-2">
              {recentJobs.slice(0, 5).map(job => (
                <div key={job.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company_name}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.status] || 'bg-muted text-muted-foreground'}`}>{job.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : tab === 'jobs' ? (
        <div className="bg-card rounded-2xl border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-heading font-semibold text-foreground">Todos los empleos ({stats.jobs})</h2>
          </div>
          <div className="divide-y divide-border">
            {recentJobs.map(job => (
              <div key={job.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-accent text-sm">{job.company_name?.[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company_name} · {job.district || job.location}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.status] || 'bg-muted text-muted-foreground'}`}>{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-heading font-semibold text-foreground">Postulaciones recientes ({stats.applications})</h2>
          </div>
          <div className="divide-y divide-border">
            {recentApps.map(app => (
              <div key={app.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{app.job_title}</p>
                  <p className="text-xs text-muted-foreground">{app.company_name}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status] || 'bg-muted text-muted-foreground'}`}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}