import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookText, Search, BookOpen, Tag } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { literaryTerms, type LiteraryTerm } from '../data/literaryTerms';
import { BookmarkButton } from '../components/BookmarkButton';

const categories = ['All', 'Poetry', 'Prose', 'Drama', 'Rhetoric', 'Narrative', 'General'] as const;

export function LiteraryTermsPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [selected, setSelected] = useState<LiteraryTerm | null>(null);

  useEffect(() => {
    const term = params.get('term');
    if (term) {
      const found = literaryTerms.find(t => t.term.toLowerCase() === term.toLowerCase());
      if (found) setSelected(found);
    }
  }, [params]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return literaryTerms.filter(t =>
      (category === 'All' || t.category === category) &&
      (!q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
    ).sort((a, b) => a.term.localeCompare(b.term));
  }, [query, category]);

  return (
    <>
      <PageHeader eyebrow="Dictionary" title="Literary Terms Dictionary" subtitle="Search 50+ literary terms by category. Precise Honours-level definitions, each with a worked example from canonical literature." icon={BookText} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
          {/* Search + list */}
          <div>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search terms…"
                className="input-field pl-10" aria-label="Search literary terms" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`chip cursor-pointer transition-colors ${category === c ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{c}</button>
              ))}
            </div>
            <div className="glass rounded-2xl overflow-hidden max-h-[70vh] overflow-y-auto scrollbar-thin">
              {filtered.length === 0 && <p className="p-6 text-sm text-slate-500 text-center">No terms match your search.</p>}
              {filtered.map(t => (
                <button key={t.term} onClick={() => { setSelected(t); setParams({ term: t.term }); }}
                  className={`w-full text-left px-4 py-3 border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-brand-500/5 transition-colors flex items-center justify-between gap-2 ${selected?.term === t.term ? 'bg-brand-500/10' : ''}`}>
                  <span className="font-serif font-medium text-slate-800 dark:text-slate-100">{t.term}</span>
                  <span className="chip text-[10px]">{t.category}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">{filtered.length} term{filtered.length === 1 ? '' : 's'}</p>
          </div>

          {/* Detail */}
          <div className="lg:sticky lg:top-24 self-start">
            {selected ? (
              <div className="card p-6 sm:p-8 animate-fade-in">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={14} className="text-brand-500" />
                      <span className="text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300">{selected.category}</span>
                    </div>
                    <h2 className="font-serif text-3xl font-bold">{selected.term}</h2>
                  </div>
                  <BookmarkButton bookmark={{ id: `term:${selected.term}`, type: 'term', label: selected.term, href: `/terms?term=${encodeURIComponent(selected.term)}` }} />
                </div>
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">Definition</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selected.definition}</p>
                  </div>
                  <div className="glass rounded-xl p-4 border-l-2 border-brand-500">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-2">Example</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic text-sm">{selected.example}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-10 text-center">
                <BookOpen size={32} className="text-brand-500 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-semibold mb-2">Select a term</h3>
                <p className="text-sm text-slate-500">Pick a literary term from the list to read its definition and a worked example.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
