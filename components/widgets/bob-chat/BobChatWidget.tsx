"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Terminal } from 'lucide-react';
import { FundamentosIcon } from './icons/FundamentosIcon';
import { MiningIcon } from './icons/MiningIcon';
import { CustodiaIcon } from './icons/CustodiaIcon';
import { ImpuestosIcon } from './icons/ImpuestosIcon';
import { VerificacionIcon } from './icons/VerificacionIcon';

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

const CONTEXTS = [
  { key: 'fundamentos', label: 'Fundamentos', icon: FundamentosIcon },
  { key: 'mining', label: 'Mining', icon: MiningIcon },
  { key: 'custodia', label: 'Custodia', icon: CustodiaIcon },
  { key: 'impuestos', label: 'Impuestos', icon: ImpuestosIcon },
  { key: 'verificacion', label: 'Verificación', icon: VerificacionIcon },
] as const;

const ChatBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed transition-colors
          ${isUser 
            ? 'bg-bitcoin/10 border border-bitcoin/30 text-white rounded-tr-none' 
            : 'bg-matrix/10 border border-matrix/30 text-[#FAFAFA] rounded-tl-none shadow-[0_0_15px_rgba(0,255,65,0.2)]'
          }`}
      >
        <p className="whitespace-pre-wrap font-mono">{message.content}</p>
        {message.role === 'assistant' && !message.visible && (
          <span className="inline-block w-1.5 h-4 bg-matrix animate-pulse ml-1 align-middle" />
        )}
      </div>
    </motion.div>
  );
};

export default function BobChatWidget({ 
  mode = 'hero', 
  defaultContext = 'fundamentos', 
  lang = 'es' 
}: BobChatWidgetProps) {
  
  const [isMounted, setIsMounted] = useState(false);
  const [context, setContext] = useState(defaultContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Hydration guard
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, []);

  // Auto-scroll corregido: Solo se ejecuta si hay mensajes en el chat
  useEffect(() => {
    if (isMounted && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isMounted]);

  // Typing simulation
  const simulateTyping = useCallback((fullText: string, index: number) => {
    setMessages(prev => {
      const updated = [...prev];
      updated[index] = { role: 'assistant', content: '', visible: false };
      return updated;
    });

    let i = 0;
    typingRef.current = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        const msg = updated[index];
        if (i < fullText.length) {
          msg.content = fullText.slice(0, i + 1);
          msg.visible = true;
          i++;
        } else {
          msg.visible = true;
          if (typingRef.current) clearInterval(typingRef.current);
        }
        return updated;
      });
    }, 22);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading || !isMounted) return;

    setIsLoading(true);
    setError(null);

    const userMsg: Message = { role: 'user', content: text, visible: true };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context, lang, useRAG: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sin respuesta');

      simulateTyping(data.response || "Entendido. ¿Qué más quieres saber sobre Bitcoin?", messages.length + 1);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ B.O.B. tuvo un problema temporal. Intenta de nuevo.',
        visible: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, context, lang, messages.length, simulateTyping, isMounted]);

  const handleContextSwitch = (key: string) => {
    if (key === context) return;
    setContext(key);
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

  const ActiveIcon = CONTEXTS.find(c => c.key === context)?.icon || FundamentosIcon;

  // Skeleton mientras hidrata
  if (!isMounted) {
    return mode === 'floating' ? (
      <div className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-black/80 border border-white/10 rounded-full animate-pulse" />
    ) : (
      <div className="w-full max-w-4xl mx-auto h-[520px] bg-black/80 border border-white/10 rounded-3xl animate-pulse" />
    );
  }

  // ===================== FLOATING MODE =====================
  if (mode === 'floating') {
    return (
      <>
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-black border-2 border-matrix/50 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:scale-105 active:scale-95 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Abrir B.O.B."
        >
          <ActiveIcon className="w-8 h-8 text-matrix" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-24 right-6 z-50 w-[min(92vw,420px)] h-[560px] bg-black/80 backdrop-blur-md border border-matrix/30 rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.15)] flex flex-col"
              suppressHydrationWarning
            >
              {/* Header con scanline */}
              <div className="relative px-5 py-4 border-b border-matrix/30 bg-black/60 flex items-center justify-between">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-matrix/40 to-transparent animate-scanline" />
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-matrix/10 border border-matrix/30">
                    <ActiveIcon className="w-6 h-6 text-matrix" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">B.O.B.</h3>
                    <p className="font-mono text-[10px] text-matrix/80 uppercase tracking-wide">Bitcoin Operated Brain</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 text-gray-400 hover:text-matrix transition-colors rounded-md hover:bg-white/5"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Context Chips */}
              <div className="p-3 border-b border-white/10 flex gap-2 overflow-x-auto bg-black/40 no-scrollbar" suppressHydrationWarning>
                {CONTEXTS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleContextSwitch(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-wide whitespace-nowrap transition-all ${
                      context === key 
                        ? 'bg-matrix text-black font-bold shadow-[0_0_15px_rgba(0,255,65,0.2)]' 
                        : 'bg-white/5 border border-white/10 hover:border-matrix/50 text-gray-300 hover:text-matrix'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div 
                className="flex-1 overflow-y-auto p-5 space-y-4 bg-[radial-gradient(rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"
                suppressHydrationWarning
              >
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Terminal className="w-12 h-12 text-matrix/40 mb-4" />
                    <p className="text-matrix font-mono text-xs uppercase tracking-wide">¿Qué quieres aprender hoy?</p>
                  </div>
                )}
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <ChatBubble message={msg} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/70">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pregúntale a B.O.B..."
                    disabled={isLoading}
                    className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-5 py-3 text-sm font-mono focus:border-matrix focus:ring-1 focus:ring-matrix/30 outline-none transition-all placeholder:text-gray-600"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-5 bg-bitcoin hover:bg-bitcoin/90 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-2xl transition-all flex items-center justify-center"
                    aria-label="Enviar mensaje"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ===================== HERO MODE (Homepage) =====================
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto bg-black/80 backdrop-blur-md border border-matrix/30 rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.15)]"
      suppressHydrationWarning
    >
      {/* Header */}
      <div className="relative px-6 py-5 border-b border-matrix/20 flex items-center justify-between bg-black/60">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-matrix/40 to-transparent animate-scanline" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-matrix/10 border border-matrix/30 rounded-2xl">
            <ActiveIcon className="w-7 h-7 text-matrix" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-white tracking-tight">B.O.B.</h3>
            <p className="font-mono text-[10px] text-matrix/80 uppercase tracking-wide">Tu tutor cypherpunk</p>
          </div>
        </div>
      </div>

      {/* Context Selector */}
      <div className="p-4 border-b border-white/10 flex gap-2 overflow-x-auto bg-black/40" suppressHydrationWarning>
        {CONTEXTS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleContextSwitch(key)}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-mono uppercase tracking-wide transition-all whitespace-nowrap ${
              context === key 
                ? 'bg-matrix text-black shadow-[0_0_15px_rgba(0,255,65,0.2)]' 
                : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-matrix/50 text-gray-300 hover:text-matrix'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div 
        className="h-[460px] overflow-y-auto p-6 space-y-5 bg-[radial-gradient(rgba(0,255,65,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"
        suppressHydrationWarning
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <Terminal className="w-14 h-14 text-matrix/30" />
            <div>
              <p className="text-lg text-matrix font-mono font-light">Hola, soy B.O.B.</p>
              <p className="text-gray-400 mt-2 font-mono text-xs">¿En qué tema de Bitcoin quieres profundizar?</p>
            </div>
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ChatBubble message={msg} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-5 border-t border-white/10 bg-black/70">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta sobre Bitcoin..."
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-sm font-mono focus:border-matrix focus:ring-1 focus:ring-matrix/30 outline-none transition-all placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-7 bg-bitcoin hover:bg-bitcoin/90 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-2xl transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}