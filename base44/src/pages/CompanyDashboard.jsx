import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Briefcase, Plus, Users, CheckCircle, XCircle, Clock, Edit, Trash2, Eye, Star, Users2, TrendingUp } from 'lucide-react';
import PlanUpgradeCTA from '@/components/monetization/PlanUpgradeCTA';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

const defaultJob = { title: '', company_name: '', location: '', district: '', description: '', requirements: '', benefits: '', modality: 'Tiempo completo', category: 'Otro', salary_min: '', salary_max: '', contact_email: '', contact_phone: '', status: 'active' };

export default function CompanyDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('jobs');
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(defaultJob);
  const [saving, setSaving] = useState(false);
  const [companyPlan, setCompanyPlan] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [j, a, plans] = await Promise.all([
        base44.entities.Job.filter({ created_by_id: user?.id }, '-created_date', 100),
        base44.entities.JobApplication.list('-created_date', 100),
        base44.entities.CompanyPlan.filter({ company_user_id: user?.id, status: 'active' }),
      ]);
      setJobs(j);
      setApplications(a);
      setCompanyPlan(plans[0] || null);
      setLoading(false);
    };
    if (user) load();
  }, [user]);

  const openCreate = () => {
    setEditingJob(null);
    setForm(defaultJob);
    setShowJobDialog(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm(job);
    setShowJobDialog(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, salary_min: form.salary_min ? Number(form.salary_min) : undefined, salary_max: form.salary_max ? Number(form.salary_max) : undefined };
    if (editingJob) {
      const updated = await base44.entities.Job.update(editingJob.id, data);
      setJobs(prev => prev.map(j => j.id === editingJob.id ? { ...j, ...data } : j));
      toast({ title: '✅ Empleo actualizado' });
    } else {
      const created = await base44.entities.Job.create(data);
      setJobs(prev => [created, ...prev]);
      toast({ title: '🎉 Empleo publicado exitosamente' });
    }
    setSaving(false);
    setShowJobDialog(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.Job.delete(id);
    setJobs(prev => prev.filter(j => j.id !== id));
    toast({ title: 'Empleo eliminado' });
  };

  const updateAppStatus = async (appId, status) => {
    await base44.entities.JobApplication.update(appId, { status });
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    toast({ title: `Postulación ${status.toLowerCase()}` });
  };

  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const myJobIds = new Set(jobs.map(j => j.id));
  const myApps = applications.filter(a => myJobIds.has(a.job_id));

  const statusColors = {
    'En revisión': 'bg-secondary/10 text-secondary',
    'Entrevista': 'bg-accent/10 text-accent',
    'Aprobado': 'bg-success/10 text-success',
    'Rechazado': 'bg-destructive/10 text-destructive',
    'Cancelado': 'bg-muted text-muted-foreground',
  };

  return (
    <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Panel Empresa</h1>
          <p className="text-muted-foreground text-sm">Gestiona tus empleos y candidatos</p>
        </div>
        <Button onClick={openCreate} className="bg-secondary hover:bg-secondary/90 text-white rounded-xl font-heading font-semibold gap-2">
          <Plus className="w-4 h-4" /> Nuevo empleo
        </Button>
      </div>

      {/* Plan CTA */}
      <div className="mb-5 space-y-3">
        <PlanUpgradeCTA currentPlan={companyPlan?.plan_type || 'free'} />
        <div className="flex gap-3">
          <Link to="/talent-pool" className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl p-3 hover:shadow-md transition-shadow">
            <Users2 className="w-5 h-5 text-accent" />
            <div><p className="font-heading font-semibold text-sm">Bolsa de Talentos</p><p className="text-muted-foreground text-xs">Candidatos activos</p></div>
          </Link>
          <Link to="/pricing" className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl p-3 hover:shadow-md transition-shadow">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <div><p className="font-heading font-semibold text-sm">Ver planes</p><p className="text-muted-foreground text-xs">Pro / Premium</p></div>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="font-heading font-bold text-2xl text-accent">{jobs.filter(j => j.status === 'active').length}</p>
          <p className="text-muted-foreground text-xs">Empleos activos</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="font-heading font-bold text-2xl text-primary">{myApps.length}</p>
          <p className="text-muted-foreground text-xs">Postulaciones</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="font-heading font-bold text-2xl text-secondary">{myApps.filter(a => a.status === 'En revisión').length}</p>
          <p className="text-muted-foreground text-xs">Pendientes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-border pb-1">
        {[{ key: 'jobs', label: `Mis empleos (${jobs.length})` }, { key: 'applicants', label: `Postulantes (${myApps.length})` }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-t-xl text-sm font-medium transition-colors ${tab === t.key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" /></div>
      ) : tab === 'jobs' ? (
        jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No has publicado empleos aún</p>
            <button onClick={openCreate} className="text-accent text-sm mt-2 font-medium hover:underline">Publicar primer empleo →</button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job.id} className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-semibold text-foreground">{job.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${job.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                        {job.status === 'active' ? 'Activo' : job.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{job.district || job.location} · {job.modality}</p>
                    {job.salary_min && <p className="text-success text-sm font-medium mt-1">S/ {job.salary_min}{job.salary_max ? ` - ${job.salary_max}` : ''}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(job)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Edit className="w-4 h-4" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar este empleo?</AlertDialogTitle>
                          <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará el empleo "<strong>{job.title}</strong>".</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(job.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Link to={`/jobs/${job.id}`} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        myApps.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No hay postulantes aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myApps.map(app => (
              <div key={app.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-foreground text-sm">{app.job_title}</p>
                    {app.cover_letter && <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{app.cover_letter}</p>}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusColors[app.status] || 'bg-muted text-muted-foreground'}`}>{app.status}</span>
                </div>
                {app.status === 'En revisión' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => updateAppStatus(app.id, 'Entrevista')} className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs gap-1 h-8">
                      <Clock className="w-3 h-3" /> Entrevista
                    </Button>
                    <Button size="sm" onClick={() => updateAppStatus(app.id, 'Aprobado')} className="flex-1 rounded-xl bg-success hover:bg-success/90 text-white font-heading font-semibold text-xs gap-1 h-8">
                      <CheckCircle className="w-3 h-3" /> Aprobar
                    </Button>
                    <Button size="sm" onClick={() => updateAppStatus(app.id, 'Rechazado')} variant="outline" className="flex-1 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 font-heading font-semibold text-xs gap-1 h-8">
                      <XCircle className="w-3 h-3" /> Rechazar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Create/Edit job dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editingJob ? 'Editar empleo' : 'Publicar nuevo empleo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Título del cargo *</Label>
                <Input value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Ej: Vendedor/a de campo" className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Empresa *</Label>
                <Input value={form.company_name} onChange={e => handleChange('company_name', e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Distrito</Label>
                <Input value={form.district || ''} onChange={e => handleChange('district', e.target.value)} placeholder="Ej: Comas" className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Ubicación</Label>
                <Input value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="Ej: Comas, Lima" className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Categoría</Label>
                <Select value={form.category} onValueChange={v => handleChange('category', v)}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Tecnología", "Construcción", "Ventas", "Logística", "Administración", "Educación", "Salud", "Marketing", "Finanzas", "Otro"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Modalidad</Label>
                <Select value={form.modality} onValueChange={v => handleChange('modality', v)}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Tiempo completo", "Medio tiempo", "Freelance", "Prácticas", "Temporal"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Salario mínimo (S/)</Label>
                <Input type="number" value={form.salary_min || ''} onChange={e => handleChange('salary_min', e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Salario máximo (S/)</Label>
                <Input type="number" value={form.salary_max || ''} onChange={e => handleChange('salary_max', e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Descripción</Label>
                <Textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="rounded-xl mt-1" rows={3} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Requisitos</Label>
                <Textarea value={form.requirements || ''} onChange={e => handleChange('requirements', e.target.value)} className="rounded-xl mt-1" rows={3} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Beneficios</Label>
                <Textarea value={form.benefits || ''} onChange={e => handleChange('benefits', e.target.value)} className="rounded-xl mt-1" rows={2} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email de contacto</Label>
                <Input value={form.contact_email || ''} onChange={e => handleChange('contact_email', e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Teléfono de contacto</Label>
                <Input value={form.contact_phone || ''} onChange={e => handleChange('contact_phone', e.target.value)} className="rounded-xl mt-1" />
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.company_name} className="w-full bg-secondary hover:bg-secondary/90 text-white font-heading font-semibold rounded-xl h-11">
              {saving ? 'Guardando...' : editingJob ? 'Guardar cambios' : '🚀 Publicar empleo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}