import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GuestBanner({ message = "Necesitas iniciar sesión o crear una cuenta para utilizar esta función." }) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center my-4">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <Lock className="w-6 h-6 text-primary" />
      </div>
      <p className="text-foreground font-heading font-semibold mb-1">Función restringida</p>
      <p className="text-muted-foreground text-sm mb-4">{message}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link to="/login">
          <Button variant="outline" className="rounded-xl font-heading font-semibold border-primary/30 text-primary hover:bg-primary/5">
            Iniciar sesión
          </Button>
        </Link>
        <Link to="/register">
          <Button className="rounded-xl font-heading font-semibold bg-secondary hover:bg-secondary/90 text-white">
            Crear cuenta gratis
          </Button>
        </Link>
      </div>
    </div>
  );
}