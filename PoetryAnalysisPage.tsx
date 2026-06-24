import { useState } from 'react';
import { Sparkles, Feather, FileText, Lightbulb, Palette, ScrollText, BookOpen } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LoadingDots } from '../components/Feedback';
import { analyzePoem, type PoemAnalysis } from '../data/content';
import { useToast } from '../components/ToastContext';

const examples = [
  { label: '"I Wandered Lonely as a Cloud" — Wordsworth', text: 'I wandered lonely as a cloud\nThat floats on high o\'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;\nBeside the lake, beneath the trees,\nFluttering and dancing in the breeze.' },
  { label: '"The Rime of the Ancient Mariner" — Coleridge', text: 'Water, water, everywhere,\nAnd all the boards did shrink;\nWater, water, everywhere,\nNor any drop to drink.\nThe very deep did rot: O Christ!\nThat ever this should be!' },
];

export function PoetryAnalysisPage() {
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PoemAnalysis | null>(null);
  const toast = useToast();

  const analyze = (text?: string) => {
    const content = (text ?? poem).trim();
    if (!content) { toast.show('Paste a poem first'); return; }
    if (text) setPoem(text);
    setLoading(true);
    setAnalysis(null);
    setTimeout(() => {
      setAnalysis(analyzePoem(content));
      setLoading(false);
    }, 900);
  };

  return (
    <>
      <PageHeader eyebrow="Tools" title="Poetry Analysis" subtitle="Paste a poem and get a structured close reading — themes, symbols, literary devices, and a summary — to support revision and seminars." icon={Feather} accent="from-violet-500 to-fuchsia-600" />
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Paste your poem</label>
            <textarea value={poem} onChange={e => setPoem(e.target.value)} rows={12} className="input-field resize-none font-serif leading-relaxed" placeholder="The curfew tolls the knell of parting day…" aria-label="Poem text" />
            <button onClick={() => analyze()} disabled={loading || !poem.trim()} className="btn-primary w-full justify-center mt-3 disabled:opacity-50 disabled:cursor-not-allowed"><Sparkles size={15} /> Analyze poem</button>
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-400 mb-2">Or try a sample</p>
              <div className="space-y-2">
                {examples.map(ex => (
                  <button key={ex.label} onClick={() => analyze(ex.text)} className="text-left w-full text-sm glass rounded-xl px-3.5 py-2.5 hover:bg-brand-500/10 transition-colors">{ex.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-h-[400px]">
            {loading && <div className="card p-12 flex flex-col items-center gap-3"><LoadingDots label="Reading the poem closely" /></div>}
            {analysis && !loading && (
              <div className="space-y-4 animate-fade-up">
                <div className="card p-5">
                  <h2 className="font-serif text-xl font-bold mb-1">{analysis.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500"><FileText size={13} /> Close-reading report</div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-3"><Lightbulb size={16} className="text-amber-500" /><h3 className="font-semibold">Themes</h3></div>
                  <div className="space-y-3">
                    {analysis.themes.map((t, i) => (
                      <div key={i}><div className="font-medium text-sm text-brand-700 dark:text-brand-300">{t.theme}</div><p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{t.explanation}</p></div>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-3"><Palette size={16} className="text-rose-500" /><h3 className="font-semibold">Symbols</h3></div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {analysis.symbols.map((s, i) => (
                      <div key={i} className="glass rounded-lg p-3"><div className="font-medium text-sm text-rose-700 dark:text-rose-300">{s.symbol}</div><p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{s.meaning}</p></div>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-3"><ScrollText size={16} className="text-emerald-500" /><h3 className="font-semibold">Literary devices</h3></div>
                  <div className="space-y-2.5">
                    {analysis.devices.map((d, i) => (
                      <div key={i} className="flex gap-2.5"><span className="chip shrink-0 self-start">{d.device}</span><p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{d.example}</p></div>
                    ))}
                  </div>
                </div>

                <div className="card p-5 bg-gradient-to-br from-brand-500/5 to-royal-500/5">
                  <div className="flex items-center gap-2 mb-2"><BookOpen size={16} className="text-brand-500" /><h3 className="font-semibold">Summary</h3></div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            )}
            {!loading && !analysis && (
              <div className="card p-12 text-center h-full flex flex-col items-center justify-center">
                <Feather size={32} className="text-brand-500 mb-3" />
                <h3 className="font-serif text-xl font-semibold mb-2">Analysis appears here</h3>
                <p className="text-sm text-slate-500 max-w-xs">Paste a poem, pick a sample, and LitMind AI will produce a Honours-level close reading.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
