import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Sparkles, Trash2, Plus, User, BookOpen, Send, Mic, Copy, Share2,
  Check, MessageSquare, Bookmark, ChevronDown,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LoadingDots } from '../components/Feedback';
import { Markdown } from '../components/Markdown';
import { useToast } from '../components/ToastContext';
import { generateLLMReply, chatSuggestions, type LLMMessage, type ChatMode } from '../data/chat';
import { listSavedChats, saveChat, deleteChat, type StoredChat } from '../data/savedChats';

interface Message { role: 'user' | 'assistant'; text: string; ts?: number; }

const MODES: { id: ChatMode; label: string; hint: string }[] = [
  { id: 'detailed', label: 'Detailed', hint: 'Comprehensive answer with examples and step-by-step structure' },
  { id: 'exam', label: 'Exam', hint: 'University-level exam answer: Introduction · Body · Conclusion · Exam Tips' },
  { id: 'short', label: 'Short', hint: 'Concise 3-5 sentence answer with essential facts' },
  { id: 'notes', label: 'Notes', hint: 'Structured study notes with headings and quick-revision summary' },
  { id: 'mcqs', label: 'MCQs', hint: '5 multiple-choice questions with answers and explanations' },
  { id: 'summary', label: 'Summary', hint: 'One-sentence, one-paragraph, and detailed summaries' },
];

function makeWelcome(): Message {
  return {
    role: 'assistant',
    text: "## Welcome to LitMind AI\n\nI'm your student-focused educational assistant — I cover **English & Indian Literature, Science, Technology, Coding, Mathematics, History, Geography, Career Guidance**, and many more subjects.\n\n### How to use me\n- Ask any question — I give **detailed, exam-ready answers**.\n- I remember our conversation so you can ask follow-ups naturally.\n- Switch **modes** below (Detailed / Exam / Short / Notes / MCQs / Summary) for the response shape you need.\n- Use the 🎤 mic for voice input, the copy/share buttons on my replies.\n\n**Try asking:**\n- Explain photosynthesis step by step\n- Discuss Kabir's *Mo Ko Kahan Dhundho Bande*\n- Write 5 MCQs on Shakespeare's Hamlet\n- Career guidance for an English Honors student",
    ts: Date.now(),
  };
}

