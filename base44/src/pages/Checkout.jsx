import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, CreditCard, Smartphone, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PAYMENT_METHODS = [
  { key: 'yape', label: 'Yape', color: 'bg-purple-100 border-purple-300', icon: '💜' },
  { key: 'plin', label: 'Plin', color: 'bg-green-100 border-green-300', icon: '💚' },
  { key: 'stripe', label: 'Tarjeta', color: 'bg-blue-100 border-blue-300', icon: '💳' },
  { key: 'mercadopago', label: 'Mercado Pago', color: 'bg-yellow-100 border-yellow-300', icon: '🛒' },
];

const PRODUCT_LABELS = {
  free: 'Plan Gratuito',
  pro: 'Plan Empresa Pro',
  premium: 'Plan Empresa Premium',
  featured_job: 'Vacante Destacada',
  featured_event: 'Evento Patrocinado',
  training_premium: 'Capacitación Premium',
  certificate: 'Certificado Digital',
  ad_space: 'Espacio Publicitario',
  talent_pool: 'Bolsa de Talentos',
  institutional: 'Convenio Institucional',
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { product, price, label } = location.state || {};

  const [method, setMethod] = useState('yape');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [phone, setPhone] = useState('');

  const productName = label || PRODUCT_LABELS[product] || product;

  const handlePay = async () => {
    if (!product || !price) return;
    setLoading(true);
    const user = await base44.auth.me();
    await base44.entities.Purchase.create({
      user_id: user.id,
      company_name: user.full_name,
      product_type: product.includes('plan') ? `plan_${product === 'pro' ? 'pro' : product === 'premium' ? 'premium' : product}` : product,
      product_name: productName,
      amount: price,
      currency: 'PEN',
      status: 'completed',
      payment_method: method,
    });
    // If buying a company plan, also create/update CompanyPlan
    if (product === 'pro' || product === 'premium') {
      const today = new Date().toISOString().split('T')[0];
      const end = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0];
      await base44.entities.CompanyPlan.create({
        plan_type: product,
        company_user_id: user.id,
        company_name: user.full_name,
        start_date: today,
        end_date: end,
        status: 'active',
        price_paid: price,
        payment_method: method,
      });
    }
    setLoading(false);
    setDone(true);
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">No hay producto seleccionado.</p>
        <Button onClick={() => navigate('/pricing')}>Ver planes</Button>
      </div>
    </div>
  );

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card border border-border rounded-2xl p-10 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">¡Pago exitoso!</h2>
        <p className="text-muted-foreground mb-1">Adquiriste: <strong>{productName}</strong></p>
        <p className="text-muted-foreground text-sm mb-6">Monto: <strong>S/ {price}</strong> vía {PAYMENT_METHODS.find(m => m.key === method)?.label}</p>
        <Button onClick={() => navigate('/')} className="w-full font-heading font-semibold">Ir al dashboard</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="bg-primary text-white py-8 px-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Finalizar compra</h1>
            <p className="text-white/70 text-sm">{productName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-5">
        {/* Order summary */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-heading font-semibold mb-3">Resumen del pedido</h2>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">{productName}</span>
            <span className="font-heading font-bold">S/ {price}</span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <span className="font-heading font-bold">Total</span>
            <span className="font-display text-xl font-bold text-primary">S/ {price}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-heading font-semibold mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" />Método de pago</h2>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map(m => (
              <button key={m.key} onClick={() => setMethod(m.key)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-heading font-semibold ${method === m.key ? 'border-primary bg-primary/5' : 'border-border bg-transparent hover:bg-muted'}`}>
                <span className="text-lg">{m.icon}</span>{m.label}
                {method === m.key && <Check className="w-4 h-4 text-primary ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Phone for Yape/Plin */}
        {(method === 'yape' || method === 'plin') && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-heading font-semibold mb-3 flex items-center gap-2"><Smartphone className="w-4 h-4" />Número de teléfono</h2>
            <div>
              <Label htmlFor="phone" className="text-sm mb-1 block">Número registrado en {method === 'yape' ? 'Yape' : 'Plin'}</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9XX XXX XXX" className="h-11" />
            </div>
          </div>
        )}

        {/* Security notice */}
        <div className="flex items-center gap-2 text-muted-foreground text-xs px-1">
          <Shield className="w-4 h-4 text-success flex-shrink-0" />
          <span>Pago seguro. Tus datos están protegidos.</span>
        </div>

        <Button onClick={handlePay} disabled={loading} className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-heading font-bold text-base rounded-xl">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Procesando...</> : `Pagar S/ ${price}`}
        </Button>
      </div>
    </div>
  );
}