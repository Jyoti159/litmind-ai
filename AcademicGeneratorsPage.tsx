import { useState } from 'react';
import {
  Sparkles, Copy, Download, NotebookPen, ListChecks, Files, FileText,
  Presentation, ListFilter, FileQuestion, FileCheck2, Loader2,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Markdown } from '../components/Markdown';
import { useToast } from '../components/ToastContext';
import { generateLLMReply } from '../data/chat';
import { useApp } from '../context/AppContext';

interface Generator {
  id: string;
  label: string;
  icon: typeof FileText;
  color: string;
  promptTemplate: (topic: string, subject?: string) => string;
  description: string;
}

const GENERATORS: Generator[] = [
  {
    id: 'notes',
    label: 'Generate Notes',
    icon: NotebookPen,
    color: 'from-brand-500 to-royal-500',
    description: 'Detailed study notes with headings, examples, and quick-revision bullets.',
    promptTemplate: (t, s = '') => `Generate comprehensive study notes on the topic "${t}"${s ? ` for ${s}` : ''}. Structure the notes with clear headings (##), subheadings (###), bullet points for key concepts, and a "## Quick Revision Summary" section at the end. Include examples and definitions.`,
  },
  {
    id: 'mcqs',
    label: 'Generate MCQs',
    icon: ListChecks,
    color: 'from-amber-500 to-orange-500',
    description: 'Multiple-choice questions with 4 options, answers, and explanations.',
    promptTemplate: (t, s = '') => `Generate 5 multiple-choice questions on "${t}"${s ? ` (subject: ${s})` : ''}. For each question: number it, write the question, list options as A), B), C), D), state the correct answer, and give a 1-2 sentence explanation. Cover a mix of difficulty levels.`,
  },
  {
    id: 'quiz',
    label: 'Generate Quiz',
    icon: Files,
    color: 'from-rose-500 to-pink-500',
    description: 'A full quiz with 8 questions spanning easy to difficult levels.',
    promptTemplate: (t, s = '') => `Create a quiz on "${t}"${s ? ` for ${s}` : ''} with 8 multiple-choice questions graded from Easy to Hard. For each question include: difficulty (Easy/Medium/Hard), the question, 4 options (A-D), the correct answer, and a brief explanation.`,
  },
  {
    id: 'qb',
    label: 'Question Bank',
    icon: ListFilter,
    color: 'from-emerald-500 to-teal-500',
    description: 'A question bank grouped by type: short, long, analytical, MCQs.',
    promptTemplate: (t, s = '') => `Generate a question bank on "${t}"${s ? ` (subject: ${s})` : ''} with at least 10 questions grouped into: Short Answer Questions (2 marks), Long Answer Questions (5-10 marks), Analytical Questions, and 3 MCQs. Label each group with a heading.`,
  },
  {
    id: 'assign',
    label: 'Assignment',
    icon: FileText,
    color: 'from-violet-500 to-fuchsia-500',
    description: 'A structured assignment with instructions, sections, and rubric.',
    promptTemplate: (t, s = '') => `Design a structured academic assignment on "${t}"${s ? ` for ${s}` : ''}. Include: Assignment Title, Objective, Word Count & Format, Sections to Cover (with subheadings), Research Guidance (sources to consult), and a Grading Rubric (criteria + marks). Make it ready-to-distribute.`,
  },
  {
    id: 'pres',
    label: 'Presentation',
    icon: Presentation,
    color: 'from-sky-500 to-blue-500',
    description: 'Slide-by-slide presentation outline with speaker notes.',
    promptTemplate: (t, s = '') => `Create a presentation outline on "${t}"${s ? ` for ${s}` : ''} with 8-10 slides. For each slide give: Slide Title, Key Bullet Points to display, and Speaker Notes (what the presenter should say). Start with a title slide and end with a Q&A slide.`,
  },
  {
    id: 'summary',
    label: 'Summary',
    icon: FileText,
    color: 'from-indigo-500 to-violet-500',
    description: 'One-sentence, one-paragraph, and detailed summaries of the topic.',
    promptTemplate: (t, s = '') => `Summarize the topic "${t}"${s ? ` (specific to ${s})` : ''} in three progressively detailed forms:\n1. **One-sentence summary**\n2. **One-paragraph summary** (~150 words)\n3. **Detailed summary** (~400 words with key points and examples).`,
  },
  {
    id: 'revision',
    label: 'Revision Notes',
    icon: ListFilter,
    color: 'from-fuchsia-500 to-rose-500',
    description: 'Cram-friendly revision notes — short bullets for rapid recall.',
    promptTemplate: (t, s = '') => `Generate last-minute revision notes for "${t}"${s ? ` (${s})` : ''}. Format as dense bullets covering: key terms, definitions, important dates, people, formulas, examples, and common exam pitfalls. End with "## Memory Hacks" using mnemonics if helpful.`,
  },
  {
    id: 'impq',
    label: 'Important Questions',
    icon: FileQuestion,
    color: 'from-amber-500 to-yellow-500',
    description: 'Important exam questions with marks allocation.',
    promptTemplate: (t, s = '') => `List 10 important exam questions on "${t}"${s ? ` (subject: ${s})` : ''}, mixing Short (2 marks), Medium (5 marks) and Long (10/15 marks) questions. Allocate marks, and indicate which 3 are most frequently asked.`,
  },
  {
    id: 'model',
    label: 'Model Answers',
    icon: FileCheck2,
    color: 'from-teal-500 to-cyan-500',
    description: 'University-level model answers to specific exam questions.',
    promptTemplate: (t, s = '') => `Write a university-level model answer for the following exam question: "${t}".${s ? ` Subject: ${s}.` : ''} Structure the answer as: Introduction · Body (2-3 themed paragraphs with evidence/examples) · Conclusion · Exam Tips. Target length ~500-700 words. Use headings and bullet points where useful.`,
  },
];

