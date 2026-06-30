import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Bookmark, Share2, ExternalLink, Clock, Recycle, ChevronDown, Loader2, Leaf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const recyclingPoints = [
  {
    id: 1,
    name: 'Punto Verde Collique Alto',
    lat: -11.9205,
    lng: -77.0543,
    address: 'Av. Universitaria Norte Cdra. 52, Collique',
    schedule: 'Lun–Sáb 8:00 AM – 5:00 PM',
    materials: ['Plástico', 'Papel', 'Vidrio', 'Cartón'],
    type: 'reciclaje',
  },
  {
    id: 2,
    name: 'Eco-Punto Municipal Comas',
    lat: -11.9352,
    lng: -77.0501,
    address: 'Jr. Los Ángeles 320, Comas',
    schedule: 'Lun–Vie 7:00 AM – 4:00 PM',
    materials: ['Metal', 'Electrónicos', 'Plástico', 'Papel'],
    type: 'acopio',
  },
  {
    id: 3,
    name: 'Centro de Acopio Sta. Luzmila',
    lat: -11.9280,
    lng: -77.0620,
    address: 'Av. Trapiche 410, Santa Luzmila',
    schedule: 'Mar–Dom 9:00 AM – 6:00 PM',
    materials: ['Vidrio', 'Latas', 'Cartón'],
    type: 'acopio',
  },
  {
    id: 4,
    name: 'Punto Reciclaje El Pinar',
    lat: -11.9150,
    lng: -77.0480,
    address: 'Calle Los Jardines 180, El Pinar',
    schedule: 'Lun–Sáb 8:00 AM – 3:00 PM',
    materials: ['Plástico PET', 'Papel', 'Textiles'],
    type: 'reciclaje',
  },
  {
    id: 5,
    name: 'Eco-Centro La Flor',
    lat: -11.9410,
    lng: -77.0560,
    address: 'Av. La Flor 220, Comas',
    schedule: 'Lun–Vie 8:00 AM – 5:00 PM',
    materials: ['Aceite', 'Plástico', 'Papel', 'Vidrio', 'Metal'],
    type: 'ambiental',
  },
];

