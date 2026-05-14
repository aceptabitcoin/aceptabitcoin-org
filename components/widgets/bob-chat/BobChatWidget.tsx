'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { FundamentosIcon } from './icons/FundamentosIcon';
import { MiningIcon } from './icons/MiningIcon';
import { CustodiaIcon } from './icons/CustodiaIcon';
import { ImpuestosIcon } from './icons/ImpuestosIcon';
import { VerificacionIcon } from './icons/VerificacionIcon';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface BobChatWidgetProps {
  mode: 'hero' | 'floating';
  defaultContext?: string;
  lang?: 'es' | 'en';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  visible: boolean;
}

interface ContextOption {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ─────────────────────────────────────────────────────────────
// Contexts mapping (UI-friendly → RAG technical)
// ─────────────────────────────────────────────────────────────
const CONTEXTS: ContextOption[] = [
  { key: 'fundamentos', label: 'Fundamentos', icon: FundamentosIcon },
  { key: 'mining', label: 'Mining', icon: MiningIcon },
  { key: 'custodia', label: 'Custodia', icon: CustodiaIcon },
  { key: 'impuestos', label: 'Impuestos', icon: ImpuestosIcon },
  { key: 'verificacion', label: 'Verificación', icon: VerificacionIcon },
];

// ─────────────────────────────────────────────────────────────
// Chat Bubble Component (DS v2.0 compliant)
// ─────────────────────────────────────────────────────────────
const ChatBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div 
        className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed transition-all
          ${isUser 
            ? 'bg-black/60 border border-[var(--bitcoin)]/40 text-[#FAFAFA] font-serif rounded-tr-none' 
            : 'bg-[var(--matrix)]/5 border border-[var(--matrix)]/30 text-[#FAFAFA] font-mono rounded-tl-none shadow-[var(--matrix-glow)]'
          }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.role === 'assistant' && !message.visible && (
          <span className="inline-block w-2 h-4 bg-[var(--matrix)]/60 animate-pulse ml-1 align-middle" />
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Component — EXPORT DEFAULT (fixes import error)
// ─────────────────────────────────────────────────────────────
export default function BobChatWidget({ 
  mode = 'hero', 
  defaultContext = 'fundamentos', 
  lang = 'es' 
}: BobChatWidgetProps) {
  
  const [context, setContext] = useState(defaultContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // used only in floating mode
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false);

  // ──────────────────────────────────────────────────────────
  // Load/Save to sessionStorage (privacy-first: client-only)
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true;
    const saved = sessionStorage.getItem(`bob_chat_${context}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure restored messages are fully visible
        const restored = parsed.map((m: Message) => ({ ...m, visible: true }));
        setMessages(restored);
      } catch {}
    }
    return () => { isMounted.current = false; };
  }, [context]);

  useEffect(() => {
    if (messages.length > 0 && isMounted.current) {
      sessionStorage.setItem(`bob_chat_${context}`, JSON.stringify(messages));
    }
  }, [messages, context]);

  // ──────────────────────────────────────────────────────────
  // Auto-scroll + cleanup typing on unmount/context change
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    return () => { 
      if (typingRef.current) clearInterval(typingRef.current); 
    };
  }, [context]);

  // ──────────────────────────────────────────────────────────
  // Typing simulation (plain text → markdown render on complete)
  // ──────────────────────────────────────────────────────────
  const simulateTyping = useCallback((fullText: string, index: number) => {
    setMessages(prev => {
      const updated = [...prev];
      updated[index] = { role: 'assistant', content: '', visible: false };
      return updated;
    });

    let charIndex = 0;
    typingRef.current = setInterval(() => {
      if (!isMounted.current) return clearInterval(typingRef.current!);
      
      setMessages(prev => {
        const updated = [...prev];
        const msg = updated[index];
        if (charIndex < fullText.length) {
          msg.content = fullText.slice(0, charIndex + 1);
          msg.visible = true;
          charIndex++;
        } else {
          msg.visible = true;
          clearInterval(typingRef.current!);
        }
        return updated;
      });
    }, 28); // ~35 chars/sec for natural rhythm
  }, []);

  // ──────────────────────────────────────────────────────────
  // Send message to API (single-turn, JSON static response)
  // ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (typingRef.current) clearInterval(typingRef.current);

    setIsLoading(true);
    setError(null);

    const userMsg: Message = { role: 'user', content: text, visible: true };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          context, 
          lang, 
          useRAG: true 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');

      const botIndex = messages.length + 1;
      simulateTyping(data.response || 'Sin respuesta generada.', botIndex);
    } catch (err: any) {
      setError(err.message || 'Error de red');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${err.message || 'B.O.B. perdió conexión temporalmente.'}`,
        visible: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, context, lang, messages.length, simulateTyping]);

  // ──────────────────────────────────────────────────────────
  // Context switch + clear conversation
  // ──────────────────────────────────────────────────────────
  const handleContextSwitch = (key: string) => {
    setContext(key);
    sessionStorage.removeItem(`bob_chat_${context}`);
    setMessages([]);
    setError(null);
    if (typingRef.current) clearInterval(typingRef.current);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // ──────────────────────────────────────────────────────────
  // Floating Mode (Labs / Secondary pages)
  // ──────────────────────────────────────────────────────────
  const FloatingIcon = CONTEXTS.find(c => c.key === context)?.icon || FundamentosIcon;

  if (mode === 'floating') {
    const ActiveIcon = FloatingIcon;

    return (
      <>
        {/* Floating trigger button */}
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black border-4 border-[var(--matrix)] rounded-full 
            shadow-[var(--matrix-glow)] flex items-center justify-center text-[var(--matrix)] 
            hover:scale-110 active:scale-95 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Abrir B.O.B. chat"
        >
          <ActiveIcon className="w-6 h-6" />
        </motion.button>

        {/* Chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 right-6 z-50 w-[min(90vw,400px)] h-[500px] 
                bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl 
                shadow-[0_0_30px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--matrix)]/10 border border-[var(--matrix)]/30 text-[var(--matrix)]">
                    <ActiveIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[#FAFAFA] font-serif font-semibold text-base">B.O.B.</h3>
                    <p className="text-[10px] font-mono text-[var(--matrix)]/70">{context}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-gray-500 hover:text-[var(--matrix)] transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Context chips */}
              <div className="px-3 py-2 border-b border-white/10 flex gap-1.5 overflow-x-auto no-scrollbar bg-black/20">
                {CONTEXTS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleContextSwitch(key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all whitespace-nowrap
                      ${context === key 
                        ? 'bg-[var(--matrix)]/15 border border-[var(--matrix)]/50 text-[var(--matrix)] shadow-[var(--matrix-glow)]' 
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:border-[var(--matrix)]/30 hover:text-[var(--matrix)]/80'}`}
                  >
                    <Icon className="w-3 h-3" /> {label}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scroll-smooth">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                    <div className="w-10 h-10 rounded-full border border-[var(--matrix)]/30 flex items-center justify-center text-[var(--matrix)] bg-[var(--matrix)]/5">
                      <FundamentosIcon className="w-5 h-5" />
                    </div>
                    <p className="text-gray-400 font-mono text-xs">Selecciona un tema o escribe tu pregunta.</p>
                  </div>
                )}
                {messages.map((msg, i) => <ChatBubble key={i} message={msg} />)}
                {error && <p className="text-center text-red-500/80 font-mono text-[10px] mt-2">{error}</p>}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-black/60 flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--matrix)] font-mono text-xs font-bold select-none">{'>'}</span>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta..."
                    disabled={isLoading}
                    className="w-full pl-6 pr-3 py-2.5 bg-white/5 border border-white/20 rounded-lg 
                      text-[#FAFAFA] font-mono text-xs placeholder:text-gray-600 
                      focus:outline-none focus:border-[var(--matrix)] focus:ring-1 focus:ring-[var(--matrix)]/30 
                      transition-all disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-3 py-2.5 bg-[var(--bitcoin)]/90 hover:bg-[var(--bitcoin)] disabled:bg-gray-700 
                    text-black font-bold rounded-lg transition-all flex items-center gap-1.5 
                    shadow-[0_0_15px_rgba(247,147,26,0.3)] disabled:shadow-none"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ──────────────────────────────────────────────────────────
  // Hero Mode (Homepage — "Aprende" section)
  // ──────────────────────────────────────────────────────────
  const ActiveIcon = CONTEXTS.find(c => c.key === context)?.icon || FundamentosIcon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.8)]"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--matrix)]/10 border border-[var(--matrix)]/30 text-[var(--matrix)]">
            <ActiveIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[#FAFAFA] font-serif font-semibold text-lg">B.O.B.</h3>
            <p className="text-xs font-mono text-[var(--matrix)]/70 mt-0.5">Bitcoin Operated Brain • {context}</p>
          </div>
        </div>
        <button 
          onClick={() => handleContextSwitch(context)} 
          className="text-gray-500 hover:text-[var(--matrix)] transition-colors p-2" 
          title="Limpiar contexto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Context Chips */}
      <div className="px-4 py-3 border-b border-white/10 flex gap-2 overflow-x-auto no-scrollbar bg-black/20">
        {CONTEXTS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleContextSwitch(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap
              ${context === key 
                ? 'bg-[var(--matrix)]/15 border border-[var(--matrix)]/50 text-[var(--matrix)] shadow-[var(--matrix-glow)]' 
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-[var(--matrix)]/30 hover:text-[var(--matrix)]/80'}`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-2 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="w-12 h-12 rounded-full border border-[var(--matrix)]/30 flex items-center justify-center text-[var(--matrix)] bg-[var(--matrix)]/5">
              <FundamentosIcon className="w-6 h-6" />
            </div>
            <p className="text-gray-400 font-mono text-sm">Selecciona un tema o escribe tu pregunta.</p>
            <p className="text-gray-600 font-mono text-xs">"Aprende → Ahorra → Acepta"</p>
          </div>
        )}
        {messages.map((msg, i) => <ChatBubble key={i} message={msg} />)}
        {error && <p className="text-center text-red-500/80 font-mono text-xs mt-2">{error}</p>}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/60 flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--matrix)] font-mono text-sm font-bold select-none">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading}
            className="w-full pl-7 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl 
              text-[#FAFAFA] font-mono text-sm placeholder:text-gray-600 
              focus:outline-none focus:border-[var(--matrix)] focus:ring-1 focus:ring-[var(--matrix)]/30 
              transition-all disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-3 bg-[var(--bitcoin)]/90 hover:bg-[var(--bitcoin)] disabled:bg-gray-700 
            text-black font-bold rounded-xl transition-all flex items-center gap-2 
            shadow-[0_0_15px_rgba(247,147,26,0.3)] disabled:shadow-none"
        >
          <span className="hidden sm:inline">{isLoading ? 'Procesando...' : 'Enviar'}</span>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </motion.div>
  );
}