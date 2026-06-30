import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const SECTIONS = [
  {
    title: '✅ Implementado en esta sesión',
    color: 'text-success',
    bg: 'bg-success/5 border-success/20',
    dot: 'bg-success',
    items: [
      { label: 'Safe Areas (notch, home indicator, Dynamic Island)', status: 'done', detail: 'viewport-fit=cover + env(safe-area-inset-*) en header, bottom nav y body.' },
      { label: 'Pull To Refresh en pantalla principal', status: 'done', detail: 'Componente PullToRefresh con feedback visual nativo en Home.' },
      { label: 'Política de Privacidad', status: 'done', detail: 'Página /privacy-policy con 10 secciones incluyendo eliminación de cuenta y datos.' },
      { label: 'Términos y Condiciones', status: 'done', detail: 'Página /terms con 10 secciones, ley peruana aplicable.' },
      { label: 'Eliminación de cuenta', status: 'done', detail: 'En Configuración con confirmación AlertDialog. Elimina perfil y cierra sesión.' },
      { label: 'Modo oscuro profesional', status: 'done', detail: 'Sistema de temas light/dark/auto con transición suave 350ms y persistencia.' },
      { label: 'Compatibilidad Android e iOS', status: 'done', detail: 'apple-mobile-web-app-capable, theme-color, status-bar-style en index.html.' },
      { label: 'Touch targets mínimos 44x44px', status: 'done', detail: 'CSS global en index.css para todos los botones y enlaces.' },
      { label: 'Tap highlight eliminado', status: 'done', detail: '-webkit-tap-highlight-color: transparent en todos los elementos.' },
      { label: 'Pantalla de error reutilizable', status: 'done', detail: 'Componente ErrorScreen con tipos: network, generic, notfound.' },
      { label: 'Gestión de sesiones', status: 'done', detail: 'Logout en Configuración con token cleanup via base44.auth.logout().' },
      { label: 'Accesibilidad (ARIA)', status: 'done', detail: 'aria-label, aria-pressed, aria-current="page" en navegación y controles.' },
      { label: 'Navegación inferior con estado activo', status: 'done', detail: 'aria-current="page" + stroke bold en ítem activo.' },
      { label: 'Configuración de cuenta centralizada', status: 'done', detail: 'Página Settings con tema, perfil, notificaciones, legal y acciones de cuenta.' },
      { label: 'Refreshing de datos nativo', status: 'done', detail: 'Home usa useCallback + estados de loading para pull-to-refresh.' },
    ]
  },
  {
    title: '⚠️ Parcialmente implementado (requiere ajuste externo)',
    color: 'text-warning',
    bg: 'bg-warning/5 border-warning/20',
    dot: 'bg-warning',
    items: [
      { label: 'Splash Screen nativa', status: 'partial', detail: 'El splash actual es React (loading state). Para nativo requiere configuración en Capacitor/Expo: splash screen plugin con imagen y color de fondo.' },
      { label: 'Ícono de app', status: 'partial', detail: 'El ícono actual apunta a base44.com. Para publicar necesitas: icon.png 1024x1024 + adaptive icon para Android. Requiere activos gráficos.' },
      { label: 'Notificaciones push', status: 'partial', detail: 'La app tiene notificaciones internas. Para push nativas (requerido por algunas stores) se necesita Firebase Cloud Messaging (Android) y APNs (iOS).' },
      { label: 'Permisos de dispositivo', status: 'partial', detail: 'La app no solicita cámara/galería directamente, pero el upload de foto de perfil puede necesitar Permissions API. Requiere prueba en dispositivo real.' },
      { label: 'Offline / Sin conexión', status: 'partial', detail: 'Existe ErrorScreen de red pero no hay caché offline ni Service Worker. Para Google Play se recomienda comportamiento gracioso sin red.' },
    ]
  },
  {
    title: '🔴 Requiere configuración externa antes de publicar',
    color: 'text-destructive',
    bg: 'bg-destructive/5 border-destructive/20',
    dot: 'bg-destructive',
    items: [
      { label: 'Wrapper nativo (Capacitor / React Native / PWA)', status: 'todo', detail: 'Google Play y App Store requieren un APK/IPA o PWA con Trusted Web Activity. Base44 genera una PWA; para nativo usa Capacitor.js envolviendo la URL publicada.' },
      { label: 'App Signing (firma digital)', status: 'todo', detail: 'Android requiere .keystore; iOS requiere certificado de Apple Developer ($99/año). Configurable en Capacitor o Android Studio / Xcode.' },
      { label: 'Google Play Console / App Store Connect', status: 'todo', detail: 'Crear la ficha de la app: capturas de pantalla (min 4), descripción, categoría "Empleo", clasificación de contenido, URLs de privacidad y términos.' },
      { label: 'URL de política de privacidad pública', status: 'todo', detail: 'Google Play y App Store exigen una URL pública accesible (no solo dentro de la app). Publicar /privacy-policy en dominio propio o ciudadactiva.pe/privacidad.' },
      { label: 'Sistema de pagos compliant', status: 'todo', detail: 'Si los planes Pro/Premium se compran dentro de la app, Google Play y App Store exigen usar su sistema de In-App Purchases (30% comisión). Alternativa: pagos solo via web.' },
      { label: 'Clasificación de contenido', status: 'todo', detail: 'Completar el cuestionario de clasificación en Google Play Console (probablemente "Todos" o "Mayor de 13"). App Store requiere similar en App Store Connect.' },
      { label: 'Capturas de pantalla de tienda', status: 'todo', detail: 'Mínimo 4 capturas de pantalla en móvil (1080x1920 o superior). App Store requiere también pantallas para iPhone 6.5" y 5.5". Usar herramientas como Canva o Figma.' },
      { label: 'APNs para iOS push', status: 'todo', detail: 'Si se activan notificaciones push en iOS, se necesita Apple Push Notification service certificate desde Apple Developer Portal.' },
      { label: 'Dominio propio verificado', status: 'todo', detail: 'Para Android App Links y iOS Universal Links (volver a la app desde emails), configurar el dominio ciudadactiva.pe con assetlinks.json y apple-app-site-association.' },
      { label: 'Declaración de recopilación de datos (iOS)', status: 'todo', detail: 'App Store Connect requiere declarar qué datos recopilas (nombre, email, ubicación) y para qué. Configurable en la ficha de la app, basado en la política de privacidad ya implementada.' },
    ]
  }
];

