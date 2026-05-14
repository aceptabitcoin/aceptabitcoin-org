'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  visible: boolean;
}

export interface UseBobChatProps {
  context: string;
  lang: 'es' | 'en';
}

export function useBobChat({ context, lang }: UseBobChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(false);

  // Carga inicial desde sessionStorage
  useEffect(() => {
    isMounted.current = true;
    const saved = sessionStorage.getItem(`bob_chat_${context}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Aseguramos que el último mensaje de asistente esté "completamente visible"
        const restored = parsed.map((m: ChatMessage) => ({ ...m, visible: true }));
        setMessages(restored);
      } catch {}
    }
    return () => { isMounted.current = false; };
  }, [context]);

  // Guardado en sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`bob_chat_${context}`, JSON.stringify(messages));
    }
  }, [messages, context]);

  // Limpiar typing al desmontar o cambiar contexto
  useEffect(() => {
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, [context]);

  const simulateTyping = useCallback((fullText: string, index: number) => {
    setMessages(prev => {
      const updated = [...prev];
      updated[index] = { role: 'assistant', content: '', visible: false };
      return updated;
    });

    let charIndex = 0;
    typingRef.current = setInterval(() => {
      if (!isMounted.current) return clearInterval(typingRef.current);
      
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
    }, 28); // ~35 chars/sec para ritmo natural
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (typingRef.current) clearInterval(typingRef.current);

    setIsLoading(true);
    setError(null);

    const userMsg: ChatMessage = { role: 'user', content: text, visible: true };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context, lang, useRAG: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fallo en API');

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

  const clearContext = useCallback(() => {
    sessionStorage.removeItem(`bob_chat_${context}`);
    setMessages([]);
    setError(null);
    if (typingRef.current) clearInterval(typingRef.current);
  }, [context]);

  return { messages, isLoading, error, sendMessage, clearContext };
}