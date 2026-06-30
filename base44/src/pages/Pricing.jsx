import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Zap, Crown, Building2, Star, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLANS = [
  {
    key: 'free',
    name: 'Gratuito',
    price: 0,
    period: '',
    icon: Building2,
    color: 'border-border',
    headerBg: 'bg-muted',
    badge: null,
    features: [
      { text: 'Perfil empresarial completo', ok: true },
      { text: '1 empleo publicado por mes', ok: true },
      { text: 'Recibir postulaciones', ok: true },
      { text: 'Estadísticas básicas', ok: false },
      { text: 'Prioridad en búsquedas', ok: false },
      { text: 'Candidatos recomendados', ok: false },
      { text: 'Publicaciones destacadas', ok: false },
      { text: 'Bolsa de talentos', ok: false },
      { text: 'Analíticas avanzadas', ok: false },
    ],
    cta: 'Comenzar gratis',
    ctaVariant: 'outline',
  },
  {
    key: 'pro',
    name: 'Empresa Pro',
    price: 79,
    period: '/mes',
    icon: Zap,
    color: 'border-accent',
    headerBg: 'bg-accent',
    badge: 'Más popular',
    features: [
      { text: 'Perfil empresarial completo', ok: true },
      { text: 'Empleos ilimitados', ok: true },
      { text: 'Recibir postulaciones', ok: true },
      { text: 'Estadísticas básicas', ok: true },
      { text: 'Prioridad en búsquedas', ok: true },
      { text: 'Candidatos recomendados', ok: true },
      { text: 'Publicaciones destacadas', ok: false },
      { text: 'Bolsa de talentos', ok: false },
      { text: 'Analíticas avanzadas', ok: false },
    ],
    cta: 'Actualizar a Pro',
    ctaVariant: 'default',
  },
  {
    key: 'premium',
    name: 'Empresa Premium',
    price: 299,
    period: '/mes',
    icon: Crown,
    color: 'border-secondary',
    headerBg: 'bg-secondary',
    badge: 'Más completo',
    features: [
      { text: 'Perfil empresarial completo', ok: true },
      { text: 'Empleos ilimitados', ok: true },
      { text: 'Recibir postulaciones', ok: true },
      { text: 'Estadísticas avanzadas', ok: true },
      { text: 'Prioridad máxima en búsquedas', ok: true },
      { text: 'Candidatos recomendados', ok: true },
      { text: 'Publicaciones destacadas incluidas', ok: true },
      { text: 'Bolsa de talentos completa', ok: true },
      { text: 'Analíticas avanzadas', ok: true },
    ],
    cta: 'Actualizar a Premium',
    ctaVariant: 'secondary',
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState('monthly');

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <div className="bg-primary text-white py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-white/70 text-sm font-heading mb-2">Para empresas</p>
          <h1 className="font-display text-3xl font-bold mb-3">Planes empresariales</h1>
          <p className="text-white/80 text-base">Encuentra al talento ideal. Los trabajadores siempre acceden gratis.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-10">
        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted rounded-xl p-1">
            <button onClick={() => setBilling('monthly')} className={`px-5 py-2 rounded-lg text-sm font-heading font-semibold transition-colors ${billing === 'monthly' ? 'bg-white text-primary shadow' : 'text-muted-foreground'}`}>Mensual</button>
            <button onClick={() => setBilling('annual')} className={`px-5 py-2 rounded-lg text-sm font-heading font-semibold transition-colors ${billing === 'annual' ? 'bg-white text-primary shadow' : 'text-muted-foreground'}`}>
              Anual <span className="ml-1 text-xs text-success font-bold">-20%</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => {
            const Icon = plan.icon;
            const finalPrice = billing === 'annual' && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price;
            return (
              <div key={plan.key} className={`relative bg-card rounded-2xl border-2 ${plan.color} overflow-hidden flex flex-col`}>
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-secondary text-white text-xs font-heading font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />{plan.badge}
                    </span>
                  </div>
                )}
                <div className={`${plan.headerBg} p-6 text-white`}>
                  <Icon className="w-8 h-8 mb-3" />
                  <h2 className="font-display text-xl font-bold">{plan.name}</h2>
                  <div className="mt-2 flex items-end gap-1">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-display font-bold">Gratis</span>
                    ) : (
                      <>
                        <span className="text-sm font-heading opacity-80">S/</span>
                        <span className="text-4xl font-display font-bold">{finalPrice}</span>
                        <span className="text-sm font-heading opacity-80 pb-1">{plan.period}</span>
                      </>
                    )}
                  </div>
                  {billing === 'annual' && plan.price > 0 && (
                    <p className="text-xs opacity-70 mt-1">Facturado S/{finalPrice * 12}/año</p>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm">
                        {f.ok
                          ? <Check className="w-4 h-4 text-success flex-shrink-0" />
                          : <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                        <span className={f.ok ? 'text-foreground' : 'text-muted-foreground'}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/checkout" state={{ product: plan.key, price: finalPrice }} className="mt-6 block">
                    <Button variant={plan.ctaVariant} className="w-full font-heading font-semibold">
                      {plan.cta} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extras */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold mb-1 flex items-center gap-2"><Star className="w-5 h-5 text-secondary" /> Destacar Vacante</h3>
            <p className="text-muted-foreground text-sm mb-4">Aparece primero en los resultados de búsqueda con la etiqueta "Destacado".</p>
            <div className="space-y-2">
              {[{ days: 7, price: 29 }, { days: 15, price: 49 }, { days: 30, price: 79 }].map(opt => (
                <Link key={opt.days} to="/checkout" state={{ product: 'featured_job', price: opt.price, label: `Vacante destacada ${opt.days} días` }}>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-xl hover:bg-muted/70 transition-colors cursor-pointer">
                    <span className="font-heading font-semibold text-sm">{opt.days} días destacado</span>
                    <span className="font-display font-bold text-secondary">S/{opt.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-accent" /> Convenios Institucionales</h3>
            <p className="text-muted-foreground text-sm mb-4">Para municipalidades, universidades, ONG y gobiernos regionales.</p>
            <ul className="space-y-2 mb-4">
              {['Publicación masiva de oportunidades', 'Gestión de programas sociales', 'Eventos institucionales', 'Estadísticas propias', 'Licencias anuales'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-success" />{item}</li>
              ))}
            </ul>
            <Button variant="outline" className="w-full font-heading font-semibold">Contactar para cotización</Button>
          </div>
        </div>
      </div>
    </div>
  );
}