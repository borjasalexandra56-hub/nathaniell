import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Lock, Crown, Filter, User, Star, MapPin, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';

const EDUCATION_ICONS = { Universitario: '🎓', Técnico: '🔧', Postgrado: '🏅', Secundaria: '📚', Primaria: '📖' };

export default function TalentPool() {
  const [plan, setPlan] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterExp, setFilterExp] = useState('');
  const [filterEdu, setFilterEdu] = useState('');

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me();
      const [plans, profs] = await Promise.all([
        base44.entities.CompanyPlan.filter({ company_user_id: user.id, status: 'active' }),
        base44.entities.UserProfile.filter({ user_type: 'worker' }),
      ]);
      setPlan(plans[0] || null);
      setProfiles(profs);
      setLoading(false);
    };
    load();
  }, []);

  const hasPlanAccess = plan && (plan.plan_type === 'pro' || plan.plan_type === 'premium');

  const filtered = profiles.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || (p.full_name || '').toLowerCase().includes(q) || (p.skills || '').toLowerCase().includes(q) || (p.occupation || '').toLowerCase().includes(q);
    const matchExp = !filterExp || (filterExp === '5+' ? (p.experience_years || 0) >= 5 : (p.experience_years || 0) <= parseInt(filterExp));
    const matchEdu = !filterEdu || p.education_level === filterEdu;
    return matchQ && matchExp && matchEdu;
  });

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;

  if (!hasPlanAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-white py-10 px-4 text-center">
          <Crown className="w-12 h-12 mx-auto mb-3 text-secondary" />
          <h1 className="font-display text-2xl font-bold mb-2">Bolsa de Talentos</h1>
          <p className="text-white/80 text-sm max-w-md mx-auto">Accede al directorio completo de candidatos activos en Lima y conecta con el talento ideal para tu empresa.</p>
        </div>
        <div className="max-w-lg mx-auto px-4 py-10 text-center">
          <div className="bg-card border border-border rounded-2xl p-8">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Acceso exclusivo</h2>
            <p className="text-muted-foreground text-sm mb-6">La Bolsa de Talentos está disponible para empresas con Plan Pro o Premium. Accede a búsquedas avanzadas, filtros por habilidades y perfiles destacados.</p>
            <div className="space-y-3">
              <Link to="/checkout" state={{ product: 'pro', price: 79 }}>
                <Button className="w-full font-heading font-semibold bg-accent hover:bg-accent/90 text-white">Actualizar a Pro — S/79/mes</Button>
              </Link>
              <Link to="/checkout" state={{ product: 'premium', price: 299 }}>
                <Button variant="secondary" className="w-full font-heading font-semibold">Actualizar a Premium — S/299/mes</Button>
              </Link>
              <Link to="/pricing"><Button variant="outline" className="w-full font-heading font-semibold">Ver todos los planes</Button></Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="bg-primary text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-secondary" />
            <span className="text-secondary text-sm font-heading font-semibold">Plan {plan.plan_type === 'premium' ? 'Premium' : 'Pro'}</span>
          </div>
          <h1 className="font-display text-2xl font-bold">Bolsa de Talentos</h1>
          <p className="text-white/70 text-sm mt-1">{profiles.length} candidatos activos</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-5">
        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, habilidades u ocupación..." className="pl-9" />
          </div>
          <select value={filterExp} onChange={e => setFilterExp(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground">
            <option value="">Toda experiencia</option>
            <option value="1">Hasta 1 año</option>
            <option value="3">Hasta 3 años</option>
            <option value="5+">5+ años</option>
          </select>
          <select value={filterEdu} onChange={e => setFilterEdu(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground">
            <option value="">Todo nivel educativo</option>
            {['Primaria', 'Secundaria', 'Técnico', 'Universitario', 'Postgrado'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No se encontraron candidatos con esos filtros.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {p.photo_url ? <img src={p.photo_url} className="w-12 h-12 rounded-full object-cover" alt="" /> : <User className="w-6 h-6 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-sm">{p.full_name || 'Candidato'}</h3>
                    {p.occupation && <p className="text-muted-foreground text-xs mt-0.5">{p.occupation}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.district && <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{p.district}</span>}
                      {p.experience_years != null && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Briefcase className="w-3 h-3" />{p.experience_years} años</span>}
                      {p.education_level && <span className="flex items-center gap-1 text-xs text-muted-foreground"><GraduationCap className="w-3 h-3" />{p.education_level}</span>}
                    </div>
                    {p.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.skills.split(',').slice(0, 3).map((s, i) => (
                          <span key={i} className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full">{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}