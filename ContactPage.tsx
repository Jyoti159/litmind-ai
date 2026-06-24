import { useState } from 'react';
import { MessageSquare, Mail, ChevronDown, Send, MapPin } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { faqs } from '../data/site';
import { useToast } from '../components/ToastContext';

export function ContactPage() {
  const toast = useToast();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.show('Please fill in all required fields'); return; }
    toast.show('Thanks — your feedback was sent');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch" subtitle="Send us feedback, report an issue, or suggest a new feature. We read every message and regularly ship improvements based on student input." icon={MessageSquare} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <form onSubmit={submit} className="card p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-2xl font-bold">Send feedback</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" placeholder="jane@university.edu" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Subject</label>
              <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-field" placeholder="Add a term to the dictionary" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">Message *</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} className="input-field resize-none" placeholder="Tell us what you'd like to see…" />
            </div>
            <button type="submit" className="btn-primary text-sm"><Send size={15} /> Send message</button>
          </form>

          <aside className="space-y-4">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2"><Mail size={18} className="text-brand-500" /><h3 className="font-serif font-semibold">Email us</h3></div>
              <p className="text-sm text-slate-600 dark:text-slate-300">For press, partnerships, or institutional access: <a href="#" onClick={e=>e.preventDefault()} className="text-brand-600 dark:text-brand-300 font-medium">hello@litmind.ai</a></p>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2"><MapPin size={18} className="text-brand-500" /><h3 className="font-serif font-semibold">Built for students everywhere</h3></div>
              <p className="text-sm text-slate-600 dark:text-slate-300">LitMind AI is a fully remote product. Our contributors and editors span four continents.</p>
            </div>
          </aside>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="card overflow-hidden">
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
                  <span className="font-medium text-slate-800 dark:text-slate-100">{f.q}</span>
                  <ChevronDown size={18} className={`text-brand-500 shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                </button>
                {openIdx === i && <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
