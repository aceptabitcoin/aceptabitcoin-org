'use client';
import { motion } from 'framer-motion';
import { ChatMessage } from './useBobChat';

export const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed transition-all
        ${isUser 
          ? 'bg-black/60 border border-bitcoin/40 text-[#FAFAFA] font-serif rounded-tr-none' 
          : 'bg-matrix/5 border border-matrix/30 text-[#FAFAFA] font-mono rounded-tl-none shadow-[0_0_12px_rgba(0,255,65,0.15)]'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.role === 'assistant' && !message.visible && (
          <span className="inline-block w-2 h-4 bg-matrix/60 animate-pulse ml-1 align-middle" />
        )}
      </div>
    </motion.div>
  );
};