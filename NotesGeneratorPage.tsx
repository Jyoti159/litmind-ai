import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { NotebookPen, Sparkles, Copy, Download, Save, FileText, ListChecks, GraduationCap } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LoadingDots } from '../components/Feedback';
import { generateNotesFull, type GeneratedNote } from '../data/content';
import { generateLLMReply } from '../data/chat';
import { Markdown } from '../components/Markdown';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContext';

type NoteType = 'short' | 'detailed' | 'exam';
const types: { id: NoteType; label: string; icon: typeof FileText; desc: string }[] = [
  { id: 'short', label: 'Short Notes', icon: FileText, desc: 'A tight, exam-night summary.' },
  { id: 'detailed', label: 'Detailed Notes', icon: ListChecks, desc: 'Full Honours-level depth.' },
  { id: 'exam', label: 'Exam-Oriented', icon: GraduationCap, desc: 'Bullet points for fast recall.' },
];

const suggestions = ['Shakespeare tragedies', 'Romanticism', 'Paradise Lost', 'Modernism', 'Metaphysical poetry', 'Victorian novel', 'Chaucer'];

export function NotesGeneratorPage() {
  const [params] = useSearchParams();
  const [topic, setTopic] = useState(params.get('topic') ?? '');
  const [type, setType] = useState<NoteType>('detailed');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ note: GeneratedNote; type: NoteType } | null>(null);
  const { addSavedNote } = useApp();
  const toast = useToast();

  useEffect(() => {
    const t = params.get('topic');
    if (t) { setTopic(t); generate(t, type); }
  }, [params]);

  const [llmText, setLlmText] = useState<string | null>(null);
  const generate = async (t: string, ty: NoteType) => {
    if (!t.trim()) { toast.show('Enter a topic first'); return; }
    setLoading(true);
    setResult(null);
    setLlmText(null);
    // Try LLM first; fall back to curated local content on any error.
    const mode = ty === 'exam' ? 'exam' : ty === 'short' ? 'short' : 'detailed';
    try {
      const prompt = `Generate ${ty} notes on the topic "${t.trim()}". Use clear headings, bullet points, examples, and end with a "## Quick Revision" section.`;
      const reply = await generateLLMReply([{ role: 'user', content: prompt }], mode as any);
      setLlmText(reply.text);
    } catch {
      setLlmText(null);
    }
    // Also produce the structured local note for the chip / export fallback.
    const full = generateNotesFull(t.trim());
    const note = full[ty];
    setResult({ note, type: ty });
    setLoading(false);
  };

  const copy = async () => {
    if (!result) return;
    const baseText = result.note.bullets.length ? `${result.note.title}\n\n${result.note.bullets.map(b => `• ${b}`).join('\n')}` : result.note.body;
    const text = llmText ? `${llmText}\n\n---\n\n${baseText}` : baseText;
    try { await navigator.clipboard.writeText(text); toast.show('Copied to clipboard'); } catch { toast.show('Copy failed — select and copy manually'); }
  };

  const download = () => {
    if (!result) return;
    const text = result.note.bullets.length ? `${result.note.title}\n\n${result.note.bullets.map(b => `- ${b}`).join('\n')}` : `# ${result.note.title}\n\n${result.note.body}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.note.title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.show('Downloaded as Markdown');
  };

  const save = () => {
    if (!result) return;
    addSavedNote({ id: `note-${Date.now()}`, title: result.note.title, body: result.note.bullets.length ? result.note.bullets.map(b => `• ${b}`).join('\n') : result.note.body, type: result.type, createdAt: Date.now() });
    toast.show('Saved to your dashboard');
  };

  return (
    <>
      <PageHeader eyebrow="Tools" title="AI Notes Generator" subtitle="Enter any literature topic and generate Short, Detailed, or Exam-Oriented notes — copy, download, or save to your dashboard." icon={NotebookPen} />
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="card p-6 sm:p-8 mb-6">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Topic</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate(topic, type)} className="input-field flex-1 text-base" placeholder="e.g. Renaissance drama, Romanticism, T. S. Eliot…" aria-label="Notes topic" />
            <button onClick={() => generate(topic, type)} disabled={loading || !topic.trim()} className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed justify-center"><Sparkles size={15} /> Generate</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suggestions.map(s => (
              <button key={s} onClick={() => { setTopic(s); generate(s, type); }} className="chip cursor-pointer hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">{s}</button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {types.map(t => (
            <button key={t.id} onClick={() => setType(t.id)} disabled={loading} className={`card p-4 text-left transition-all ${type === t.id ? 'ring-2 ring-brand-500 shadow-lg' : 'hover:-translate-y-0.5'}`}>
              <div className="flex items-center gap-2 mb-1"><t.icon size={16} className="text-brand-500" /><span className="font-medium text-sm">{t.label}</span></div>
              <p className="text-xs text-slate-500">{t.desc}</p>
              {type === t.id && <div className="mt-2 text-[11px] font-medium text-brand-600 dark:text-brand-300">Selected</div>}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {loading && <div className="card p-10 flex flex-col items-center gap-3"><LoadingDots label="Generating notes" /></div>}
          {result && !loading && (
            <div className="card p-6 sm:p-8 animate-fade-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h2 className="font-serif text-2xl font-bold">{result.note.title}</h2>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={copy} className="btn-ghost text-xs"><Copy size={14} /> Copy</button>
                  <button onClick={download} className="btn-ghost text-xs"><Download size={14} /> Download</button>
                  <button onClick={save} className="btn-primary text-xs py-1.5"><Save size={14} /> Save</button>
                </div>
              </div>
              {llmText && (
                <div className="mb-5 pb-5 border-b border-slate-200/50 dark:border-slate-800/50">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-500 mb-2">AI-Powered Detailed Notes</div>
                  <Markdown text={llmText} />
                </div>
              )}
              {result.note.bullets.length ? (
                <ul className="space-y-2.5">
                  {result.note.bullets.map((b, i) => <li key={i} className="flex gap-2.5 text-slate-700 dark:text-slate-300 leading-relaxed"><span className="text-brand-500 font-bold shrink-0">•</span><span>{b}</span></li>)}
                </ul>
              ) : (
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{result.note.body}</p>
              )}
              <p className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">LitMind AI · Generated from curated academic content. Cross-check with prescribed texts before exams. <Link to="/dashboard" className="text-brand-500 hover:underline">View saved notes</Link></p>
            </div>
          )}
          {!loading && !result && (
            <div className="card p-12 text-center">
              <NotebookPen size={32} className="text-brand-500 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-semibold mb-2">Your notes will appear here</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">Enter a topic above, choose a note type, and let LitMind AI draft revision notes grounded in the canon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
