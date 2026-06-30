import React from 'react';
import { WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Full-screen error state component.
 * type: 'network' | 'generic' | 'notfound' | 'empty'
 */
export default function ErrorScreen({ type = 'generic', title, message, onRetry, icon: CustomIcon }) {
  const config = {
    network: {
      icon: WifiOff,
      title: 'Sin conexión',
      message: 'Verifica tu conexión a internet e intenta de nuevo.',
      color: 'text-muted-foreground',
      bg: 'bg-muted/30',
    },
    generic: {
      icon: AlertCircle,
      title: 'Algo salió mal',
      message: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
      color: 'text-destructive',
      bg: 'bg-destructive/5',
    },
    notfound: {
      icon: AlertCircle,
      title: 'No encontrado',
      message: 'El contenido que buscas no está disponible.',
      color: 'text-muted-foreground',
      bg: 'bg-muted/30',
    },
  };

  const cfg = config[type] || config.generic;
  const Icon = CustomIcon || cfg.icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className={`w-16 h-16 rounded-2xl ${cfg.bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-8 h-8 ${cfg.color}`} />
      </div>
      <h3 className="font-heading font-bold text-foreground text-lg mb-2">{title || cfg.title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">{message || cfg.message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
      )}
    </div>
  );
}