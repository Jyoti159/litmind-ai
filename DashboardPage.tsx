import { Link } from 'react-router-dom';
import { LayoutDashboard, NotebookPen, ListChecks, Bookmark, Trophy, Flame, Trash2, Sparkles, ChevronRight, ScrollText, Feather, BookText, CalendarCheck, Library } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { QuoteOfTheDay } from '../components/QuoteOfTheDay';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContext';
import { badges } from '../data/site';

const badgeIcons: Record<string, typeof Trophy> = { Footprints: Trophy, NotebookPen, ListChecks, Bookmark, Sparkles, ScrollText, Flame, Trophy };

export function DashboardPage() {
  const { savedNotes, removeSavedNote, quizResults, bookmarks, studyStreak } = useApp();
  const toast = useToast();

  const earnedIds = new Set([
    'first-steps',
    savedNotes.length > 0 ? 'scholar' : null,
    quizResults.some(q => q.percentage >= 80) ? 'quiz-master' : null,
    bookmarks.length >= 5 ? 'bibliophile' : null,
    'poet',
    'explorer',
  ].filter(Boolean) as string[]);

  const avgScore = quizResults.length ? Math.round(quizResults.reduce((s, q) => s + q.percentage, 0) / quizResults.length) : 0;

  return (
    <>
      <PageHeader eyebrow="Account" title="Student Dashboard" subtitle="Your saved notes, quiz results, bookmarks, achievement badges, and learning progress — all in one place." icon={LayoutDashboard} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { icon: NotebookPen, label: 'Saved notes', value: savedNotes.length, color: 'from-brand-500 to-royal-500' },
            { icon: ListChecks, label: 'Quizzes taken', value: quizResults.length, color: 'from-accent-500 to-brand-500' },
            { icon: Bookmark, label: 'Bookmarks', value: bookmarks.length, color: 'from-rose-500 to-pink-500' },
            { icon: Flame, label: 'Day streak', value: studyStreak, color: 'from-orange-500 to-red-500' },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center text-white mb-3`}><s.icon size={18} /></div>
              <div className="font-serif text-2xl font-bold">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Saved notes */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2"><NotebookPen size={18} className="text-brand-500" /><h2 className="font-serif text-xl font-bold">Saved notes</h2></div>
              <Link to="/notes" className="btn-ghost text-xs"><Sparkles size={14} /> Generate more</Link>
            </div>
            {savedNotes.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No saved notes yet. <Link to="/notes" className="text-brand-600 dark:text-brand-300">Generate your first set →</Link></p>
            ) : (
              <div className="space-y-3">
                {savedNotes.map(n => (
                  <div key={n.id} className="glass rounded-xl p-4 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-serif font-semibold text-slate-800 dark:text-slate-100 truncate">{n.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                        <div className="flex items-center gap-2 mt-2"><span className="chip text-[10px]">{n.type}</span><span className="text-[11px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span></div>
                      </div>
                      <button onClick={() => { removeSavedNote(n.id); toast.show('Note removed'); }} className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all" aria-label="Remove note"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quote of the day */}
          <QuoteOfTheDay compact />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Recent quizzes */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2"><Trophy size={18} className="text-amber-500" /><h2 className="font-serif text-xl font-bold">Quiz history</h2></div>
              <Link to="/quiz" className="btn-ghost text-xs"><ListChecks size={14} /> New quiz</Link>
            </div>
            {quizResults.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No quizzes yet. <Link to="/quiz" className="text-brand-600 dark:text-brand-300">Take your first quiz →</Link></p>
            ) : (
              <div className="space-y-2.5">
                {quizResults.slice(0, 6).map(q => (
                  <div key={q.id} className="flex items-center justify-between gap-3 glass rounded-lg p-3">
                    <div className="min-w-0"><div className="text-sm font-medium truncate">{q.topic}</div><div className="text-[11px] text-slate-400">{new Date(q.takenAt).toLocaleDateString()}</div></div>
                    <div className="text-right shrink-0"><div className={`font-serif text-lg font-bold ${q.percentage >= 80 ? 'text-emerald-500' : q.percentage >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{q.percentage}%</div><div className="text-[10px] text-slate-400">{q.score}/{q.total}</div></div>
                  </div>
                ))}
              </div>
            )}
            {quizResults.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-sm"><span className="text-slate-500">Average score</span><span className="font-serif font-bold text-brand-600 dark:text-brand-300">{avgScore}%</span></div>
            )}
          </div>

          {/* Bookmarks */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5"><Bookmark size={18} className="text-rose-500" /><h2 className="font-serif text-xl font-bold">Bookmarks</h2></div>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No bookmarks yet. Save authors, periods, or terms as you browse.</p>
            ) : (
              <div className="space-y-2">
                {bookmarks.slice(0, 8).map(b => (
                  <Link key={b.id} to={b.href} className="flex items-center justify-between gap-2 glass rounded-lg p-3 hover:bg-brand-500/5 transition-colors group">
                    <div className="min-w-0"><div className="text-sm font-medium truncate">{b.label}</div><div className="text-[11px] text-slate-400 capitalize">{b.type}</div></div>
                    <ChevronRight size={14} className="text-brand-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievement badges */}
        <div className="card p-6 mt-6">
          <div className="flex items-center gap-2 mb-5"><Trophy size={18} className="text-amber-500" /><h2 className="font-serif text-xl font-bold">Achievement badges</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map(b => {
              const earned = b.earnedByDefault || earnedIds.has(b.id);
              const Icon = badgeIcons[b.icon] ?? Trophy;
              return (
                <div key={b.id} className={`rounded-2xl p-4 text-center transition-all ${earned ? 'glass' : 'glass opacity-40 grayscale'}`}>
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${b.color} grid place-items-center text-white shadow-lg mb-2`}><Icon size={22} /></div>
                  <div className="font-serif font-semibold text-sm">{b.title}</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">{b.description}</p>
                  {earned && <div className="mt-2 inline-flex items-center gap-1 chip bg-emerald-500/15 text-emerald-600 text-[10px]"><Trophy size={10} /> Earned</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-8">
          <h2 className="font-serif text-xl font-bold mb-4">Jump back in</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { to: '/assistant', icon: Sparkles, label: 'Assistant' },
              { to: '/notes', icon: NotebookPen, label: 'Notes' },
              { to: '/quiz', icon: ListChecks, label: 'Quiz' },
              { to: '/history', icon: ScrollText, label: 'History' },
              { to: '/authors', icon: Feather, label: 'Authors' },
              { to: '/terms', icon: BookText, label: 'Dictionary' },
              { to: '/poetry', icon: Sparkles, label: 'Poetry' },
              { to: '/planner', icon: CalendarCheck, label: 'Planner' },
              { to: '/library', icon: Library, label: 'Library' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="card p-4 text-center hover:-translate-y-1 transition-all group">
                <l.icon size={22} className="text-brand-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-medium">{l.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
