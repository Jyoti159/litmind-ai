import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Users, BookOpen, Calendar, Lightbulb, Sparkles } from 'lucide-react';
import { literaturePeriods } from '../data/literaturePeriods';
import { authors } from '../data/authors';
import { BookmarkButton } from '../components/BookmarkButton';
import { NotFoundPage } from './NotFoundPage';

export function PeriodDetailPage() {
  const { periodId } = useParams();
  const idx = literaturePeriods.findIndex(p => p.id === periodId);
  if (idx === -1) return <NotFoundPage />;
  const p = literaturePeriods[idx];
  const prev = literaturePeriods[idx - 1];
  const next = literaturePeriods[idx + 1];
  const authorIds = new Set(authors.map(a => a.id));

  return (
    <>
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-10`} aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link to="/history" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 dark:hover:text-brand-300 transition-colors mb-6"><ArrowLeft size={16} /> All periods</Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 chip mb-3"><span className={`w-2 h-2 rounded-full bg-gradient-to-br ${p.accent}`} /> Literary period</div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{p.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1"><Clock size={14} /> {p.timeline}</span>
              </div>
            </div>
            <BookmarkButton bookmark={{ id: `period:${p.id}`, type: 'period', label: p.name, href: `/history/${p.id}` }} />
          </div>
          <p className="mt-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">{p.summary}</p>
          <Link to={`/notes?topic=${encodeURIComponent(p.name)}`} className="mt-6 inline-flex items-center btn-primary text-sm"><Sparkles size={15} /> Generate exam notes on this period</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-4"><Calendar size={14} /> Major Events</div>
            <ul className="space-y-3">
              {p.majorEvents.map((e, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-serif text-sm font-semibold text-brand-600 dark:text-brand-300 w-16 shrink-0">{e.year}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{e.event}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-4"><BookOpen size={14} /> Important Works</div>
            <ul className="space-y-2">
              {p.importantWorks.map((w, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"><span className="text-brand-500 mt-1">›</span><span className="italic">{w}</span></li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-4"><Users size={14} /> Major Authors</div>
            <div className="flex flex-wrap gap-2">
              {p.majorAuthors.map(a => {
                const match = authors.find(x => a.toLowerCase().includes(x.fullName.split(' ')[1].toLowerCase()) || x.name.toLowerCase() === a.toLowerCase().split(' ')[0].toLowerCase());
                const id = match?.id;
                return id && authorIds.has(id)
                  ? <Link key={a} to={`/authors/${id}`} className="chip hover:bg-brand-500/15 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">{a}</Link>
                  : <span key={a} className="chip">{a}</span>;
              })}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-4"><Lightbulb size={14} /> Key Characteristics</div>
            <ul className="space-y-2">
              {p.characteristics.map((c, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"><span className="text-emerald-500 mt-0.5 shrink-0">✓</span><span>{c}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          {prev ? (
            <Link to={`/history/${prev.id}`} className="glass rounded-xl px-4 py-3 hover:shadow-md transition-all flex items-center gap-2 max-w-[48%]">
              <ArrowLeft size={16} className="text-brand-500 shrink-0" />
              <span className="min-w-0"><span className="block text-[11px] uppercase tracking-wide text-slate-400">Previous</span><span className="block text-sm font-medium truncate">{prev.name}</span></span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/history/${next.id}`} className="glass rounded-xl px-4 py-3 hover:shadow-md transition-all flex items-center gap-2 max-w-[48%] text-right">
              <span className="min-w-0"><span className="block text-[11px] uppercase tracking-wide text-slate-400">Next</span><span className="block text-sm font-medium truncate">{next.name}</span></span>
              <ArrowRight size={16} className="text-brand-500 shrink-0" />
            </Link>
          ) : <span />}
        </div>
      </section>
    </>
  );
}
