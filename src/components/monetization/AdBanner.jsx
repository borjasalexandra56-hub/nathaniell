import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ExternalLink, Megaphone } from 'lucide-react';

export default function AdBanner({ placement }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    base44.entities.AdSpace.filter({ placement, status: 'active' }).then(ads => {
      const active = ads.filter(a => (!a.end_date || a.end_date >= today));
      if (active.length > 0) setAd(active[Math.floor(Math.random() * active.length)]);
    });
  }, [placement]);

  if (!ad) return null;

  return (
    <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-2xl p-3 hover:bg-accent/10 transition-colors group">
      {ad.image_url && <img src={ad.image_url} alt={ad.advertiser_name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <Megaphone className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Publicidad</span>
        </div>
        <p className="font-heading font-semibold text-sm truncate">{ad.title}</p>
        {ad.description && <p className="text-muted-foreground text-xs truncate">{ad.description}</p>}
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-accent transition-colors" />
    </a>
  );
}