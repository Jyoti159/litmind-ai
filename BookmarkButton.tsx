import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useApp, type Bookmark as BM } from '../context/AppContext';
import { useToast } from './ToastContext';

export function BookmarkButton({ bookmark, className = '', label }: { bookmark: BM; className?: string; label?: string }) {
  const { isBookmarked, toggleBookmark } = useApp();
  const toast = useToast();
  const active = isBookmarked(bookmark.id);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(bookmark); toast.show(active ? 'Removed from saved' : 'Saved to dashboard'); }}
      aria-label={active ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${active ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300' : 'text-slate-500 hover:text-brand-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'} ${className}`}
    >
      {active ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      {label ?? (active ? 'Saved' : 'Save')}
    </button>
  );
}
