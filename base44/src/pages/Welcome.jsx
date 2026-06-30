import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Heart } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Logo */}
        <Logo size="hero" variant="onDark" className="mb-6" />

        {/* Tagline */}
        <p className="text-primary-foreground/80 text-center text-base mb-10 font-body">
          Conecta con oportunidades que transforman vidas.
        </p>

        {/* Buttons */}
        <div className="w-full space-y-3">
          <Link to="/register" className="block">
            <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold text-base rounded-xl">
              REGISTRARSE
            </Button>
          </Link>
          <Link to="/login" className="block">
            <Button variant="outline" className="w-full h-12 bg-transparent border-2 border-white text-white hover:bg-white/10 font-heading font-semibold text-base rounded-xl">
              INICIAR SESIÓN
            </Button>
          </Link>
          <Link to="/explore" className="block">
            <button className="w-full text-primary-foreground/70 text-sm font-body underline underline-offset-2 py-2 hover:text-white transition-colors">
              Explorar información (sin cuenta)
            </button>
          </Link>
        </div>

        {/* Bottom features */}
        <div className="flex items-center gap-6 mt-12 text-primary-foreground/50 text-xs">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Empleos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Comunidad</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>Apoyo</span>
          </div>
        </div>
      </div>
    </div>
  );
}