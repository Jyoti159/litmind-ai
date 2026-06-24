import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface Bookmark { id: string; type: 'term'|'author'|'period'|'note'|'quiz'|'resource'; label: string; href: string; }
export interface SavedNote { id: string; title: string; body: string; type: 'short'|'detailed'|'exam'; createdAt: number; }
export interface QuizResult { id: string; topic: string; score: number; total: number; percentage: number; takenAt: number; }

interface Ctx {
  bookmarks: Bookmark[];
  toggleBookmark: (b: Bookmark) => void;
  isBookmarked: (id: string) => boolean;
  savedNotes: SavedNote[];
  addSavedNote: (n: SavedNote) => void;
  removeSavedNote: (id: string) => void;
  quizResults: QuizResult[];
  addQuizResult: (r: QuizResult) => void;
  studyStreak: number;
  completedToday: string[];
  toggleTaskToday: (id: string) => void;
  quoteIndex: number;
}

const AppCtx = createContext<Ctx | undefined>(undefined);

function usePersistent<T>(key: string, initial: T) {
  const [s, setS] = useState<T>(() => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) as T : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(s)); } catch {} }, [key, s]);
  return [s, setS] as const;
}

const SEED_NOTES: SavedNote[] = [
  { id: 'n1', title: 'The Romantic Age — Exam Notes', body: 'Period 1798-1837. Big Six: Blake, Wordsworth, Coleridge, Byron, Shelley, Keats. Manifesto: Wordsworth 1800 Preface. Theory: negative capability (Keats); primary/secondary imagination (Coleridge).', type: 'exam', createdAt: Date.now()-86400000*2 },
  { id: 'n2', title: "Shakespeare's Tragedies — Short Notes", body: 'Four great tragedies: Hamlet (c.1600), Othello (c.1603), King Lear (c.1605), Macbeth (c.1606). Form: blank verse. First Folio 1623.', type: 'short', createdAt: Date.now()-86400000*5 },
];
const SEED_RESULTS: QuizResult[] = [
  { id: 'q1', topic: 'Romantic Poetry', score: 8, total: 10, percentage: 80, takenAt: Date.now()-86400000*3 },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = usePersistent<Bookmark[]>('litmind-bookmarks', []);
  const [savedNotes, setSavedNotes] = usePersistent<SavedNote[]>('litmind-notes', SEED_NOTES);
  const [quizResults, setQuizResults] = usePersistent<QuizResult[]>('litmind-quizzes', SEED_RESULTS);
  const [completedToday, setCompleted] = usePersistent<string[]>('litmind-tasks-today', []);

  const quoteIndex = useMemo(() => Math.floor(Date.now()/86400000), []);
  const toggleBookmark = useCallback((b: Bookmark) => setBookmarks(p => p.some(x=>x.id===b.id) ? p.filter(x=>x.id!==b.id) : [...p, b]), [setBookmarks]);
  const isBookmarked = useCallback((id: string) => bookmarks.some(b => b.id === id), [bookmarks]);
  const addSavedNote = useCallback((n: SavedNote) => setSavedNotes(p => [n, ...p.filter(x=>x.id!==n.id)]), [setSavedNotes]);
  const removeSavedNote = useCallback((id: string) => setSavedNotes(p => p.filter(x=>x.id!==id)), [setSavedNotes]);
  const addQuizResult = useCallback((r: QuizResult) => setQuizResults(p => [r, ...p].slice(0,50)), [setQuizResults]);
  const toggleTaskToday = useCallback((id: string) => setCompleted(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]), [setCompleted]);
  const studyStreak = useMemo(() => {
    const days = new Set<number>();
    quizResults.forEach(r => days.add(Math.floor(r.takenAt/86400000)));
    savedNotes.forEach(n => days.add(Math.floor(n.createdAt/86400000)));
    return Math.min(days.size || 1, 12);
  }, [quizResults, savedNotes]);

  const value = useMemo<Ctx>(() => ({ bookmarks, toggleBookmark, isBookmarked, savedNotes, addSavedNote, removeSavedNote, quizResults, addQuizResult, studyStreak, completedToday, toggleTaskToday, quoteIndex }),
    [bookmarks, toggleBookmark, isBookmarked, savedNotes, addSavedNote, removeSavedNote, quizResults, addQuizResult, studyStreak, completedToday, toggleTaskToday, quoteIndex]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp requires AppProvider');
  return c;
}