export function AcademicGeneratorsPage() {
  const toast = useToast();
  const { addSavedNote } = useApp();
  const [activeId, setActiveId] = useState<string>('notes');
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const active = GENERATORS.find(g => g.id === activeId)!;

  const run = async () => {
    if (!topic.trim()) { toast.show('Enter a topic first'); return; }
    setLoading(true); setOutput('');
    try {
      const prompt = active.promptTemplate(topic.trim(), subject.trim() || undefined);
      const reply = await generateLLMReply([{ role: 'user', content: prompt }], 'detailed');
      setOutput(reply.text);
    } catch {
      toast.show('Generation failed. Please try again.');
    } finally { setLoading(false); }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(output); toast.show('Copied to clipboard'); }
    catch { toast.show('Copy failed'); }
  };

  const download = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${active.id}-${topic.trim().replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.show('Downloaded');
  };

  const save = () => {
    addSavedNote({
      id: `gen-${Date.now()}`,
      title: `${active.label}: ${topic.trim().slice(0, 60)}`,
      body: output,
      type: 'detailed',
      createdAt: Date.now(),
    });
    toast.show('Saved to your notes');
  };

  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="AI Academic Generators"
        subtitle="Generate notes, MCQs, quizzes, question banks, assignments, presentations, summaries, revision notes, important questions, and model answers in seconds."
        icon={Sparkles}
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Generator menu */}
          <aside>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {GENERATORS.map(g => {
                const Icon = g.icon;
                const isActive = g.id === activeId;
                return (
                  <button
                    key={g.id}
                    onClick={() => { setActiveId(g.id); setOutput(''); }}
                    className={`group text-left flex items-start gap-3 p-3 rounded-xl border transition-all ${isActive ? 'glass-strong border-brand-500/40 shadow-md' : 'glass border-transparent hover:bg-brand-500/5'}`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${g.color} grid place-items-center text-white shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold leading-tight">{g.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug hidden lg:block">{g.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Active generator */}
          <div className="space-y-4">
            <div className="card p-5 sm:p-6">
              <h2 className="font-serif text-xl font-bold mb-1">{active.label}</h2>
              <p className="text-sm text-slate-500 mb-4">{active.description}</p>

              <div className="grid sm:grid-cols-[1fr_200px_auto] gap-2.5 items-end">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">Topic</label>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && run()}
                    placeholder={active.id === 'model' ? 'Paste an exam question here…' : 'e.g., Romantic Poetry / Photosynthesis / Shakespeare'}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">Subject (optional)</label>
                  <input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && run()}
                    placeholder="e.g., English Lit / Physics"
                    className="input-field"
                  />
                </div>
                <button
                  onClick={run}
                  disabled={loading || !topic.trim()}
                  className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed h-[44px]"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Generate
                </button>
              </div>
            </div>

            {/* Output panel */}
            {loading ? (
              <div className="card p-12 flex flex-col items-center gap-3 text-slate-500">
                <Loader2 size={28} className="animate-spin text-brand-500" />
                <p className="text-sm">Generating your {active.label.toLowerCase()}…</p>
              </div>
            ) : output ? (
              <div className="card p-5 sm:p-7">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="font-serif font-semibold text-slate-800 dark:text-slate-100">Output</h3>
                  <div className="flex gap-1.5">
                    <button onClick={copy} className="btn-ghost text-xs px-3 py-1.5"><Copy size={13} /> Copy</button>
                    <button onClick={download} className="btn-ghost text-xs px-3 py-1.5"><Download size={13} /> Download</button>
                    <button onClick={save} className="btn-ghost text-xs px-3 py-1.5"><NotebookPen size={13} /> Save to Notes</button>
                  </div>
                </div>
                <div className="prose-sm max-w-none">
                  <Markdown text={output} />
                </div>
              </div>
            ) : (
              <div className="card p-10 text-center text-slate-400">
                <active.icon size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Enter your topic above and hit Generate to create {active.label.toLowerCase()}.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
