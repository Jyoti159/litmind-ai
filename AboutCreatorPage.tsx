import { Link } from 'react-router-dom';
import {
  GraduationCap, Sparkles, School, Award, Quote, Heart, BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { creator, creatorTimeline, gratitudeCards } from '../data/site';
import { PageHeader } from '../components/PageHeader';

const iconMap: Record<string, LucideIcon> = {
  School, GraduationCap, Award,
};

export function AboutCreatorPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Meet the Creator"
        subtitle="The story and gratitude behind LitMind AI"
      />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-pink-500/10 animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl animate-float" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] items-center p-8 sm:p-12">
            {/* Avatar */}
            <div className="mx-auto">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 blur-md opacity-60 animate-pulse-soft" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 grid place-items-center text-white shadow-xl shadow-pink-500/40">
                  <GraduationCap size={72} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center">
                  <Sparkles size={20} className="text-pink-500" />
                </div>
              </div>
            </div>

            {/* Intro */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-600 mb-4 animate-fade-in">
                <Sparkles size={14} /> Creator & Founder
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                {creator.name}
              </h1>
              <p className="mt-3 text-lg text-pink-600 font-medium">{creator.education}</p>
              <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <School size={16} className="text-pink-500" /> {creator.collegeShort}
                </span>
                <span className="inline-flex items-center gap-2">
                  <GraduationCap size={16} className="text-pink-500" /> {creator.university}
                </span>
              </div>
              <p className="mt-6 max-w-2xl text-slate-700 leading-relaxed italic">
                "{creator.tagline}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Journey (names only — no descriptions) */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-600 mb-3">
            <BookOpen size={14} /> Journey
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Educational Journey
          </h2>
        </div>

        <div className="space-y-4">
          {creatorTimeline.map((phase, i) => {
            const Icon = iconMap[phase.icon] ?? Award;
            return (
              <div
                key={phase.title}
                className="flex items-center gap-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-100 shadow-md shadow-pink-500/5 p-5 sm:p-6 hover:shadow-lg hover:shadow-pink-500/10 transition-shadow animate-fade-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${phase.accent} grid place-items-center text-white shadow-lg shadow-pink-500/30 shrink-0`}>
                  <Icon size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-pink-500">
                    {phase.phase}
                  </p>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    {phase.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Founder's Message */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-600 mb-3">
            <Quote size={14} /> From the Founder
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Founder's Message
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-white to-rose-50 border border-pink-100 shadow-lg shadow-pink-500/10 p-8 sm:p-12 animate-scale-in">
          <Quote size={64} className="absolute -top-2 -left-2 text-pink-200" />
          <div className="relative">
            <p className="font-serif text-xl sm:text-2xl text-slate-800 leading-relaxed italic">
              {creator.foundersMessage}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 grid place-items-center text-white">
                <GraduationCap size={18} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">— {creator.name}</p>
                <p className="text-xs text-pink-600">Founder, LitMind AI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgements & Gratitude */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-600 mb-3">
            <Heart size={14} /> Gratitude
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Acknowledgements & Gratitude
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            This platform would not have been possible without the inspiration, encouragement,
            support, and guidance of the following individuals.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {gratitudeCards.map((card, i) => (
            <div
              key={card.id}
              className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-100 shadow-md shadow-pink-500/5 p-8 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${card.accent} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
              <div className="relative">
                <h3 className="font-serif text-2xl font-bold text-slate-900 italic tracking-tight" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                  {card.names}
                </h3>
                {card.subtitle && (
                  <p className="text-xs text-pink-600 mt-1 font-medium uppercase tracking-wide">{card.subtitle}</p>
                )}
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Influence: </span>
                  {card.influence}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 p-10 sm:p-14 text-center shadow-2xl shadow-pink-500/30 animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0" />
          <div className="relative">
            <Award size={40} className="mx-auto text-white mb-4" />
            <h2 className="font-serif text-3xl font-bold text-white">Explore LitMind AI</h2>
            <p className="mt-3 text-pink-50 max-w-xl mx-auto">
              Your complete English Honours learning portal — novels, poetry, American literature,
              Indian writings, communication skills, and AI-powered academic assistance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/" className="btn bg-white text-pink-600 hover:bg-pink-50 shadow-lg">
                <BookOpen size={18} /> Browse Subjects
              </Link>
              <Link to="/assistant" className="btn bg-pink-600/40 text-white border border-white/40 hover:bg-pink-600/60">
                <Sparkles size={18} /> Try the AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
