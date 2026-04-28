import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../stores';
import { useAIChat } from '../hooks/useApi';
import { Send, Sparkles, Trash2 } from 'lucide-react';
import type { ChatMessage } from '../types';

const quickSuggestions = [
  'Quel engrais pour les tomates au Souss-Massa ?',
  'Dosage NPK pour le blé en hiver ?',
  'Produits bio pour les agrumes ?',
  'Tendances de ventes ce trimestre',
  'Calendrier de fertilisation printemps',
];

export default function Chat() {
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useChatStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatMutation = useAIChat();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    addMessage(userMsg);
    setLoading(true);

    chatMutation.mutate({ message: msg }, {
      onSuccess: (data) => {
        const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response, timestamp: new Date() };
        addMessage(botMsg);
        setLoading(false);
      },
      onError: () => {
        addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: 'Désolé, une erreur est survenue. Veuillez réessayer.', timestamp: new Date() });
        setLoading(false);
      },
    });
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <div className="chat-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>AgroBot — Assistant IA</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Expert en fertilisants et agriculture marocaine</p>
        </div>
        {messages.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={clearMessages}><Trash2 size={14} /> Effacer</button>
        )}
      </div>

      <div className="chat-messages" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Sparkles size={40} color="var(--accent)" style={{ marginBottom: 12, opacity: 0.6 }} />
            <h3 style={{ marginBottom: 8, fontSize: 16 }}>Comment puis-je vous aider ?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Posez-moi une question sur les fertilisants, les cultures ou les tendances de vente.</p>
          </div>
        )}
        {messages.map((msg) => {
          // Parse basic markdown and line breaks
          let formattedContent = msg.content
            .replace(/# # # (.*?)(?:\n|$)/g, '<h4>$1</h4>')
            .replace(/### (.*?)(?:\n|$)/g, '<h4>$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>');

          return (
            <div 
              key={msg.id} 
              className={`chat-bubble ${msg.role}`} 
              style={{ lineHeight: '1.5' }}
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          );
        })}
        {isLoading && (
          <div className="chat-bubble assistant">
            <div className="typing-indicator"><span /><span /><span /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 0 && (
        <div className="chat-suggestions">
          {quickSuggestions.map((q, i) => (
            <button key={i} className="chat-pill" onClick={() => sendMessage(q)}>{q}</button>
          ))}
        </div>
      )}

      <div className="chat-input-bar">
        <input
          className="chat-input"
          placeholder="Tapez votre message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={isLoading}
        />
        <button className="btn btn-primary" onClick={() => sendMessage()} disabled={!input.trim() || isLoading}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
