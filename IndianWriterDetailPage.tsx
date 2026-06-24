import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Calendar, CheckCircle2, Sparkles,
  Trophy, XCircle, Star, PenLine, Globe, FileText, ListChecks, GraduationCap,
} from 'lucide-react';
import { indianWriters } from '../data/indianWriters';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContext';
import { BookmarkButton } from '../components/BookmarkButton';
import { NotFoundPage } from './NotFoundPage';

export function IndianWriterDetailPage() {
  const { writerId } = useParams();
  const idx = indianWriters.findIndex(w => w.id === writerId);
  const { addQuizResult } = useApp();
  const toast = useToast();
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (idx === -1) return <NotFoundPage />;
  const w = indianWriters[idx];
  const prev = indianWriters[idx - 1];
  const next = indianWriters[idx + 1];

  const setAnswer = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; });
  };
  const submit = () => {
    if (answers.filter(v => v !== null).length < w.mcqs.length) { toast.show('Answer all questions first'); return; }
    setSubmitted(true);
    const computed = answers.reduce<number>((acc, ans, i) => acc + (ans === w.mcqs[i].answer ? 1 : 0), 0);
    const total = w.mcqs.length;
    addQuizResult({ id: `quiz-${Date.now()}`, topic: `${w.fullName} Quiz`, score: computed, total, percentage: Math.round((computed/total)*100), takenAt: Date.now() });
    toast.show(`Quiz complete: ${computed}/${total}`);
  };
  const reset = () => { setAnswers([]); setSubmitted(false); };
  const score = answers.reduce<number>((acc, ans, i) => acc + (ans === w.mcqs[i].answer ? 1 : 0), 0);
  const allAnswered = answers.filter(v => v !== null).length === w.mcqs.length;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${w.accent} opacity-10`} aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link to="/indian-writers" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-pink-600 dark:hover:text-pink-300 transition-colors mb-6"><ArrowLeft size={16} /> All Indian writers</Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${w.accent} grid place-items-center text-white font-serif font-bold text-2xl shadow-xl shrink-0`}>
              {w.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{w.fullName}</h1>
                    {w.isSyllabusWriter && (
                      <span className="chip bg-amber-500/15 text-amber-600 dark:text-amber-300 inline-flex items-center gap-1">
                        <Star size={11} className="fill-amber-400" /> Syllabus
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1"><Calendar size={14} /> {w.lifespan}</span>
                    <span className="chip"><PenLine size={11} /> {w.period}</span>
                    <span className="chip"><Globe size={11} /> {w.language}</span>
                    {w.region && <span className="chip">{w.region}</span>}
                  </div>
                </div>
                <BookmarkButton bookmark={{ id: `indian-writer:${w.id}`, type: 'author', label: w.fullName, href: `/indian-writers/${w.id}` }} />
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {w.categories.map(cat => (
              <span key={cat} className="chip bg-pink-500/10 text-pink-600 dark:text-pink-300">{cat}</span>
            ))}
          </div>
          <Link to={`/notes?topic=${encodeURIComponent(w.fullName)}`} className="mt-6 inline-flex items-center btn-primary text-sm"><Sparkles size={15} /> Generate notes about this writer</Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Biography */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4"><BookOpen size={18} className="text-pink-500" /><h2 className="font-serif text-2xl font-bold">Biography</h2></div>
          <div className="space-y-4">
            {w.bio.map((p, i) => <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">{p}</p>)}
          </div>
        </div>

        {/* Writing Style + Contribution */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3"><PenLine size={18} className="text-pink-500" /><h3 className="font-serif text-xl font-bold">Writing Style</h3></div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{w.writingStyle}</p>
          </div>
          <div className="card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-pink-500/5 to-rose-500/5">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl" aria-hidden />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3"><Award size={18} className="text-pink-500" /><h3 className="font-serif text-xl font-bold">Literary Contribution</h3></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{w.contribution}</p>
            </div>
          </div>
        </div>

        {/* Awards & Themes */}
        <div className="grid gap-6 md:grid-cols-2">
          {w.awards.length > 0 && (
            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3"><Trophy size={18} className="text-amber-500" /><h3 className="font-serif text-xl font-bold">Awards & Achievements</h3></div>
              <ul className="space-y-2">
                {w.awards.map((a, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3"><Sparkles size={18} className="text-pink-500" /><h3 className="font-serif text-xl font-bold">Important Themes</h3></div>
            <div className="flex flex-wrap gap-2">
              {w.themes.map(t => <span key={t} className="chip bg-pink-500/10 text-pink-600 dark:text-pink-300">{t}</span>)}
            </div>
          </div>
        </div>

        {/* Major Works */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4"><BookOpen size={18} className="text-pink-500" /><h2 className="font-serif text-2xl font-bold">Major Works</h2></div>
          <div className="grid sm:grid-cols-2 gap-3">
            {w.majorWorks.map((work, i) => (
              <div key={i} className="glass rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif font-semibold text-slate-800 dark:text-slate-100">{work.title}</h4>
                  <span className="chip shrink-0">{work.type}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{work.year}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Famous works</h4>
            <div className="flex flex-wrap gap-2">{w.famousWorks.map(f => <span key={f} className="chip">{f}</span>)}</div>
          </div>
        </div>

        {/* Short Notes */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4"><FileText size={18} className="text-pink-500" /><h2 className="font-serif text-2xl font-bold">Short Notes (Quick Revision)</h2></div>
          <div className="grid sm:grid-cols-2 gap-3">
            {w.shortNotes.map((n, i) => (
              <div key={i} className="glass rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-500/15 text-pink-600 grid place-items-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                {n}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Study Material */}
        <div className="card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-pink-500/5 to-rose-500/5">
          <div className="flex items-center gap-2 mb-4"><GraduationCap size={18} className="text-pink-500" /><h2 className="font-serif text-2xl font-bold">Detailed Study Material</h2></div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{w.studyMaterial}</p>
        </div>

        {/* Exam Questions */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6"><FileText size={20} className="text-pink-500" /><h2 className="font-serif text-2xl font-bold">Important Exam Questions</h2></div>
          <div className="space-y-5">
            {w.examQuestions.map((q, i) => (
              <div key={i} className="glass rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="font-medium text-slate-800 dark:text-slate-100">{i + 1}. {q.question}</p>
                  <span className="chip shrink-0 bg-pink-500/15 text-pink-600 dark:text-pink-300">{q.marks} marks</span>
                </div>
                <div className="rounded-lg bg-white/60 dark:bg-slate-900/40 p-4 border border-pink-100 dark:border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wide text-pink-500 mb-2">Model Answer</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{q.modelAnswer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MCQ Quiz */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2"><ListChecks size={20} className="text-pink-500" /><h2 className="font-serif text-2xl font-bold">Test your knowledge</h2></div>
            {submitted && <span className="chip bg-pink-500/15 text-pink-600 dark:text-pink-300">Score {score}/{w.mcqs.length}</span>}
          </div>
          <div className="space-y-6">
            {w.mcqs.map((q, qi) => (
              <div key={qi}>
                <p className="font-medium text-slate-800 dark:text-slate-100 mb-3">{qi + 1}. {q.q}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[qi] === oi;
                    const correct = q.answer === oi;
                    let cls = 'glass hover:bg-pink-500/10';
                    if (submitted && correct) cls = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40';
                    else if (submitted && chosen && !correct) cls = 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40';
                    else if (chosen) cls = 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border border-pink-500/40';
                    return (
                      <button key={oi} onClick={() => setAnswer(qi, oi)} disabled={submitted}
                        className={`text-left px-3.5 py-2.5 rounded-xl text-sm transition-all flex items-start gap-2 ${cls}`}>
                        {submitted && correct ? <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> : submitted && chosen && !correct ? <XCircle size={16} className="text-rose-500 mt-0.5 shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5" />}
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

        {/* Prev / Next */}
        <div className="flex items-center justify-between gap-3 pt-4">
          {prev ? <Link to={`/indian-writers/${prev.id}`} className="glass rounded-xl px-4 py-3 hover:shadow-md transition-all flex items-center gap-2 max-w-[48%]"><ArrowLeft size={16} className="text-pink-500 shrink-0" /><span className="min-w-0"><span className="block text-[11px] uppercase tracking-wide text-slate-400">Previous</span><span className="block text-sm font-medium truncate">{prev.fullName}</span></span></Link> : <span />}
          {next ? <Link to={`/indian-writers/${next.id}`} className="glass rounded-xl px-4 py-3 hover:shadow-md transition-all flex items-center gap-2 max-w-[48%] text-right"><span className="min-w-0"><span className="block text-[11px] uppercase tracking-wide text-slate-400">Next</span><span className="block text-sm font-medium truncate">{next.fullName}</span></span><ArrowRight size={16} className="text-pink-500 shrink-0" /></Link> : <span />}
        </div>
      </section>
    </>
  );
}