function Section({ section, index }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`bg-card border rounded-2xl overflow-hidden ${section.bg}`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <h2 className={`font-heading font-bold text-sm ${section.color}`}>{section.title}</h2>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3">
          {section.items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-background/50 rounded-xl p-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${section.dot}`} />
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StoreReadinessReport() {
  const done = SECTIONS[0].items.length;
  const partial = SECTIONS[1].items.length;
  const todo = SECTIONS[2].items.length;
  const total = done + partial + todo;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 h-14 flex items-center gap-3">
        <Link to="/settings" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="font-heading font-bold text-foreground">Informe de publicación</h1>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
        {/* Summary */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white">
          <h2 className="font-display font-bold text-xl mb-1">Google Play & App Store</h2>
          <p className="text-white/70 text-sm mb-4">Auditoría de requisitos de publicación</p>
          <div className="flex items-end gap-2 mb-3">
            <span className="font-heading font-bold text-4xl">{pct}%</span>
            <span className="text-white/70 text-sm mb-1">completado</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div className="bg-secondary h-2 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-heading font-bold text-2xl text-green-300">{done}</p>
              <p className="text-white/70 text-[10px]">Implementado</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-heading font-bold text-2xl text-yellow-300">{partial}</p>
              <p className="text-white/70 text-[10px]">Parcial</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-heading font-bold text-2xl text-red-300">{todo}</p>
              <p className="text-white/70 text-[10px]">Externo</p>
            </div>
          </div>
        </div>

        {SECTIONS.map((section, i) => (
          <Section key={i} section={section} index={i} />
        ))}

        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-2">🚀 Próximos pasos recomendados</h3>
          <ol className="space-y-2">
            {[
              'Publicar la URL de política de privacidad en un dominio propio accesible.',
              'Registrar cuenta de Google Play Console ($25 único) y Apple Developer Program ($99/año).',
              'Instalar Capacitor.js y envolver la URL publicada de Ciudad Activa como APK/IPA.',
              'Generar assets: ícono 1024x1024, splash 2732x2732, capturas de pantalla.',
              'Decidir estrategia de pagos: web-only (evita comisión 30%) o In-App Purchases nativo.',
              'Completar cuestionario de clasificación de contenido en ambas consolas.',
              'Realizar prueba en dispositivos reales Android e iOS antes de enviar a revisión.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}