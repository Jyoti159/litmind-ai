import { useMemo } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { quoteOfDay } from '../data/site';

export function QuoteOfTheDay({ compact = false }: { compact?: boolean }) {
  const { quoteIndex } = useApp();
  const quote = useMemo(() => quoteOfDay(quoteIndex), [quoteIndex]);

  if (compact) {
    return (
      <div className="glass rounded-2xl p-5">
        <QuoteIcon size={20} className="text-brand-500 mb-2" />
        <p className="font-serif text-base leading-relaxed text-slate-700 dark:text-slate-200">"{quote.text}"</p>
        <p className="text-xs text-slate-500 mt-3">— {quote.author}{quote.work ? `, ${quote.work}` : ''}</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden glass-strong rounded-3xl p-8 sm:p-10">
      <div className="absolute -top-12 -right-10 w-48 h-48 rounded-full bg-brand-500/15 blur-3xl" aria-hidden />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-royal-500/15 blur-3xl" aria-hidden />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-500 mb-4">
          <QuoteIcon size={16} /> Quote of the Day
        </div>
        <blockquote className="font-serif text-2xl sm:text-3xl leading-snug text-slate-800 dark:text-slate-100">"{quote.text}"</blockquote>
        <cite className="text-sm text-slate-500 mt-4 not-italic block">— {quote.author}{quote.work ? <>, <span className="italic">{quote.work}</span></> : null}</cite>
      </div>
    </div>
  );
}
