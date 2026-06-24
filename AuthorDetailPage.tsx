import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, BookOpen, Calendar, CheckCircle2, Sparkles, Trophy, XCircle } from 'lucide-react';
import { authors } from '../data/authors';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContext';
import { BookmarkButton } from '../components/BookmarkButton';
import { NotFoundPage } from './NotFoundPage';

export function AuthorDetailPage() {
  const { authorId } = useParams();
  const idx = authors.findIndex(a => a.id === authorId);
  const { addQuizResult } = useApp();
  const toast = useToast();
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (idx === -1) return <NotFoundPage />;
  const a = authors[idx];
  const prev = authors[idx - 1];
  const next = authors[idx + 1];

  const setAnswer = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers(prev => { const next = [...prev]; next[qi] = oi; return next; });
  };
  const submit = () => {
    if (answers.filter(v => v !== null).length < a.quiz.length) { toast.show('Answer all questions first'); return; }
    setSubmitted(true);
    const computed = answers.reduce<number>((acc, ans, i) => acc + (ans === a.quiz[i].answer ? 1 : 0), 0);
    const total = a.quiz.length;
    addQuizResult({ id: `quiz-${Date.now()}`, topic: `${a.fullName} Quiz`, score: computed, total, percentage: Math.round((computed/total)*100), takenAt: Date.now() });
    toast.show(`Quiz complete: ${computed}/${total}`);
  };
  const reset = () => { setAnswers([]); setSubmitted(false); };
  const score = answers.reduce<number>((acc, ans, i) => acc + (ans === a.quiz[i].answer ? 1 : 0), 0);
  const allAnswered = answers.filter(v => v !== null).length === a.quiz.length;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${a.accent} opacity-10`} aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link to="/authors" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 dark:hover:text-brand-300 transition-colors mb-6"><ArrowLeft size={16} /> All authors</Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${a.accent} grid place-items-center text-white font-serif font-bold text-2xl shadow-xl shrink-0`}>
              {a.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{a.fullName}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1"><Calendar size={14} /> {a.lifespan}</span>
                    <span className="chip">{a.era}</span>
                    <span className="chip">{a.nationality}</span>
                  </div>
                </div>
                <BookmarkButton bookmark={{ id: `author:${a.id}`, type: 'author', label: a.fullName, href: `/authors/${a.id}` }} />
              </div>
            </div>
          </div>
          <Link to={`/notes?topic=${encodeURIComponent(a.fullName)}`} className="mt-6 inline-flex items-center btn-primary text-sm"><Sparkles size={15} /> Generate notes about this author</Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="card p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold mb-4">Biography</h2>
          <div className="space-y-4">
            {a.bio.map((p, i) => <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">{p}</p>)}
          </div>
        </div>

        <div className="card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-brand-500/5 to-royal-500/5">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3"><Award size={18} className="text-brand-500" /><h2 className="font-serif text-2xl font-bold">Literary Contribution</h2></div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{a.contribution}</p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4"><BookOpen size={18} className="text-brand-500" /><h2 className="font-serif text-2xl font-bold">Major Works</h2></div>
          <div className="grid sm:grid-cols-2 gap-3">
            {a.majorWorks.map((w, i) => (
              <div key={i} className="glass rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif font-semibold text-slate-800 dark:text-slate-100">{w.title}</h4>
                  <span className="chip shrink-0">{w.type}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{w.year}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Famous works</h3>
          <div className="flex flex-wrap gap-2">{a.famousWorks.map(f => <span key={f} className="chip">{f}</span>)}</div>
        </div>

        {/* Quiz */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2"><Trophy size={20} className="text-amber-500" /><h2 className="font-serif text-2xl font-bold">Test your knowledge</h2></div>
            {submitted && <span className="chip bg-brand-500/15 text-brand-600 dark:text-brand-300">Score {score}/{a.quiz.length}</span>}
          </div>
          <div className="space-y-6">
            {a.quiz.map((q, qi) => (
              <div key={qi}>
                <p className="font-medium text-slate-800 dark:text-slate-100 mb-3">{qi + 1}. {q.question}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[qi] === oi;
                    const correct = q.answer === oi;
                    const showResult = submitted;
                    let cls = 'glass hover:bg-brand-500/10';
                    if (showResult && correct) cls = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40';
                    else if (showResult && chosen && !correct) cls = 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40';
                    else if (chosen) cls = 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/40';
                    return (
                      <button key={oi} onClick={() => setAnswer(qi, oi)} disabled={submitted}
                        className={`text-left px-3.5 py-2.5 rounded-xl text-sm transition-all flex items-start gap-2 ${cls}`}>
                        {showResult && correct ? <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> : showResult && chosen && !correct ? <XCircle size={16} className="text-rose-500 mt-0.5 shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {submitted && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pl-1 italic">{q.explanation}</p>}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            {!submitted ? <button onClick={submit} disabled={!allAnswered} className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">Submit answers</button>
              : <button onClick={reset} className="btn-outline text-sm">Try again</button>}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4">
          {prev ? <Link to={`/authors/${prev.id}`} className="glass rounded-xl px-4 py-3 hover:shadow-md transition-all flex items-center gap-2 max-w-[48%]"><ArrowLeft size={16} className="text-brand-500 shrink-0" /><span className="min-w-0"><span className="block text-[11px] uppercase tracking-wide text-slate-400">Previous</span><span className="block text-sm font-medium truncate">{prev.fullName}</span></span></Link> : <span />}
          {next ? <Link to={`/authors/${next.id}`} className="glass rounded-xl px-4 py-3 hover:shadow-md transition-all flex items-center gap-2 max-w-[48%] text-right"><span className="min-w-0"><span className="block text-[11px] uppercase tracking-wide text-slate-400">Next</span><span className="block text-sm font-medium truncate">{next.fullName}</span></span><ArrowRight size={16} className="text-brand-500 shrink-0" /></Link> : <span />}
        </div>
      </section>
    </>
  );
}
