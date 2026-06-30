import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin, Clock, Briefcase, DollarSign, Mail, Phone, CheckCircle, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favId, setFavId] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const load = async () => {
      const [data, apps, favs] = await Promise.all([
        base44.entities.Job.get(id),
        base44.entities.JobApplication.filter({ job_id: id }),
        base44.entities.Favorite.filter({ item_id: id, item_type: 'job' }),
      ]);
      setJob(data);
      if (apps.length > 0) setApplied(true);
      if (favs.length > 0) { setIsFav(true); setFavId(favs[0].id); }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    await base44.entities.JobApplication.create({
      job_id: id,
      job_title: job.title,
      company_name: job.company_name,
      cover_letter: coverLetter,
    });
    setApplied(true);
    setApplying(false);
    setShowApplyDialog(false);
    toast({ title: '🎉 ¡Postulación enviada!', description: `Te postulaste a ${job.title} en ${job.company_name}` });
  };

  const toggleFav = async () => {
    if (isFav && favId) {
      await base44.entities.Favorite.delete(favId);
      setIsFav(false); setFavId(null);
      toast({ title: 'Eliminado de favoritos' });
    } else {
      const fav = await base44.entities.Favorite.create({ item_type: 'job', item_id: id, item_title: job.title, item_company: job.company_name });
      setIsFav(true); setFavId(fav.id);
      toast({ title: '⭐ Guardado en favoritos' });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: job.title, text: `${job.title} en ${job.company_name}`, url: window.location.href });
        return;
      } catch (e) {
        // Fall through to clipboard fallback on denial or cancellation
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Enlace copiado' });
    } catch {
      toast({ title: 'No se pudo copiar el enlace', variant: 'destructive' });
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="text-center py-20 px-4">
      <p className="text-muted-foreground">Empleo no encontrado</p>
      <Link to="/jobs" className="text-accent text-sm mt-2 inline-block">Volver a empleos</Link>
    </div>
  );

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="font-heading font-bold text-accent text-xl">{job.company_name?.[0]}</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">{job.title}</h1>
              <p className="text-muted-foreground">{job.company_name}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={toggleFav} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
              {isFav ? <BookmarkCheck className="w-5 h-5 text-secondary" /> : <Bookmark className="w-5 h-5 text-muted-foreground" />}
            </button>
            <button onClick={handleShare} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {job.location && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted rounded-lg px-3 py-1.5">
              <MapPin className="w-4 h-4" /> {job.district || job.location}
            </span>
          )}
          {job.modality && (
            <span className="flex items-center gap-1.5 text-sm text-accent bg-accent/10 rounded-lg px-3 py-1.5 font-medium">
              <Briefcase className="w-4 h-4" /> {job.modality}
            </span>
          )}
          {job.salary_min && (
            <span className="flex items-center gap-1.5 text-sm text-success bg-success/10 rounded-lg px-3 py-1.5 font-medium">
              <DollarSign className="w-4 h-4" /> S/ {job.salary_min}{job.salary_max ? ` - ${job.salary_max}` : ''}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted rounded-lg px-3 py-1.5">
            <Clock className="w-4 h-4" /> {moment(job.created_date).fromNow()}
          </span>
        </div>

        {job.description && (
          <div className="mb-6">
            <h3 className="font-heading font-semibold text-foreground mb-2">Descripción</h3>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>
        )}
        {job.requirements && (
          <div className="mb-6">
            <h3 className="font-heading font-semibold text-foreground mb-2">Requisitos</h3>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{job.requirements}</p>
          </div>
        )}
        {job.benefits && (
          <div className="mb-6">
            <h3 className="font-heading font-semibold text-foreground mb-2">Beneficios</h3>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{job.benefits}</p>
          </div>
        )}

        {(job.contact_email || job.contact_phone) && (
          <div className="mb-6 bg-muted rounded-xl p-4">
            <h3 className="font-heading font-semibold text-foreground mb-2">Contacto</h3>
            {job.contact_email && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-4 h-4" /> {job.contact_email}</p>}
            {job.contact_phone && <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1"><Phone className="w-4 h-4" /> {job.contact_phone}</p>}
          </div>
        )}

        {applied ? (
          <div className="flex items-center gap-3 bg-success/10 text-success rounded-xl p-4 border border-success/20">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-heading font-semibold">Ya te postulaste a este empleo</p>
              <p className="text-success/70 text-sm">Revisa el estado en <Link to="/applications" className="underline font-medium">Mis postulaciones</Link></p>
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowApplyDialog(true)} className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-heading font-semibold rounded-xl text-base">
            Postularme ahora →
          </Button>
        )}
      </div>

      {/* Apply dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Postularse a {job.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-muted rounded-xl p-3 text-sm">
              <p className="font-medium text-foreground">{job.company_name}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{job.district || job.location}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Carta de presentación (opcional)</Label>
              <Textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Cuéntale al empleador por qué eres el candidato ideal..."
                className="rounded-xl mt-1"
                rows={4}
              />
            </div>
            <Button onClick={handleApply} disabled={applying} className="w-full bg-secondary hover:bg-secondary/90 text-white font-heading font-semibold rounded-xl h-11">
              {applying ? 'Enviando postulación...' : '🚀 Enviar postulación'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}