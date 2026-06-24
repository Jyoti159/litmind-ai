import { useState, useMemo } from 'react';
import { CalendarCheck, Flame, Clock, CheckCircle2, Plus, Target, TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContext';

interface Task { id: string; label: string; day: string; time?: string; }
const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const seedTasks: Task[] = [
  { id: 't1', label: 'Revise Romantic odes (Keats)', day: 'Mon', time: '09:00' },
  { id: 't2', label: 'Read Hamlet Act III', day: 'Mon', time: '17:00' },
  { id: 't3', label: 'Literary terms flashcards', day: 'Tue', time: '10:00' },
  { id: 't4', label: 'Chaucer — General Prologue', day: 'Wed', time: '09:00' },
  { id: 't5', label: 'Quiz: Modernist Literature', day: 'Wed', time: '20:00' },
  { id: 't6', label: 'Notes: Victorian novel', day: 'Thu', time: '16:00' },
  { id: 't7', label: 'Poetry analysis prep', day: 'Fri', time: '14:00' },
  { id: 't8', label: 'Past papers: Modernism', day: 'Sat', time: '10:00' },
];

export function StudyPlannerPage() {
  const { completedToday, toggleTaskToday, studyStreak } = useApp();
  const toast = useToast();
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [view, setView] = useState<'week' | 'day'>('week');
  const [examDate, setExamDate] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newDay, setNewDay] = useState('Mon');

  const countdown = useMemo(() => {
    if (!examDate) return null;
    const days = Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000);
    return days >= 0 ? days : null;
  }, [examDate]);

  const addTask = () => {
    if (!newLabel.trim()) return;
    setTasks(t => [...t, { id: `t-${Date.now()}`, label: newLabel.trim(), day: newDay }]);
    setNewLabel('');
    toast.show('Task added to planner');
  };

  const todays = tasks.filter(t => t.day === 'Mon');

  return (
    <>
      <PageHeader eyebrow="Tools" title="Study Planner" subtitle="Daily and weekly planner, exam countdown, and a progress dashboard. Build the revision habit that wins exams." icon={CalendarCheck} accent="from-sky-500 to-indigo-600" />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Top stats */}
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="card p-5 flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-orange-500/15 text-orange-600 grid place-items-center"><Flame size={20} /></div><div><div className="font-serif text-2xl font-bold">{studyStreak}</div><div className="text-[11px] uppercase tracking-wide text-slate-500">Day streak</div></div></div>
          <div className="card p-5 flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 grid place-items-center"><CheckCircle2 size={20} /></div><div><div className="font-serif text-2xl font-bold">{completedToday.length}</div><div className="text-[11px] uppercase tracking-wide text-slate-500">Tasks today</div></div></div>
          <div className="card p-5 flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-brand-500/15 text-brand-600 grid place-items-center"><Target size={20} /></div><div><div className="font-serif text-2xl font-bold">{countdown ?? '—'}</div><div className="text-[11px] uppercase tracking-wide text-slate-500">Days to exam</div></div></div>
        </div>

        {/* Exam countdown */}
        <div className="card p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Clock size={18} className="text-brand-500" /><h3 className="font-semibold">Exam countdown</h3></div>
            <div className="flex items-center gap-2">
              <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="input-field py-2 w-auto" aria-label="Exam date" />
              {countdown !== null && <span className="chip bg-brand-500/15 text-brand-600 dark:text-brand-300">{countdown} day{countdown === 1 ? '' : 's'} to go</span>}
            </div>
          </div>
        </div>

        {/* Add task */}
        <div className="card p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} className="input-field flex-1" placeholder="Add a study task…" aria-label="New task label" />
            <select value={newDay} onChange={e => setNewDay(e.target.value)} className="input-field sm:w-32" aria-label="Task day">
              {weekDays.map(d => <option key={d}>{d}</option>)}
            </select>
            <button onClick={addTask} className="btn-primary text-sm justify-center"><Plus size={15} /> Add task</button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setView('day')} className={`chip cursor-pointer ${view === 'day' ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300' : ''}`}>Today</button>
          <button onClick={() => setView('week')} className={`chip cursor-pointer ${view === 'week' ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300' : ''}`}>Week</button>
        </div>

        {view === 'day' ? (
          <div className="card p-5">
            <h3 className="font-serif text-lg font-semibold mb-4">Today's plan</h3>
            <div className="space-y-2">
              {todays.map(t => {
                const done = completedToday.includes(t.id);
                return (
                  <button key={t.id} onClick={() => { toggleTaskToday(t.id); toast.show(done ? 'Marked incomplete' : 'Task complete'); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${done ? 'bg-emerald-500/10 line-through text-slate-400' : 'glass hover:bg-brand-500/5'}`}>
                    <span className={`w-5 h-5 rounded-md border-2 grid place-items-center shrink-0 ${done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>{done && <CheckCircle2 size={14} className="text-white" />}</span>
                    <span className="flex-1 text-sm">{t.label}</span>
                    {t.time && <span className="text-xs text-slate-500">{t.time}</span>}
                  </button>
                );
              })}
              {todays.length === 0 && <p className="text-sm text-slate-500 text-center py-6">No tasks for today. Add one above.</p>}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {weekDays.map(day => {
              const dayTasks = tasks.filter(t => t.day === day);
              return (
                <div key={day} className="glass rounded-2xl p-3 min-h-[180px]">
                  <div className="flex items-center justify-between mb-2"><span className="font-semibold text-sm">{day}</span><span className="text-[10px] text-slate-400">{dayTasks.length}</span></div>
                  <div className="space-y-1.5">
                    {dayTasks.map(t => {
                      const done = completedToday.includes(t.id);
                      return (
                        <button key={t.id} onClick={() => { toggleTaskToday(t.id); toast.show(done ? 'Marked incomplete' : 'Task complete'); }}
                          className={`w-full text-left text-xs p-2 rounded-lg transition-all ${done ? 'bg-emerald-500/10 line-through text-slate-400' : 'bg-white/60 dark:bg-slate-800/50 hover:bg-brand-500/10'}`}>
                          {t.time && <div className="text-[10px] text-brand-500 font-medium">{t.time}</div>}
                          {t.label}
                        </button>
                      );
                    })}
                    {dayTasks.length === 0 && <p className="text-[11px] text-slate-400 text-center py-4">No tasks</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Progress dashboard */}
        <div className="card p-6 mt-8">
          <div className="flex items-center gap-2 mb-4"><TrendingUp size={18} className="text-brand-500" /><h3 className="font-semibold">Progress dashboard</h3></div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1"><span>This week's completion</span><span>{Math.round((completedToday.length / Math.max(tasks.length, 1)) * 100)}%</span></div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-brand-500 to-royal-500 transition-all" style={{ width: `${(completedToday.length / Math.max(tasks.length, 1)) * 100}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Study streak target (7 days)</span><span>{Math.min(studyStreak, 7)}/7</span></div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all" style={{ width: `${(Math.min(studyStreak, 7) / 7) * 100}%` }} /></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
