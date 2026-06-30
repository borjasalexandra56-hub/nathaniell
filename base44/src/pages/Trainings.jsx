import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, MapPin, Star, GraduationCap } from 'lucide-react';

const badgeColors = {
  'Popular': 'bg-destructive text-white',
  'Nuevo': 'bg-accent text-white',
  'Gratis': 'bg-success text-white',
  'Certificado': 'bg-secondary text-white',
};

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    base44.entities.Training.filter({ status: 'active' }, '-created_date', 50).then(data => {
      setTrainings(data);
      setLoading(false);
    });
  }, []);

  const filtered = trainings.filter(t => {
    const matchSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || t.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Capacitaciones</h1>
      <p className="text-muted-foreground text-sm mb-6">Mejora tus habilidades y crece profesionalmente</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar capacitación..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {["Tecnología", "Construcción", "Emprendimiento", "Marketing", "Finanzas", "Educación", "Salud", "Otro"].map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No se encontraron capacitaciones</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <Link key={t.id} to={`/trainings/${t.id}`}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all">
              <div className="h-36 bg-gradient-to-br from-accent/20 to-accent/5 relative flex items-center justify-center">
                {t.image_url ? (
                  <img src={t.image_url} alt={t.title} className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-12 h-12 text-accent/30" />
                )}
                {t.badge && (
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColors[t.badge] || 'bg-muted text-foreground'}`}>
                    {t.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-heading font-semibold text-foreground line-clamp-2">{t.title}</p>
                <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{t.description}</p>
                <div className="flex items-center gap-3 mt-3 text-muted-foreground text-xs">
                  {t.duration_hours && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t.duration_hours} horas</span>}
                  {t.modality && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {t.modality}</span>}
                  {t.rating && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-secondary text-secondary" /> {t.rating}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}