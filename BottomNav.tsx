import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, MessageSquare, Library, BookText, User, X, Landmark,
  BookOpen, Feather, Flag, MessageCircle, ListTree, Clock,
  Sparkles, Calendar, Library as LibIcon, GraduationCap,
  Heart, Target, Eye, Award, ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SubItem { label: string; to: string; icon: LucideIcon }
interface NavEntry {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: string;
  subItems?: SubItem[];
}

const NAV_ENTRIES: NavEntry[] = [
  { id: 'home', label: 'Home', icon: Home, to: '/' },
  { id: 'assistant', label: 'AI Chat', icon: MessageSquare, to: '/assistant' },
  {
    id: 'hub',
    label: 'Learning Hub',
    icon: Library,
    subItems: [
      { label: 'British Novel', to: '/subjects/novel', icon: BookOpen },
      { label: 'British Poetry', to: '/subjects/poetry', icon: Feather },
      { label: 'American Literature', to: '/subjects/american', icon: Flag },
      { label: 'Indian Writings', to: '/subjects/indian', icon: Landmark },
      { label: 'Indian Writers Hub', to: '/indian-writers', icon: Landmark },
      { label: 'Communication Skills', to: '/subjects/communication', icon: MessageCircle },
      { label: 'Literary Terms', to: '/terms', icon: ListTree },
      { label: 'Author Explorer', to: '/authors', icon: BookOpen },
      { label: 'History of Lit', to: '/history', icon: Clock },
      { label: 'Resource Library', to: '/library', icon: LibIcon },
    ],
  },
  {
    id: 'syllabus',
    label: 'Syllabus & Tools',
    icon: BookText,
    subItems: [
      { label: 'Exam Center', to: '/exams', icon: Award },
      { label: 'Notes Generator', to: '/notes', icon: Sparkles },
      { label: 'Quiz Generator', to: '/quiz', icon: Target },
      { label: 'Poetry Analysis', to: '/poetry', icon: Feather },
      { label: 'Study Planner', to: '/planner', icon: Calendar },
      { label: 'Subject Hub', to: '/subjects', icon: GraduationCap },
    ],
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    subItems: [
      { label: 'About Creator', to: '/about-creator', icon: GraduationCap },
      { label: "Creator's Journey", to: '/about-creator', icon: Clock },
      { label: 'Acknowledgements', to: '/about-creator', icon: Heart },
      { label: 'Mission & Vision', to: '/about-creator', icon: Eye },
      { label: 'Dashboard', to: '/dashboard', icon: Target },
      { label: 'Contact', to: '/contact', icon: MessageCircle },
    ],
  },
];

const ACTIVE_PATTERNS: Record<string, RegExp> = {
  home: /^\/$/,
  assistant: /^\/assistant/,
  hub: /^\/(subjects|terms|authors|history|library)/,
  syllabus: /^\/(exams|notes|quiz|poetry|planner)/,
  profile: /^\/(about-creator|dashboard|contact)/,
};

function isActive(id: string, pathname: string): boolean {
  const re = ACTIVE_PATTERNS[id];
  return re ? re.test(pathname) : false;
}

