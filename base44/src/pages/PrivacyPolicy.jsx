import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 h-14 flex items-center gap-3">
        <Link to="/settings" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="font-heading font-bold text-foreground">Política de Privacidad</h1>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6 pb-safe">
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <Shield className="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <p className="font-heading font-semibold text-foreground text-sm">Ciudad Activa</p>
            <p className="text-muted-foreground text-xs">Última actualización: junio 2025</p>
          </div>
        </div>

        {[
          {
            title: '1. Información que recopilamos',
            content: 'Recopilamos información que usted nos proporciona directamente, como nombre, correo electrónico, DNI, teléfono, dirección, información de empleo, CV y foto de perfil. También recopilamos datos de uso de la aplicación de forma anónima para mejorar nuestros servicios.'
          },
          {
            title: '2. Cómo usamos su información',
            content: 'Utilizamos su información para: (a) crear y administrar su cuenta, (b) conectarle con oportunidades de empleo, capacitaciones y eventos, (c) enviarle notificaciones relevantes, (d) mejorar nuestros servicios, (e) cumplir con obligaciones legales.'
          },
          {
            title: '3. Compartición de datos',
            content: 'No vendemos su información personal a terceros. Compartimos datos únicamente con empresas empleadoras cuando usted aplica a una vacante, con proveedores de servicios técnicos bajo acuerdos de confidencialidad, y cuando la ley lo requiere.'
          },
          {
            title: '4. Almacenamiento y seguridad',
            content: 'Sus datos se almacenan en servidores seguros con cifrado en tránsito (TLS) y en reposo. Implementamos medidas técnicas y organizativas para proteger su información contra acceso no autorizado, pérdida o alteración.'
          },
          {
            title: '5. Sus derechos',
            content: 'Usted tiene derecho a: (a) acceder a sus datos personales, (b) rectificar datos inexactos, (c) solicitar la eliminación de su cuenta y datos, (d) oponerse al procesamiento de sus datos, (e) portabilidad de datos. Para ejercer estos derechos, contáctenos en privacidad@ciudadactiva.pe'
          },
          {
            title: '6. Eliminación de cuenta',
            content: 'Puede eliminar su cuenta en cualquier momento desde Configuración > Cuenta > Eliminar cuenta. Al eliminar su cuenta, borraremos todos sus datos personales dentro de los 30 días siguientes, excepto aquellos que debamos conservar por obligaciones legales.'
          },
          {
            title: '7. Cookies y tecnologías similares',
            content: 'Utilizamos almacenamiento local del dispositivo para guardar sus preferencias de tema y sesión. No utilizamos cookies de rastreo de terceros.'
          },
          {
            title: '8. Menores de edad',
            content: 'Ciudad Activa no está dirigida a menores de 18 años. No recopilamos intencionalmente información de menores. Si detectamos que un menor ha creado una cuenta, eliminaremos su información inmediatamente.'
          },
          {
            title: '9. Cambios a esta política',
            content: 'Podemos actualizar esta política ocasionalmente. Le notificaremos sobre cambios significativos mediante una notificación en la aplicación. El uso continuado de la aplicación tras los cambios constituye su aceptación.'
          },
          {
            title: '10. Contacto',
            content: 'Para preguntas sobre esta política de privacidad, contáctenos en: privacidad@ciudadactiva.pe o escriba a Ciudad Activa, Collique, Lima, Perú.'
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