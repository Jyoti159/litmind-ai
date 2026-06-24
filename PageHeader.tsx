import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: LucideIcon;
  accent?: string;
}

export function PageHeader({ eyebrow, title, subtitle, icon: Icon, accent = 'from-brand-500 to-royal-600' }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-mesh opacity-70 pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <nav className="mb-4 text-xs text-slate-400">
          <Link to="/" className="hover:text-brand-500">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-500">{typeof eyebrow === 'string' ? eyebrow : typeof title === 'string' ? title : 'Page'}</span>
        </nav>
        <div className="flex items-start gap-4">
          {Icon && (
            <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-lg shadow-brand-500/30`}>
              <Icon className="h-6 w-6" />
            </span>
          )}
          <div>
            {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-300">{eyebrow}</p>}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300 leading-relaxed">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode; align?: 'center'|'left' }) {
  return (
    <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-3">{eyebrow}</div>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{subtitle}</p>}
    </div>
  );
}
