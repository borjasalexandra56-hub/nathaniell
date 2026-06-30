import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import moment from 'moment';

const typeLabel = { request: 'Necesita', offer: 'Ofrece' };
const typeIcon  = { request: '🙋', offer: '🤝' };

export default function CommunityFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.CommunitySupport.filter({ status: 'active' }, '-created_date', 3)
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wide">Comunidad</p>
        <Link to="/community" className="flex items-center gap-0.5 text-rose-500 text-xs font-semibold">
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Compact list — only summary, no full text */}
      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {items.map(item => (
          <Link key={item.id} to="/community"
            className="flex items-center gap-2.5 px-3 py-2 active:bg-muted/50 transition-colors">
            <span className="text-base flex-shrink-0">{typeIcon[item.type] || '💬'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{item.author_name || 'Anónimo'} · {moment(item.created_date).fromNow()}</p>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${item.type === 'request' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'}`}>
              {typeLabel[item.type]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}