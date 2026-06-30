import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Bookmark, Clock } from 'lucide-react';
import moment from 'moment';
import { SkeletonList } from '@/components/SkeletonCard';

const modalityColors = {
  'Tiempo completo': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'Medio tiempo':    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'Freelance':       'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  'Prácticas':       'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'Temporal':        'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
};

const avatarColors = ['bg-[#183D7C]', 'bg-violet-600', 'bg-[#F57C21]', 'bg-teal-600', 'bg-rose-600'];

export default function FeaturedJobsList({ jobs, loading }) {
  // Skip first job if it's the featured one
  const featured = jobs.find(j => j.is_featured) || jobs[0];
  const list = jobs.filter(j => j.id !== featured?.id).slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-heading font-bold text-foreground">Empleos recomendados</span>
        <Link to="/jobs" className="text-xs text-[#183D7C] dark:text-blue-400 font-semibold flex items-center gap-0.5">
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? <SkeletonList count={2} /> : list.length === 0 ? null : (
        /* Horizontal scroll — 2 cards visible */
        <div className="-mx-4 sm:mx-0">
          <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory px-4 sm:px-0"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {list.map((job, idx) => (
              <Link key={job.id} to={`/jobs/${job.id}`}
                className="snap-start flex-shrink-0 bg-card border border-border rounded-2xl p-3 active:scale-[0.98] transition-transform duration-150 hover:shadow-sm"
                style={{ width: 'clamp(170px, 48vw, 220px)' }}>

                {/* Top: logo + bookmark */}
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden ${avatarColors[idx % avatarColors.length]}`}>
                    {job.company_logo
                      ? <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
                      : job.company_name?.[0]?.toUpperCase()}
                  </div>
                  <Bookmark className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>

                <p className="font-heading font-bold text-foreground text-xs leading-snug line-clamp-2 mb-0.5">{job.title}</p>
                <p className="text-muted-foreground text-[10px] truncate mb-1.5">{job.company_name}</p>

                <div className="flex items-center gap-1 text-muted-foreground text-[10px] mb-1.5">
                  <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                  <span className="truncate">{job.district || job.location}</span>
                </div>

                {job.salary_min && (
                  <p className="text-[#0FA36B] font-heading font-bold text-xs mb-2">
                    S/ {job.salary_min.toLocaleString()}{job.salary_max ? ` - ${job.salary_max.toLocaleString()}` : ''}
                  </p>
                )}

                {job.modality && (
                  <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full ${modalityColors[job.modality] || 'bg-muted text-muted-foreground'}`}>
                    {job.modality}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}