import React, { useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import Logo from '@/components/Logo';
import { Sun, Moon, Monitor, Check, LogOut, Trash2, Shield, FileText, ChevronRight, User, Bell, Lock, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from '@/components/ui/use-toast';

const THEME_OPTIONS = [
  { key: 'light', label: 'Claro', icon: Sun, desc: 'Interfaz luminosa', emoji: '☀️' },
  { key: 'dark', label: 'Oscuro', icon: Moon, desc: 'Interfaz oscura', emoji: '🌙' },
  { key: 'auto', label: 'Automático', icon: Monitor, desc: 'Según el dispositivo', emoji: '⚙️' },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // Delete user profile data
      const profiles = await base44.entities.UserProfile.filter({ created_by_id: user?.id });
      for (const p of profiles) await base44.entities.UserProfile.delete(p.id);
      // Sign out
      toast({ title: 'Cuenta eliminada', description: 'Tus datos han sido eliminados.' });
      setTimeout(() => logout(true), 1500);
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar la cuenta. Contáctanos.', variant: 'destructive' });
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Header */}
      <div className="px-4 lg:px-8 py-6 max-w-xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" variant="bare" className="mb-3" />
          <h1 className="font-display text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground text-sm mt-1">Personaliza tu experiencia en Ciudad Activa</p>
        </div>

        {/* Account info */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-lg flex-shrink-0">
            {user?.full_name?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-heading font-semibold text-foreground truncate">{user?.full_name || 'Usuario'}</p>
            <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
          </div>
          <Link to="/profile" className="ml-auto p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>

        {/* Appearance */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-5">
          <h2 className="font-heading font-bold text-foreground mb-1">Apariencia</h2>
          <p className="text-muted-foreground text-xs mb-4">Elige cómo ver la aplicación</p>
          <div className="space-y-2">
            {THEME_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = theme === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setTheme(opt.key)}
                  aria-label={`Tema ${opt.label}`}
                  aria-pressed={active}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    active ? 'border-secondary bg-secondary/5' : 'border-border bg-transparent hover:bg-muted/50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-foreground text-sm">{opt.emoji} {opt.label}</p>
                    <p className="text-muted-foreground text-xs">{opt.desc}</p>
                  </div>
                  {active && <Check className="w-4 h-4 text-secondary flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Links section */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-5">
          {[
            { to: '/profile', icon: User, label: 'Editar perfil', color: 'text-primary' },
            { to: '/notifications', icon: Bell, label: 'Notificaciones', color: 'text-secondary' },
            { to: '/privacy-policy', icon: Shield, label: 'Política de privacidad', color: 'text-success' },
            { to: '/terms', icon: FileText, label: 'Términos y condiciones', color: 'text-accent' },
            { to: '/store-report', icon: BarChart2, label: 'Informe de publicación (Stores)', color: 'text-secondary' },
          ].map((item, i, arr) => (
            <Link key={item.to} to={item.to}
              className={`flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
              <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Account actions */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-5">
          {/* Logout */}
          <button
            onClick={() => logout(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors border-b border-border"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 text-sm font-medium text-foreground text-left">Cerrar sesión</span>
          </button>

          {/* Delete account */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-destructive/5 transition-colors"
                aria-label="Eliminar cuenta"
              >
                <Trash2 className="w-5 h-5 text-destructive flex-shrink-0" />
                <span className="flex-1 text-sm font-medium text-destructive text-left">Eliminar mi cuenta</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción es permanente. Se eliminarán todos tus datos personales, postulaciones, mensajes y favoritos. No podrás recuperar tu cuenta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Version footer */}
        <div className="mt-6 flex flex-col items-center gap-1 opacity-40">
          <Logo size="sm" variant="bare" />
          <p className="text-xs text-muted-foreground">Ciudad Activa v1.0 © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}