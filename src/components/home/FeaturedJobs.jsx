import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bookmark, Clock } from 'lucide-react';
import moment from 'moment';

export default function FeaturedJobs({ jobs }) {
  if (!jobs?.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-bold text-foreground text-base">Empleos destacados</h3>
        <Link to="/jobs" className="text-accent text-xs font-semibold">Ver todos</Link>
      </div>
      <div className="space-y-3">
        {jobs.slice(0, 3).map(job => (
          <Link key={job.id} to={`/jobs/${job.id}`}
            className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-heading font-bold text-foreground text-xs">{job.company_name?.[0] || 'E'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-semibold text-foreground text-sm">{job.title}</p>
              <p className="text-muted-foreground text-xs">{job.company_name}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
                  <MapPin className="w-3 h-3" /> {job.district || job.location}
                </span>
                {job.modality && (
                  <span className="bg-accent/10 text-accent text-[10px] font-medium px-2 py-0.5 rounded-full">{job.modality}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Bookmark className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-[10px]">
                {moment(job.created_date).fromNow()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}