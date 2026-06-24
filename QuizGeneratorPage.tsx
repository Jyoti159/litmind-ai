import { useState } from 'react';
import { ListChecks, Trophy, CheckCircle2, XCircle, ChevronRight, Award, Sparkles, Layers } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LoadingDots } from '../components/Feedback';
import { quizTopics, buildQuiz, resetTopic, availableCount, type MCQ, type Difficulty } from '../data/quiz';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContext';

const DIFFICULTIES: (Difficulty | 'Mixed')[] = ['Easy', 'Medium', 'Hard', 'Mixed'];
const QUESTION_COUNTS = [5, 8, 10];

const diffChipClasses: Record<string, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  Medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  Hard: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  Mixed: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
};

export function QuizGeneratorPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | 'Mixed'>('Mixed');
  const [count, setCount] = useState<number>(5);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { addQuizResult, quizResults } = useApp();
  const toast = useToast();

  const start = (topicId: string) => {
    setSelected(topicId);
    setLoading(true);
    setQuestions([]);
    setAnswers([]);
    setSubmitted(false);
    setTimeout(() => {
      const qs = buildQuiz(topicId, count, difficulty);
      setQuestions(qs);
      setAnswers(new Array(qs.length).fill(null));
      setLoading(false);
      setAttempt(a => a + 1);
    }, 650);
  };

  const selectAnswer = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; });
  };

  const submit = () => {
    if (answers.some(a => a === null)) { toast.show('Answer all questions first'); return; }
    setSubmitted(true);
    const topic = quizTopics.find(t => t.id === selected)?.label ?? 'Quiz';
    const computed = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].answer ? 1 : 0), 0);
    const total = questions.length;
    addQuizResult({ id: `quiz-${Date.now()}`, topic, score: computed, total, percentage: Math.round((computed/total)*100), takenAt: Date.now() });
    toast.show(`Quiz complete: ${computed}/${total}`);
  };

  const reset = () => {
    if (selected) resetTopic(selected);
    setQuestions([]); setAnswers([]); setSubmitted(false); setSelected(null); setAttempt(0);
  };

  const retry = () => {
    if (selected) {
      setLoading(true);
      setQuestions([]); setAnswers([]); setSubmitted(false);
      setTimeout(() => {
        const qs = buildQuiz(selected, count, difficulty);
        setQuestions(qs);
        setAnswers(new Array(qs.length).fill(null));
        setLoading(false);
        setAttempt(a => a + 1);
      }, 600);
    }
  };

  const score = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].answer ? 1 : 0), 0);
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const avgScore = quizResults.length ? Math.round(quizResults.reduce((s, r) => s + r.percentage, 0) / quizResults.length) : 0;

  return (
    <>
      <PageHeader eyebrow="Tools" title="Quiz Generator" subtitle="Topic-specific quizzes with randomized questions and answer options. New questions every attempt — Easy, Medium, Hard, or Mixed difficulty." icon={ListChecks} />
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Progress dashboard strip */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="card p-4 text-center"><div className="font-serif text-2xl font-bold text-brand-600 dark:text-brand-300">{quizResults.length}</div><div className="text-[11px] uppercase tracking-wide text-slate-500">Quizzes taken</div></div>
          <div className="card p-4 text-center"><div className="font-serif text-2xl font-bold text-amber-600">{avgScore}%</div><div className="text-[11px] uppercase tracking-wide text-slate-500">Avg. score</div></div>
          <div className="card p-4 text-center"><div className="font-serif text-2xl font-bold text-emerald-600">{quizResults.filter(r => r.percentage >= 80).length}</div><div className="text-[11px] uppercase tracking-wide text-slate-500">Passed (80%+)</div></div>
        </div>

        {!selected && (
          <div>
            {/* Difficulty + count selectors */}
            <div className="card p-5 mb-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 block">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map(d => (
                    <button key={d} onClick={() => setDifficulty(d)} className={`chip px-3 py-1.5 transition-all ${difficulty === d ? 'bg-gradient-to-r from-brand-600 to-royal-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 block">Questions per quiz</label>
                <div className="flex flex-wrap gap-2">
                  {QUESTION_COUNTS.map(n => (
                    <button key={n} onClick={() => setCount(n)} className={`chip px-3 py-1.5 transition-all ${count === n ? 'bg-gradient-to-r from-brand-600 to-royal-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
                      {n} questions
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="font-serif text-xl font-semibold mb-4">Pick a topic to begin</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {quizTopics.map(t => {
                const avail = availableCount(t.id, difficulty);
                return (
                  <button key={t.id} onClick={() => start(t.id)} className="card p-5 text-left hover:-translate-y-1 transition-all flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-serif font-semibold text-slate-800 dark:text-slate-100">{t.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">{t.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`chip ${diffChipClasses[t.defaultDifficulty]}`}>{t.defaultDifficulty}</span>
                        <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-500"><Sparkles size={11} /> {avail} in bank</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-brand-500 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading && <div className="card p-12 flex flex-col items-center gap-3"><LoadingDots label="Building quiz" /></div>}

        {selected && !loading && questions.length > 0 && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold">{quizTopics.find(t => t.id === selected)?.label}</h2>
                <p className="text-xs text-slate-500">
                  Attempt #{attempt} · {questions.length} questions · {difficulty === 'Mixed' ? 'Mixed difficulty' : difficulty}
                </p>
              </div>
              {submitted && (
                <div className="text-right">
                  <div className={`font-serif text-3xl font-bold ${pct >= 80 ? 'text-emerald-500' : pct >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{pct}%</div>
                  <div className="text-xs text-slate-500">{score}/{questions.length} correct</div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {questions.map((q, qi) => (
                <div key={qi} className="card p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="font-medium text-slate-800 dark:text-slate-100">{qi + 1}. {q.q}</p>
                    <span className={`chip shrink-0 ${diffChipClasses[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => {
                      const chosen = answers[qi] === oi;
                      const correct = q.answer === oi;
                      let cls = 'glass hover:bg-brand-500/10';
                      if (submitted && correct) cls = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40';
                      else if (submitted && chosen && !correct) cls = 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40';
                      else if (chosen) cls = 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/40';
                      return (
                        <button key={oi} onClick={() => selectAnswer(qi, oi)} disabled={submitted} className={`text-left px-3.5 py-2.5 rounded-xl text-sm transition-all flex items-start gap-2 ${cls}`}>
                          {submitted && correct ? <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> : submitted && chosen && !correct ? <XCircle size={16} className="text-rose-500 mt-0.5 shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5" />}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {submitted && <div className="mt-3 glass rounded-lg p-3 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2"><Award size={14} className="text-brand-500 mt-0.5 shrink-0" /><span><strong className="text-slate-700 dark:text-slate-200">Explanation: </strong>{q.explanation}</span></div>}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {!submitted ? <button onClick={submit} className="btn-primary text-sm"><Trophy size={15} /> Submit answers</button>
                          : <button onClick={retry} className="btn-primary text-sm"><Sparkles size={15} /> Try new questions</button>}
              {submitted && <button onClick={reset} className="btn-secondary text-sm"><Layers size={15} /> Change topic</button>}
              <button onClick={reset} className="btn-ghost text-sm">Reset</button>
            </div>

            {submitted && (
              <div className="mt-4 card p-4 text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                <Sparkles size={16} className="text-brand-500 mt-0.5 shrink-0" />
                <span>Questions and options are shuffled on every attempt — no two quizzes are identical. Click <strong>Try new questions</strong> for a fresh set from the topic bank. Unlimited attempts.</span>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
