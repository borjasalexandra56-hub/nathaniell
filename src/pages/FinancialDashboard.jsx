import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, Award, Star, Megaphone, CreditCard, Package } from 'lucide-react';

const useUser = () => {
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser); }, []);
  return user;
};

const PRODUCT_LABELS = {
  plan_pro: 'Plan Pro', plan_premium: 'Plan Premium',
  featured_job: 'Vacantes destacadas', featured_event: 'Eventos patrocinados',
  training_premium: 'Capacitaciones premium', certificate: 'Certificados',
  ad_space: 'Publicidad', talent_pool: 'Bolsa de talentos', institutional: 'Convenios',
};

export default function FinancialDashboard() {
  const user = useUser();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    base44.entities.Purchase.filter({ status: 'completed' }).then(data => {
      setPurchases(data);
      setLoading(false);
    });
  }, []);

  if (user && user.role !== 'admin') return <Navigate to="/" replace />;

  const total = purchases.reduce((s, p) => s + (p.amount || 0), 0);

  // Group by product type
  const byType = purchases.reduce((acc, p) => {
    const key = p.product_type || 'other';
    acc[key] = (acc[key] || 0) + (p.amount || 0);
    return acc;
  }, {});

  const typeChartData = Object.entries(byType).map(([key, val]) => ({
    name: PRODUCT_LABELS[key] || key,
    monto: val,
  }));

  // Monthly trend (last 6 months)
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const label = d.toLocaleString('es-PE', { month: 'short' });
    const monthPurchases = purchases.filter(p => {
      const pd = new Date(p.created_date);
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
    });
    return { mes: label, ingresos: monthPurchases.reduce((s, p) => s + (p.amount || 0), 0) };
  });

  const stats = [
    { label: 'Ingresos Totales', value: `S/ ${total.toFixed(2)}`, icon: DollarSign, color: 'bg-primary/10 text-primary' },
    { label: 'Suscripciones', value: `S/ ${(byType['plan_pro'] || 0) + (byType['plan_premium'] || 0)}`, icon: CreditCard, color: 'bg-accent/10 text-accent' },
    { label: 'Certificados', value: `S/ ${byType['certificate'] || 0}`, icon: Award, color: 'bg-success/10 text-success' },
    { label: 'Vacantes destacadas', value: `S/ ${byType['featured_job'] || 0}`, icon: Star, color: 'bg-secondary/10 text-secondary' },
    { label: 'Capacitaciones', value: `S/ ${byType['training_premium'] || 0}`, icon: Package, color: 'bg-chart-3/10 text-chart-3' },
    { label: 'Publicidad', value: `S/ ${byType['ad_space'] || 0}`, icon: Megaphone, color: 'bg-chart-4/10 text-chart-4' },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="bg-primary text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/70 text-sm font-heading">Administración</p>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><TrendingUp className="w-6 h-6 text-secondary" />Dashboard Financiero</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Cargando datos...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {stats.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${s.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-muted-foreground text-xs font-heading">{s.label}</p>
                    <p className="font-display text-xl font-bold mt-0.5">{s.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Monthly trend */}
            <div className="bg-card border border-border rounded-2xl p-5 mb-6">
              <h2 className="font-heading font-bold mb-4">Evolución mensual (últimos 6 meses)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => [`S/ ${v}`, 'Ingresos']} />
                  <Line type="monotone" dataKey="ingresos" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* By type */}
            <div className="bg-card border border-border rounded-2xl p-5 mb-6">
              <h2 className="font-heading font-bold mb-4">Ingresos por categoría</h2>
              {typeChartData.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">Sin datos de ingresos aún.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={typeChartData} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={v => [`S/ ${v}`, 'Monto']} />
                    <Bar dataKey="monto" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Recent purchases */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-heading font-bold mb-4">Transacciones recientes</h2>
              {purchases.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-6">Sin transacciones aún.</p>
              ) : (
                <div className="space-y-3">
                  {purchases.slice(0, 10).map(p => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-heading font-semibold text-sm">{p.product_name || PRODUCT_LABELS[p.product_type] || p.product_type}</p>
                        <p className="text-muted-foreground text-xs">{p.company_name} · {p.payment_method} · {new Date(p.created_date).toLocaleDateString('es-PE')}</p>
                      </div>
                      <span className="font-display font-bold text-success">S/ {p.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}