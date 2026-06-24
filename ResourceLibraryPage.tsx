import { useMemo, useState } from 'react';
import { Library, Download, FileText, Clock, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { resources } from '../data/site';
import { useToast } from '../components/ToastContext';
import { BookmarkButton } from '../components/BookmarkButton';

const types = ['All', 'Notes', 'Previous Year Questions', 'Downloadable'] as const;

export function ResourceLibraryPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<(typeof types)[number]>('All');
  const toast = useToast();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return resources.filter(r =>
      (type === 'All' || r.type === type) &&
      (!q || r.title.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q) || r.period.toLowerCase().includes(q))
    );
  }, [query, type]);

  const download = (title: string) => {
    const blob = new Blob([`# ${title}\n\nThis is a sample resource from LitMind AI.\nIn a production deployment this would be the full file content.`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.show('Downloaded sample resource');
  };

  return (
    <>
      <PageHeader eyebrow="Library" title="Resource Library" subtitle="Curated notes, previous-year questions, and downloadable resources indexed by period and topic." icon={Library} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by topic, period, or title…" className="input-field pl-10" aria-label="Search resources" />
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <button key={t} onClick={() => setType(t)} className={`chip cursor-pointer transition-colors ${type === t ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => {
            const Icon = r.type === 'Downloadable' ? Download : r.type === 'Previous Year Questions' ? Clock : FileText;
            return (
              <article key={r.id} className="card p-5 flex flex-col animate-fade-up" style={{ animationDelay: `${i*40}ms` }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`w-10 h-10 rounded-xl ${r.type === 'Downloadable' ? 'bg-amber-500/15 text-amber-600' : r.type === 'Previous Year Questions' ? 'bg-rose-500/15 text-rose-600' : 'bg-brand-500/15 text-brand-600'} grid place-items-center`}>
                    <Icon size={18} />
                  </span>
                  <BookmarkButton bookmark={{ id: `resource:${r.id}`, type: 'resource', label: r.title, href: '/library' }} label="" />
                </div>
                <span className="chip self-start mb-2 text-[10px]">{r.type}</span>
                <h3 className="font-serif font-semibold text-lg leading-tight mb-2">{r.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1 mb-3">{r.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                  <span>{r.period} · {r.format} · {r.size}</span>
                  <button onClick={() => download(r.title)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300 hover:bg-brand-500/20 transition-colors font-medium"><Download size={12} /> Get</button>
                </div>
              </article>
            );
          })}
        </div>
        {filtered.length === 0 && <p className="text-center text-sm text-slate-500 py-20">No resources match your filters.</p>}
      </section>
    </>
  );
}
