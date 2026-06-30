import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 h-14 flex items-center gap-3">
        <Link to="/settings" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="font-heading font-bold text-foreground">Términos y Condiciones</h1>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6 pb-safe">
        <div className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-2xl p-4">
          <FileText className="w-6 h-6 text-secondary flex-shrink-0" />
          <div>
            <p className="font-heading font-semibold text-foreground text-sm">Ciudad Activa</p>
            <p className="text-muted-foreground text-xs">Última actualización: junio 2025</p>
          </div>
        </div>

        {[
          {
            title: '1. Aceptación de los términos',
            content: 'Al registrarse y usar Ciudad Activa, usted acepta estos Términos y Condiciones. Si no está de acuerdo con alguna parte, no podrá acceder al servicio. Estos términos aplican a todos los usuarios: trabajadores, empresas y administradores.'
          },
          {
            title: '2. Descripción del servicio',
            content: 'Ciudad Activa es una plataforma digital que conecta a trabajadores con oportunidades de empleo, capacitaciones y eventos en Collique y alrededores. También ofrece un espacio de apoyo comunitario y herramientas para empresas empleadoras.'
          },
          {
            title: '3. Registro y cuenta',
            content: 'Debe tener al menos 18 años para registrarse. Es responsable de mantener la confidencialidad de su contraseña y de toda la actividad que ocurra bajo su cuenta. Debe proporcionar información veraz y actualizada. Ciudad Activa se reserva el derecho de suspender cuentas que incumplan estos términos.'
          },
          {
            title: '4. Uso aceptable',
            content: 'Queda prohibido: (a) publicar información falsa o engañosa, (b) acosar o amenazar a otros usuarios, (c) publicar contenido ofensivo, discriminatorio o ilegal, (d) intentar acceder a cuentas ajenas, (e) usar la plataforma para spam o fraude, (f) publicar ofertas de empleo fraudulentas.'
          },
          {
            title: '5. Contenido del usuario',
            content: 'Usted es responsable del contenido que publica. Al publicar contenido, otorga a Ciudad Activa una licencia no exclusiva para usarlo, modificarlo y distribuirlo dentro de la plataforma. Ciudad Activa puede eliminar contenido que viole estos términos sin previo aviso.'
          },
          {
            title: '6. Planes y pagos',
            content: 'Los planes de pago (Pro y Premium) se cobran por adelantado por el período seleccionado. No se realizan reembolsos por períodos no utilizados. Ciudad Activa se reserva el derecho de modificar precios con 30 días de aviso previo.'
          },
          {
            title: '7. Limitación de responsabilidad',
            content: 'Ciudad Activa es una plataforma intermediaria y no garantiza empleo ni los resultados de las capacitaciones. No somos responsables de las acciones de empresas o usuarios. La plataforma se proporciona "tal cual" sin garantías de disponibilidad continua.'
          },
          {
            title: '8. Propiedad intelectual',
            content: 'Todo el contenido propio de Ciudad Activa (logo, diseño, código) está protegido por derechos de autor. No puede reproducir, distribuir o crear trabajos derivados sin autorización expresa.'
          },
          {
            title: '9. Terminación',
            content: 'Puede cerrar su cuenta en cualquier momento desde Configuración > Cuenta > Eliminar cuenta. Ciudad Activa puede suspender o terminar cuentas que violen estos términos. Al terminar la cuenta, perderá acceso a todos los datos y funcionalidades.'
          },
          {
            title: '10. Ley aplicable',
            content: 'Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa se resolverá en los tribunales de Lima, Perú. Para consultas, contáctenos en legal@ciudadactiva.pe'
          }
        ].map((section, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-heading font-bold text-foreground mb-2 text-sm">{section.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}