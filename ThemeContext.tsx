import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
interface ThemeCtx { theme: Theme; toggleTheme: () => void; }
const Ctx = createContext<ThemeCtx | undefined>(undefined);
const KEY = 'litmind-theme';

function initial(): Theme {
  if (typeof window === 'undefined') return 'light';
  const s = localStorage.getItem(KEY) as Theme | null;
  if (s === 'light' || s === 'dark') return s;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initial);
  useEffect(() => {
    const r = document.documentElement;
    r.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(KEY, theme);
  }, [theme]);
  const value = useMemo<ThemeCtx>(() => ({ theme, toggleTheme: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) }), [theme]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme requires ThemeProvider');
  return c;
}
