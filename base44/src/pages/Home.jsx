import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { Bell, MessageCircle, Settings } from 'lucide-react';
import PullToRefresh from '@/components/PullToRefresh';
import FeaturedOpportunity from '@/components/home/FeaturedOpportunity';
import FeaturedJobsList from '@/components/home/FeaturedJobsList';
import EventsCarousel from '@/components/home/EventsCarousel';
import TrainingsGrid from '@/components/home/TrainingsGrid';
import RecentActivity from '@/components/home/RecentActivity';

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const [j, e, t, a] = await Promise.all([
      base44.entities.Job.filter({ status: 'active' }, '-created_date', 6),
      base44.entities.Event.filter({ status: 'upcoming' }, 'date', 5),
      base44.entities.Training.filter({ status: 'active' }, '-created_date', 4),
      base44.entities.JobApplication.list('-created_date', 10),
    ]);
    setJobs(j); setEvents(e); setTrainings(t); setApplications(a);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    base44.entities.Notification.filter({ read: false }).then(d => setUnread(d.length)).catch(() => {});
  }, [load]);

  const firstName = user?.full_name?.split(' ')[0] || 'Usuario';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días ☀️' : hour < 18 ? 'Buenas tardes ☀️' : 'Buenas noches 🌙';
  const initial = user?.full_name?.[0]?.toUpperCase() || 'U';

  return (
    <PullToRefresh onRefresh={load}>
      <div className="w-full max-w-2xl mx-auto lg:max-w-5xl overflow-x-hidden bg-background">

        {/* ── Header ── */}
        <div className="sticky top-0 z-20 bg-background/96 backdrop-blur-md border-b border-border/30 px-4 py-2.5">
          <div className="flex items-center justify-between">
            {/* Avatar + greeting */}
            <div className="flex items-center gap-2.5 min-w-0">
              <Link to="/profile" className="flex-shrink-0">
                {user?.photo_url ? (
                  <img src={user.photo_url} alt={firstName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#183D7C] to-[#1E4788] flex items-center justify-center text-white font-bold text-sm">
                    {initial}
                  </div>
                )}
              </Link>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none">{greeting}</p>
                <p className="text-sm font-heading font-bold text-foreground leading-tight">¡Hola, {firstName}!</p>
                <p className="text-[10px] text-muted-foreground leading-none">Encuentra oportunidades cerca de ti.</p>
              </div>
            </div>
            {/* Action icons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link to="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted active:scale-90 transition-all">
                <Bell className="w-5 h-5 text-foreground" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background" />
                )}
              </Link>
              <Link to="/messages" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted active:scale-90 transition-all">
                <MessageCircle className="w-5 h-5 text-foreground" />
              </Link>
              <Link to="/settings" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted active:scale-90 transition-all">
                <Settings className="w-5 h-5 text-foreground" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-4 pt-3 pb-2 space-y-4">

          {/* Featured opportunity */}
          <FeaturedOpportunity jobs={jobs} loading={loading} />

          {/* Empleos recomendados */}
          <FeaturedJobsList jobs={jobs} loading={loading} />

          {/* Eventos próximos */}
          <EventsCarousel events={events} loading={loading} />

          {/* Capacitaciones */}
          <TrainingsGrid trainings={trainings} loading={loading} />

          {/* Actividad reciente */}
          <RecentActivity applications={applications} />

          <div className="h-1" />
        </div>
      </div>
    </PullToRefresh>
  );
}