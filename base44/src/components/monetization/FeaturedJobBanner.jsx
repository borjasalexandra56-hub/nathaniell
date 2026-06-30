import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeaturedJobBanner({ job }) {
  if (!job?.is_featured) return null;
  return (
    <div className="relative bg-gradient-to-r from-secondary/10 to-secondary/5 border-2 border-secondary/30 rounded-2xl p-4 overflow-hidden">
      <div className="absolute top-2 right-2">
        <span className="flex items-center gap-1 bg-secondary text-white text-xs font-heading font-bold px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3" /> Destacado
        </span>
      </div>
      <div className="pr-20">
        <h3 className="font-heading font-bold text-sm">{job.title}</h3>
        <p className="text-muted-foreground text-xs">{job.company_name} · {job.location}</p>
      </div>
    </div>
  );
}