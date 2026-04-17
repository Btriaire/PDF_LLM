import { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';

export const ChatInterface = ({ userId, pdf }) => {
  const [userInput, setUserInput] = useState('');
  const { messages, loading, sendMessage, setPdfText } = useChat(userId, pdf?.id);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (pdf?.text) {
      console.log('ChatInterface received PDF text, length:', pdf.text.length);
      console.log('First 300 chars:', pdf.text.substring(0, 300));
      setPdfText(pdf.text);
    } else {
      console.log('ChatInterface: No PDF text available');
      setPdfText('');
    }
  }, [pdf, setPdfText]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;
    await sendMessage(userInput);
    setUserInput('');
  };

  if (!pdf) {
    return (
      <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-8 text-center text-slate-400 backdrop-blur">
        Sélectionnez un PDF
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-cyan-500/30 rounded-xl flex flex-col h-[600px] backdrop-blur overflow-hidden">
      <div className="p-4 border-b border-cyan-500/20">
        <h3 className="font-bold text-cyan-300">{pdf.title}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                  : 'bg-slate-700 text-slate-100 border border-cyan-500/20'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-cyan-500/20 animate-pulse">
              Penser...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-cyan-500/20 flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Question..."
          className="flex-1 px-4 py-2 bg-slate-700 border border-cyan-500/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !userInput.trim()}
          className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg font-medium disabled:opacity-50 transition"
        >
          →
        </button>
      </form>
    </div>
  );
};
