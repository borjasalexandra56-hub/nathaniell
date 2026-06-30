import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, CalendarDays, MapPin, Clock, ArrowLeft, Users, Star } from 'lucide-react';
import moment from 'moment';

export default function Explore() {
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [j, e, t] = await Promise.all([
        base44.entities.Job.filter({ status: 'active' }, '-created_date', 5),
        base44.entities.Event.filter({ status: 'upcoming' }, 'date', 5),
        base44.entities.Training.filter({ status: 'active' }, '-created_date', 4),
      ]);
      setJobs(j);
      setEvents(e);
      setTrainings(t);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/welcome" className="text-primary-foreground/70 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-white rounded-xl font-heading font-semibold">
                Iniciar sesión
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-display font-bold text-lg">Ciudad Activa</span>
          </div>
          <p className="text-primary-foreground/70 text-sm">Explora las oportunidades disponibles en Collique y alrededores</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-10">
        {/* Jobs */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-accent" /> Empleos recientes
          </h2>
          {jobs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay empleos disponibles aún.</p>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.id} className="bg-card rounded-xl p-4 border border-border">
                  <h3 className="font-heading font-semibold text-foreground">{job.title}</h3>
                  <p className="text-muted-foreground text-sm">{job.company_name}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-muted-foreground text-xs"><MapPin className="w-3.5 h-3.5" /> {job.district || job.location}</span>
                    {job.modality && <span className="bg-accent/10 text-accent text-xs font-medium px-2 py-0.5 rounded-full">{job.modality}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Events */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-secondary" /> Próximos eventos
          </h2>
          {events.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay eventos próximos.</p>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
                  <div className="w-12 h-14 bg-secondary/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-secondary text-[10px] font-bold uppercase">{moment(event.date).format('MMM')}</span>
                    <span className="text-secondary font-heading font-bold text-lg leading-none">{moment(event.date).format('DD')}</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">{event.title}</h3>
                    {event.location && <p className="flex items-center gap-1 text-muted-foreground text-[11px] mt-1"><MapPin className="w-3 h-3" /> {event.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trainings */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-success" /> Capacitaciones disponibles
          </h2>
          {trainings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay capacitaciones disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trainings.map(t => (
                <div key={t.id} className="bg-card rounded-xl p-4 border border-border">
                  <h3 className="font-heading font-semibold text-foreground text-sm">{t.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-muted-foreground text-xs">
                    {t.duration_hours && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t.duration_hours}h</span>}
                    {t.modality && <span>{t.modality}</span>}
                    {t.rating && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-secondary text-secondary" /> {t.rating}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-6 text-center">
          <h3 className="font-display font-bold text-white text-lg mb-2">¿Quieres acceder a más oportunidades?</h3>
          <p className="text-white/70 text-sm mb-4">Crea tu cuenta gratis y postúlate a empleos, inscríbete a capacitaciones y más.</p>
          <Link to="/register">
            <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-xl font-heading font-semibold">
              Crear cuenta gratis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}