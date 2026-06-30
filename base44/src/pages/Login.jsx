import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Logo from '@/components/Logo';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <Link to="/welcome" className="text-primary mb-6">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <div className="flex flex-col items-center mb-6">
        <Logo size="lg" variant="bare" className="mb-3" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">¡HOLA DE NUEVO!</h1>
        <p className="text-muted-foreground text-sm">Inicia sesión para continuar</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Correo electrónico</Label>
          <Input type="email" placeholder="hello@ejemplo.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} className="h-12 rounded-xl mt-1.5" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contraseña</Label>
            <Link to="/forgot-password" className="text-xs font-semibold text-secondary">OLVIDÉ MI CONTRASEÑA</Link>
          </div>
          <div className="relative mt-1.5">
            <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} className="h-12 rounded-xl pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button onClick={handleLogin} disabled={loading} className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-heading font-semibold rounded-xl">
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </Button>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-xs">O CONTINUAR CON...</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button variant="outline" onClick={() => base44.auth.loginWithProvider('google', '/')} className="w-full h-12 rounded-xl font-body flex items-center gap-2">
        <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" /> Continuar con Google
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-8">
        ¿No tienes cuenta? <Link to="/register" className="text-accent font-semibold">Regístrate</Link>
      </p>
    </div>
  );
}