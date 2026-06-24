import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, FileText, Clock, Sparkles, BookOpen, ListChecks,
  ChevronDown, Lightbulb, Award, Target,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { novels } from '../data/subjects/novels';
import { poems } from '../data/subjects/poetry';
import { americanAll } from '../data/subjects/index';
import { quizBank } from '../data/quiz';

// Pull together all exam questions across the subject works
function gatherExamMaterial() {
  const all = [...novels, ...poems, ...americanAll];
  return all.flatMap(w => w.examQuestions.map(q => ({ ...q, work: w.title, author: w.author, hub: w.hub })));
}

const shortNotes = [
  { id: 'sn1', title: 'The metaphysical conceit (Donne)', body: 'Donne\'s "A Valediction: Forbidding Mourning" compares parted lovers to the legs of a compass — a sustained, surprising comparison across different domains. The key is the yoking of dissimilar things; Samuel Johnson coined "metaphysical poets" in his Life of Cowley (1781); T. S. Eliot praised their "unified sensibility" in "The Metaphysical Poets" (1921).', work: 'A Valediction: Forbidding Mourning', marks: '5' },
  { id: 'sn2', title: 'The First Folio of Shakespeare (1623)', body: "The First Folio (Mr. William Shakespeares Comedies, Histories, & Tragedies) was compiled by actors John Heminges and Henry Condell in 1623, seven years after Shakespeare's death. It preserved 36 plays (Pericles included; no Two Noble Kinsmen) and is the foundational text of the dramatic canon. Without it, ~18 plays including Macbeth and The Tempest might have been lost.", work: 'Shakespeare', marks: '5' },
  { id: 'sn3', title: 'Pantisocracy', body: 'Coleridge and Southey\'s 1794 utopian plan to found a community on the banks of the Susquehanna River in Pennsylvania, based on communal property, equal education, and radical politics. The plan collapsed for want of funds; the two poets went on to collaborate on Lyrical Ballads (1798) instead.', work: 'Coleridge', marks: '5' },
  { id: 'sn4', title: 'The "transparent eyeball" (Emerson)', body: "In Emerson's Nature (1836), the speaker on the common becomes 'a transparent eyeball; I am nothing; I see all; the currents of the Universal Being circulate through me.' The image enacts the dissolution of the ego into universal being and is the emblem of American Transcendentalism's Over-Soul doctrine.", work: 'Nature', marks: '5' },
  { id: 'sn5', title: 'Negative Capability (Keats)', body: "In his letter to George and Tom Keats (December 1817), Keats defines negative capability as 'when a man is capable of being in uncertainties, mysteries, doubts, without any irritable reaching after fact and reason.' The poet holds contradictions open rather than resolving them; foundational to Romantic aesthetics.", work: 'Keats', marks: '5' },
  { id: 'sn6', title: 'Hemingway\'s Iceberg Theory', body: "Hemingway's theory of omission (formulated in Death in the Afternoon, 1932): the dignity of movement of an iceberg is due to only one-eighth of it being above water. What is omitted is present in its absence; the unsaid carries the moral weight. Most fully exemplified in The Old Man and the Sea (1952).", work: 'The Old Man and the Sea', marks: '5' },
];

const revisionGuides = [
  { title: 'British Lit Periods Timeline (450-2024)', body: 'One-page folding timeline of all 11 literary periods with anchor dates: 1066 (Norman Conquest), 1340 (Chaucer), 1599 (Globe), 1660 (Restoration), 1798 (Lyrical Ballads), 1837 (Victoria), 1922 (Waste Land & Ulysses).' , href:'/history'},
  { title: 'Romantic Poetry Quick Revision', body: 'A summary sheet of the Big Six Romantic poets with their major works, key critical concepts (negative capability, primary imagination), and one-line summaries of the most-tested poems.', href:'/subjects/poetry' },
  { title: 'English Novelists at a Glance', body: 'Behn → Defoe → Fielding → Austen → Shelley → Brontë → Scott → Forster — one-line summaries and publication dates.' , href:'/subjects/novel'},
  { title: 'Modernism Quick Reference', body: 'Eliot, Joyce, Woolf, Yeats, Lawrence — key texts (1922 in particular), the mythic method, stream of consciousness, impersonality.' , href:'/history/modern'},
  { title: 'American Literature Map', body: 'Emerson, Twain, Chopin, O. Henry, Dickinson, Whitman, Hemingway — schools (Transcendentalism, Realism, Modernism) and key works mapped.' , href:'/subjects/american'},
  { title: 'Literary Terms Glossary', body: '50+ literary terms with examples from canonical works — the most-tested vocabulary for Honours and competitive exams.' , href:'/terms'},
];

