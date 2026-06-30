import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Building2, Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState('choose'); // choose, worker, company, otp
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '', company_name: '', sector: '',
    email: '', password: '', confirm_password: ''
  });
  const [otpCode, setOtpCode] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRegister = async () => {
    if (form.password !== form.confirm_password) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await base44.auth.register({
        email: form.email,
        password: form.password,
        full_name: step === 'worker' ? form.full_name : form.company_name
      });
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await base44.auth.verifyOtp({ email: form.email, otpCode });
      base44.auth.setToken(result.access_token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await base44.auth.resendOtp(form.email);
    } catch (err) {
      // silent
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6 py-8">
        <button onClick={() => setStep(step === 'worker' ? 'worker' : 'company')} className="text-primary mb-6">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Verifica tu correo</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Ingresa el código que enviamos a <span className="font-medium text-foreground">{form.email}</span>
        </p>
        <div className="space-y-4">
          <Input
            placeholder="Código de verificación"
            value={otpCode}
            onChange={e => { setOtpCode(e.target.value); setError(''); }}
            className="h-12 rounded-xl text-center text-lg tracking-widest"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button onClick={handleVerifyOtp} disabled={loading || !otpCode} className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-heading font-semibold rounded-xl">
            {loading ? 'Verificando...' : 'Verificar'}
          </Button>
          <button onClick={handleResendOtp} className="w-full text-accent text-sm font-medium">
            Reenviar código
          </button>
        </div>
      </div>
    );
  }

  if (step === 'choose') {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6 py-8">
        <button onClick={() => navigate('/welcome')} className="text-primary mb-6">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">CREAR CUENTA</h1>
        <p className="text-muted-foreground text-sm mb-8">¿Cómo deseas registrarte?</p>
        <div className="space-y-3 mb-8">
          <Button onClick={() => setStep('worker')} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold rounded-xl flex items-center gap-2">
            <User className="w-5 h-5" /> Soy trabajador
          </Button>
          <Button onClick={() => setStep('company')} className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold rounded-xl flex items-center gap-2">
            <Building2 className="w-5 h-5" /> Soy empresa
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs">O CONTINUAR CON...</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <Button variant="outline" onClick={() => base44.auth.loginWithProvider('google', '/')} className="w-full h-12 rounded-xl font-body mb-4 flex items-center gap-2">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" /> Continuar con Google
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Al registrarte aceptas los <span className="text-accent font-medium">Términos y Condiciones</span> y la <span className="text-accent font-medium">Política de privacidad</span>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿Ya tienes cuenta? <Link to="/login" className="text-accent font-semibold">Inicia sesión</Link>
        </p>
      </div>
    );
  }

  const isWorker = step === 'worker';

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <button onClick={() => setStep('choose')} className="text-primary mb-6">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-medium w-fit mb-4">
        {isWorker ? <User className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
        {isWorker ? 'Cuenta trabajador' : 'Cuenta empresa'}
      </div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Crea tu cuenta</h1>
      <p className="text-muted-foreground text-sm mb-6">Completa tus datos para comenzar</p>

      <div className="space-y-4">
        {isWorker ? (
          <div>
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tu nombre completo</Label>
            <Input placeholder="Juan García" value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} className="h-12 rounded-xl mt-1.5" />
          </div>
        ) : (
          <>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre de la empresa</Label>
              <Input placeholder="Empresa S.A." value={form.company_name} onChange={e => handleChange('company_name', e.target.value)} className="h-12 rounded-xl mt-1.5" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sector / Industria</Label>
              <Input placeholder="Tecnología, Construcción..." value={form.sector} onChange={e => handleChange('sector', e.target.value)} className="h-12 rounded-xl mt-1.5" />
            </div>
          </>
        )}
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Correo electrónico</Label>
          <Input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e => handleChange('email', e.target.value)} className="h-12 rounded-xl mt-1.5" />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contraseña</Label>
          <div className="relative mt-1.5">
            <Input type={showPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => handleChange('password', e.target.value)} className="h-12 rounded-xl pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confirmar contraseña</Label>
          <div className="relative mt-1.5">
            <Input type={showConfirm ? 'text' : 'password'} placeholder="Repite tu contraseña" value={form.confirm_password} onChange={e => handleChange('confirm_password', e.target.value)} className="h-12 rounded-xl pr-10" />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button onClick={handleRegister} disabled={loading} className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-heading font-semibold rounded-xl">
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Al registrarte aceptas los <span className="text-accent font-medium">Términos y Condiciones</span> y la <span className="text-accent font-medium">Política de privacidad</span>
        </p>
      </div>
    </div>
  );
}