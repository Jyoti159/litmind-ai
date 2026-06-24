import { GraduationCap, Sparkles } from 'lucide-react';
import { creator } from '../data/site';

export function CreatorBadge({ variant = 'card' }: { variant?: 'card' | 'inline' }) {
  if (variant === 'inline') {
    return (
      <p className="text-xs text-slate-500">
        Created by <span className="font-medium text-slate-700 dark:text-slate-300">{creator.name}</span>, {creator.role}, {creator.institution}
      </p>
    );
  }
  return (
    <div className="relative overflow-hidden glass-strong rounded-2xl p-5 sm:p-6">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/15 blur-2xl" aria-hidden />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-3">
          <Sparkles size={14} /> Created by
        </div>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-royal-600 grid place-items-center text-white shrink-0">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="font-serif text-lg font-bold text-slate-900 dark:text-white">{creator.name}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">{creator.role}</div>
            <div className="text-xs text-slate-500 mt-1">{creator.institution}</div>
            <div className="text-xs text-slate-500">{creator.affiliation}</div>
          </div>
        </div>
        <p className="mt-4 text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">"{creator.tagline}"</p>
      </div>
    </div>
  );
}
