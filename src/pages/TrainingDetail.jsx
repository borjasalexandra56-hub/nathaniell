import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Star, User, GraduationCap } from 'lucide-react';

export default function TrainingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Training.get(id).then(data => {
      setTraining(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" /></div>;

  if (!training) return (
    <div className="text-center py-20 px-4">
      <p className="text-muted-foreground">Capacitación no encontrada</p>
      <Link to="/trainings" className="text-accent text-sm mt-2 inline-block">Volver</Link>
    </div>
  );

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-6 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
          {training.image_url ? <img src={training.image_url} alt="" className="w-full h-full object-cover" /> : <GraduationCap className="w-16 h-16 text-accent/30" />}
        </div>
        <div className="p-6 lg:p-8">
          <h1 className="font-display text-xl font-bold text-foreground mb-2">{training.title}</h1>
          <div className="flex flex-wrap gap-3 mb-6">
            {training.category && <span className="bg-accent/10 text-accent text-xs font-medium px-3 py-1 rounded-full">{training.category}</span>}
            {training.duration_hours && <span className="flex items-center gap-1 text-muted-foreground text-xs"><Clock className="w-3.5 h-3.5" /> {training.duration_hours} horas</span>}
            {training.modality && <span className="flex items-center gap-1 text-muted-foreground text-xs"><MapPin className="w-3.5 h-3.5" /> {training.modality}</span>}
            {training.rating && <span className="flex items-center gap-1 text-muted-foreground text-xs"><Star className="w-3.5 h-3.5 fill-secondary text-secondary" /> {training.rating}</span>}
            {training.instructor && <span className="flex items-center gap-1 text-muted-foreground text-xs"><User className="w-3.5 h-3.5" /> {training.instructor}</span>}
          </div>
          {training.description && (
            <div className="mb-6">
              <h3 className="font-heading font-semibold text-foreground mb-2">Descripción</h3>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{training.description}</p>
            </div>
          )}
          {training.location && (
            <div className="mb-6 bg-muted rounded-xl p-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /> {training.location}</p>
            </div>
          )}
          <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-heading font-semibold rounded-xl text-base">
            Inscribirme
          </Button>
        </div>
      </div>
    </div>
  );
}