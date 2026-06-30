import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlanUpgradeCTA({ currentPlan = 'free' }) {
  if (currentPlan === 'premium') return null;

  if (currentPlan === 'pro') return (
    <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 rounded-2xl p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Crown className="w-5 h-5 text-secondary flex-shrink-0" />
        <div>
          <p className="font-heading font-bold text-sm">Actualiza a Premium</p>
          <p className="text-muted-foreground text-xs">Marca empleadora, analíticas avanzadas y más.</p>
        </div>
      </div>
      <Link to="/checkout" state={{ product: 'premium', price: 299 }}>
        <Button size="sm" variant="secondary" className="font-heading font-semibold whitespace-nowrap">
          Premium <ArrowRight className="w-3 h-3" />
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-accent" />
        <p className="font-heading font-bold text-sm">Plan actual: Gratuito</p>
      </div>
      <p className="text-muted-foreground text-xs mb-3">Solo puedes publicar 1 empleo por mes. Actualiza para desbloquear empleos ilimitados, candidatos recomendados y más.</p>
      <div className="flex gap-2">
        <Link to="/checkout" state={{ product: 'pro', price: 79 }} className="flex-1">
          <Button size="sm" className="w-full font-heading font-semibold text-xs">Actualizar a Pro</Button>
        </Link>
        <Link to="/pricing" className="flex-1">
          <Button size="sm" variant="outline" className="w-full font-heading font-semibold text-xs">Ver planes</Button>
        </Link>
      </div>
    </div>
  );
}