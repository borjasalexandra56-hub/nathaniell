import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MapPin, Plus, HandHeart, Package } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const categoryColors = {
  'Educación': 'bg-accent/10 text-accent',
  'Salud': 'bg-destructive/10 text-destructive',
  'Alimentación': 'bg-secondary/10 text-secondary',
  'Emergencias': 'bg-destructive/10 text-destructive',
  'Servicios': 'bg-success/10 text-success',
  'Donaciones': 'bg-chart-5/10 text-chart-5',
};

export default function Community() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Educación', type: 'request', location: '' });

  useEffect(() => {
    base44.entities.CommunitySupport.filter({ status: 'active' }, '-created_date', 50).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    await base44.entities.CommunitySupport.create({
      ...form,
      author_name: user?.full_name || 'Anónimo',
    });
    const updated = await base44.entities.CommunitySupport.filter({ status: 'active' }, '-created_date', 50);
    setItems(updated);
    setOpen(false);
    setForm({ title: '', description: '', category: 'Educación', type: 'request', location: '' });
  };

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Apoyo Comunitario</h1>
          <p className="text-muted-foreground text-sm">Ayuda mutua entre ciudadanos de Collique</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-xl font-heading font-semibold gap-2">
              <Plus className="w-4 h-4" /> Publicar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Nueva publicación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Button variant={form.type === 'request' ? 'default' : 'outline'} onClick={() => setForm(p => ({...p, type: 'request'}))} className="flex-1 rounded-xl gap-1">
                  <HandHeart className="w-4 h-4" /> Solicitar ayuda
                </Button>
                <Button variant={form.type === 'offer' ? 'default' : 'outline'} onClick={() => setForm(p => ({...p, type: 'offer'}))} className="flex-1 rounded-xl gap-1">
                  <Package className="w-4 h-4" /> Ofrecer ayuda
                </Button>
              </div>
              <Input placeholder="Título" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="rounded-xl" />
              <Textarea placeholder="Descripción" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="rounded-xl" rows={3} />
              <Select value={form.category} onValueChange={v => setForm(p => ({...p, category: v}))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Educación", "Salud", "Alimentación", "Emergencias", "Servicios", "Donaciones"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Ubicación (ej: San Juan de Lurigancho)" value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} className="rounded-xl" />
              <Button onClick={handleSubmit} disabled={!form.title} className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-xl font-heading font-semibold">
                Publicar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No hay publicaciones aún</p>
          <p className="text-muted-foreground/60 text-sm">Sé el primero en solicitar u ofrecer ayuda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.type === 'offer' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}`}>
                  {item.type === 'offer' ? <Package className="w-5 h-5" /> : <HandHeart className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-heading font-semibold text-foreground text-sm">{item.author_name}</p>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs">{item.type === 'offer' ? 'ofrece' : 'necesita'}</span>
                  </div>
                  <p className="text-foreground text-sm">{item.title}</p>
                  {item.description && <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{item.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    {item.location && <span className="flex items-center gap-1 text-muted-foreground text-[11px]"><MapPin className="w-3 h-3" /> {item.location}</span>}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[item.category] || 'bg-muted text-foreground'}`}>{item.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}