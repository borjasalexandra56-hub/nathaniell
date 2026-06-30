import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Bookmark, Filter, BookmarkCheck, Star } from 'lucide-react';
import moment from 'moment';
import { useToast } from '@/components/ui/use-toast';
import { SkeletonList } from '@/components/SkeletonCard';
import AdBanner from '@/components/monetization/AdBanner';

const categories = ["Tecnología", "Construcción", "Ventas", "Logística", "Administración", "Educación", "Salud", "Marketing", "Finanzas", "Otro"];
const modalities = ["Tiempo completo", "Medio tiempo", "Freelance", "Prácticas", "Temporal"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [modality, setModality] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const [jobData, favData] = await Promise.all([
        base44.entities.Job.filter({ status: 'active' }, '-created_date', 100),
        base44.entities.Favorite.filter({ item_type: 'job' }),
      ]);
      setJobs(jobData);
      setFavorites(new Set(favData.map(f => f.item_id)));
      setLoading(false);
    };
    load();
  }, []);

  const toggleFavorite = async (e, job) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorites.has(job.id)) {
      const favs = await base44.entities.Favorite.filter({ item_id: job.id, item_type: 'job' });
      if (favs.length > 0) await base44.entities.Favorite.delete(favs[0].id);
      setFavorites(prev => { const s = new Set(prev); s.delete(job.id); return s; });
      toast({ title: 'Eliminado de favoritos' });
    } else {
      await base44.entities.Favorite.create({ item_type: 'job', item_id: job.id, item_title: job.title, item_company: job.company_name });
      setFavorites(prev => new Set([...prev, job.id]));
      toast({ title: '⭐ Guardado en favoritos' });
    }
  };

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.company_name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || j.category === category;
    const matchModality = modality === 'all' || j.modality === modality;
    return matchSearch && matchCategory && matchModality;
  });

  return (
    <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Empleos disponibles</h1>
      <p className="text-muted-foreground text-sm mb-6">Encuentra la oportunidad perfecta para ti</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por cargo o empresa..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={modality} onValueChange={setModality}>
          <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl">
            <SelectValue placeholder="Modalidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las modalidades</SelectItem>
            {modalities.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <AdBanner placement="jobs" />

      {loading ? (
        <SkeletonList count={5} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No se encontraron empleos</p>
          <p className="text-muted-foreground/60 text-sm">Intenta cambiar los filtros</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`}
              className={`flex items-start gap-4 bg-card rounded-xl p-5 border hover:shadow-lg transition-all group ${job.is_featured ? 'border-secondary/40 bg-secondary/5' : 'border-border'}`}>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-accent">{job.company_name?.[0] || 'E'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-accent transition-colors">{job.title}</h3>
                  {job.is_featured && <span className="flex items-center gap-1 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full"><Star className="w-2.5 h-2.5" />Destacado</span>}
                </div>
                <p className="text-muted-foreground text-sm">{job.company_name}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <MapPin className="w-3.5 h-3.5" /> {job.district || job.location}
                  </span>
                  {job.modality && (
                    <span className="bg-accent/10 text-accent text-xs font-medium px-2.5 py-0.5 rounded-full">{job.modality}</span>
                  )}
                  {job.salary_min && (
                    <span className="text-success text-xs font-medium">S/ {job.salary_min}{job.salary_max ? ` - ${job.salary_max}` : ''}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button onClick={(e) => toggleFavorite(e, job)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  {favorites.has(job.id)
                    ? <BookmarkCheck className="w-5 h-5 text-secondary" />
                    : <Bookmark className="w-5 h-5 text-muted-foreground hover:text-secondary transition-colors" />
                  }
                </button>
                <span className="text-muted-foreground text-[11px]">{moment(job.created_date).fromNow()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}