export function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [renderMenu, setRenderMenu] = useState<string | null>(null);

  const handleTap = (entry: NavEntry, e: React.MouseEvent) => {
    // Only respond to left clicks
    if (e.button !== 0 && e.type !== 'keydown') return;
    if (entry.to) {
      setOpenMenu(null);
      setRenderMenu(null);
      navigate(entry.to);
      return;
    }
    if (openMenu === entry.id) {
      setOpenMenu(null);
      setTimeout(() => setRenderMenu(null), 250);
    } else {
      setRenderMenu(entry.id);
      // defer open state to next tick so transitions run
      requestAnimationFrame(() => setOpenMenu(entry.id));
    }
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && openMenu) {
        setOpenMenu(null);
        setTimeout(() => setRenderMenu(null), 250);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openMenu]);

  const handleSubTap = (to: string) => {
    setOpenMenu(null);
    setTimeout(() => setRenderMenu(null), 250);
    navigate(to);
  };

  const backdropOpen = !!openMenu;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          backdropOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(190, 24, 93, 0.12)', backdropFilter: 'blur(2px)' }}
        onClick={() => { setOpenMenu(null); setTimeout(() => setRenderMenu(null), 250); }}
        aria-hidden
      />

      {/* Expandable sub-menu (above bar, bottom-anchored) */}
      <div
        className={`fixed inset-x-0 bottom-[76px] z-50 px-3 transition-all duration-300 ease-out ${
          backdropOpen && renderMenu
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl bg-white/80 backdrop-blur-2xl border border-pink-200/70 shadow-2xl shadow-pink-500/20 p-4">
            {renderMenu && (() => {
              const entry = NAV_ENTRIES.find(n => n.id === renderMenu);
              if (!entry?.subItems) return null;
              return (
                <>
                  <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-pink-100">
                    <h4 className="font-serif font-bold text-slate-800 flex items-center gap-2">
                      <entry.icon size={18} className="text-pink-500" />
                      {entry.label}
                    </h4>
                    <button
                      onClick={() => { setOpenMenu(null); setTimeout(() => setRenderMenu(null), 250); }}
                      className="w-7 h-7 grid place-items-center rounded-full hover:bg-pink-100 text-slate-500"
                      aria-label="Close menu"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {entry.subItems.map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => handleSubTap(item.to)}
                          className="group flex items-center gap-3 rounded-xl bg-white/70 border border-pink-100 px-3 py-2.5 text-left hover:border-pink-300 hover:bg-pink-50 transition-all"
                        >
                          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 grid place-items-center text-white shrink-0 shadow-sm shadow-pink-500/30 group-hover:scale-110 transition-transform">
                            <Icon size={15} />
                          </span>
                          <span className="text-sm font-medium text-slate-700 leading-tight">
                            {item.label}
                          </span>
                          <ArrowRight size={13} className="ml-auto text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 px-2 pb-2 pt-0"
        aria-label="Primary bottom navigation"
      >
        <div className="mx-auto max-w-2xl">
          <div className="relative rounded-2xl sm:rounded-[1.5rem] bg-white/75 backdrop-blur-2xl border border-pink-200/60 shadow-2xl shadow-pink-500/20 overflow-hidden">
            {/* Soft accent glow */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-pink-300/30 blur-2xl rounded-full pointer-events-none" />

            <div className="relative grid grid-cols-5">
              {NAV_ENTRIES.map(entry => {
                const Icon = entry.icon;
                const active = isActive(entry.id, pathname);
                const menuOpen = openMenu === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={(e) => handleTap(entry, e)}
                    role="link"
                    aria-current={active ? 'page' : undefined}
                    aria-label={entry.label}
                    className="relative flex flex-col items-center justify-center gap-1 py-2.5 px-1 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60 rounded-lg"
                  >
                    {/* Active pill background */}
                    <span
                      className={`absolute inset-x-2 inset-y-1.5 rounded-xl transition-all duration-300 ${
                        active || menuOpen
                          ? 'bg-gradient-to-br from-pink-500 to-rose-500 opacity-100 shadow-md shadow-pink-500/30'
                          : 'bg-transparent opacity-0 group-hover:bg-pink-100 group-hover:opacity-100'
                      }`}
                      aria-hidden
                    />
                    {/* Icon */}
                    <span className="relative">
                      <Icon
                        size={20}
                        strokeWidth={active || menuOpen ? 2.4 : 2}
                        className={`transition-colors duration-200 ${
                          active || menuOpen
                            ? 'text-white'
                            : 'text-slate-500 group-hover:text-pink-600'
                        }`}
                      />
                      {/* Optional notification dot on AI Chat */}
                      {entry.id === 'assistant' && !active && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-400 animate-pulse-soft" />
                      )}
                    </span>
                    {/* Label */}
                    <span
                      className={`relative text-[10px] font-medium leading-none transition-colors duration-200 ${
                        active || menuOpen
                          ? 'text-white'
                          : 'text-slate-500 group-hover:text-pink-600'
                      }`}
                    >
                      {entry.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
