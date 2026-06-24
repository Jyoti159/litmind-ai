import { Loader2 } from 'lucide-react';

export function LoadingDots({ label = 'Thinking' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
      <Loader2 size={16} className="animate-spin text-brand-500" />
      <span>{label}</span>
      <span className="inline-flex gap-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse [animation-delay:200ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse [animation-delay:400ms]" />
      </span>
    </div>
  );
}

export function LoadingScreen({ label = 'Loading LitMind AI' }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 via-royal-500 to-accent-500 animate-pulse-slow" />
        <Loader2 size={28} className="absolute inset-0 m-auto animate-spin text-white" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}…</p>
    </div>
  );
}
