import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastCtx { show: (msg: string) => void; }
const Ctx = createContext<ToastCtx | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(null), 2400);
  }, []);
  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 ${msg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} role="status" aria-live="polite">
        {msg && (
          <div className="glass-strong rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-2 text-sm">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>{msg}</span>
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  return c ?? { show: (_m: string) => {} };
}