const typeConfig = {
  reciclaje: { label: 'Reciclaje', color: 'bg-emerald-500', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  acopio: { label: 'Centro de Acopio', color: 'bg-blue-500', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  ambiental: { label: 'Centro Ambiental', color: 'bg-violet-500', dot: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300' },
};

const materialColors = {
  'Plástico': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'Plástico PET': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'Papel': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'Cartón': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'Vidrio': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'Metal': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  'Latas': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  'Electrónicos': 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  'Textiles': 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  'Aceite': 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
};

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Recycling() {
  const { toast } = useToast();
  const [mapOpen, setMapOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [points, setPoints] = useState(recyclingPoints);

  // Try to get user location when map opens
  useEffect(() => {
    if (!mapOpen) return;
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        // Sort points by distance
        const sorted = [...recyclingPoints].map(p => ({
          ...p,
          distance: getDistance(latitude, longitude, p.lat, p.lng),
        })).sort((a, b) => a.distance - b.distance);
        setPoints(sorted);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }, [mapOpen]);

  const mapCenter = userLocation
    ? `${userLocation.lat},${userLocation.lng}`
    : 'Collique, Comas, Lima, Peru';

  const mapSrc = selected
    ? `https://maps.google.com/maps?q=${encodeURIComponent(selected.address + ', Lima, Peru')}&z=16&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(mapCenter)}&z=14&output=embed`;

  const handleSave = (point, e) => {
    e.stopPropagation();
    setSaved(prev => prev.includes(point.id) ? prev.filter(id => id !== point.id) : [...prev, point.id]);
    toast({ title: saved.includes(point.id) ? 'Eliminado de favoritos' : '⭐ Punto guardado' });
  };

  const handleShare = async (point, e) => {
    e.stopPropagation();
    const url = `https://maps.google.com/?q=${encodeURIComponent(point.address + ', Lima, Peru')}`;
    if (navigator.share) {
      try { await navigator.share({ title: point.name, text: point.address, url }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(`${point.name} — ${point.address}\n${url}`);
      toast({ title: '📋 Enlace copiado' });
    } catch {
      toast({ title: 'No se pudo copiar', variant: 'destructive' });
    }
  };

  const handleDirections = (point, e) => {
    e.stopPropagation();
    const dest = encodeURIComponent(point.address + ', Lima, Peru');
    const origin = userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : '';
    window.open(`https://www.google.com/maps/dir/?api=1${origin}&destination=${dest}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <Recycle className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Puntos de Reciclaje</h1>
          <p className="text-muted-foreground text-xs">Centros de acopio y puntos ambientales cercanos</p>
        </div>
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-muted">
            <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
            {cfg.label}
          </span>
        ))}
      </div>

      {/* Map toggle button */}
      <button
        onClick={() => setMapOpen(o => !o)}
        className="w-full flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl px-5 py-4 transition-all shadow-md shadow-emerald-600/20">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5" />
          <div className="text-left">
            <p className="font-heading font-bold text-sm">Puntos de reciclaje</p>
            <p className="text-white/70 text-xs">Ver mapa con ubicaciones cercanas</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mapOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Map — lazy loaded */}
      {mapOpen && (
        <div className="space-y-3">
          {locating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              Obteniendo tu ubicación para mostrarte puntos cercanos...
            </div>
          )}
          {userLocation && !locating && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl px-4 py-2.5 border border-emerald-200 dark:border-emerald-900">
              <Navigation className="w-3.5 h-3.5" />
              Puntos ordenados por distancia a tu ubicación
            </div>
          )}
          <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200 dark:border-emerald-900 shadow-lg" style={{ height: 'clamp(220px, 45vw, 320px)' }}>
            <iframe
              key={selected?.id || mapCenter}
              title="Mapa de puntos de reciclaje"
              src={mapSrc}
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Pulsing markers overlay hint */}
            <div className="absolute top-3 left-3 bg-white dark:bg-card/90 rounded-xl px-3 py-1.5 shadow text-xs font-medium text-foreground flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              {points.length} puntos cercanos
            </div>
          </div>
        </div>
      )}

      {/* Points list */}
      <div className="space-y-2">
        {points.map((point, idx) => {
          const cfg = typeConfig[point.type] || typeConfig.reciclaje;
          const isSelected = selected?.id === point.id;
          const isNearby = idx < 2; // top 2 are "nearest"
          return (
            <div key={point.id}
              className={`bg-card border-2 rounded-2xl overflow-hidden transition-all duration-200 ${isSelected ? 'border-emerald-500 shadow-md shadow-emerald-500/10' : isNearby && userLocation ? 'border-emerald-300 dark:border-emerald-800' : 'border-border'}`}>

              <button
                className="w-full flex items-center gap-3 p-3.5 text-left active:bg-muted/30 transition-colors"
                onClick={() => setSelected(isSelected ? null : point)}>

                {/* Icon with pulsing dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-base ${cfg.color}`}>
                    ♻️
                  </div>
                  {isNearby && userLocation && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full">
                      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="font-heading font-semibold text-foreground text-sm truncate">{point.name}</p>
                    {isNearby && userLocation && (
                      <span className="text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">CERCA</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-[10px] truncate flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 flex-shrink-0" />{point.address}
                  </p>
                  {point.distance != null && (
                    <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold mt-0.5">
                      {point.distance < 1 ? `${Math.round(point.distance * 1000)} m` : `${point.distance.toFixed(1)} km`}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isSelected ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Expanded detail */}
              {isSelected && (
                <div className="px-3.5 pb-3.5 space-y-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-3">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
                    <span>{point.schedule}</span>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Residuos aceptados</p>
                    <div className="flex flex-wrap gap-1">
                      {point.materials.map(mat => (
                        <span key={mat} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${materialColors[mat] || 'bg-muted text-muted-foreground'}`}>
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={(e) => handleSave(point, e)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${saved.includes(point.id) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-muted border-border text-muted-foreground hover:text-foreground'}`}>
                      <Bookmark className="w-3.5 h-3.5" />
                      {saved.includes(point.id) ? 'Guardado' : 'Guardar'}
                    </button>
                    <button
                      onClick={(e) => handleShare(point, e)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border border-border bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-3.5 h-3.5" /> Compartir
                    </button>
                    <button
                      onClick={(e) => handleDirections(point, e)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-[#183D7C] text-white hover:bg-[#183D7C]/90 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Cómo llegar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}