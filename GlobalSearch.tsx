import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownRight } from 'lucide-react';
import { searchEntries, type SearchEntry } from '../data/search';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

const groupOrder: SearchEntry['group'][] = ['Pages', 'Authors', 'Periods', 'Novels', 'Poems', 'American Works', 'Literary Terms'];

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = searchEntries(query);
  const flat: SearchEntry[] = [];
  groupOrder.forEach(g => flat.push(...results.filter(r => r.group === g)));

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, flat.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter' && flat[activeIndex]) { navigate(flat[activeIndex].href); onClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, flat, activeIndex, navigate, onClose]);

  if (!open) return null;

  let counter = -1;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true" aria-label="Global search">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-strong rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/60 dark:border-slate-700/60">
          <Search size={18} className="text-slate-400" />
          <input ref={inputRef} type="text" value={query} onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
            placeholder="Search authors, periods, literary terms, pages…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400" aria-label="Search query" />
          <button onClick={onClose} className="chip" aria-label="Close search">
            <span className="hidden sm:inline">Esc</span><X size={14} />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto scrollbar-thin">
          {query.trim() === '' && (
            <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              Start typing to search across pages, authors, periods and literary terms.
            </div>
          )}
          {query.trim() !== '' && flat.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No matches for «<span className="font-medium">{query}</span>».
            </div>
          )}
          {groupOrder.map(group => {
            const groupResults = results.filter(r => r.group === group);
            if (groupResults.length === 0) return null;
            return (
              <div key={group}>
                <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider font-semibold text-slate-400">{group}</div>
                {groupResults.map(entry => {
                  counter += 1;
                  const idx = counter;
                  const isActive = idx === activeIndex;
                  return (
                    <button key={entry.id} onMouseEnter={() => setActiveIndex(idx)} onClick={() => { navigate(entry.href); onClose(); }}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${isActive ? 'bg-brand-500/10 text-brand-700 dark:text-brand-200' : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'}`}>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{entry.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{entry.sublabel}</div>
                      </div>
                      {isActive && <CornerDownRight size={14} className="text-brand-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="px-4 py-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>↑↓ navigate · ↵ open</span>
          <span>{flat.length} result{flat.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
}
