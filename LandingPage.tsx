import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, BookOpen, Star, Play, BadgeCheck,
  Quote, GraduationCap, Users, Award, Zap, ChevronRight,
} from 'lucide-react';
import { features, testimonials, subjectHubs } from '../data/site';
import { CreatorFeature } from '../components/CreatorFeature';
import { QuoteOfTheDay } from '../components/QuoteOfTheDay';

const stats = [
  { icon: Users, value: '50K+', label: 'Students learning' },
  { icon: BookOpen, value: '33+', label: 'Studied works' },
  { icon: GraduationCap, value: '4', label: 'Subject Hubs' },
  { icon: Award, value: '4.9/5', label: 'Student rating' },
];

function featureLink(id: string): string {
  return { assistant:'/assistant', notes:'/notes', quiz:'/quiz', terms:'/terms', history:'/history', authors:'/authors', poetry:'/poetry', planner:'/planner', library:'/library' }[id] ?? '/';
}

export function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="absolute inset-0 bg-hero-mesh opacity-80 pointer-events-none" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" aria-hidden />
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl animate-pulse-slow" aria-hidden />
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-royal-500/20 blur-3xl animate-pulse-slow" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs sm:text-sm font-medium text-brand-700 dark:text-brand-200 mb-6 animate-fade-in">
            <Sparkles size={14} /> AI-powered learning for English Literature students
            <span className="hidden sm:inline-flex items-center gap-1 text-brand-500"><ChevronRight size={12} /> Try free</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.05] animate-fade-up">
            Master English Literature with
            <span className="block mt-2 gradient-text gradient-text-animated">your AI study companion</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-up">
            From Old English epics to Postmodern novels — LitMind AI gives Honours students an AI tutor, notes generator, poetry analyser, and curated literary library in one elegant workspace.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up">
            <Link to="/assistant" className="btn-primary text-base px-6 py-3 group">
              <Sparkles size={18} /> Start learning free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/history" className="btn-outline text-base px-6 py-3"><Play size={16} /> Explore the library</Link>
          </div>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto animate-fade-up">
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 hover:-translate-y-1 transition-transform">
                <s.icon size={20} className="text-brand-500 mx-auto" />
                <div className="font-serif text-2xl font-bold mt-2">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 mb-12 text-center animate-fade-up">
        <div className="inline-flex flex-col items-center gap-1 rounded-2xl glass px-6 py-4">
          <p className="font-serif text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            Created by <span className="gradient-text">Jyoti Panchal</span>
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            English Honors Student · Government P.G. College for Women (GPGCW), Rohtak
          </p>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Affiliated to Maharshi Dayanand University (MDU)
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
        <QuoteOfTheDay />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-3"><Zap size={14} /> Everything you need</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">One workspace for all of English Literature</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">Nine focused tools, woven around a curated core of 11 periods, 9 canonical authors and 50+ literary terms.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Link key={f.id} to={featureLink(f.id)} className="group card p-6 relative overflow-hidden hover:-translate-y-1.5 transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${f.color} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity`} aria-hidden />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg mb-4`}>
                <BookOpen size={22} />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-300">Open <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden glass-strong rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-500/10 to-transparent" aria-hidden />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-3"><Sparkles size={14} /> AI Study Assistant</div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight">Ask anything. Get grounded, exam-ready answers.</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">Trained on canonical English literature from Beowulf to Beckett, LitMind AI answers questions on authors, periods, themes, and texts — and remembers your conversation.</p>
              <ul className="mt-5 space-y-2.5">
                {['Grounded in standard Honours-level sources', 'Conversation history saved per session', 'Suggested prompts to get you started', 'Cited examples from canonical works'].map(li => (
                  <li key={li} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"><BadgeCheck size={16} className="text-emerald-500 mt-0.5 shrink-0" />{li}</li>
                ))}
              </ul>
              <Link to="/assistant" className="mt-6 inline-flex items-center btn-primary text-sm"><Sparkles size={15} /> Try the assistant</Link>
            </div>
            <div className="relative">
              <div className="glass rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-slate-400 ml-2">LitMind AI Assistant</span>
                </div>
                <div className="space-y-3">
                  <div className="ml-auto max-w-[80%] bg-brand-500 text-white text-sm rounded-2xl rounded-tr-sm px-3.5 py-2.5">Explain the metaphysical conceit with an example.</div>
                  <div className="max-w-[88%] glass text-sm rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-slate-700 dark:text-slate-200">The <strong>metaphysical conceit</strong> is an extended, surprising comparison across different domains — Donne's parted lovers as compass-legs in "A Valediction: Forbidding Mourning." T. S. Eliot praised its "unified sensibility"…</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" /> LitMind is typing…</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-3"><Star size={14} /> Loved by students</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">From first-years to PhDs</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={t.id} className="card p-6 flex flex-col animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-1 mb-3 text-amber-400">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} className="fill-amber-400" />)}</div>
              <blockquote className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">"{t.text}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} grid place-items-center text-white text-xs font-semibold`}>{t.initials}</div>
                <div><div className="text-sm font-medium">{t.name}</div><div className="text-xs text-slate-500">{t.role}</div></div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-3"><GraduationCap size={14} /> Subject Modules</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">A learning hub for every paper</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">Four dedicated hubs covering British Novel, British Poetry, American Literature, and Communication Skills — with chapter summaries, line-by-line explanations, critical appreciation, MCQs, and university exam questions.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {subjectHubs.map((h, i) => (
            <Link key={h.id} to={h.to} className="group card p-6 hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i*60}ms` }}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${h.accent} flex items-center justify-center text-white shadow-lg mb-4`}><BookOpen size={22} /></div>
              <h3 className="font-serif text-lg font-semibold mb-1">{h.title}</h3>
              <p className="text-xs text-brand-600 dark:text-brand-300 font-medium mb-2">{h.short}</p>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{h.description}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-300">Open hub <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform"/></div>
            </Link>
          ))}
        </div>
      </section>

      <CreatorFeature />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-royal-600 to-accent-600 p-10 sm:p-16 text-center">
          <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse-slow" aria-hidden />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse-slow" aria-hidden />
          <div className="relative">
            <Quote size={32} className="text-white/80 mx-auto mb-4" />
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto">"Some books are to be tasted, others to be swallowed, and some few to be chewed and digested."</h2>
            <p className="text-white/80 mt-4 text-sm">— Francis Bacon, Of Studies</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold shadow-lg hover:-translate-y-0.5 transition-all">Create your free account <ArrowRight size={16} /></Link>
              <Link to="/history" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-medium hover:bg-white/10 transition-all">Browse the library</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