export function ExamCenterPage() {
  const [filter, setFilter] = useState<'all' | 'novel' | 'poetry' | 'american'>('all');
  const [openQ, setOpenQ] = useState<string | null>(null);
  const examMaterial = useMemo(gatherExamMaterial, []);
  const longAnswers = examMaterial.filter(q => q.type === 'long');
  const filtered = filter === 'all' ? longAnswers : longAnswers.filter(q => q.hub === filter);

  const lastMinute = [
    'Memorise the publication dates and authors of the core texts — examiners reward specificity.',
    'For long answers, always structure: Introduction → Historical Context → Themes → Literary Devices → Critical Views → Conclusion → Exam Tips.',
    'Quote 2-3 short, accurate quotations per text — they show genuine familiarity.',
    'Know at least two critical positions per text (e.g. Watt + Said for Crusoe; Mellor + Baldick for Frankenstein).',
    'Practise 5-mark short notes — 80-100 words each — on the metaphysical conceit, the First Folio, Pantisocracy, the "transparent eyeball", negative capability, and the iceberg theory.',
    'Time-box the exam: 5 minutes planning, 25 minutes writing per long answer, 5 minutes per short note.',
  ];

  return (
    <>
      <PageHeader
        eyebrow="Exam Prep"
        title="Exam Preparation Center"
        subtitle="Previous year questions, model long answers, short notes, revision guides, and last-minute preparation notes — concentrated exam prep across all subject hubs."
        icon={GraduationCap}
        accent="from-brand-500 to-royal-600"
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { icon: ListChecks, label: 'Long Answer Questions', value: examMaterial.filter(q => q.type === 'long').length, color: 'from-brand-500 to-royal-500' },
            { icon: FileText, label: 'Short Notes', value: shortNotes.length, color: 'from-emerald-500 to-teal-500' },
            { icon: Clock, label: 'Quick MCQs', value: quizBank.length, color: 'from-amber-500 to-orange-500' },
            { icon: BookOpen, label: 'Revision Guides', value: revisionGuides.length, color: 'from-rose-500 to-pink-500' },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center text-white mb-3`}><s.icon size={18} /></div>
              <div className="font-serif text-2xl font-bold">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Long answers */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-2"><Award size={18} className="text-brand-500" /><h2 className="font-serif text-2xl font-bold">Most Important Questions</h2></div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'novel', 'poetry', 'american'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`chip cursor-pointer transition-colors ${filter === f ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  {f === 'all' ? 'All' : f === 'novel' ? 'British Novel' : f === 'poetry' ? 'British Poetry' : 'American Lit'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filtered.slice(0, 16).map((q, i) => {
              const id = `q-${i}`;
              const isOpen = openQ === id;
              return (
                <div key={id} className="card overflow-hidden">
                  <button onClick={() => setOpenQ(isOpen ? null : id)} className="w-full flex items-center justify-between gap-3 p-5 hover:bg-brand-500/5 transition-colors text-left">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="chip text-[10px]">{q.marks} marks</span>
                        <span className="chip text-[10px]">{q.work}</span>
                      </div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">{q.q}</p>
                    </div>
                    <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-200/50 dark:border-slate-800/50 pt-4 animate-fade-in">
                      <p className="text-xs uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-300 mb-3">Model Answer</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{q.modelAnswer}</p>
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-center text-sm text-slate-500 py-10">No long answers match this filter.</p>}
          </div>
        </div>

        {/* Short notes */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5"><Lightbulb size={18} className="text-amber-500" /><h2 className="font-serif text-2xl font-bold">Short Notes</h2></div>
          <div className="grid sm:grid-cols-2 gap-4">
            {shortNotes.map(s => (
              <div key={s.id} className="card p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-serif font-semibold">{s.title}</h3>
                  <span className="chip shrink-0">{s.marks} marks</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{s.body}</p>
                <p className="text-xs text-slate-500 mt-2">Related: {s.work}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revision guides */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5"><BookOpen size={18} className="text-emerald-500" /><h2 className="font-serif text-2xl font-bold">Revision Guides</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {revisionGuides.map((g, i) => (
              <Link key={i} to={g.href} className="card p-5 hover:-translate-y-1 transition-all group">
                <BookOpen size={20} className="text-brand-500 mb-2" />
                <h3 className="font-serif font-semibold mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">{g.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{g.body}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Last minute */}
        <div className="card p-6 sm:p-8 bg-gradient-to-br from-brand-500/5 to-royal-500/5">
          <div className="flex items-center gap-2 mb-5"><Target size={18} className="text-rose-500" /><h2 className="font-serif text-2xl font-bold">Last-Minute Preparation Notes</h2></div>
          <ul className="space-y-3">
            {lastMinute.map((tip, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-6 h-6 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300 grid place-items-center font-bold text-xs shrink-0">{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link to="/assistant" className="btn-primary text-sm inline-flex"><Sparkles size={15} /> Ask the AI tutor for a custom answer</Link>
          <p className="text-xs text-slate-400 mt-2">Stuck on a question? Just ask!</p>
        </div>
      </section>
    </>
  );
}
