import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Feather, ChevronRight, BookOpen } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { authors } from '../data/authors';

const filters = ['All', 'Romantic', 'Modern', 'Renaissance', 'Middle English', '17th Century'];

function eraGroup(era: string): string {
  const e = era.toLowerCase();
  if (e.includes('romantic')) return 'Romantic';
  if (e.includes('modern')) return 'Modern';
  if (e.includes('elizabethan') || e.includes('jacobean') || e.includes('renaissance')) return 'Renaissance';
  if (e.includes('middle english')) return 'Middle English';
  if (e.includes('17th')) return '17th Century';
  return 'Other';
}

export function AuthorsPage() {
  const [filter, setFilter] = useState('All');
  const filtered = authors.filter(a => filter === 'All' || eraGroup(a.era) === filter);

  return (
    <>
      <PageHeader eyebrow="Authors" title="Author Explorer" subtitle="Nine canonical authors of English literature — biographies, major works, literary contribution, and an interactive quiz for each." icon={Feather} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`chip cursor-pointer transition-colors ${filter === f ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{f}</button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <Link key={a.id} to={`/authors/${a.id}`} className="group card p-6 hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i*60}ms` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.accent} grid place-items-center text-white font-serif font-bold text-lg shadow-lg`}>
                  {a.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-semibold leading-tight truncate group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">{a.fullName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{a.lifespan}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3">{a.era}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">{a.contribution}</p>
              <div className="flex items-center justify-between">
                <span className="chip"><BookOpen size={12} /> {a.majorWorks.length} works</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-300">Explore <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
