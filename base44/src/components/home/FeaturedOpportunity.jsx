import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Bookmark, ArrowRight } from 'lucide-react';

export default function FeaturedOpportunity({ jobs, loading }) {
  if (loading || jobs.length === 0) return null;

  // Pick the featured job or the first active one
  const job = jobs.find(j => j.is_featured) || jobs[0];

  return (
    <div className="relative bg-gradient-to-br from-[#183D7C] via-[#1a3f80] to-[#0d2550] rounded-2xl overflow-hidden p-4">
      {/* Decorative */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute right-4 bottom-4 w-16 h-16 bg-white/5 rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1 bg-[#F57C21]/20 border border-[#F57C21]/40 rounded-full px-2 py-0.5 mb-2">
          <Star className="w-3 h-3 text-[#F57C21] fill-[#F57C21]" />
          <span className="text-[10px] font-bold text-[#F57C21]">Oportunidad destacada</span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-white text-base leading-snug mb-0.5">{job.title}</h3>
            <div className="flex items-center gap-1 mb-2">
              <p className="text-white/70 text-xs">{job.company_name}</p>
              {job.is_featured && (
                <div className="w-3.5 h-3.5 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[8px] font-bold">✓</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {job.location && (
                <span className="flex items-center gap-0.5 text-white/60 text-[11px]">
                  <MapPin className="w-3 h-3" />{job.district || job.location}
                </span>
              )}
              {job.modality && (
                <span className="flex items-center gap-0.5 text-white/60 text-[11px]">
                  <Clock className="w-3 h-3" />{job.modality}
                </span>
              )}
            </div>

            {job.salary_min && (
              <div className="inline-flex items-center gap-1 bg-white/15 rounded-lg px-2.5 py-1 mb-3">
                <span className="text-white font-heading font-bold text-sm">
                  S/ {job.salary_min.toLocaleString()}{job.salary_max ? ` - ${job.salary_max.toLocaleString()}` : ''}
                </span>
              </div>
            )}
          </div>

          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <Bookmark className="w-4 h-4 text-white" />
          </button>
        </div>

        <Link to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1.5 bg-white text-[#183D7C] font-heading font-bold text-xs px-4 py-2 rounded-xl shadow-md active:opacity-80 transition-opacity">
          Ver detalle <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}n