export function AssistantPage() {
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>([makeWelcome()]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<ChatMode>('detailed');
  const [modeOpen, setModeOpen] = useState(false);
  const [savedChats, setSavedChats] = useState<StoredChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load saved chats on mount
  useEffect(() => { listSavedChats().then(setSavedChats); }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Auto-resize textarea
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const startNew = useCallback(() => {
    setMessages([makeWelcome()]);
    setCurrentChatId(null);
    setInput('');
    setTimeout(() => taRef.current?.focus(), 60);
  }, []);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || typing) return;
    const userMsg: Message = { role: 'user', text: content, ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setTyping(true);

    // Build LLM history (only role + content for prior turns)
    const history: LLMMessage[] = newMessages.map(m => ({ role: m.role, content: m.text }));

    try {
      const reply = await generateLLMReply(history, mode);
      const assistantMsg: Message = { role: 'assistant', text: reply.text, ts: Date.now() };
      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);

      // Auto-save / update conversation
      const title = finalMessages.find(m => m.role === 'user')?.text.slice(0, 60) ?? 'New conversation';
      const saved = await saveChat({
        id: currentChatId ?? undefined,
        title,
        messages: finalMessages.map(m => ({ role: m.role, text: m.text, ts: m.ts })),
      });
      if (saved) {
        setCurrentChatId(saved.id);
        setSavedChats(await listSavedChats());
      }
    } catch {
      toast.show('Failed to get a response. Please try again.');
    } finally {
      setTyping(false);
    }
  };

  const loadSaved = (chat: StoredChat) => {
    setMessages(chat.messages.map(m => ({ role: m.role, text: m.text, ts: m.ts })));
    setCurrentChatId(chat.id);
  };

  const removeSaved = async (id: string) => {
    await deleteChat(id);
    setSavedChats(await listSavedChats());
    if (id === currentChatId) startNew();
    toast.show('Conversation deleted');
  };

  const clearCurrent = () => {
    if (!confirm('Start a new conversation? The current one is already saved in your history.')) return;
    startNew();
    toast.show('New conversation started');
  };

  // Voice input (Web Speech API)
  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.show('Voice input is not supported in this browser');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' : '') + transcript);
    };
    rec.onerror = () => toast.show('Voice input error');
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const copyMessage = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      toast.show('Copy failed');
    }
  };

  const shareMessage = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'LitMind AI answer', text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast.show('Answer copied to clipboard (sharing not supported here)');
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const currentMode = MODES.find(m => m.id === mode)!;

  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="LitMind AI Assistant"
        subtitle="A powerful AI educational assistant — Literature, Science, Coding, History, Career Guidance, and more. Conversation memory, voice input, saved chats, and structured academic answers."
        icon={MessageSquare}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-[260px_1fr] gap-4 lg:gap-6">
          {/* Sidebar — saved chats */}
          <aside className="hidden lg:block">
            <button onClick={startNew} className="btn-primary w-full justify-center text-sm mb-4">
              <Plus size={15} /> New chat
            </button>
            <div className="glass rounded-2xl overflow-hidden">
              {savedChats.length === 0 ? (
                <p className="p-4 text-xs text-slate-500 text-center">No saved conversations yet.</p>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                  {savedChats.map(c => (
                    <div
                      key={c.id}
                      onClick={() => loadSaved(c)}
                      className={`group w-full text-left px-4 py-3 border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-brand-500/5 transition-colors cursor-pointer ${c.id === currentChatId ? 'bg-brand-500/10' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium truncate flex-1 min-w-0">{c.title}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeSaved(c.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all"
                          aria-label="Delete chat"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <MessageSquare size={10} /> {c.messages.length} msgs
                        {c.pinned && <Bookmark size={10} className="fill-amber-400 text-amber-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Conversation */}
          <div className="flex flex-col glass-strong rounded-2xl overflow-hidden h-[calc(100vh-300px)] min-h-[500px]">
            {/* Header — title + mode selector + actions */}
            <header className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-royal-500 grid place-items-center text-white shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">LitMind AI · {currentMode.label} mode</div>
                  <div className="text-[11px] text-slate-400">{currentMode.hint}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mode selector */}
                <div className="relative">
                  <button
                    onClick={() => setModeOpen(o => !o)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-brand-500/10 transition-colors"
                  >
                    <BookOpen size={13} /> Mode <ChevronDown size={12} />
                  </button>
                  {modeOpen && (
                    <div className="absolute right-0 top-full mt-1 z-20 w-56 glass-strong rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-1.5">
                      {MODES.map(m => (
                        <button
                          key={m.id}
                          onClick={() => { setMode(m.id); setModeOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-brand-500/10 transition-colors ${m.id === mode ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300' : ''}`}
                        >
                          <div className="font-semibold">{m.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{m.hint}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={startNew} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="New chat">
                  <Plus size={16} />
                </button>
                <button onClick={clearCurrent} className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-500" aria-label="Clear conversation">
                  <Trash2 size={16} />
                </button>
              </div>
            </header>

            {/* Messages */}
            <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-5 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`group flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-royal-500 grid place-items-center text-white shrink-0">
                      <BookOpen size={15} />
                    </div>
                  )}
                  <div className={`relative max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-brand-500 text-white rounded-tr-sm whitespace-pre-wrap' : 'glass text-slate-800 dark:text-slate-100 rounded-tl-sm'}`}>
                    {m.role === 'assistant' ? <Markdown text={m.text} /> : m.text}
                    {m.role === 'assistant' && (
                      <div className="absolute -bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyMessage(m.text, i)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 hover:text-brand-500"
                          aria-label="Copy"
                        >
                          {copiedIdx === i ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                        <button
                          onClick={() => shareMessage(m.text)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 hover:text-brand-500"
                          aria-label="Share"
                        >
                          <Share2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 grid place-items-center text-white shrink-0">
                      <User size={15} />
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-royal-500 grid place-items-center text-white shrink-0">
                    <BookOpen size={15} />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                    <LoadingDots />
                  </div>
                </div>
              )}

              {messages.length <= 1 && (
                <div className="pt-4">
                  <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">Try asking</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {chatSuggestions.slice(0, 8).map(s => (
                      <button key={s} onClick={() => send(s)} className="text-left text-sm glass rounded-xl px-3.5 py-2.5 hover:bg-brand-500/10 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-slate-200/60 dark:border-slate-700/60 p-3 sm:p-4">
              <div className="relative flex items-end gap-2">
                <textarea
                  ref={taRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={1}
                  placeholder="Ask me anything — literature, science, coding, career, exam help…"
                  aria-label="Message input"
                  className="input-field resize-none pl-3 pr-24 min-h-[44px] max-h-40 scrollbar-thin"
                />
                <div className="absolute right-1.5 bottom-1.5 flex items-center gap-1">
                  <button
                    onClick={toggleVoice}
                    className={`p-2.5 rounded-lg transition-colors ${listening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    aria-label="Voice input"
                  >
                    <Mic size={16} />
                  </button>
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || typing}
                    className="p-2.5 rounded-lg bg-gradient-to-br from-brand-600 to-royal-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                Enter to send · Shift+Enter for newline · 🎤 for voice · Mode: {currentMode.label}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
