import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Mail, Heart, GraduationCap } from 'lucide-react';
import { navItems, creator } from '../data/site';

const cols = {
  Learn: navItems.filter(n => n.group === 'learn'),
  Tools: navItems.filter(n => n.group === 'tools'),
  Account: navItems.filter(n => n.group === 'account'),
};

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-royal-500 to-accent-500 grid place-items-center shadow-lg shadow-brand-500/30" />
                <BookOpen size={18} className="absolute inset-0 m-auto text-white" strokeWidth={2.2} />
              </div>
              <div className="leading-none">
                <div className="font-serif text-lg font-semibold tracking-tight">LitMind <span className="gradient-text">AI</span></div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Literature Learning</div>
              </div>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The premium AI-powered learning platform for English Literature and English Honours students. Study smarter with curated literary content.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-500 hover:text-brand-600 dark:hover:text-brand-300 transition-colors" aria-label={['Twitter','GitHub','Email'][i]}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(cols).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-3">{group}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.to}><Link to={item.to} className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">{item.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LitMind AI — Created and Developed by {creator.name}, {creator.role}, {creator.collegeShort}, {creator.affiliation}.</p>
          <p className="flex items-center gap-1.5">Crafted with <Heart size={12} className="text-rose-500 fill-rose-500" /> for English Honours students</p>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-royal-600 grid place-items-center text-white shrink-0"><GraduationCap size={20} /></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Created and Developed by <span className="font-semibold text-brand-600 dark:text-brand-300">{creator.name}</span></div>
              <div className="text-xs text-slate-500 mt-0.5">{creator.role} · {creator.institution}</div>
              <div className="text-xs text-slate-500">{creator.affiliation}</div>
            </div>
            <p className="text-xs italic text-slate-500 max-w-md">"{creator.tagline}"</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
