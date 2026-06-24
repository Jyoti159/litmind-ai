import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Menu, Moon, Search, Sparkles, Sun, X, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GlobalSearch } from './GlobalSearch';

const nav = [
  { label: 'Home', to: '/', group: 'main' },
  { label: 'History of Lit', to: '/history', group: 'learn' },
  { label: 'Author Explorer', to: '/authors', group: 'learn' },
  { label: 'Literary Terms', to: '/terms', group: 'learn' },
  { label: 'Resource Library', to: '/library', group: 'learn' },
  { label: 'Study Assistant', to: '/assistant', group: 'tools' },
  { label: 'Notes Generator', to: '/notes', group: 'tools' },
  { label: 'Quiz Generator', to: '/quiz', group: 'tools' },
  { label: 'Poetry Analysis', to: '/poetry', group: 'tools' },
  { label: 'Study Planner', to: '/planner', group: 'tools' },
  { label: 'Dashboard', to: '/dashboard', group: 'account' },
  { label: 'Contact', to: '/contact', group: 'main' },
];
const topBar = ['Home', 'History of Lit', 'Author Explorer', 'Literary Terms', 'Study Assistant', 'Quiz Generator', 'Dashboard', 'Contact'];
const groups = { Learn: nav.filter(n => n.group === 'learn'), Tools: nav.filter(n => n.group === 'tools'), Account: nav.filter(n => n.group === 'account') };

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setMobileOpen(false), [loc.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-sm' : 'bg-transparent'}`}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="LitMind AI home">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-royal-500 to-accent-500 grid place-items-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform" />
              <BookOpen size={18} className="absolute inset-0 m-auto text-white" strokeWidth={2.2} />
            </div>
            <div className="leading-none">
              <div className="font-serif text-lg font-semibold tracking-tight">LitMind <span className="gradient-text">AI</span></div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Literature Learning</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {nav.filter(n => topBar.includes(n.label)).map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-brand-600 dark:text-brand-300 bg-brand-500/10' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'}`}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 glass hover:text-brand-600 dark:hover:text-brand-300 transition-colors w-44 lg:w-52" aria-label="Search">
              <Search size={15} /><span className="text-xs">Search…</span>
              <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/70 text-slate-500">⌘K</kbd>
            </button>
            <button onClick={() => setSearchOpen(true)} className="sm:hidden p-2 rounded-lg glass hover:text-brand-600 dark:hover:text-brand-300 transition-colors" aria-label="Search"><Search size={18} /></button>
            <button onClick={toggleTheme} className="p-2 rounded-lg glass hover:text-brand-600 dark:hover:text-brand-300 transition-colors" aria-label="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
            <Link to="/login" className="hidden sm:inline-flex items-center btn-primary text-sm py-2"><Sparkles size={15} />Sign in</Link>
            <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden p-2 rounded-lg glass" aria-label="Open menu" aria-expanded={mobileOpen}>{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </nav>
      </header>

      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <aside className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] glass-strong shadow-2xl flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <span className="font-serif text-lg font-semibold">Menu</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
            <NavLink to="/" end className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100/70 dark:hover:bg-slate-800/50">Home</NavLink>
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="mt-4">
                <div className="px-3 text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">{group}</div>
                {items.map(item => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'}
                    className={({ isActive }) => `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-brand-600 dark:text-brand-300 bg-brand-500/10' : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'}`}>
                    {item.label}<ChevronRight size={14} className="opacity-40" />
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
          <div className="p-3 border-t border-slate-200/60 dark:border-slate-700/60"><Link to="/login" className="btn-primary w-full justify-center text-sm">Sign in</Link></div>
        </aside>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
