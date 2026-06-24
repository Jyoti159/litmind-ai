import { Link } from 'react-router-dom';
import { Home, BookOpen } from 'lucide-react';

export function NotFoundPage() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <div className="font-serif text-[120px] sm:text-[180px] leading-none font-bold gradient-text gradient-text-animated">404</div>
        <BookOpen size={48} className="absolute inset-0 m-auto text-brand-500/40" />
      </div>
      <h1 className="font-serif text-3xl font-bold mb-3">This page is unwritten</h1>
      <p className="text-slate-600 dark:text-slate-300 max-w-md mb-8">Like a missing folio from a great library — the page you sought isn't here. Let's get you back to the canon.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-primary text-sm"><Home size={15} /> Back home</Link>
        <Link to="/history" className="btn-outline text-sm"><BookOpen size={15} /> Browse the library</Link>
      </div>
    </section>
  );
}
