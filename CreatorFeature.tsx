import { Link } from 'react-router-dom';
import {
  GraduationCap, Sparkles, ArrowRight, School, Quote,
} from 'lucide-react';
import { creator, creatorTimeline } from '../data/site';

export function CreatorFeature() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-600 mb-3">
          <Sparkles size={14} /> Created by Jyoti Panchal
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Meet the Creator
        </h2>
        <p className="mt-2 text-pink-600 font-medium">{creator.education}</p>
        <p className="mt-1 text-sm text-slate-600">{creator.collegeShort}</p>
        <p className="text-sm text-slate-600">{creator.affiliation}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Profile card */}
        <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-pink-500/10 animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50" />
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-pink-200/40 blur-3xl animate-float" />
          <div className="relative p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 blur-md opacity-50 animate-pulse-soft" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 grid place-items-center text-white shadow-xl shadow-pink-500/40">
                  <GraduationCap size={40} strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-2xl font-bold text-slate-900">{creator.name}</h3>
                <p className="text-pink-600 font-medium mt-1">{creator.education}</p>
                <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                  <p className="inline-flex items-center justify-center sm:justify-start gap-2">
                    <School size={15} className="text-pink-500" /> {creator.collegeShort}
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <GraduationCap size={15} className="text-pink-500" /> {creator.university}
                  </p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-6 relative rounded-2xl bg-white/70 border border-pink-100 p-5">
              <Quote size={28} className="absolute -top-2 -left-1 text-pink-200" />
              <p className="text-sm italic text-slate-700 leading-relaxed pl-5">
                {creator.foundersMessage}
              </p>
              <p className="mt-3 text-xs font-semibold text-pink-600">— {creator.name}</p>
            </div>

            <Link
              to="/about-creator"
              className="mt-6 btn btn-primary w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:shadow-lg hover:shadow-pink-500/40"
            >
              Read Full Story <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-pink-100 shadow-md shadow-pink-500/5 p-6 sm:p-8 animate-fade-up">
            <h4 className="font-serif text-lg font-bold text-slate-900 mb-5">Educational Journey</h4>
            <div className="space-y-5">
              {creatorTimeline.map((phase, i) => (
                <div key={phase.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${phase.accent} grid place-items-center text-white text-xs font-bold shrink-0 shadow-md shadow-pink-500/20`}>
                      {i + 1}
                    </div>
                    {i < creatorTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-pink-300 to-rose-200 mt-1" />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">{phase.phase}</p>
                    <p className="font-semibold text-slate-800 mt-0.5 leading-snug">{phase.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/about-creator"
            className="block text-center text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors link-underline"
          >
            View full creator profile &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
