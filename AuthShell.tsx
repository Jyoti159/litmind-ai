import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface AuthShellProps {
  mode: 'login' | 'signup';
}

const perks = [
  'Save notes, quizzes, and bookmarks across devices',
  'Track your study streak and earn achievement badges',
  'Free access to all AI study tools',
];

export function AuthShell({ mode }: AuthShellProps) {
  const isLogin = mode === 'signup' ? false : true;
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || (!isLogin && !form.name)) { toast.show('Please fill in all fields'); return; }
    toast.show(isLogin ? 'Welcome back to LitMind AI' : 'Account created — welcome!');
    setTimeout(() => navigate('/dashboard'), 700);
  };

  return (
    <section className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-royal-500 to-accent-500 grid place-items-center shadow-lg shadow-brand-500/30" />
              <BookOpen size={18} className="absolute inset-0 m-auto text-white" strokeWidth={2.2} />
            </div>
            <div className="font-serif text-lg font-semibold tracking-tight">LitMind <span className="gradient-text">AI</span></div>
          </Link>

          <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-8">{isLogin ? 'Pick up where you left off.' : 'Free forever. No credit card required.'}</p>

          <form onSubmit={submit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Full name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field pl-10" placeholder="Jane Doe" />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field pl-10" placeholder="jane@university.edu" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="input-field pl-10" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full justify-center">{isLogin ? 'Sign in' : 'Create account'} <Sparkles size={15} /></button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            {isLogin ? <>Don't have an account? <Link to="/signup" className="text-brand-600 dark:text-brand-300 font-medium">Sign up free</Link></>
                     : <>Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-300 font-medium">Sign in</Link></>}
          </p>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-brand-600 via-royal-600 to-accent-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse-slow" aria-hidden />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse-slow" aria-hidden />
        <div className="relative max-w-md text-white">
          <BookOpen size={40} className="mb-6" />
          <h2 className="font-serif text-3xl font-bold leading-tight mb-4">Your AI literature tutor, one sign-in away.</h2>
          <p className="text-white/80 leading-relaxed mb-8">Join 50,000+ English Honours students using LitMind AI to revise smarter — from Beowulf to Beckett.</p>
          <ul className="space-y-3">
            {perks.map(p => (
              <li key={p} className="flex items-start gap-2 text-sm text-white/90"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-white" />{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
