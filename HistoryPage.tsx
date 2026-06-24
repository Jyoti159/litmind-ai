import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, Clock, Users, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { literaturePeriods } from '../data/literaturePeriods';

const filterChips = ['All', 'Old English', 'Middle', 'Renaissance', 'Augustan', 'Romantic', 'Victorian', 'Modern'];

function matchesFilter(p: typeof literaturePeriods[number], f: string): boolean {
  if (f === 'All') return true;
  const name = p.name.toLowerCase();
  if (f === 'Old English') return name.includes('old english');
  if (f === 'Middle') return name.includes('middle');
  if (f === 'Renaissance') return name.includes('renaissance') || name.includes('elizabethan') || name.includes('jacobean');
  if (f === 'Augustan') return name.includes('neoclassical') || name.includes('restoration');
  if (f === 'Romantic') return name.includes('romantic');
  if (f === 'Victorian') return name.includes('victorian');
  if (f === 'Modern') return name.includes('modern');
  return false;
}

export function HistoryPage() {
  const refs = useRef<Record<string, HTMLElement | null>>({});

  return (
    <>
      <PageHeader
        eyebrow="Literary History"
        title="History of English Literature"
        subtitle="Eleven literary periods from the Anglo-Saxon settlements to the postmodern present — timelines, events, authors, works, and key characteristics."
        icon={ScrollText}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterChips.map(chip => (
            <button key={chip} onClick={() => {
              const id = literaturePeriods.find(p => matchesFilter(p, chip))?.id;
              if (id && refs.current[id]) refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }} className="chip hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300 cursor-pointer transition-colors">{chip}</button>
          ))}
        </div>

        <ol className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/0 via-brand-500/40 to-brand-500/0" aria-hidden />
          {literaturePeriods.map((p, i) => {
            const left = i % 2 === 0;
            return (
              <li
                key={p.id}
                ref={(el) => { refs.current[p.id] = el; }}
                className="relative mb-10"
              >
                <span className={`absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${p.accent} ring-4 ring-slate-50 dark:ring-slate-950 shadow-lg z-10`} />
                <div className={`pl-12 md:pl-0 md:w-1/2 ${left ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'}`}>
                  <Link to={`/history/${p.id}`} className="group block glass rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className={`flex items-center gap-2 ${left ? 'md:justify-end' : ''} mb-2`}>
                      <span className="chip"><Clock size={12} /> {p.timeline}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">{p.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">{p.summary}</p>
                    <div className={`flex flex-wrap gap-1.5 ${left ? 'md:justify-end' : ''} mb-3`}>
                      {p.majorAuthors.slice(0, 3).map(a => <span key={a} className="chip"><Users size={11} /> {a}</span>)}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-300 ${left ? 'md:mr-0' : ''}`}>Explore period <ChevronRight size={13} /></span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
