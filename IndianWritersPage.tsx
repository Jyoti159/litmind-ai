import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ChevronRight, BookOpen, Star, Filter } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import {
  indianWriters,
  indianCategoryOrder,
  type IndianCategory,
} from '../data/indianWriters';

export function IndianWritersPage() {
  const [filter, setFilter] = useState<IndianCategory | 'All' | 'Syllabus'>('All');

  const syllabusWriters = indianWriters.filter(w => w.isSyllabusWriter);
  const filtered =
    filter === 'All' ? indianWriters
    : filter === 'Syllabus' ? syllabusWriters
    : indianWriters.filter(w => w.categories.includes(filter as IndianCategory));

  const tabs: (IndianCategory | 'All' | 'Syllabus')[] = ['All', 'Syllabus', ...indianCategoryOrder];

  return (
    <>
      <PageHeader
        eyebrow="Hub"
        title="Indian Literature Hub"
        subtitle="40+ major Indian writers across six categories — from ancient Sanskrit classics to contemporary Indian English fiction, drama, and regional literatures. Syllabus writers are given detailed coverage."
        icon={Landmark}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        {/* Syllabus spotlight */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} className="text-amber-500" />
            <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">Prescribed Syllabus Writers</h2>
            <span className="chip bg-amber-500/15 text-amber-600 dark:text-amber-300"> detailed coverage</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {syllabusWriters.map((w, i) => (
              <Link
                key={w.id}
                to={`/indian-writers/${w.id}`}
                className="group relative card p-5 hover:-translate-y-1 transition-all duration-300 animate-fade-up overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${w.accent} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${w.accent} grid place-items-center text-white font-serif font-bold text-sm shadow-lg shrink-0 mb-3`}>
                    {w.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <h3 className="font-serif font-semibold leading-tight text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">{w.fullName}</h3>
                  <p className="text-xs text-slate-500 mt-1">{w.lifespan}</p>
                  <p className="text-xs text-slate-500 mt-1.5">{w.language}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="chip"><BookOpen size={11} /> {w.majorWorks.length} works</span>
                    <ChevronRight size={14} className="text-brand-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 mb-6">
          <Filter size={16} className="text-slate-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter by category</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`chip cursor-pointer transition-colors ${filter === t ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              {t === 'Syllabus' ? 'Syllabus Spotlight' : t}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w, i) => (
            <Link
              key={w.id}
              to={`/indian-writers/${w.id}`}
              className="group card p-6 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${w.accent} grid place-items-center text-white font-serif font-bold text-sm shadow-lg shrink-0`}>
                  {w.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif font-semibold leading-tight text-slate-800 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                    {w.fullName}
                    {w.isSyllabusWriter && <Star size={12} className="inline-block ml-1.5 text-amber-400 fill-amber-400" />}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{w.lifespan}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-2">{w.period} · {w.language}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">{w.contribution}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {w.categories.slice(0, 3).map(cat => (
                  <span key={cat} className="chip bg-pink-500/10 text-pink-600 dark:text-pink-300 text-[10px]">{cat}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="chip"><BookOpen size={12} /> {w.majorWorks.length} works</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-300">Explore <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
