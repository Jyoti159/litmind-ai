import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { ToastProvider } from './ToastContext';
import { BottomNav } from './BottomNav';

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col relative">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1 pt-16 pb-24">
          <Outlet />
        </main>
        <Footer />
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
