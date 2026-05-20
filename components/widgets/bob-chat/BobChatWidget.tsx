'use client';

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
];

const ChatBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed
          ${isUser 
            ? 'bg-bitcoin/10 border border-bitcoin/40 text-white rounded-tr-none' 
            : 'bg-matrix/10 border border-matrix/40 text-[#FAFAFA] rounded-tl-none shadow-[0_0_20px_rgba(0,255,65,0.15)]'
          }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
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
  
  const [context, setContext] = useState(defaultContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          clearInterval(typingRef.current!);
        }
        return updated;
      });
    }, 22);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

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
  }, [isLoading, context, lang, messages.length, simulateTyping]);

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

  // ===================== FLOATING MODE =====================
  if (mode === 'floating') {
    return (
      <>
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-black border-4 border-matrix rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.4)] hover:scale-110 active:scale-95 transition-all"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
        >
          <ActiveIcon className="w-8 h-8" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed bottom-24 right-6 z-50 w-[min(92vw,420px)] h-[560px] bg-black/95 backdrop-blur-xl border border-matrix/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header con glow */}
              <div className="px-5 py-4 border-b border-matrix/30 bg-black/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-matrix/10 border border-matrix/40">
                    <ActiveIcon className="w-6 h-6 text-matrix" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">B.O.B.</h3>
                    <p className="font-mono text-xs text-matrix">Bitcoin Operated Brain</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Context Chips */}
              <div className="p-3 border-b border-white/10 flex gap-2 overflow-x-auto bg-black/40 no-scrollbar">
                {CONTEXTS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleContextSwitch(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                      context === key 
                        ? 'bg-matrix text-black font-bold shadow-[0_0_15px_rgba(0,255,65,0.5)]' 
                        : 'bg-white/5 border border-white/10 hover:border-matrix/50 text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[radial-gradient(rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:30px_30px]">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Terminal className="w-12 h-12 text-matrix/40 mb-4" />
                    <p className="text-matrix font-mono">¿Qué quieres aprender hoy?</p>
                  </div>
                )}
                {messages.map((msg, i) => <ChatBubble key={i} message={msg} />)}
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
                    className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-5 py-3 text-sm focus:border-matrix focus:ring-matrix/30 outline-none transition-all font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 bg-bitcoin hover:bg-bitcoin/90 disabled:bg-gray-700 text-black font-bold rounded-2xl transition-all"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
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
      className="w-full max-w-4xl mx-auto bg-black/90 backdrop-blur-2xl border border-matrix/30 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.15)]"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-matrix/20 flex items-center justify-between bg-black/60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-matrix/10 border border-matrix/30 rounded-2xl">
            <ActiveIcon className="w-7 h-7 text-matrix" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-white tracking-tight">B.O.B.</h3>
            <p className="font-mono text-xs text-matrix">Tu tutor cypherpunk</p>
          </div>
        </div>
      </div>

      {/* Context Selector */}
      <div className="p-4 border-b border-white/10 flex gap-2 overflow-x-auto bg-black/40">
        {CONTEXTS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleContextSwitch(key)}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-mono transition-all whitespace-nowrap ${
              context === key 
                ? 'bg-matrix text-black shadow-[0_0_20px_rgba(0,255,65,0.4)]' 
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="h-[460px] overflow-y-auto p-6 space-y-5 bg-[radial-gradient(rgba(0,255,65,0.04)_1px,transparent_1px)] bg-[size:40px_40px]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="text-6xl opacity-40">🤖</div>
            <div>
              <p className="text-xl text-matrix font-light">Hola, soy B.O.B.</p>
              <p className="text-gray-400 mt-2">¿En qué tema de Bitcoin quieres profundizar?</p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => <ChatBubble key={i} message={msg} />)}
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
            className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-sm focus:border-matrix focus:ring-1 focus:ring-matrix/30 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-8 bg-bitcoin hover:bg-orange-500 text-black font-bold rounded-2xl transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}